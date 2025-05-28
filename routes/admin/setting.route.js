const router=require("express").Router();
const cloudinaryHelper = require("../../helpers/cloudinary.helper");
const multer = require("multer");
const upload = multer({ storage: cloudinaryHelper.storage });
const settingController=require("../../controllers/admin/setting.controller");
const settingAccountAdminValidate=require("../../validates/admin/setting-account-admin.validate");
const settingRoleValidate=require('../../validates/admin/setting-role.validate')


router.get("/list",settingController.list);

router.get("/website-infor",settingController.webSiteInFor);
router.patch("/website-infor", upload.fields([
    { name: 'logo', maxCount: 1 },
     { name: 'favicon', maxCount: 1 }
    ]),settingController.webSiteInForPatch);

router.get("/account-admin/list",settingController.accountAdminList);


router.get("/account-admin/create",settingController.accountAdminCreate);
router.post("/account-admin/create",    upload.single('avatar'),settingAccountAdminValidate.accountAdminCreatePost, settingController.accountAdminCreatePost)

router.get(`/account-admin/edit/:id`,settingController.accountAdminEdit)
router.patch(`/account-admin/edit/:id`,  upload.single('avatar'),settingAccountAdminValidate.accountAdminEdit,settingController.accountAdminEditPatch)

router.get("/role/create",settingController.roleCreate)
router.post("/role/create",settingRoleValidate.createPost,settingController.roleCreatePost)


router.get("/role/list",settingController.roleList);

router.get("/role/edit/:id",settingController.roleEdit);
router.patch("/role/edit/:id",settingRoleValidate.createPost,settingController.roleEditPatch);

module.exports=router;