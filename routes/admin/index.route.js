const router=require("express").Router();

const accountRoute=require("./account.route");
const dashboardRoute=require("./dashboard.route");
const categoryRoute=require("./category.route");
const tourRoute=require("./tour.route");
const orderRoute=require("./order.route");
const userRoute=require("./user.route");
const contactRoute=require("./contact.route");
const settingRoute=require("./setting.route");
const profileRoute=require("./profile.route");
const uploadRoutes=require("./upload.route");


const authMiddlewares=require("../../middlewares/admin/auth.middleware")


//Xóa bộ nhớ đệm
// router.use((req,res,next)=>
// {
//     res.setHeader('cache-Control','no-store');
//     next();
// })

router.use("/account",accountRoute);
router.use("/dashboard",authMiddlewares.verifyToken,dashboardRoute)
router.use("/category",authMiddlewares.verifyToken,categoryRoute);
router.use("/tour",authMiddlewares.verifyToken,tourRoute);
router.use("/order",authMiddlewares.verifyToken,orderRoute);
router.use("/user",authMiddlewares.verifyToken,userRoute);
router.use("/contact",authMiddlewares.verifyToken,contactRoute);
router.use("/setting",authMiddlewares.verifyToken,settingRoute);
router.use("/profile",authMiddlewares.verifyToken,profileRoute);
router.use("/upload",authMiddlewares.verifyToken,uploadRoutes);

router.get("*",authMiddlewares.verifyToken,(req,res)=>
{
    res.render("admin/pages/error-404.pug",{
        pageTitle:" 404 Not Found"
    })
})

module.exports=router;

