const Joi = require("joi");

module.exports.registerPost = (req, res, next) => {
  const schema = Joi.object({
    fullName: Joi.string().required().min(3).max(30).messages({
      "string.empty": "Vui lòng nhập vào họ tên!",
      "string.min": "Vui lòng nhập họ tên trên 3 kí tự",
      "string.max": "Vui lòng nhập họ tên ít hơn 3 kí tự",
    }),
    email: Joi.string().required().email().messages({
      "string.empty": "Vui lòng nhập vào email!",
      "string.email": "Email không đúng định dạng",
    }),
    password: Joi.string()
      .required()
      .min(8)
      .custom((value, helpers) => {
        if (!/[A-Z]/.test(value)) {
          return helpers.error("password.uppercase");
        }

        if (!/[a-z]/.test(value)) {
          return helpers.error("password.lowercase");
        }

        if (!/\d/.test(value)) {
          return helpers.error("password.number");
        }

        if (!/[@$!%*?&]/.test(value)) {
          return helpers.error("password.special");
        }

        // Return the value unchanged
        return value;
      }, "custom validation")
      .messages({
        "string.empty": "Vui lòng nhập vào mật khẩu",
        "string.min": "Mật khẩu phải có độ dài 8 kí tự trở lên",
        "password.uppercase": "Mật khẩu phải chứa ít nhẩt 1 chữ cái in hoa",
        "password.lowercase": "Mật khẩu phải chứa ít nhất 1 chữ cái thường",
        "password.number": "Mật khẩu phải chứa ít nhất 1 số",
        "password.special": "Mật khẩu phải chứa ít nhất 1 kí tự đặc biệt",
      }),
  });

  //kiểm tra xem có tồn tại error không
  const { error } = schema.validate(req.body);
  if (error) {
    res.json({
      code: "error",
      message: error.message,
    });
    return;
  }

  next();
};

module.exports.loginPost = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().required().email().messages({
      "string.empty": "Vui lòng nhập vào email!",
      "string.email": "Email không đúng định dạng",
    }),
    password: Joi.string()
      .required()
      .min(8)
      .custom((value, helpers) => {
        if (!/[A-Z]/.test(value)) {
          return helpers.error("password.uppercase");
        }

        if (!/[a-z]/.test(value)) {
          return helpers.error("password.lowercase");
        }

        if (!/\d/.test(value)) {
          return helpers.error("password.number");
        }

        if (!/[@$!%*?&]/.test(value)) {
          return helpers.error("password.special");
        }

        // Return the value unchanged
        return value;
      }, "custom validation")
      .messages({
        "string.empty": "Vui lòng nhập vào mật khẩu",
        "string.min": "Mật khẩu phải có độ dài 8 kí tự trở lên",
        "password.uppercase": "Mật khẩu phải chứa ít nhẩt 1 chữ cái in hoa",
        "password.lowercase": "Mật khẩu phải chứa ít nhất 1 chữ cái thường",
        "password.number": "Mật khẩu phải chứa ít nhất 1 số",
        "password.special": "Mật khẩu phải chứa ít nhất 1 kí tự đặc biệt",
      }),
    rememberPassword:Joi.boolean()
   
  });
  //kiểm tra xem có tồn tại error không
  const { error } = schema.validate(req.body);
  if (error) {
    res.json({
      code: "error",
      message: error.message,
    });
    return;
  }
  next();
};
