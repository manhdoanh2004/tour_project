const Order=require("../../models/order.model")
const AccountAdmin=require("../../models/account-admin.model")
const moment=require("moment");
const variableConfig=require("../../config/variable");
module.exports.dashboard=async(req,res)=>
{
    try {


        //Section-1 
        const overView={
        totalAdmin:0,
        totalOrder:0,
        totalPrice:0,

    }

    overView.totalAdmin=await AccountAdmin.countDocuments({
        status:'active'
    })
    const orderList=await Order.find({
        deleted:false
    }).sort({
        createdAt:"desc",
    })

    overView.totalOrder=orderList.length;

    overView.totalPrice=orderList.reduce((sum,item)=>
    {
        return sum+item.total
    },0)
    //Hết Section-1 

  
    //Lấy ra 5 đơn hàng mới nhất
    const orderListSection2=await Order.find({
        deleted:false
    }).sort({
        createdAt:"desc"
    }).limit(5).skip(0);
     for (let orderDetail of orderListSection2) {
          const paymentMethodName = variableConfig.paymentMethod.find(
            (item) => item.value == orderDetail.paymentMethod
          ).label;
          orderDetail.paymentMethodName = paymentMethodName;
    
          const paymentStatusName = variableConfig.paymentStatus.find(
            (item) => item.value == orderDetail.paymentStatus
          ).label;
          orderDetail.paymentStatusName = paymentStatusName;
    
          orderDetail.createdAtTime = moment(orderDetail.createdAt).format("HH:mm");
          orderDetail.createdAtDate = moment(orderDetail.createdAt).format(
            "DD/MM/YYYY"
          );
        }
    //Hết Lấy ra 5 đơn hàng mới nhất

   
    res.render("admin/pages/dashboard.pug",{
        pageTitle:"Tổng quan",
        orderList:orderList,
        overView:overView,
        orderListSection2:orderListSection2
    }) 
    } catch (error) {
        res.redirect("/")
    }
   
}

module.exports.revenueChartPost=async(req,res)=>
{
   
    const {currentMonth,currentYear,previousMonth,previousYear,arrayDay}=req.body;


    //Lấy ra tất cả đơn hàng trong tháng hiện tại
    const orderCurrentMonth=await Order.find({
        deleted:false,
        createdAt:{
            $gte:new Date(currentYear,currentMonth-1,1),
            $lte:new Date(currentYear,currentMonth,1),
        }
    });
 
     //Lấy ra tất cả đơn hàng trong tháng trước
    const orderPreviousMonth=await Order.find({
        deleted:false,
        createdAt:{
            $gte:new Date(previousYear,previousMonth-1,1),
            $lte:new Date(previousYear,previousMonth,1),
        }
    });
   
    //Tạo ra mảng doanh thu theo từng ngày
    const dataCurrentMonth=[];
    const dataPreviousMonth=[];
    
   
    for(const day of arrayDay)
    {
        //Tính tổng doanh thu theo từng ngày của tháng này
        let totalCurrent=0;
        for(const order of orderCurrentMonth)
        {
            const orderDate=new Date(order.createdAt).getDate();
            if(day==orderDate)
            {
                totalCurrent+=order.total;
            }
        }
        dataCurrentMonth.push(totalCurrent)
        //Hết Tính tổng doanh thu theo từng ngày của tháng này


        //Tính tổng doanh thu theo từng ngày của tháng trước 
         let totalPrevious=0;
        for(const order of orderPreviousMonth)
        {
            const orderDate=new Date(order.createdAt).getDate();
            if(day==orderDate)
            {
                totalPrevious+=order.total;
            }
        }
        dataPreviousMonth.push(totalPrevious);
        //Hết Tính tổng doanh thu theo từng ngày của tháng trước 

    }
  


    res.json(
        {
            code:"success",
            message:"Du lieu bieu do!",
            dataCurrentMonth:dataCurrentMonth,
            dataPreviousMonth:dataPreviousMonth
        }
    )
}