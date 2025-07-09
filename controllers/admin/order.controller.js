const Order = require("../../models/order.model");
const variableConfig = require("../../config/variable");
const City = require("../../models/city.model");

const moment = require("moment");

module.exports.list = async (req, res) => {
  if (!req.permissions.includes("order-list")) {
    return res.redirect(`/${pathAdmin}/dashboard`);
  }
  try {
    const find = {
      deleted: false,
    };

    //Lọc theo trạng thái đơn hàng 
    if(req.query.status)
    {
        find.status=req.query.status
    }
    //Hết Lọc theo trạng thái đơn hàng 
    
    //Lọc theo phương thức thanh toán của đơn hàng
    if(req.query.paymentMethod)
    {
        find.paymentMethod=req.query.paymentMethod
    }
    //HếtLọc theo phương thức thanh toán của đơn hàng
    
    //Lọc theo trạng thái thanh toán của đơn hàng
    if(req.query.paymentStatus)
    {
        find.paymentStatus=req.query.paymentStatus
    }
    //Hết Lọc theo trạng thái thanh toán của đơn hàng

    //Lọc đơn hàng theo ngày tạo
    const dateFilter={};
    if(req.query.startDate)
    {
        const startDate=moment(req.query.startDate).startOf("date").toDate();
        dateFilter.$gte=startDate
    }

    if(req.query.endDate)
    {
         const endDate=moment(req.query.endDate).endOf("date").toDate();
        dateFilter.$lte=endDate
    }
    if(Object.keys(dateFilter).length>0)
    {
        find.createdAt=dateFilter;
    }
    //Hết Lọc đơn hàng theo ngày tạo

    //Tìm kiến đơn hàng theo họ tên của khách hàng
    if(req.query.keyword)
    {
        const keyWord=req.query.keyword;
        const keyWordRegex=new RegExp(keyWord,'i');
        find.fullName=keyWordRegex
    }
    //Hết Tìm kiến đơn hàng theo họ tên của khách hàng


    //Phân trang
    
    const limitItem=6
   
    let page=1; //Mặc định là bằng 1
    if(req.query.page)
    {
         page=parseInt(req.query.page);
    }
    const totalRecord=await Order.countDocuments({  deleted: false});
    const totalPage=Math.ceil(totalRecord/limitItem);

    if(page>totalPage)
    {
        page=totalPage
    }

     const skip=(page-1)*limitItem;
    const orderList = await Order.find(find).sort({
      createdAt: "desc",
    }).limit(limitItem).skip(skip);
    //Hết Phân trang 
   

    for (let orderDetail of orderList) {
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

    res.render("admin/pages/order-list.pug", {
      pageTitle: "Quản lý đơn hàng",
      orderList: orderList,
      totalPage:totalPage,
      totalRecord:totalRecord,
      skip:skip,
      limitItem:limitItem,
      paymentMethodList: variableConfig.paymentMethod,
      paymentStatusList: variableConfig.paymentStatus,
      statusList: variableConfig.orderStatus,
      
    });
  } catch (error) {
    res.redirect(`/${pathAdmin}/dashboard`);
  }
};

module.exports.edit = async (req, res) => {
  if (!req.permissions.includes("order-edit")) {
    return res.json({
      code: "error",
      message: "Không có quyền sử dụng tính năng này!",
    });
  }
  try {
    const orderId = req.params.id;

    const orderDetail = await Order.findOne({
      _id: orderId,
      deleted: false,
    });

    for (let item of orderDetail.items) {
      item.departureDateFormat = moment(item.departureDate).format(
        "DD/MM/YYYY"
      );
      const city = await City.findOne({
        _id: item.locationFrom,
      });

      item.locationFromName = city.name;
    }

    orderDetail.createdAtFormat = moment(orderDetail.createdAt).format(
      "YYYY-MM-DDTHH:MM"
    );

    res.render("admin/pages/order-edit.pug", {
      pageTitle: `Đơn hàng: ${orderDetail.orderCode}`,
      orderDetail: orderDetail,
      paymentMethodList: variableConfig.paymentMethod,
      paymentStatusList: variableConfig.paymentStatus,
      orderStatusList: variableConfig.orderStatus,
    });
  } catch (error) {
    res.redirect(`/${pathAdmin}/order/list`);
  }
};

module.exports.editPatch = async (req, res) => {
  if (!req.permissions.includes("order-edit")) {
    return res.json({
      code: "error",
      message: "Không có quyền sử dụng tính năng này!",
    });
  }
  try {
    const id = req.params.id;

    const orderDetail = await Order.findOne({
      _id: id,
      deleted: false,
    });
    if (!orderDetail) {
      return res.json({
        code: "error",
        message: "Thông tin đơn hàng không hợp lệ!",
      });
    }
    await Order.updateOne(
      {
        _id: id,
        deleted: false,
      },
      req.body
    );
    res.json({
      code: "success",
      message: "Cập nhật đơn hành thành công!",
    });
  } catch (error) {
    res.json({
      code: "error",
      message: "Thông tin đơn hàng không hợp lệ!",
    });
  }
};


module.exports.deletePatch=async(req,res)=>
{
    if (!req.permissions.includes("order-delete")) {
        return res.json({
        code: "error",
        message: "Không có quyền sử dụng tính năng này!",
        })
    };
    try {
         const orderId=req.params.id;
        
        await  Order.updateOne({
            _id:orderId
         },{
            deleted:true
         })
        req.flash("success","Xóa đơn hàng thành công!");
        res.json({
            code:"success",
            message:"Xóa đơn hàng thành công!"
        });
    } catch (error) {
       req.flash("error","Xóa đơn hàng không thành công!");
        res.json({
            code:"error",
            message:"Xóa đơn hàng không thành công!"
        })
    }
       
}