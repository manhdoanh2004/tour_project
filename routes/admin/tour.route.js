const router=require("express").Router();
const tourController=require("../../controllers/admin/tour.controller");
const cloudinaryHelper = require("../../helpers/cloudinary.helper");
const multer = require("multer");
const upload = multer({ storage: cloudinaryHelper.storage });
const tourValidate=require("../../validates/admin/tour.validate")

router.get("/list",tourController.list);
router.patch("/change-multi",tourController.changeMultiTour);

router.get("/create",tourController.create);

router.get("/edit/:id",tourController.edit);

router.patch(
    '/edit/:id', 
    upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'images', maxCount: 8 }]), 
    tourValidate.createPost,
    tourController.editPatch
  )
  
  
  router.patch("/delete/:id",tourController.deletePatch);


router.post("/create", upload.single("avatar"),tourValidate.createPost,tourController.createPost);

router.get("/trash",tourController.trash);

router.patch("/undo/:id",tourController.undoPatch)
router.patch("/delete-destroy/:id",tourController.deleteDestroy)
router.patch("/trash/change-multi",tourController.changeMultiPatch)


module.exports=router;