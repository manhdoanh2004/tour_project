const Tour=require("../../models/tour.model");
const City =require("../../models/city.model")
const moment=require("moment")

module.exports.cart=(req,res)=>
{
    res.render("client/pages/cart",{
        pageTitle:"Giỏ hàng"
    })
}

module.exports.list=async(req,res)=>
{
    try {
        //Lấy ra tất cả đơn hàng được gửi lên
    const cart=req.body;
   

    for(let item of cart)
    {
        const tourInfo= await Tour.findOne({
            _id:item.tourId,
            status:"active",
            deleted:false
        })

        if(tourInfo)
        {
           item.avatar=tourInfo.avatar;
           item.name=tourInfo.name;
           item.slug=tourInfo.slug;
           item.departureDateFormat=moment(tourInfo.departureDate).format("DD/MM/YYYY");
           item.priceNewAdult=tourInfo.priceNewAdult;
           item.priceNewChildren=tourInfo.priceNewChildren;
           item.priceNewBaby=tourInfo.priceNewBaby;
           item.stockAdult=tourInfo.stockAdult
           item.stockChildren=tourInfo.stockChildren
           item.stockBaby=tourInfo.stockBaby


           const city =await City.findOne({
            _id:item.locationFrom
           })
           if(city)
           {  
              item.locationFromName=city.name;

           }

        }
        else
        {
            //Nếu tour không tìm thấy thì xóa tour đó ra khỏi giỏ hàng 
            const indexItem=cart.findIndex(tour=>tour.tourId==item.tourId);
            cart.splice(indexItem,1);
        }
    }

   

   
     res.json({
        code:"success",
        message:"Gửi thành công",
        cart:cart
     }) 
    } catch (error) {
        res.redirect("/")
    }
}