const Order=require("../../models/order.model")
const variableConfig=require("../../config/variable")
const City=require("../../models/city.model");


const moment=require("moment")

module.exports.list=async(req,res)=>
{
    if(!req.permissions.includes("order-list"))
        {
         return res.redirect({
              code:"error",
              message:"Không có quyền sử dụng tính năng này!"
          })
        }
   try {
     const find={
   deleted:false
    }
    const orderList =await Order.find(find).sort({
        createdAt:"desc"
    });
  
    for(let orderDetail of orderList)
    {
        const paymentMethodName=variableConfig.paymentMethod.find(item=>item.value==orderDetail.paymentMethod).label;
        orderDetail.paymentMethodName=paymentMethodName;

        const paymentStatusName=variableConfig.paymentStatus.find(item=>item.value==orderDetail.paymentStatus).label;
        orderDetail.paymentStatusName=paymentStatusName
        
        orderDetail.createdAtTime=moment(orderDetail.createdAt).format("HH:mm");
        orderDetail.createdAtDate=moment(orderDetail.createdAt).format("DD/MM/YYYY");
    }
    
  
  

    res.render("admin/pages/order-list.pug",{
        pageTitle:"Quản lý đơn hàng",
        orderList:orderList
    })
   } catch (error) {
    res.redirect(`/${pathAdmin}/dashboard`)
   }
}

module.exports.edit=async(req,res)=>
{
     if(!req.permissions.includes("order-edit"))
        {
         return res.redirect({
              code:"error",
              message:"Không có quyền sử dụng tính năng này!"
          })
        }
   try {
    const orderId=req.params.id;
   
   const orderDetail=await Order.findOne({
    _id:orderId,
    deleted:false
   });

   for(let item of orderDetail.items)
   {
    item.departureDateFormat=moment(item.departureDate).format("DD/MM/YYYY")
        const city=await City.findOne({
            _id:item.locationFrom
        });

    item.locationFromName=city.name;
   }

   orderDetail.createdAtFormat=moment(orderDetail.createdAt).format("YYYY-MM-DDTHH:MM");

   

   
    res.render("admin/pages/order-edit.pug",{
        pageTitle:`Đơn hàng: ${orderDetail.orderCode}`,
        orderDetail:orderDetail,
        paymentMethodList:variableConfig.paymentMethod,
        paymentStatusList:variableConfig.paymentStatus,
        orderStatusList:variableConfig.orderStatus
    })
   } catch (error) {
        res.redirect(`/${pathAdmin}/order/list`)
   }
}


module.exports.editPatch=async(req,res)=>
{
     if(!req.permissions.includes("order-edit"))
        {
         return res.redirect({
              code:"error",
              message:"Không có quyền sử dụng tính năng này!"
          })
        }
    try {
    const id=req.params.id;
    
    const orderDetail =await Order.findOne({
        _id:id,
        deleted:false
    })
    if(!orderDetail)
    {
        return res.json({
            code:"error",
            message:"Thông tin đơn hàng không hợp lệ!"
        })
    }
    await Order.updateOne({
        _id:id,
        deleted:false
    },
    req.body
    )
    res.json({
        code:"success",
        message:"Cập nhật đơn hành thành công!"
    })
    } catch (error) {
        res.json({
            code:"error",
            message:"Thông tin đơn hàng không hợp lệ!"
        })
    }
    
}