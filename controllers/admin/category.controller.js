const moment=require("moment");
const Category=require("../../models/categories.model");
const categoryHelper=require("../../helpers/categories.helper");
const accountAdmin =require("../../models/account-admin.model");
const slugify = require('slugify')

module.exports.list=async(req,res)=>
{

   try {
    
    const find={
        deleted:false
    }

    //Lọc theo trạng thái
    if(req.query.status)
    {
        find.status=req.query.status
      
    }
     //Hết theo trạng thái

    //Lọc theo người tạo
    if(req.query.createdBy)
        {
            find.createdBy=req.query.createdBy
          
        }
    //Hết lọc theo người tạo


    //Lọc theo ngày tạo
    const dateFilter={};
    if(req.query.startDate)
    {
       

        const startDate=moment(req.query.startDate).startOf("date").toDate();
        dateFilter.$gte=startDate;

      
    }

    if(req.query.endDate)
        {
      
    
            const endDate=moment(req.query.endDate).endOf("date").toDate();
            dateFilter.$lte=endDate;
            
         
        }

        if(Object.keys(dateFilter).length>0)
        {
            find.createdAt=dateFilter;
        }

    //End lọc theo ngày tạo

    //Tìm kiếm
    if(req.query.keyword)
    {
        
        const keyWordSlug=slugify(req.query.keyword, {
            lower: true,      
          })
          const keyWordRg=new RegExp(keyWordSlug);
          find.slug=keyWordRg
    }
    //Hết tìm kiếm

    //Phân trang
    const limitItem=3;
    let page=1// Mặc định là trang đầu tiên
 
    if(req.query.page)
    {
        const pageCurrent=parseInt(req.query.page);
        if(pageCurrent>0)
        {
            page=pageCurrent
        }
    }
    const skip=(page-1)*limitItem;

    const totalRecord=await Category.countDocuments(find);
    const totalPage=Math.ceil( totalRecord/limitItem);
    
    if(page>totalPage)
    {
        page=totalPage;
    }

    const pagination={
        skip:skip,
        totalRecord:totalRecord,
        totalPage:totalPage
    }
    //Hết Phân trang




    const categoryList=await Category.find(find).sort({
        position:"desc"
    })
    .limit(limitItem)
    .skip(skip);
  
  
   
    for(let item of categoryList)
    {
        if(item.createdBy)
        {
            const infoAccountCreated= await accountAdmin.findOne({
                _id:item.createdBy
            })
            item.createdByFullName=infoAccountCreated.fullName;
        }
        if(item.updatedBy)
            {
                const infoAccountUpdated= await accountAdmin.findOne({
                    _id:item.updatedBy
                })
                item.updatedByFullName=infoAccountUpdated.fullName;
            }

            item.createdAtFormat=moment(item.createdAt).format("HH:mm - DD/MM/YYYY");
            item.updatedAtFormat=moment(item.updatedAt).format("HH:mm - DD/MM/YYYY");
    }


    //Lấy ra tên của từng tài khoản, id thì mặc định được trả về
    const accountAdminList=await accountAdmin.find({}).select("fullName")
    //Hết Lấy ra tên của từng tài khoản, id thì mặc định được trả về

    res.render("admin/pages/category-list.pug",{
        pageTitle:"Quản lý danh mục",
        categoryList:categoryList,
        accountAdminList:accountAdminList,
        pagination:pagination
        }
    );
   } catch (error) {
    res.redirect(`/${pathAdmin}/dashboard`)
    console.log("Loi lay du")
   }
}

module.exports.create=async(req,res)=>
{
    const categoryList=await Category.find({
        deleted:false
    });

    const categoryTree=categoryHelper.buildCategoryTree(categoryList)
   
    res.render("admin/pages/category-create.pug",{
        pageTitle:"Tạo danh mục ",
        categoryList:categoryTree
    })
}


//hàm tạo danh mục mới 
module.exports.createPost=async(req,res)=>
{
  if(!req.permissions.includes("category-create"))
  {
   return res.json({
        code:"error",
        message:"Không có quyền sử dụng tính năng này!"
    })
  }

  try {
     //kiểm tra xem có gửi lên biến position không
     if(req.body.position)
        {
         req.body.position=parseInt(req.body.position); // chuyển từ string sang number
        
        }
        else
        {
         //nếu không gửi lên biến position thì mặc định position là tăng dần 
             const totalRecord=await Category.countDocuments({});
             req.body.position=totalRecord+1;
            
        }
     
        //lấy id của người tạo và người cập nhật, lần đầu tiên thì người tạo và người cập nhật là 1 người
        req.body.createdBy=req.account.id;
        req.body.updatedBy=req.account.id;
        req.body.avatar=req.file?req.file.path:""; //nếu gửi ảnh thì lấy đường dẫn của ảnh , nếu không thì lưu chuỗi rỗng
        
       
        //lưu vào cơ sở dữ liệu
        const newRecord=new Category(req.body);
        await newRecord.save();
     
        req.flash('success', 'Tạo danh mục thành công');
        return res.json({
         code:"success",
       
        }) 
  } catch (error) {
    console.log("Lỗi tạo danh mục")
  }
}

module.exports.edit=async(req,res)=>
{
    try {
        const categoryList=await Category.find({
            deletead:false
        })
        const categoryTree=categoryHelper.buildCategoryTree(categoryList)
        const id=req.params.id;
    
    
        const categoryDetail=await Category.findOne({
            _id:id,
            deleted:false,
        })
      
    
    
        res.render("admin/pages/category-edit.pug",{
            pageTitle:"Chỉnh sửa danh mục",
            categoryDetail:categoryDetail,
            categoryList:categoryTree
        })
    } catch (error) {
        res.redirect(`/${pathAdmin}/category/list`)
    
    }
 
}


module.exports.editPatch=async(req,res)=>
{

    if(!req.permissions.includes("category-edit"))
        {
         return res.json({
              code:"error",
              message:"Không có quyền sử dụng tính năng này!"
          })
        }

   try {
    const id=req.params.id;

    //kiểm tra xem có gửi lên biến position không
 if(req.body.position)
  {
   req.body.position=parseInt(req.body.position); // chuyển từ string sang number
  
  }
  else
  {
   //nếu không gửi lên biến position thì mặc định position là tăng dần 
       const totalRecord=await Category.countDocuments({});
       req.body.position=totalRecord+1;
      
  }

  //lấy id người cập nhật, lần đầu tiên thì người tạo và người cập nhật là 1 người

  req.body.updatedBy=req.account.id;
  if(req.file)
  {
      //nếu gửi ảnh thì lấy đường dẫn của ảnh
      req.body.avatar=req.file.path;
  }
  else
  { //nếu không thì thì xóa biến avatar
      delete req.body.avatar;
  }

  //cập nhật bản ghi trong cơ sở dữ liệu
  await Category.updateOne({
      _id:id,
      deleted:false
  },req.body)
 


  req.flash('success', 'Cập nhật danh mục thành công');
  return res.json({
   code:"success",
 
  })
   } catch (error) {
    req.flash('error', 'id không hợp lệ');
  return res.json({
   code:"error",
 
  })
   }
}

module.exports.deletePatch=async(req,res)=>
{
    if(!req.permissions.includes("category-delete"))
        {
         return res.json({
              code:"error",
              message:"Không có quyền sử dụng tính năng này!"
          })
        }
    try {
        const id=req.params.id;
     
     
      
        await Category.updateOne({
            _id:id,
            deleted:false
        },{
            deleted:true,
            deletedBy: req.account.id,
            deletedAt: Date.now(),
        })

        req.flash('success', 'Xóa danh mục thành công');
        return res.json({
            code:"success",
            message:"Xóa danh mục thành công!"
        })
     

    } catch (error) {
        return res.json({
            code:"error",
            message:"Xóa danh mục không thành công!"
        })
    }
   
}


module.exports.changeMultiPatch=async(req,res)=>
{
    if(!req.permissions.includes("category-edit"))
        {
         return res.json({
              code:"error",
              message:"Không có quyền sử dụng tính năng này!"
          })
        }
    try {
        const option=req.body.option
        const ids=req.body.ids
       switch (option) {
        case 'active':
        case 'inactive':
                
            await Category.updateMany({
                _id:{$in:ids}
            },{
                status:option
            })
            req.flash('success',
                "Đổi trạng thái thành công")
            res.json({
                code:'success',
                message:"Đổi trạng thái thành công"
            })   
           break;
        case 'delete':
            await Category.updateMany({
                _id:{$in:ids}
            },{
                deleted:true,
                deletedBy:req.account.id,
                deletedAt:Date.now()
            })
            req.flash('success',
                "Xóa thành công")
            break;
       
        default:
            break;
       }
       
    } catch (error) {
        res.json({
            code:'error',
            message:"Id không tồn tại trong hệ thống"
        })   
    }
   
}