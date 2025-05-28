const mongoose=require("mongoose");

const scheme=new mongoose.Schema({
    email:String,
    deletedBy:String,
    deletedAt:Date,
    deleted:{
        type:Boolean,
        default:false
    }
},
{
    timestamps:true
})

const Contact= mongoose.model("contact",scheme,"contacts");
module.exports=Contact