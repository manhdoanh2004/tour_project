const Coupon=require("../../models/coupon.model");

const moment =require("moment");
module.exports.list=async(req,res)=>
{
     if(!req.permissions.includes("coupon-list"))
    {
    return res.json({
            code:"error",
            message:"Không có quyền sử dụng tính năng này!"
        })
    }

     const find={};

    //Tìm kiếm theo mã coupon
    if(req.query.keyword)
    {
       
        const keyWord=req.query.keyword;
        const keyWordRegex=new RegExp(keyWord,"i");
        find.couponCode=keyWordRegex
    }
    //Hết Tìm kiếm theo mã coupon

    //Phân trang
   
    const limitItem=6
   
    let page=1; //Mặc định là bằng 1
    if(req.query.page)
    {
         page=parseInt(req.query.page);
    }
    const totalRecord=await Coupon.countDocuments();
    const totalPage=Math.ceil(totalRecord/limitItem);

    if(page>totalPage)
    {
        page=totalPage
    }

     const skip=(page-1)*limitItem;
    const couponList = await Coupon.find(find).sort({
      createdAt: "desc",
    }).limit(limitItem).skip(skip);
    //Hết Phân trang 
   
    

    for(let item of couponList)
    {
        item.expiredFormat=moment(item.expired).format("DD-MM-YYYY");
        item.createdAtFormat=moment (item.createdAtFormat).format("DD-MM-YYYY");
    }

    res.render("admin/pages/coupon-list.pug",{
        pageTitle:"Danh sách phiếu giảm giá",
        couponList:couponList,
        totalPage:totalPage,
        totalRecord:totalRecord,
        skip:skip,
        limitItem:limitItem
    })
}
module.exports.create=async(req,res)=>
{
     if(!req.permissions.includes("coupon-create"))
    {
    return res.json({
            code:"error",
            message:"Không có quyền sử dụng tính năng này!"
        })
    }
    res.render("admin/pages/coupon-create.pug",{
        pageTitle:"Tạo phiếu giảm giá"
    })
}

module.exports.createPost=async(req,res)=>
{
    if(!req.permissions.includes("coupon-create"))
    {
    return res.json({
            code:"error",
            message:"Không có quyền sử dụng tính năng này!"
        })
    }
   

    try {
           req.body.quantity=parseInt(req.body.quantity);
    req.body.percent=parseInt(req.body.percent);
    req.body.maximumPrice=parseInt(req.body.maximumPrice);
    req.body.expired=new Date(req.body.expired);
 
    const newCoupon= Coupon(req.body);
    await newCoupon.save();

    req.flash("success","Tạo phiếu giảm giá thành công!")
    res.json({
        code:"success",
        message:"Tạo phiếu giảm giá thành công!"
    })
    } catch (error) {
        console.log(error)
        req.flash("error","Lỗi tạo phiếu giảm giá!")
        res.json({
            code:"error",
        message:"Lỗi tạo phiếu giảm giá!"
        })
    }
 
}