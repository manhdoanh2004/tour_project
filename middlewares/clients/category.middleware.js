const Category = require("../../models/categories.model")
const categoryHelper=require("../../helpers/categories.helper");
const variableConfig=require("../../config/variable")
module.exports.list=async(req,res,next)=>
{
    const categoryList =await Category.find({
        deleted:false,
        status:"active"
    })


    const categoryTree= categoryHelper.buildCategoryTree(categoryList);
  
    res.locals.categoryList=categoryTree;
    res.locals.trackingTypes=variableConfig.trackingType;
    next();
}