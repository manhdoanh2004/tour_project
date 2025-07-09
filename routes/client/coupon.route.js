const router=require("express").Router();
const couponController=require("../../controllers/client/coupon.controller")

router.post(`/detail`,couponController.couponDetail);

module.exports=router;