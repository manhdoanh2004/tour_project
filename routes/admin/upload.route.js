const router=require("express").Router();
const cloudinaryHelper = require("../../helpers/cloudinary.helper");
const multer = require("multer");
const upload = multer({ storage: cloudinaryHelper.storage });
const uploadController=require("../../controllers/admin/upload.controller");


router.post("/image",upload.single("file"),uploadController.uploadImage)

module.exports=router