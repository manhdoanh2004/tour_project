const router=require("express").Router();
const trackingControllers=require("../../controllers/client/tracking.controller")

router.get("/",trackingControllers)
router.get("/detail",trackingControllers.trackingDetail)

module.exports=router