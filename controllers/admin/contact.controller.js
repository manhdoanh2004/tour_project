const Contact = require("../../models/contac.model")
const moment=require("moment");
module.exports.list=async(req,res)=>
{
    try {
        const contactList=await Contact.find({
        deleted:false
    }).sort({
        createdAt:"desc"
    })
 
    for(let item of contactList)
    {
        item.createdAtFormat=moment(item.createdAt).format("HH:mm - DD/MM/YYYY");
         
    }
    res.render("admin/pages/contact-list.pug",{
        pageTitle:"Thông tin liên hệ ",
        contactList:contactList
    }) 
    } catch (error) {
            res.redirect(`/${pathAdmin}/dashboard`)
    }
   
}