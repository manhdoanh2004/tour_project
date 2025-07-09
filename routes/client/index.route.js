const router=require('express').Router();
const settingWebsite=require("../../middlewares/clients/setting-website.middleware");
const category=require("../../middlewares/clients/category.middleware");


const tourRoutes=require("./tour.route");
const homeRoutes=require("./home.route");
const cartRoutes=require("./cart.route");
const contactRoutes=require("./contact.route");
const categoryRoutes=require("./category.route");
const searchRoutes=require("./search.route")
const orderRoutes=require("./order.route")
const couponRoutes=require("./coupon.route")
const trackingRoutes=require("./tracking.route")

router.use(settingWebsite.webSiteInfo)
router.use(category.list)


router.use('/tour',tourRoutes)
router.use('/search',searchRoutes)
router.use('/category',categoryRoutes)
router.use("/",homeRoutes);
router.use("/cart",cartRoutes);
router.use("/contact",contactRoutes);
router.use("/order",orderRoutes);
router.use("/coupon",couponRoutes);
router.use("/tracking",trackingRoutes);

module.exports =router;