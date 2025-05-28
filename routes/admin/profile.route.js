const Router=require("express").Router();
const cloudinaryHelper = require("../../helpers/cloudinary.helper");
const multer = require("multer");
const upload = multer({ storage: cloudinaryHelper.storage });
const profileController=require("../../controllers/admin/profile.controller");
const profileValidate=require("../../validates/admin/profile.validate")


Router.get("/change-password",profileController.changePassword);
Router.patch("/change-password",profileValidate.changePassWord,profileController.changePasswordPatch)


Router.get("/edit",profileController.edit);
Router.patch("/edit",  upload.single('avatar'),profileValidate.editProfile, profileController.editPatch);


module.exports=Router;