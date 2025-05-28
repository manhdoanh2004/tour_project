const bcrypt = require("bcryptjs");
const SettingWebSiteInFor = require("../../models/setting-website-infor.model");
const permission = require("../../config/permission");
const Role = require("../../models/role.model");
const accountAdmin = require("../../models/account-admin.model");
module.exports.list = async (req, res) => {
  res.render("admin/pages/setting-list.pug", {
    pageTitle: "Cài đặt chung",
  });
};

module.exports.webSiteInFor = async (req, res) => {
  const webSiteInfor = await SettingWebSiteInFor.findOne({});

  res.render("admin/pages/setting-website-info.pug", {
    pageTitle: "Thông tin website",
    webSiteInfor: webSiteInfor,
  });
};

module.exports.webSiteInForPatch = async (req, res) => {
  if (!req.permissions.includes("setting-websiteinfo")) {
    return res.json({
      code: "error",
      message: "Không có quyền sử dụng tính năng này!",
    });
  }

  try {
    if (req.files && req.files.logo) {
      req.body.logo = req.files["logo"][0].path;
    } else {
      delete req.body.logo;
    }
    if (req.files && req.files.favicon) {
      req.body.favicon = req.files["favicon"][0].path;
    } 
    else {
      delete req.body.favicon;
    }

    //kiểm tra xem đã tồn tại 1 bản ghi trong database hay chưa
    const webSiteInfor = await SettingWebSiteInFor.findOne({});
    if (webSiteInfor) {
      //cập nhật lại thông tin nếu đã tồn tại 1 bản ghi
      await SettingWebSiteInFor.updateOne(
        {
          _id: webSiteInfor.id,
        },
        req.body
      );
    } else {
      //Tạo mới 1 bản ghi nếu chưa tồn tại 1 bản ghi nào trong database
      const newRecord = new SettingWebSiteInFor(req.body);
      await newRecord.save();
    }

    req.flash("success", "Cập nhật thành công!");
    res.json({
      code: "success",
      message: "Cập nhật thông tin website thành công!",
    });
  } catch (error) {
    res.json({
      code: "error",
      message: "Cập nhật thông tin website không thành công!",
    });
  }
};

module.exports.accountAdminList = async (req, res) => {
  const accoutAdminList = await accountAdmin.find({});

  const roleList = await Role.find({});

  for (let item of accoutAdminList) {
    if (item.role) {
      const roleDetail = await Role.findOne({
        _id: item.role,
      });

      item.roleName = roleDetail.name;
    }
  }
  res.render("admin/pages/setting-account-admin-list.pug", {
    pageTitle: "Tài khoản quản trị",
    accoutAdminList: accoutAdminList,
    roleList: roleList,
  });
};

module.exports.accountAdminCreate = async (req, res) => {
  const roleList = await Role.find({
    deleted: false,
  });

  res.render("admin/pages/setting-account-admin-create.pug", {
    pageTitle: "Tạo tài khoản quản trị",
    roleList: roleList,
  });
};

module.exports.accountAdminCreatePost = async (req, res) => {
  if (!req.permissions.includes("account-admin-create")) {
    return res.json({
      code: "error",
      message: "Không có quyền sử dụng tính năng này!",
    });
  }

  try {
    //kiểm tra xem trong database đã tồn tại email được gửi lên chưa
    const exitsAccount = await accountAdmin.findOne({
      email: req.body.email,
    });
    if (!exitsAccount) {
      //Mã hóa mật khẩu được gửi lên
      const salt = await bcrypt.genSalt(10); //Tạo ra 1 chuỗi ngẫu nhiên có 10 kí tự
      const hashedPassword = await bcrypt.hash(req.body.passWord, salt); //mã hóa mật khẩu được truyền vào

      req.body.passWord = hashedPassword;

      req.body.avatar = req.file ? req.file.path : "";

      const newAccount = new accountAdmin(req.body);
      await newAccount.save();

      req.flash("success", "Tạo tài khoản quản trị thành công!");
      return res.json({
        code: "success",
        message: "Tao thanh cong!",
      });
    } else {
      return res.json({
        code: "error",
        message: "Tao khong thanh cong!",
      });
    }
  } catch (error) {
    return res.json({
      code: "error",
      message: "Lỗi sever",
    });
  }
};

//Các hàm cho trang chỉnh sửa tài khoản quản trị
module.exports.accountAdminEdit = async (req, res) => {
  try {
    const accountDetail = await accountAdmin.findOne({
      _id: req.params.id,
    });
    const roleList = await Role.find({});
    res.render("admin/pages/setting-account-admin-edit", {
      pageTitle: "Chỉnh sửa tài khoản quản trị",
      roleList: roleList,
      accountDetail: accountDetail,
    });
  } catch (error) {
    res.redirect(`/${pathAdmin}/setting/account-admin/list`);
  }
};

module.exports.accountAdminEditPatch = async (req, res) => {
  if (!req.permissions.includes("account-admin-edit")) {
    return res.json({
      code: "error",
      message: "Không có quyền sử dụng tính năng này!",
    });
  }
  try {
    if (req.file) {
      req.body.avatar = req.file.path;
    } else delete req.body.avatar;

    await accountAdmin.updateOne(
      {
        _id: req.body.id,
      },
      req.body
    );
    req.flash("success", "Cập nhật tài khoản quản trị thành công!");
    return res.json({
      code: "success",
      message: "Cập nhật tài khỏa quản trị thành công!",
    });
  } catch (error) {
    return res.json({
      code: "error",
      message: "Lỗi sever",
    });
  }
};

//Hết các hàm cho trang chỉnh sửa tài khoản quản trị

module.exports.roleCreate = (req, res) => {
  const premissonList = permission.permissionList;
  res.render("admin/pages/setting-role-create.pug", {
    pageTitle: "Tạo nhóm quyền",
    premissonList: premissonList,
  });
};

module.exports.roleCreatePost = async (req, res) => {
  if (!req.permissions.includes("setting-role-create")) {
    return res.json({
      code: "error",
      message: "Không có quyền sử dụng tính năng này!",
    });
  }

  try {
    req.body.createdBy = req.account.id;
    req.body.updatedBy = req.account.id;

    const newRecord = new Role(req.body);
    await newRecord.save();
    req.flash("success", "Tạo mới thành công!");
    res.json({
      code: "success",
      message: "Tạo mới thành công!",
    });
  } catch (error) {
    res.json({
      code: "error",
      message: "Tạo mới không thành công!",
    });
  }
};

module.exports.roleList = async (req, res) => {
  const roleList = await Role.find({
    deleted: false,
  });
  res.render("admin/pages/setting-role-list.pug", {
    pageTitle: " Nhóm quyền",
    roleList: roleList,
  });
};

module.exports.roleEdit = async (req, res) => {
  try {
    const id = req.params.id;
    const record = await Role.findOne({
      _id: id,
      deleted: false,
    });
    if (record) {
      const premissonList = permission.permissionList;
      res.render("admin/pages/setting-role-edit", {
        pageTitle: "Chỉnh sửa quyền",
        premissonList: premissonList,
        record: record,
      });
    } else {
      res.redirect(`/${pathAdmin}/setting/role/list`);
    }
  } catch (error) {
    res.redirect(`/${pathAdmin}/setting/role/list`);
  }
};

module.exports.roleEditPatch = async (req, res) => {
  if (!req.permissions.includes("setting-role-edit")) {
    return res.json({
      code: "error",
      message: "Không có quyền sử dụng tính năng này!",
    });
  }
  try {
    const id = req.params.id;
    await Role.updateOne(
      {
        _id: id,
      },
      req.body
    );

    req.flash("success", "Cập nhật quyền thành công!");
    res.json({
      code: "success",
      message: "Cập nhập thành công",
    });
  } catch (error) {
    res.json({
      code: "error",
      message: "Cập nhật không quyền không thành công!",
    });
  }
};
