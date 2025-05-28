const mongoose = require('mongoose');
var slug = require('mongoose-slug-updater');//nhúng thư viện tạo slug
mongoose.plugin(slug);
const schema=new mongoose.Schema({ 
    name: String , 
    category:String,
    position:Number,
    vehicle : String ,
    status:String,
    avatar:String,
    priceAdult:Number,
    priceChildren:Number,
    priceBaby:Number,
    priceNewAdult:Number,
    priceNewChildren:Number,
    priceNewBaby:Number,
    stockAdult:Number,
    stockChildren:Number,
    stockBaby:Number,
    stockBaby:Number,
    time:String,
    departureDate:Date,
    information:String,
    schedules:Array,
    locations:Array,
    images:Array,
    slug:{
        type:String,
        slug: "name",
        unique: true 
    },
    createdBy: String,
    updatedBy: String,
     deleted: {
        type: Boolean,
        default: false,
      },
      deletedBy: String,
      deletedAt: Date,

},{
    timestamps: true, //tự động tạo ra  createTime và updateTime
})
const Tour = mongoose.model('Tour', schema,'tours');

 module.exports=Tour;

