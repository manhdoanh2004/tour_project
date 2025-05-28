const mongoose=require("mongoose");

const schema= new mongoose.Schema({
    email:String,
    otp:String,
    expireAt:{
        type:Date,
        expires:0
    }
},
{
    timestamps:true, //Tự động sinh ra createdAt và updatedAt
}
)

const ForGotPassWord=mongoose.model('ForGotPassWord',schema,'forgot-password');

module.exports=ForGotPassWord;