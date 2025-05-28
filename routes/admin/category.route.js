const router = require("express").Router();
const cloudinaryHelper = require("../../helpers/cloudinary.helper");
const multer = require("multer");
const upload = multer({ storage: cloudinaryHelper.storage });
const categoryValidate=require("../../validates/admin/category.validate");
const categoryController = require("../../controllers/admin/category.controller");

router.get("/list", categoryController.list);


router.get("/create", categoryController.create);
router.post("/create", upload.single("avatar"),categoryValidate.createPost, categoryController.createPost);


router.get("/edit/:id", categoryController.edit);
router.patch("/edit/:id", upload.single("avatar"),categoryValidate.createPost,categoryController.editPatch);

router.patch("/delete/:id",categoryController.deletePatch);

router.patch('/change-multi',categoryController.changeMultiPatch)

module.exports = router;
