const Category = require("../../models/categories.model");
const categoryHelper=require("../../helpers/categories.helper");
const Tour = require("../../models/tour.model");
const City=require("../../models/city.model")
const moment =require("moment")
module.exports.list=async(req,res)=>
{
    //lấy slug từ bên client
    const slug =req.params.slug;

    //Tìm danh mục theo slug
    const category=await Category.findOne({
        slug:slug,
        deleted:false,
        status:"active"
    })
  
   if(category)
   {
        const breadCrumb={
            image:category.avatar,
            title:category.name,
            list:[
                {
                    link:"/",
                    title:"Trang chủ"
                },
                
            ]
        }

       
        //Tìm danh mục cha
        if(category.parent)
        {
            const categoryParent=await Category.findOne({
                _id:category.parent,
                status:"active",
                deleted:false
            })

            if(categoryParent)
            {
                breadCrumb.list.push({
                    link:`/category/${categoryParent.slug}`,
                    title:categoryParent.name
                },)
            }
        }

        //Thêm danh mục hiện tại
         breadCrumb.list.push({
            link:`/category/${category.slug}`,
            title:category.name
        },)


          //Tìm tour theo danh mục
        const listcategoryId=await categoryHelper.getAllSubcategoryIds(category.id)
          const find ={
            deleted:false,
            status:"active",
            category:{$in:listcategoryId}
        }
         const totalTour=await Tour.countDocuments(find);
        const tourList=await Tour.find(find).sort({
            position:"desc"
        }).limit(6)
        
        for(let item of tourList )
        {
            item.departureDateFormat=moment(item.departureDate).format("DD/MM/YYYY");
        }
         //Hết tìm tour theo danh mục
        

         //Lấy ra danh sách thành phố
         const cityList=await City.find({});
         //Hết lấy ra danh sách thành phố

        res.render("client/pages/tour-list.pug",{
            pageTitle:"Danh sách tour",
            breadCrumb:breadCrumb,
            category:category,
            tourList:tourList,
            totalTour:totalTour,
            cityList:cityList
        })
   }
   else
   {
    res.redirect(`/`);
   }
   
}