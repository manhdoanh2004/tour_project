const mongoose = require("mongoose");
const schema=new mongoose.Schema({
    websiteName:String,
    phone:String,
    address:String,
    logo:String,
    favicon:String,
    email:String
},{
    timestamps:true //Tự động sinh ra createdAt và updatedAt
})

const SettingWebSiteInFor=mongoose.model("SettingWebSiteInFor",schema,'setting-website-infor');
module.exports=SettingWebSiteInFor;