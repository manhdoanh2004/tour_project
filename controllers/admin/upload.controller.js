module.exports.uploadImage=(req,res)=>
{
    res.json({
         location:req.file.path
        })
}