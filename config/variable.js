module.exports.pathAdmin="admin"
module.exports.paymentMethod=[{
    label:"Thanh toán tiền mặt",
    value:"money"
},
{
    label:"Ví momo",
    value:"momo"
},
{
    label:"Chuyển khoản ngân hàng",
    value:"bank"
},
{
    label:"Thanh toán bằng ZaloPay",
    value:"zalopay"
},
{
    label:"Thanh toán bằng VNPay",
    value:"vnpay"
},
]

module.exports.paymentStatus=[
    {
        label:"Chưa thanh toán",
        value:"unpaid"
    },
    {
        label:"Đã thanh toán",
        value:"paid"
    }
]

module.exports.orderStatus=[
    {
        label:"Khởi tạo",
        value:"initial"
    },
       {
        label:"Đã hoàn thành",
        value:"done"
    },   {
        label:"Hủy ",
        value:"cancel"
    },
]
module.exports.orderStatusClient=[
    {
        label:"Đang xử lý",
        value:"initial"
    },
       {
        label:"Đã hoàn thành",
        value:"done"
    },   {
        label:"Đã hủy ",
        value:"cancel"
    },
]


module.exports.trackingType=[
    {
        link:"/tracking?type=tourOrder",
        title:"Tour đã đặt",
        value:"tourOrder"
    },

 

]