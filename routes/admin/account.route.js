const router=require("express").Router();

const accountValidate=require("../../validates/admin/account.validate");

const accountController=require("../../controllers/admin/account.controller");
const authMiddlewares=require("../../middlewares/admin/auth.middleware")


router.get("/login",accountController.login);
router.post("/login",accountValidate.loginPost,accountController.loginPost);

router.get("/register",accountController.register);
router.get("/register-initial",accountController.registerInitial);
router.post(`/register`,accountValidate.registerPost,accountController.registerPost);

router.post("/logout",accountController.logoutPost);

router.get("/forgot-password",accountController.forgotPassword)
router.post("/forgot-password",accountController.forgotPasswordPost)

router.get("/otppassword",accountController.otppassword)
router.post("/otppassword",accountController.otppasswordPost)


router.get("/reset-password",accountController.resetPassword)
router.post("/reset-password",authMiddlewares.verifyToken,accountController.resetPasswordPost)

module.exports=router;