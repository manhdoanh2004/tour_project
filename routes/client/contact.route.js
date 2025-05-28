const router=require("express").Router();
const contactControllter=require("../../controllers/client/contact.controller");

router.post("/create",contactControllter.contacCreate)

module.exports=router