const mongoose = require("mongoose");
var slug = require('mongoose-slug-updater');//nhúng thư viện tạo slug
mongoose.plugin(slug);
const schema = new mongoose.Schema(
  {
    name: String,
    parent: String,
    position: Number,
    status: String,
    avatar: String,
    description: String,
    createdBy: String,
    updatedBy: String,
    slug: {
      type:String,
      slug: "name",
      unique: true 
    },//tạo slug cho từng danh mục
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedBy: String,
    deletedAt: Date,
  },
  {
    timestamps: true, //tự động tạo ra  createTime và updateTime
  }
);

const Category=mongoose.model("category",schema,"categories");
module.exports=Category;
