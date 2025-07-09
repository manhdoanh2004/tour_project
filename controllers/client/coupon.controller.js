const Coupon=require("../../models/coupon.model")

const moment=require("moment");
module.exports.couponDetail=async(req,res)=>
{
   
    const dateFilter={};
    const dateNow= new Date();
    dateFilter.$gte=dateNow

    const couponDetail=await Coupon.findOne({
        couponCode:req.body.coupon,
        expired: dateFilter
    });

   if(!couponDetail)
   {
        return res.json({
        code:"error",
        message:"Mã giảm giá đã hết hạn!",
        
         })
   }
     return res.json({
        code:"success",
        message:"Lấy thành công!",
        couponDetail:couponDetail
    })

}