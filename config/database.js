const mongoose = require('mongoose');
module.exports.conect=async()=>
{
    try{
      
    
       await  mongoose.connect(process.env.DATABASE);
       console.log("Kết nối database thành công")
    }catch(error)
    {
        console.log("kết nối database thất bại" +error)
    }
   
}