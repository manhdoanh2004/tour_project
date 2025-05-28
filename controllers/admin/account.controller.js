const accountAdmin = require("../../models/account-admin.model");
var jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const generateHelper = require("../../helpers/generate.helper");
const mailHelper = require("../../helpers/mail.helper");
const ForGotPassWord = require("../../models/forgot-password.model");
const { date } = require("joi");

module.exports.login = (req, res) => {
  res.render("admin/pages/login.pug", {
    pageTitle: "Login",
  });
};

module.exports.loginPost = async (req, res) => {
  const { email, password, rememberPassword } = req.body;

  const exitsAccount = await accountAdmin.findOne({
    email: email,
  });
  if (!exitsAccount) {
    return res.json({
      code: "error",
      message: "Email không tồn tại!",
    });
  }

  //kiểm tra xem mật khẩu người dùng nhập vào có đúng với mật khẩu trong database hay không
  const isPassWordValid = await bcrypt.compare(password, exitsAccount.passWord); // true
  if (!isPassWordValid) {
    return res.json({
      code: "error",
      message: "Mật khẩu không chính xác!",
    });
  }
  if (exitsAccount.status == "initial") {
    return res.json({
      code: "error",
      message: "Tài khoản chưa được kích hoạt!",
    });
  }
  if (exitsAccount.status == "inactive") {
    return res.json({
      code: "error",
      message: "Tài khoản đã bị khóa!",
    });
  }

  //Tạo jwt
  var token = jwt.sign(
    {
      id: exitsAccount.id,
      email: exitsAccount.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: rememberPassword ? "30d" : "1d",
    }
  );

  //lưu token vào cookies
  res.cookie("token", token, {
    maxAge: rememberPassword ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000, //Token có hiệu lưu 1 ngày,
    httpOnly: true, //chỉ có sever mới được gửi token lên
    sameSite: "strict", //đúng tên miền của sever mới thì mới chấp nhận  token
  });

  res.json({
    code: "success",
    message: "Đăng nhập thành công !",
  });
};

module.exports.register = async (req, res) => {
  res.render("admin/pages/register.pug", {
    pageTitle: "Đăng ký",
  });
};

module.exports.registerPost = async (req, res) => {
  const { fullName, email, password } = req.body;

  const exitsAccount = await accountAdmin.findOne({
    email: email,
  });
  if (exitsAccount) {
    res.json({ code: "error", message: "Email đã tồn tại" });
    return;
  }

  //Mã hóa mật khẩu với bcrypt trước khi lưu vào cơ sở dữ liệu
  const salt = await bcrypt.genSalt(10); //Tạo ra 1 chuỗi ngẫu nhiên có 10 kí tự
  const hashedPassword = await bcrypt.hash(password, salt); //mã hóa mật khẩu được truyền vào

  const newAccount = new accountAdmin({
    fullName: fullName,
    email: email,
    passWord: hashedPassword,
    status: "initital",
  });

  await newAccount.save();

  res.json({
    code: "success",
    message: "Đăng kí thành công !",
  });
};

module.exports.registerInitial = (req, res) => {
  res.render("admin/pages/register-initial.pug", {
    pageTitle: "Tài khoản đã được khởi tạo",
  });
};

module.exports.logoutPost = (req, res) => {
  res.clearCookie("token");
  res.json({
    code: "success",
    message: "Đăng xuất thành công",
  });
};

module.exports.forgotPassword = (req, res) => {
  res.render("admin/pages/forgot-password.pug", {
    pageTitle: "Quên mật khẩu",
  });
};

module.exports.forgotPasswordPost = async (req, res) => {
  const { email } = req.body;
  //Kiểm tra xem email có tồn tại hay không
  const exitsAccount = await accountAdmin.findOne({
    email: email,
  });
  if (!exitsAccount) {
    return res.json({
      code: "error",
      message: "Email không tồn tại trong hệ thống!",
    });
  }

  //Kiểm tra xem tài khoản này đã tồn tại trong ForgotPassWord hay chưa,nếu rồi thì không cho gửi
  const exitsForgotPassWord = await ForGotPassWord.findOne({
    email: email,
  });
  if (exitsForgotPassWord) {
    return res.json({
      code: "error",
      message: "Vui lòng gửi lại yêu cầu sau 5 phút nữa!",
    });
  }

  //Tạo mã OTP
  const otp = generateHelper.generateRandomNumber(6);

  //Lưu vào database email và mã OTP và tự động xóa sau 5 phút
  const newRecord = new ForGotPassWord({
    email: email,
    otp: otp,
    expireAt: Date.now() + 5 * 60 * 1000,
  });
  await newRecord.save();

  //Gửi mã OPT qua email cho người dùng
  const subject = "Mã OTP để lấy lại mật khẩu";
  const content = `Mã OTP của bạn là <b style=' color : green'>${otp}</b> .
                 Mã OTP có hiệu lực trong vòng 5 phút vui lòng không cung cấp cho người khác`;

  mailHelper.sendMail(email, content, subject);

  res.json({
    code: "success",
    message: "Gửi thành công",
  });
};

module.exports.otppassword = (req, res) => {
  res.render("admin/pages/otp-password.pug", {
    pageTitle: "Nhập mã OTP",
  });
};
module.exports.otppasswordPost = async (req, res) => {
  const { email, otp } = req.body;

  //kiểm tra xem có tồn tại bản ghi trong collection ForGotPassWord hay không
  const existForGot = await ForGotPassWord.findOne({
    email: email,
    otp: otp,
  });

  if (existForGot == null) {
    return res.json({
      code: "error",
      message: "Mã otp không chính xác",
    });
  }

  //Tìm thông tin trong colleciton AccountAdmin
  const Account = await accountAdmin.findOne({
    email: email,
  });

  //Tạo jwt
  var token = jwt.sign(
    {
      id: Account.id,
      email: Account.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  //lưu token vào cookies
  res.cookie("token", token, {
    maxAge: 24 * 60 * 60 * 1000, //Token có hiệu lưu 1 ngày,
    httpOnly: true, //chỉ có sever mới được gửi token lên
    sameSite: "strict", //đúng tên miền của sever mới thì mới chấp nhận  token
  });

  res.json({
    code: "success",
    message: "Xác nhận mã otp thành công",
  });
};

module.exports.resetPassword = (req, res) => {
  res.render("admin/pages/reset-password.pug", {
    pageTitle: "Đổi mật khẩu",
  });
};

module.exports.resetPasswordPost = async (req, res) => {
  const {password}=req.body;

  //Mã hóa mật khẩu với bcrypt trước khi lưu vào cơ sở dữ liệu
  const salt = await bcrypt.genSalt(10); //Tạo ra 1 chuỗi ngẫu nhiên có 10 kí tự
  const hashedPassword = await bcrypt.hash(password, salt); //mã hóa mật khẩu được truyền vào

    //cập nhật lại mật khẩu
    await accountAdmin.updateOne({
      _id:req.account.id,
      status:"active",
    },
  {
    passWord:hashedPassword
  })

  return res.json(
    {
      code:"success",
      message:"Đổi mật khẩu thành công!"
    }
  )

};
