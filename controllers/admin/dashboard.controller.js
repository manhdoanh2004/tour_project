const Order=require("../../models/order.model")
const AccountAdmin=require("../../models/account-admin.model")
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

  

   
    res.render("admin/pages/dashboard.pug",{
        pageTitle:"Tổng quan",
        orderList:orderList,
        overView:overView
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