const variableConfig=require("../../config/variable")
const Order =require("../../models/order.model");

const moment=require("moment");
const Tour = require("../../models/tour.model");
module.exports=(req,res)=>
{
    res.render("client/pages/tracking.pug",{
        pageTitle:"Tra cứu đơn hàng",
        trackingTypes:variableConfig.trackingType
    })
}
module.exports.trackingDetail=async(req,res)=>
{
    try {

        const {email,phone,orderCode}=req.query;

        const orderList=await Order.find({
            orderCode:orderCode,
            email:email,
            phone:phone
        });
       
        for(let order of orderList)
        {
            order.createdAtFormat=moment(order.createdAt).format("DD-MM-yyyy HH:mm");
            order.orderStatusName=variableConfig.orderStatusClient.find(item=>item.value==order.status).label;

            
            for (const item of order.items) {
                    const infoTour = await Tour.findOne({
                        _id: item.tourId,
                        deleted: false
                    })

                    if(infoTour) {
                        order.slug = infoTour.slug;
                    }
                }
        }
    
        
        res.render("client/pages/tracking-detail.pug",{
        pageTitle:"Đơn hàng của bạn",
        orderList:orderList
    })
    } catch (error) {
        res.redirect("/")
    }
  
}