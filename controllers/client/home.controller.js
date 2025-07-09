const Tour = require("../../models/tour.model")
const moment=require("moment")
const categoryHelper=require("../../helpers/categories.helper");
module.exports= async(req, res) => {
    
    //section2
    const tourListSection2=await Tour.find({
        deleted:false,
        status:"active"
    }).sort({
        position:"desc"
    }).limit(6)
   
    for(let item of tourListSection2 )
    {
        item.departureDateFormat=moment(item.departureDate).format("DD/MM/YYYY");
    }
    //End section2
    
    //Section-4 :Tour trong nước
    const section4CategoryId="67ff876fbac0df239ca724e3";
    const listcategoryId=await categoryHelper.getAllSubcategoryIds(section4CategoryId)
    const tourListSection4=await Tour.find({
        deleted:false,
        status:"active",
        category:{$in:listcategoryId}
    }).sort({
        position:"desc"
    }).limit(6)
    
    for(let item of tourListSection4 )
    {
        item.departureDateFormat=moment(item.departureDate).format("DD/MM/YYYY");
    }
    //Hết section-4 :Tour trong nước


    //Section-4 : Tour nước ngoài
    const section4CategoryId_foreign="67ff86c905d64ab034873ced";
    const listcategoryId_foreign=await categoryHelper.getAllSubcategoryIds(section4CategoryId_foreign)
    const tourListSection4_foreign=await Tour.find({
        deleted:false,
        status:"active",
        category:{$in:listcategoryId_foreign}
    }).sort({
        position:"desc"
    }).limit(6)
    
    for(let item of tourListSection4_foreign )
    {
        item.departureDateFormat=moment(item.departureDate).format("DD/MM/YYYY");
    }
    //Hết Section-4 : Tour nước ngoài


    res.render("client/pages/home",{
            pageTitle: req.settingWebsiteInfo?req.settingWebsiteInfo.websiteName:"Trang chủ",
            tourListSection2:tourListSection2,
            tourListSection4:tourListSection4,
            tourListSection4_foreign:tourListSection4_foreign
    })
}