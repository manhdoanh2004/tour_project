const Joi = require('joi');
module.exports.createPost=async(req,res,next)=>
{
    
    const schema=Joi.object({
        name:Joi.string().required().messages({
                    "string.empty": "Vui lòng nhập tên quyền!"
                }),
     
            
                description: Joi.string().allow(''), // Cho phép chuỗi rỗng
                permissions: Joi.array().items(Joi.string()).min(1).messages({
                  'array.base': 'Trường permissions phải là một mảng.',
                  'array.min': 'Mảng permissions phải có ít nhất một phần tử.',
                  'array.items': 'Các phần tử trong mảng permissions phải là chuỗi.'
                })
    });
    const { error } = schema.validate(req.body);
    if(error)
    {
        const errorMessage = error.details[0].message;
        res.json({
            code: "error",
            message: errorMessage
          });
          return;
    }
    next();
}