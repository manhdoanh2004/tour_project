var jwt = require("jsonwebtoken");
const accountAdmin = require("../../models/account-admin.model");
const Role=require("../../models/role.model");
module.exports.verifyToken = async (req, res, next) => {
 
  try {
    const token = req.cookies.token;

    //Xác thực token
    var decoded = jwt.verify(token, process.env.JWT_SECRET);


    const { id, email } = decoded;

    const exitsAccount = await accountAdmin.findOne({
      id: id,
      email: email,
      status:"active"
    });

    if (!exitsAccount) {
      res.clearCookie("token");
      res.redirect(`/${pathAdmin}/account/login`);
      return;
    }

    const role=await Role.findOne({
      _id:exitsAccount.role
    })
   
   if(role) exitsAccount.roleName=role.name

    req.account=exitsAccount;
    req.permissions=role.permissions;

    res.locals.account=exitsAccount;
    res.locals.permissions=role.permissions;

    next();
  } catch (error) {
    res.clearCookie("token");
    res.redirect(`/${pathAdmin}/account/login`);
  }
};
