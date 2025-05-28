const accountAdmin = require("../../models/account-admin.model")
const bcrypt = require("bcryptjs");

//Các hàm của trang đổi mật khẩu cá nhân
module.exports.changePassword=(req,res)=>
{
    res.render("admin/pages/profile-change-password.pug",{
        pageTitle:"Đổi mật khẩu"
    })
}


module.exports.changePasswordPatch=async(req,res)=>
{
   try {
    const {passWord}=req.body;
    //Mã hóa mật khẩu với bcrypt trước khi lưu vào cơ sở dữ liệu
    const salt = await bcrypt.genSalt(10); //Tạo ra 1 chuỗi ngẫu nhiên có 10 kí tự
    const hashedPassword = await bcrypt.hash(passWord, salt); //mã hóa mật khẩu được truyền vào
  
      await accountAdmin.updateOne({
          _id:req.account.id
      },{
          passWord:hashedPassword
      })
      req.flash("success","Đổi mật khẩu thành công!")
      res.json({
          code:"success",
          message:"Đổi mật khẩu thành công!"
      })
   } catch (error) {
    res.json({
        code:"error",
        message:"Đổi mật khẩu không thành công!"
    })
   }
}

//Hết các hàm của trang đổi mật khẩu cá nhân

//Các hàm của trang thông tin cá nhân
module.exports.edit=(req,res)=>
{

    res.render("admin/pages/profile-edit.pug",{
        pageTitle:"Thông tin cá nhân"
    })
}

module.exports.editPatch=async(req,res)=>
{
    try {
        if(req.file)
            {
                req.body.avatar=req.file.path
            }
    else delete req.body.avatar

    
            await accountAdmin.updateOne({
                _id:req.account.id
            },req.body)
    req.flash("success","Cập nhập profile thành công!")
    res.json({
        code:"success",
        message:"Cập nhập profile thành công!"
    })
    } catch (error) {
        res.json({
            code:"error",
            message:"Cập nhập profile không thành công!"
        })
    }
  
}


//Hết các hàm chỉnh sửa của trang thông tin cá nhân