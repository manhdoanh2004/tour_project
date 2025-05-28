const express = require('express')
const flash = require('express-flash')
const cookieParser = require('cookie-parser')
const path=require('path');
require('dotenv').config();
const app = express()
const port = 3000
const adminRoutes=require("./routes/admin/index.route");
const clientRoutes=require("./routes/client/index.route");
const session = require('express-session')


//Kết nối database
const database=require("./config/database");
database.conect();



//Thiết lập      views
app.set('views', path.join(__dirname,'views'))

app.set('view engine', 'pug')

//cho phép gửi data lên dạng json
app.use(express.json());

const variableConfig=require("./config/variable");

//sử dụng cookieParser
app.use(cookieParser('AJJSDSSJJLL'))

//Nhúng flash
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());


//Tạo biến toàn cục trong file PUG
app.locals.pathAdmin=variableConfig.pathAdmin;


//Tạo biến toàn cục bên BE
global.pathAdmin=variableConfig.pathAdmin;

//Thiết lập thư mục chứa file của FE 
app.use(express.static(path.join(__dirname,'public')))




//thiết lập đường dẫn bên admin
app.use(`/${variableConfig.pathAdmin}`,adminRoutes);

//Thiết lập đường dẫn bên client
app.use('/',clientRoutes);



app.listen(port, () => {
  console.log(`Website đang chạy cổng  ${port}`)
})

