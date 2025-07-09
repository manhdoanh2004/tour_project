const router=require("express").Router();
const contactController=require("../../controllers/admin/contact.controller");
router.get("/list",contactController.list);
router.patch("/delete/:id",contactController.patchDelete);

router.patch("/change-multi",contactController.patchChangeMulti)

module.exports=router;