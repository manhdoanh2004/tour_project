const router=require("express").Router();
const orderController=require("../../controllers/client/order.controller");


router.post("/create",orderController.create);
router.get("/success",orderController.success);

router.get("/payment-zalopay",orderController.paymentZalopay);
router.post("/payment-zalopay-result",orderController.paymentZalopayResultPost);

router.get("/payment-vnpay",orderController.paymentVNpay);
router.get("/payment-vnpay-result",orderController.paymentVNPayResult);

module.exports=router;