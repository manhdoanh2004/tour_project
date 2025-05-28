const Contact = require("../../models/contac.model");

module.exports.contacCreate=async(req,res)=>
{
  
    const {email}=req.body;
    const existContact=await Contact.findOne({
        email:req.body.email
    })
    if(existContact)
    { 
        return res.json({
        code:"error",
        message:"Email của bạn nhập đã được đăng ký rồi!"
    })
    }
        const newContact =new Contact({
            email:email,
        });
        await newContact.save();
        req.flash("success","Cảm ơn bạn đã đăng ký nhận tin tức!")
    res.json({
        code:"success",
        message:"Đăng ký thành công!"
    })
}