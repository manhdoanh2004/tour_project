const Contact = require("../../models/contac.model")
const moment=require("moment");
module.exports.list=async(req,res)=>
{
    try {
  const find={
            deleted:false 
        };

        //Lọc theo ngày tạo
        const dateFilter={

        };
        if(req.query.startDate)
        {
            const startDate=moment(req.query.startDate).startOf("date").toDate();
            dateFilter.$gte=startDate;

        }
        if(req.query.endDate)
        {
            const endDate=moment(req.query.endDate).startOf("date").toDate();
            dateFilter.$lte=endDate;

        }

        if(Object.keys(dateFilter).length>0)
        {
            find.createdAt=dateFilter;
        }

        //Hết lọc theo ngày tạo

        //Tìm kiếm theo email
        if(req.query.keyword)
        {
            const keyWord=req.query.keyword;
            const keyWordRegex=new RegExp(keyWord,"i");
            find.email=keyWordRegex
        }
        //Hết Tìm kiếm theo email

        //Phân trang
        const limitItem=5;
        let page=1;//Mặc địng là bằng 1

        const totalRecord=await Contact.countDocuments({
            deleted:false
        });
        const totalPage=Math.ceil(totalRecord/limitItem);
        
        if(req.query.page)
        {
            page=parseInt(req.query.page);
        }

        if(page>totalPage)
        {
            page=totalPage
        }

        const skip=((page-1)*limitItem);
       
        //Hết Phân trang

        const contactList=await Contact.find(find).sort({
        createdAt:"desc"
    }).limit(limitItem).skip(skip);
 
    for(let item of contactList)
    {
        item.createdAtFormat=moment(item.createdAt).format("HH:mm - DD/MM/YYYY");
         
    }
    res.render("admin/pages/contact-list.pug",{
        pageTitle:"Thông tin liên hệ ",
        contactList:contactList,
        totalRecord:totalRecord,
        skip:skip,
        limitItem:limitItem,
        totalPage:totalPage
    }) 
   
    } catch (error) {
            res.redirect(`/${pathAdmin}/dashboard`)
    }
       
   
}


module.exports.patchDelete=async(req,res)=>
{
    try {
    const id=req.params.id;
    await Contact.updateOne({
        _id:id
    },{
        deleted:true
    })
    req.flash("success","Xóa thành công!");
    res.json({
        code:"success",
        message:"Xóa thành công!"
    })  
    } catch (error) {
        req.flash("success","Xóa thành công!");
        res.json({
             code:"error",
        message:"Xóa không thành công!"
        })
    }
  
}


module.exports.patchChangeMulti=async(req,res)=>
{
    try {
        const {option,ids}=req.body;

        switch (option) {
            case 'delete':
                await Contact.updateMany({
                    _id: $in=ids
                },{
                    deleted:true
                })
                break;
        
            default:
                break;
        }

        req.flash("success","Thực hiện hành động thành công!");
        res.json({
            code:"success",
            message:"Thực hiện hành động thành công!"
        })  
    } catch (error) {
         req.flash("error","Thực hiện hành động không thành công!");
        res.json({
            code:"error",
            message:"Thực hiện hành động không thành công!"
        })  
    }
  
}