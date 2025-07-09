const mongoose=require("mongoose");

const schema=new mongoose.Schema({
    name:String,
    couponCode:String,
    quantity:Number,
    percent:Number,
    expired:Date,
    maximumPrice:Number,
    deletad:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
});

const Coupon= mongoose.model("Coupon",schema,"coupons");
module.exports=Coupon