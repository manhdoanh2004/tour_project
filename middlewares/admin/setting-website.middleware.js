const SettingWebSiteInFor = require("../../models/setting-website-infor.model");

module.exports.webSiteInfo=async(req,res,next)=>
{
    const settingWebsiteInfo= await SettingWebSiteInFor.findOne({});
    res.locals.settingWebsiteInfo=settingWebsiteInfo;
    req.settingWebsiteInfo=settingWebsiteInfo;
    next();
}