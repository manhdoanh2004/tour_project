const mongoose=require("mongoose");
const schema= new mongoose.Schema({
    fullName:String,
    phone:String,
    note:String,
    items:Array,
    subTotal:Number,
    total:Number,
    paymentMethod:String,
    status:String,
    updatedBy:String,
    deleted:{
        type:Boolean,
        default:false
    },
    deletedBy:String,
    deletedAt:Date,
    paymentStatus:String,
    orderCode:String,
    discount:String

},
{
    timestamps:true
})

const Order= mongoose.model("Order",schema,"orders");
module.exports=Order;