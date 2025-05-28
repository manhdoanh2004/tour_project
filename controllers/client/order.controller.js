const Tour = require("../../models/tour.model");
const Order=require("../../models/order.model");
const City=require("../../models/city.model")

const generateHelper=require("../../helpers/generate.helper")
const sortHelper=require("../../helpers/sort.helper")
const variableHelper=require("../../config/variable");
const moment=require("moment");
const axios = require('axios').default; // npm install axios
const CryptoJS = require('crypto-js'); // npm install crypto-js
const querystring = require('qs');
const crypto = require("crypto"); 

module.exports.create = async (req, res) => {

  try {
    if (req.body.items.length >= 1) {

        //Tạo mã đơn hàng 
        req.body.orderCode="OD"+generateHelper.generateRandomNumber(10);
    //Danh sách tour
    for (let item of req.body.items) {
      const tourInfor = await Tour.findOne({
        _id: item.tourId,
        status: "active",
        deleted: false,
      });
      if (tourInfor) {
        //Tiêu đề
        item.name = tourInfor.name;

        //Thêm giá
        item.priceNewAdult = tourInfor.priceNewAdult;
        item.priceNewChildren = tourInfor.priceNewChildren;
        item.priceNewBaby = tourInfor.priceNewBaby;
        item.priceNewBaby = tourInfor.priceNewBaby;

        //Ảnh
        item.avatar = tourInfor.avatar;

        //Ngày khởi hành
        item.departureDate =tourInfor.departureDate;

        //Cập nhật lại số lượng hành khách còn lại của tour
        if (
          tourInfor.stockAdult < item.quantityAdult ||
          tourInfor.stockChildren < item.quantityChildren ||
          tourInfor.stockBaby < item.quantityBaby
        ) {
          return res.json({
            code: "error",
            message: `Số lượng chỗ của tour ${tourInfor.name} vui lòng chọn lại!`,
          });
        }
        await Tour.updateOne(
          {
            _id: item.tourId,
          },
          {
            stockAdult: tourInfor.stockAdult - item.quantityAdult,
            stockChildren: tourInfor.stockChildren - item.quantityChildren,
            stockBaby: tourInfor.stockBaby - item.quantityBaby,
          }
        );
      }
    }

    //Tạm tính
    req.body.subTotal = req.body.items.reduce((sum, item) => {
      return (
        sum +
        (item.priceNewAdult * item.quantityAdult +
          item.priceNewChildren * item.quantityChildren +
          item.priceNewBaby * item.quantityBaby)
      );
    }, 0);

    //Giảm giá
    req.body.discount = 0;

    //Thanh toán
    req.body.total = req.body.subTotal - req.body.discount;

    //Trạng thái thanh toán
    req.body.paymentStatus = "unpaid"; //unpaid : chưa thanh toán , paid:đã thanh toán

    //Trạng thái đơn hành
    req.body.status = "initial"; //inital :khởi tạo, done :hoàn thành , cancel :hủy

   

    const newOrder= new Order(req.body)
    await newOrder.save();


    res.json({
      code: "success",
      message: "Đặt hàng thành công!",
      orderCode:req.body.orderCode,
      phone:req.body.phone,
      orderId:newOrder.id
    });

  }
   else {
    res.json({
      code: "error",
      message: "Đặt hàng không  thành công!",
    });
  }
  } catch (error) {
     res.json({
      code: "error",
      message: "Đặt hàng không  thành công!",
    });
  }
};

module.exports.success=async(req,res)=>
{
    try {

       const {orderCode,phone,orderId}=req.query;

        const orderDetail=await Order.findOne({
          _id:orderId,
          orderCode:orderCode,
            phone:phone,
            
        })
        if(!orderDetail)
        {
          
            return res.redirect("/cart");
        }
      

        orderDetail.paymentMethodName=variableHelper.paymentMethod.find(item=>item.value==orderDetail.paymentMethod);
        orderDetail.paymentStatusName=variableHelper.paymentStatus.find(item=>item.value==orderDetail.paymentStatus);
        orderDetail.orderStatusName=variableHelper.orderStatus.find(item=>item.value==orderDetail.status);
        orderDetail.createAtFormat=moment(orderDetail.createdAt).format("HH:mm - DD/MM/YYYY")
          for (const item of orderDetail.items) {
            const infoTour = await Tour.findOne({
                _id: item.tourId,
                deleted: false
            })

            if(infoTour) {
                item.slug = infoTour.slug;
            }

            item.departureDateFormat = moment(item.departureDate).format("DD/MM/YYYY");

            const city = await City.findOne({
                _id: item.locationFrom
            })

            if(city) {
                item.locationFromName = city.name;
            }

         }


       res.render("client/pages/order-success.pug",
        {
            pageTitle:"Đặt hàng thành công",
            orderDetail:orderDetail
        }
    )  
    } catch (error) {
        res.redirect("/cart");
    }
      

   
}

module.exports.paymentZalopay=async(req,res)=>
{

  try {
    const{orderCode,phone,orderId}=req.query;
    

    const orderDetail=await Order.findOne({
      _id:orderId,
      deleted:false,
      orderCode:orderCode,
      phone:phone,
      paymentStatus:'unpaid'
    })
    if(!orderDetail)
    {
      res.redirect("/");
    }

    // APP INFO
    const config = {
        app_id: process.env.ZALOPAY_APPID,
        key1: process.env.ZALOPAY_KEY1,
        key2:  process.env.ZALOPAY_KEY2,
        endpoint: `${process.env.ZALOPAY_DOMAIN}/v2/create`
    };

    const embed_data = {
      redirecturl:`${process.env.DOMAIN_WEBSITE}/order/success?orderCode=${orderDetail.orderCode}&&phone=${orderDetail.phone}&&orderId=${orderDetail.id}`
    };

    const items = [{}];
    const transID = Math.floor(Math.random() * 1000000);
    const order = {
        app_id: config.app_id,
        app_trans_id: `${moment().format('YYMMDD')}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
        app_user: `${orderDetail.orderCode}-${orderDetail.phone}-${orderDetail.id}`,
        app_time: Date.now(), // miliseconds
        item: JSON.stringify(items),
        embed_data: JSON.stringify(embed_data),
        amount: orderDetail.total,
        description: `Thanh toán đơn hàng ${orderDetail.orderCode}`,
        bank_code: "",// không điền gì thì có thể thanh toán bằng nhiều phương thức khác nhau,
        callback_url: `${process.env.DOMAIN_WEBSITE}/order/payment-zalopay-result`,
      
    };

    // appid|app_trans_id|appuser|amount|apptime|embeddata|item
    const data = config.app_id + "|" + order.app_trans_id + "|" + order.app_user + "|" + order.amount + "|" + order.app_time + "|" + order.embed_data + "|" + order.item;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    const response=await axios.post(config.endpoint, null, { params: order });
    
    if(response.data.return_code==1)
    {
      res.redirect(response.data.order_url);
    }
    else
    {
      res.redirect("/");
    }   
  } catch (error) {
     res.redirect("/");
  }
 
 
}


module.exports.paymentZalopayResultPost=async(req,res)=>
{
  const config = {
    key2: process.env.ZALOPAY_KEY2
  };

  let result = {};

  try {
    let dataStr = req.body.data;
    let reqMac = req.body.mac;

    let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
    
    
    // kiểm tra callback hợp lệ (đến từ ZaloPay server)
    if (reqMac !== mac) {
      // callback không hợp lệ
      result.return_code = -1;
      result.return_message = "mac not equal";
    }
    else {
      // thanh toán thành công
      let dataJson = JSON.parse(dataStr, config.key2);
      const [ orderCode,phone, orderId ] = dataJson.app_user.split("-");

      await Order.updateOne({
        _id: orderId,
        phone: phone,
        deleted: false,
        orderCode:orderCode
      }, {
        paymentStatus: "paid"
      })

      result.return_code = 1;
      result.return_message = "success";
    }
  } catch (ex) {
    result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
    result.return_message = ex.message;
  }

  // thông báo kết quả cho ZaloPay server
  res.json(result);

 
}

module.exports.paymentVNpay=async(req,res)=>
{
  try {
     const{orderCode,phone,orderId}=req.query;
  

  const orderDetail=await Order.findOne({
    _id:orderId,
    deleted:false,
    orderCode:orderCode,
    phone:phone,
    paymentStatus:'unpaid'
  })
  if(!orderDetail)
  {
    res.redirect("/");
  }
  
   let date = new Date();
    let createDate = moment(date).format('YYYYMMDDHHmmss');
    
    let ipAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    
    let tmnCode = process.env.VNPAY_CODE;
    let secretKey = process.env.VNPAY_SECRET;
    let vnpUrl = process.env.VNPAY_URL;
    let returnUrl = `${process.env.DOMAIN_WEBSITE}/order/payment-vnpay-result`;
    let orderIdVNP = `${orderCode}-${orderId}-${phone}-${Date.now()}`;
    let amount = orderDetail.total;
    let bankCode = "";
    
    let locale = "vn";
    let currCode = 'VND';
    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderIdVNP;
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderIdVNP;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    if(bankCode !== null && bankCode !== ''){
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = sortHelper.sortObject(vnp_Params);

    let querystring = require('qs');
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");     
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex"); 
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

    res.redirect(vnpUrl)

  } catch (error) {
    console.log(error)
    res.redirect("/");
  }

}

module.exports.paymentVNPayResult=async(req,res)=>
{
 try {
     let vnp_Params = req.query;

  let secureHash = vnp_Params['vnp_SecureHash'];

  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  vnp_Params = sortHelper.sortObject(vnp_Params);

  let secretKey = process.env.VNPAY_SECRET;

  let querystring = require('qs');
  let signData = querystring.stringify(vnp_Params, { encode: false });
  let crypto = require("crypto");     
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
  
  if(secureHash === signed){
    if(vnp_Params["vnp_ResponseCode"] == "00" && vnp_Params["vnp_TransactionStatus"] == "00") {
      const [ orderCode,orderId,phone, date ] = vnp_Params["vnp_TxnRef"].split("-");


      await Order.updateOne({
        _id: orderId,
        orderCode:orderCode,
        phone:phone,
        deleted: false
      }, {
        paymentStatus: "paid"
      })

      res.redirect(`${process.env.DOMAIN_WEBSITE}/order/success?orderCode=${orderCode}&&orderId=${orderId}&phone=${phone}`);
    } else {
      res.render('success', {code: '97'})
    }
  } else{
    res.render('success', {code: '97'})
  }
 } catch (error) {
  console.log(error)
  res.redirect("/")
 }

}
