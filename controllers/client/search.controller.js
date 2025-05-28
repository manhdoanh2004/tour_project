const Tour = require("../../models/tour.model")
const moment=require("moment")
const slugify=require("slugify")


module.exports.search=async(req,res)=>
{
    const find={
        status:"active",
        deleted:false,
    }
    try {
        
    //Điểm đi 
    if(req.query.locationFrom)
    {
        find.locations=req.query.locationFrom
    }
    //Hết Điểm đi 

    //Điểm đến
    if(req.query.locationTo)
    {
        const keyword=slugify(req.query.locationTo,{
            lower:true
        });

        const keywordRegex=new RegExp(keyword);
        find.slug=keywordRegex

    }
    //Hết Điểm đến


    //Ngày khởi hành 
    if(req.query.departureDate)
    {
        find.departureDate=new Date(req.query.departureDate)

    }
    //Hết Ngày khởi hành 


    //Số lượng hành khách
    if(req.query.stockAdult)
    {
        find.stockAdult={
            $gte:parseInt(req.query.stockAdult)
        }
    }
    if(req.query.stockChildren)
    {
        find.stockChildren={
            $gte:parseInt(req.query.stockChildren)
        }
    }
    if(req.query.stockBaby)
    {
        find.stockBaby={
            $gte:parseInt(req.query.stockBaby)
        }
    }
    //Hết Số lượng hành khách

    //Theo giá tour
    if(req.query.price)
    {
        const priceArray=req.query.price.split("-");
        find.priceNewAdult={
            $gte:parseInt(priceArray[0]),
            $lte:parseInt(priceArray[1])
        }
    }
    //Hết Theo giá tour

    const tourList =await Tour.find(find).sort({
        position:"desc"
    })

        for(let item of tourList)
        {
            item.departureDateFormat= moment(item.departureDate).format("DD/MM/YYYY")
        }

    res.render("client/pages/search.pug",{
        pageTitle:"Kết quả tìm kiếm",
        tourList:tourList
    })
    } catch (error) {
        res.redirect("/")
    }
}