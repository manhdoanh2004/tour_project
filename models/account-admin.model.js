const mongoose=require("mongoose");

const schema=new mongoose.Schema({
    fullName:String,
    email:String,
    passWord:String,
    status:String,
    phone:String,
    role:String,
    positionCompany:{
        type:String,
        default:"Nhân viên"
    }
    ,
    avatar:String,
    deleted:false
});

const accountAdmin=mongoose.model('accountAdmin',schema,'account-admin');

module.exports=accountAdmin;