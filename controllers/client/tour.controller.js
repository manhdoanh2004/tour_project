const Category = require("../../models/categories.model");
const Tour = require("../../models/tour.model");
const moment =require("moment")
const City=require("../../models/city.model")
module.exports.detail = async (req, res) => {

  try {
     const slug = req.params.slug;

  //Tìm tour theo slug
  const tourDetail = await Tour.findOne({
    status: "active",
    slug: slug,
    deleted: false,
  });
 
    const breadCrumb = {
      image: tourDetail.avatar,
      title: tourDetail.name,
      list: [
        {
          link: "/",
          title: "Trang chủ",
        },
      ],
    };

    //Tìm danh mục
    if (tourDetail.category) {
      const category = await Category.findOne({
        _id: tourDetail.category,
        status: "active",
        deleted: false,
      });

      if (category) {
        breadCrumb.list.push({
          link: `/category/${category.slug}`,
          title: category.name,
        });

        //Tìm danh mục cha
        const categoryParent = await Category.findOne({
          _id: category.parent,
          status: "active",
          deleted: false,
        });

        if (categoryParent) {
          breadCrumb.list.push({
            link: `/category/${categoryParent.slug}`,
            title: categoryParent.name,
          });
        }
      }
    }

    //Thêm danh mục hiện tại
    breadCrumb.list.push({
      link: `/category/${tourDetail.slug}`,
      title: tourDetail.name,
    });

    //Hết Tìm tour theo slug

     //Lấy ra thông tin chi tiết tour
     tourDetail.departureDateFormat=moment( tourDetail.departureDate).format("DD/MM/YYYY") 
      let cities=[];
      for(let item of tourDetail.locations)
      {
         const city=await City.findOne({
          _id:item,
         })
         if(city)
         {
          cities.push(city)
         }
      }
      tourDetail.cities=cities
 
    //Hết Lấy ra thông tin chi tiết tour


    res.render("client/pages/tour-detail", {
      pageTitle: "Chi tiết tour",
      breadCrumb: breadCrumb,
      tourDetail:tourDetail
    });
  
  } catch (error) {
    res.redirect("/");
  }
 
};
