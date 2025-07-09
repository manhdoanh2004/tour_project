const Joi=require("joi");

module.exports.editPatch = (req, res, next) => {
  const schema = Joi.object({
    fullName: Joi.string()
      .required()
      .messages({
        "string.empty": "Vui lòng nhập tên khác hàng!",
      }),
    phone: Joi.string()
        .required()
        .custom((value, helpers) =>{
            if (!/(84|0[3|5|7|8|9])+([0-9]{8})\b/g.test(value)) {
                  return helpers.error("phone.invalid");
            }

            return value;
        },"custom validation")
        .messages({
            "string.empty": "Vui lòng nhập số điện điện thoại!",
            'phone.invalid':"Số điện thoại không hợp lệ vui lòng nhập lại!"
        }),
    note: Joi.string().allow(""),
    paymentMethod: Joi.string()
        .required()
        .messages({
            'string.empty':"Vui lòng chọn phương thức thanh toán"
        }),
    paymentStatus: Joi.string()
        .required()
        .messages({
             'string.empty':"Vui lòng chọn trạng thái thanh toán"
        }),
    status: Joi.string()
        .required()
        .messages({
            'string.empty':"Vui lòng nhập trạng thái đơn hàng!"
        }),
  });

  const { error } = schema.validate(req.body);

  if(error) {
    const errorMessage = error.details[0].message;
    res.json({
      code: "error",
      message: errorMessage
    });
    return;
  }
  
  next();
}
