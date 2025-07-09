

// Menu Mobile
const buttonMenuMobile = document.querySelector(".header .inner-button-menu");
if(buttonMenuMobile) {
  const sider = document.querySelector(".sider");
  const siderOverlay = document.querySelector(".sider-overlay");

  buttonMenuMobile.addEventListener("click", () => {
    sider.classList.add("active");
    siderOverlay.classList.add("active");
  })

  siderOverlay.addEventListener("click", () => {
    sider.classList.remove("active");
    siderOverlay.classList.remove("active");
  })
}
// End Menu Mobile

// Schedule Section 8
const scheduleSection8 = document.querySelector(".section-8 .inner-schedule");
if(scheduleSection8) {
  const buttonCreate = scheduleSection8.querySelector(".inner-schedule-create");
  const listItem = scheduleSection8.querySelector(".inner-schedule-list");

  // Tạo mới
  if(buttonCreate) {
    buttonCreate.addEventListener("click", () => {
      const firstItem = listItem.querySelector(".inner-schedule-item");
      const cloneItem = firstItem.cloneNode(true);//sao chép lại element firstItem, true :sao chép nông, false:sao chép sâu(sao chép cả element con)
      cloneItem.querySelector(".inner-schedule-head input").value = "";

      const body = cloneItem.querySelector(".inner-schedule-body");
      const id = `mce_${Date.now()}`;
      body.innerHTML = `<textarea textarea-mce id="${id}"></textarea>`;

      listItem.appendChild(cloneItem);

      initTinyMCE(`#${id}`);
    })
  }

  listItem.addEventListener("click", (event) => {
    // Đóng/mở item
    if(event.target.closest('.inner-more')) {
      const parentItem = event.target.closest('.inner-schedule-item');
      if (parentItem) {
        parentItem.classList.toggle('hidden');
      }
    }

    // Xóa item
    if(event.target.closest('.inner-remove')) {
      const parentItem = event.target.closest('.inner-schedule-item');
      const totalItem = listItem.querySelectorAll(".inner-schedule-item").length;
      if (parentItem && totalItem > 1) {
        parentItem.remove();
      }
    }
  })

  // Sắp xếp
  new Sortable(listItem, {
    animation: 150, // Thêm hiệu ứng mượt mà
    handle: ".inner-move", // Chỉ cho phép kéo bằng class .inner-move
    onStart: (event) => {
      const textarea = event.item.querySelector("[textarea-mce]");
      const id = textarea.id;
      tinymce.get(id).remove();
    },
    onEnd: (event) => {
      const textarea = event.item.querySelector("[textarea-mce]");
      const id = textarea.id;
      initTinyMCE(`#${id}`);
    }
  });
}
// End Schedule Section 8

// Filepond Image
const listFilepondImage = document.querySelectorAll("[filepond-image]");
let filePond = {};
if(listFilepondImage.length > 0) {
  listFilepondImage.forEach(filepondImage => {
    FilePond.registerPlugin(FilePondPluginImagePreview);
    FilePond.registerPlugin(FilePondPluginFileValidateType);

    let files = null;
    const elementImageDefault = filepondImage.closest("[image-default]");//tìm kiếm phần tử cha gần nhất có thuộc tính là image-default
    if(elementImageDefault) {
      const imageDefault = elementImageDefault.getAttribute("image-default");
      if(imageDefault) {
        files = [
          {
            source: imageDefault, // Đường dẫn ảnh
          },
        ]
      }
    }



    filePond[filepondImage.name] = FilePond.create(filepondImage, {
      labelIdle: '+',
      files:files
    });
  });
}
// End Filepond Image


// Filepond Image Multi
const listFilepondImageMulti = document.querySelectorAll("[filepond-image-multi]");
let filePondMulti = {};
if(listFilepondImageMulti.length > 0) {
  listFilepondImageMulti.forEach(filepondImage => {
    FilePond.registerPlugin(FilePondPluginImagePreview);
    FilePond.registerPlugin(FilePondPluginFileValidateType);

    let files = null;
    const elementListImageDefault = filepondImage.closest("[list-image-default]");
    if(elementListImageDefault) {
      let listImageDefault = elementListImageDefault.getAttribute("list-image-default");
      if(listImageDefault) {
        listImageDefault = JSON.parse(listImageDefault);
        files = [];
        listImageDefault.forEach(image => {
          files.push({
            source: image, // Đường dẫn ảnh
          });
        })
      }
    }

    filePondMulti[filepondImage.name] = FilePond.create(filepondImage, {
      labelIdle: '+',
      files: files,
    });
  });
}
// End Filepond Image Multi


// Biểu đồ doanh thu
const revenueChart = document.querySelector("#revenue-chart");
if(revenueChart) {

  let chart=null;//Chưa vẽ lần nào thì giá trị là null
  const drawChart=(now)=>
  {
     //Lấy ra tháng và năm hiện tại
  const currentMonth=now.getMonth()+1; // vì getMonth trả về giá trị từ 0 đến 11 nên cần +1
  const currentYear=now.getFullYear();

  //Tạo một đối tượng date mới cho tháng trước
  //Nếu hiện tại là tháng 1 thì new Date(currentYear,0-1,1) sẽ tự động chuyển thành tháng 12 của năm trước, 1 là lấy từ ngày 1.
  const previousMonthDate =new Date(currentYear,now.getMonth()-1,1);
  
  //Lấy ra tháng và năm từ đối tượng previousMonthDate
  const previousMonth=previousMonthDate.getMonth()+1;
  const previousYear=previousMonthDate.getFullYear();


  //Lấy ra tổng số ngày 
  const dayInMonthCurrent=new Date(currentYear,currentMonth,0).getDate();
  const dayInMonthPrevious=new Date(previousMonth,previousYear,0).getDate();
  const days=dayInMonthCurrent>dayInMonthPrevious? dayInMonthCurrent:dayInMonthPrevious;

  const arrayDay=[];
  for(let i=1;i<=days;i++)
  {
    arrayDay.push(i)
  }


  const dataFinal={
    currentMonth:currentMonth,
    currentYear:currentYear,
    previousMonth:previousMonth,
    previousYear:previousYear,
    arrayDay:arrayDay
  }

  //gui data len cho BE
  fetch(`/${pathAdmin}/dashboard/revenue-chart`,{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify(dataFinal)
  })
    .then(res=>res.json())
    .then(data=>{

      if(data.code=='success')
      {
        //Nếu chart đã được vẽ 1 lần rồi thì hủy chart để vẽ lại 1 chart mới , nếu không hủy thì sẽ bị trùng id và không vẽ được
        if(chart)
        {
          chart.destroy();
        }
       
       chart= new Chart(revenueChart, {
          type: 'line',
          data: {
            labels: arrayDay,
            datasets: [
              {
                label: `Tháng ${currentMonth}/${currentYear}`, // Nhãn của dataset
                data: data.dataCurrentMonth, // Dữ liệu
                borderColor: '#4379EE', // Màu viền
                borderWidth: 1.5, // Độ dày của đường
              },
              {
                label: `Tháng ${previousMonth}/${previousYear}`, // Nhãn của dataset
                data: data.dataPreviousMonth, // Dữ liệu
                borderColor: '#EF3826', // Màu viền
                borderWidth: 1.5, // Độ dày của đường
              }
            ]
          },
          options: {
            plugins: {
              legend: {
                position: 'bottom'
              }
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Ngày'
                }
              },
              y: {
                title: {
                  display: true,
                  text: 'Doanh thu (VND)'
                }
              }
            },
            maintainAspectRatio: false, // Không giữ tỷ lệ khung hình mặc định
    }
          });
      }
      else alert(data.message);
    })

  }

  //Lấy ra ngày hiện tại
  const now =new Date();

  drawChart(now); //Lần đầu vào trang mặc định lấy ra tháng hiện tại

  
  //Lấy theo tháng mà người dùng chọn
  const inputMonth=document.querySelector(".section-2 input[type='month']");
  if(inputMonth)
  {
    inputMonth.addEventListener("change",()=>
    {
        const value=inputMonth.value;
        drawChart(new Date(value))
    });
  }

 
}
// Hết Biểu đồ doanh thu

// Category Create Form
const categoryCreateForm = document.querySelector("#category-create-form");
if(categoryCreateForm) {
  const validation = new JustValidate('#category-create-form');

  validation
    .addField('#name', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập tên danh mục!'
      }
    ])
    .onSuccess((event) => {
      const name = event.target.name.value;
      const parent = event.target.parent.value;
      const position = event.target.position.value;
      const status = event.target.status.value;
      const avatars = filePond.avatar.getFiles();
      let avatar = null;
      if(avatars.length > 0) {
        avatar = avatars[0].file;
      }
      const description = tinymce.get("description").getContent();
      
      const formData=new FormData();
      formData.append("name",name);
      formData.append("parent",parent);
      formData.append("position",position);
      formData.append("status",status);
      formData.append("avatar",avatar);
      formData.append("description",description);
     
      fetch(`/${pathAdmin}/category/create`,{
        method:"POST",
        body:formData
      })
        .then(res=>res.json())
        .then(data=>{
          if(data.code=="success")
          {
           
            window.location.href=`/${pathAdmin}/category/list`;
          }
            else
          {
            alert("Tạo danh mục không thành công")
          }
        })
    })
  ;
}
// End Category Create Form


// Category Edit Form
const categoryEditForm = document.querySelector("#category-edit-form");
if(categoryEditForm) {
  const validation = new JustValidate('#category-edit-form');

  validation
    .addField('#name', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập tên danh mục!'
      }
    ])
    .onSuccess((event) => {
      const id = event.target.id.value;
      const name = event.target.name.value;
      const parent = event.target.parent.value;
      const position = event.target.position.value;
      const status = event.target.status.value;
      const avatars = filePond.avatar.getFiles();
      let avatar = null;
      if(avatars.length > 0) {
        avatar = avatars[0].file;
        const elementImageDefault = event.target.avatar.closest("[image-default]");
        const imageDefault = elementImageDefault.getAttribute("image-default");
        if(imageDefault.includes(avatar.name)) {
          avatar = null;
        }
      }
      const description = tinymce.get("description").getContent();

      // Tạo FormData
      const formData = new FormData();
      formData.append("name", name);
      formData.append("parent", parent);
      formData.append("position", position);
      formData.append("status", status);
      formData.append("avatar", avatar);
      formData.append("description", description);
      
      fetch(`/${pathAdmin}/category/edit/${id}`, {
        method: "PATCH",
        body: formData
      })
        .then(res => res.json())
        .then(data => {
          if(data.code == "error") {
            alert(data.message);
          }

          if(data.code == "success") {
            window.location.reload();
          }
        })
    })
  ;
}
// End Category Edit Form


// Tour Create Form
const tourCreateForm = document.querySelector("#tour-create-form");
if(tourCreateForm) {
  const validation = new JustValidate('#tour-create-form');

  validation
    .addField('#name', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập tên tour!'
      }
    ])
    .onSuccess((event) => {
      const name = event.target.name.value;
      const category = event.target.category.value;
      const position = event.target.position.value;
      const status = event.target.status.value;
      const avatars = filePond.avatar.getFiles();
      let avatar = null;
      if(avatars.length > 0) {
        avatar = avatars[0].file;
      }
      const priceAdult = event.target.priceAdult.value;
      const priceChildren = event.target.priceChildren.value;
      const priceBaby = event.target.priceBaby.value;
      const priceNewAdult = event.target.priceNewAdult.value;
      const priceNewChildren = event.target.priceNewChildren.value;
      const priceNewBaby = event.target.priceNewBaby.value;
      const stockAdult = event.target.stockAdult.value;
      const stockChildren = event.target.stockChildren.value;
      const stockBaby = event.target.stockBaby.value;
      const locations = [];
      const time = event.target.time.value;
      const vehicle = event.target.vehicle.value;
      const departureDate = event.target.departureDate.value;
      const information = tinymce.get("information").getContent();
      const schedules = [];

      // locations
      const listElementLocation = tourCreateForm.querySelectorAll('input[name="locations"]:checked');
      listElementLocation.forEach(input => {
        locations.push(input.value);
      });
      // End locations

      // schedules
      const listElementScheduleItem = tourCreateForm.querySelectorAll('.inner-schedule-item');
      listElementScheduleItem.forEach(scheduleItem => {
        const input = scheduleItem.querySelector("input");
        const title = input.value;

        const textarea = scheduleItem.querySelector("textarea");
        const idTextarea = textarea.id;
        const description = tinymce.get(idTextarea).getContent();

        schedules.push({
          title: title,
          description: description
        });
      });
      // End schedules
      
      console.log(name);
      console.log(category);
      console.log(position);
      console.log(status);
      console.log(avatar);
      console.log(priceAdult);
      console.log(priceChildren);
      console.log(priceBaby);
      console.log(priceNewAdult);
      console.log(priceNewChildren);
      console.log(priceNewBaby);
      console.log(stockAdult);
      console.log(stockChildren);
      console.log(stockBaby);
      console.log(locations);
      console.log(time);
      console.log(vehicle);
      console.log(departureDate);
      console.log(information);
      console.log(schedules);

      //Tạo Form  Data
      const formData=new FormData();
      formData.append("name",name)
      formData.append("category",category)
      formData.append("position",position)
      formData.append("status",status)
      formData.append("avatar",avatar)
      formData.append("priceAdult",priceAdult)
      formData.append("priceChildren",priceChildren)
      formData.append("priceBaby",priceBaby)
      formData.append("priceNewAdult",priceNewAdult)
      formData.append("priceNewChildren",priceNewChildren)
      formData.append("priceNewBaby",priceNewBaby)
      formData.append("stockAdult",stockAdult)
      formData.append("stockChildren",stockChildren)
      formData.append("stockBaby",stockBaby)
      formData.append("locations",JSON.stringify(locations))
      formData.append("time",time)
      formData.append("vehicle",vehicle)
      formData.append("departureDate",departureDate)
      formData.append("information",information)
      formData.append("schedules",JSON.stringify(schedules))


      fetch(`/${pathAdmin}/tour/create`,{
        method:"POST",
        body:formData
      })
        .then(res=>res.json())
        .then(data=>{
          if(data.code=="error")
          {
            alert(data.message)
          }
          else
          {
            window.location.href=`/${pathAdmin}/tour/list`
          }
        })

    })
  ;
}
// End Tour Create Form




// Tour Edit Form
const tourEditForm = document.querySelector("#tour-edit-form");
if(tourEditForm) {
  const validation = new JustValidate('#tour-edit-form');

  validation
    .addField('#name', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập tên tour!'
      }
    ])
    .onSuccess((event) => {
      const id = event.target.id.value;
      const name = event.target.name.value;
      const category = event.target.category.value;
      const position = event.target.position.value;
      const status = event.target.status.value;
      const avatars = filePond.avatar.getFiles();
      let avatar = null;
      if(avatars.length > 0) {
        avatar = avatars[0].file;
        const elementImageDefault = event.target.avatar.closest("[image-default]");
        const imageDefault = elementImageDefault.getAttribute("image-default");
        if(imageDefault.includes(avatar.name)) {
          avatar = null;
        }
      }
      const priceAdult = event.target.priceAdult.value;
      const priceChildren = event.target.priceChildren.value;
      const priceBaby = event.target.priceBaby.value;
      const priceNewAdult = event.target.priceNewAdult.value;
      const priceNewChildren = event.target.priceNewChildren.value;
      const priceNewBaby = event.target.priceNewBaby.value;
      const stockAdult = event.target.stockAdult.value;
      const stockChildren = event.target.stockChildren.value;
      const stockBaby = event.target.stockBaby.value;
      const locations = [];
      const time = event.target.time.value;
      const vehicle = event.target.vehicle.value;
      const departureDate = event.target.departureDate.value;
      const information = tinymce.get("information").getContent();
      const schedules = [];

      // locations
      const listElementLocation = tourEditForm.querySelectorAll('input[name="locations"]:checked');
      listElementLocation.forEach(input => {
        locations.push(input.value);
      });
      // End locations

      // schedules
      const listElementScheduleItem = tourEditForm.querySelectorAll('.inner-schedule-item');
      listElementScheduleItem.forEach(scheduleItem => {
        const input = scheduleItem.querySelector("input");
        const title = input.value;

        const textarea = scheduleItem.querySelector("textarea");
        const idTextarea = textarea.id;
        const description = tinymce.get(idTextarea).getContent();

        schedules.push({
          title: title,
          description: description
        });
      });
      // End schedules

      // Tạo FormData
      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", category);
      formData.append("position", position);
      formData.append("status", status);
      formData.append("avatar", avatar);
      formData.append("priceAdult", priceAdult);
      formData.append("priceChildren", priceChildren);
      formData.append("priceBaby", priceBaby);
      formData.append("priceNewAdult", priceNewAdult);
      formData.append("priceNewChildren", priceNewChildren);
      formData.append("priceNewBaby", priceNewBaby);
      formData.append("stockAdult", stockAdult);
      formData.append("stockChildren", stockChildren);
      formData.append("stockBaby", stockBaby);
      formData.append("locations", JSON.stringify(locations));
      formData.append("time", time);
      formData.append("vehicle", vehicle);
      formData.append("departureDate", departureDate);
      formData.append("information", information);
      formData.append("schedules", JSON.stringify(schedules));

         // images
      if(filePondMulti.images.getFiles().length > 0) {
        filePondMulti.images.getFiles().forEach(item => {
          formData.append("images", item.file);
        })
      }
     
      // End images


      fetch(`/${pathAdmin}/tour/edit/${id}`, {
        method: "PATCH",
        body: formData
      })
        .then(res => res.json())
        .then(data => {
          if(data.code == "error") {
            alert(data.message);
          }

          if(data.code == "success") {
            window.location.reload();
          }
        })
    })
  ;
}
// End Tour Edit Form



// Order Edit Form
const orderEditForm = document.querySelector("#order-edit-form");
if(orderEditForm) {
  const validation = new JustValidate('#order-edit-form');

  validation
    .addField('#fullName', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập họ tên!'
      },
      {
        rule: 'minLength',
        value: 5,
        errorMessage: 'Họ tên phải có ít nhất 5 ký tự!',
      },
      {
        rule: 'maxLength',
        value: 50,
        errorMessage: 'Họ tên không được vượt quá 50 ký tự!',
      },
    ])
    .addField('#phone', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập số điện thoại!'
      },
      {
        rule: 'customRegexp',
        value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
        errorMessage: 'Số điện thoại không đúng định dạng!'
      },
    ])
    .onSuccess((event) => {
      const id = event.target.id.value;
      const fullName = event.target.fullName.value;
      const phone = event.target.phone.value;
      const note = event.target.note.value;
      const paymentMethod = event.target.paymentMethod.value;
      const paymentStatus = event.target.paymentStatus.value;
      const status = event.target.status.value;

   

        const dataFinal={
          fullName:fullName,
          phone:phone,
          note:note,
          paymentMethod:paymentMethod,
          paymentStatus:paymentStatus,
          status:status
        }
        
        fetch(`/${pathAdmin}/order/edit/${id}`,{
          method:"PATCH",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify(dataFinal)
        })    
          .then(res=>res.json())
          .then(data=>{
            if(data.code=="success") window.location.reload()
            else alert(data.message)
          })


    })
  ;
}
// End Order Edit Form

// Setting Website Info Form
const settingWebsiteInfoForm = document.querySelector("#setting-website-info-form");
if(settingWebsiteInfoForm) {
  const validation = new JustValidate('#setting-website-info-form');

  validation
    .addField('#websiteName', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập tên website!'
      },
    ])
    .addField('#email', [
      {
        rule: 'email',
        errorMessage: 'Email không đúng định dạng!',
      },
    ])
    .onSuccess((event) => {
      const websiteName = event.target.websiteName.value;
      const phone = event.target.phone.value;
      const email = event.target.email.value;
      const address = event.target.address.value;
      const logos = filePond.logo.getFiles();
      let logo = null;
      if(logos.length > 0) {
        logo = logos[0].file;
        const elementImageDefault = event.target.logo.closest("[image-default]");//lấy ra phần tử cha gần nhất có thuộc tính image-default
        const imageDefault = elementImageDefault.getAttribute("image-default"); //lấy ra url ảnh
         //kiểm tra xem ảnh hiển thị có cùng tên với ảnh được gắn mặc định hay không, nếu có thì nghĩa là vẫn là file cũ, không thì là 1 file mới , cũ thì không gửi lại ảnh
        if(imageDefault.includes(logo.name)) {
          logo = null;
        }
       
      }
      const favicons = filePond.favicon.getFiles();
      let favicon = null;
      if(favicons.length > 0) {
        favicon = favicons[0].file;
        const elementImageDefault = event.target.favicon.closest("[image-default]"); //lấy ra phần tử cha gần nhất có thuộc tính image-default
        const imageDefault = elementImageDefault.getAttribute("image-default"); //lấy ra url ảnh
       

        //kiểm tra xem ảnh hiển thị có cùng tên với ảnh được gắn mặc định hay không, nếu có thì nghĩa là vẫn là file cũ, không thì là 1 file mới , cũ thì không gửi lại ảnh
        if(imageDefault.includes(favicon.name)) {
          favicon = null;
        
        }
      }

      // Tạo FormData
      const formData = new FormData();
      formData.append("websiteName", websiteName);
      formData.append("phone", phone);
      formData.append("address", address);
      formData.append("email", email);
      formData.append("logo", logo);
      formData.append("favicon", favicon);
     

      fetch(`/${pathAdmin}/setting/website-infor`, {
        method: "PATCH",
        body: formData
      })
        .then(res => res.json())
        .then(data => {
          if(data.code == "error") {
            alert(data.message);
          }

          if(data.code == "success") {
            window.location.reload();
          }
        })
      console.log(websiteName);
      console.log(phone);
      console.log(email);
      console.log(address);
      console.log(logo);
      console.log(favicon);
    })
  ;
}
// End Setting Website Info Form

// Setting Account Admin Create Form
const settingAccountAdminCreateForm = document.querySelector("#setting-account-admin-create-form");
if(settingAccountAdminCreateForm) {
  const validation = new JustValidate('#setting-account-admin-create-form');

  validation
    .addField('#fullName', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập họ tên!'
      },
      {
        rule: 'minLength',
        value: 5,
        errorMessage: 'Họ tên phải có ít nhất 5 ký tự!',
      },
      {
        rule: 'maxLength',
        value: 50,
        errorMessage: 'Họ tên không được vượt quá 50 ký tự!',
      },
    ])
    .addField('#email', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập email!'
      },
      {
        rule: 'email',
        errorMessage: 'Email không đúng định dạng!',
      },
    ])
    .addField('#phone', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập số điện thoại!'
      },
      {
        rule: 'customRegexp',
        value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
        errorMessage: 'Số điện thoại không đúng định dạng!'
      },
    ])
    .addField('#positionCompany', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập chức vụ!'
      },
    ])
    .addField('#password', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập mật khẩu!',
      },
      {
        validator: (value) => value.length >= 8,
        errorMessage: 'Mật khẩu phải chứa ít nhất 8 ký tự!',
      },
      {
        validator: (value) => /[A-Z]/.test(value),
        errorMessage: 'Mật khẩu phải chứa ít nhất một chữ cái in hoa!',
      },
      {
        validator: (value) => /[a-z]/.test(value),
        errorMessage: 'Mật khẩu phải chứa ít nhất một chữ cái thường!',
      },
      {
        validator: (value) => /\d/.test(value),
        errorMessage: 'Mật khẩu phải chứa ít nhất một chữ số!',
      },
      {
        validator: (value) => /[@$!%*?&]/.test(value),
        errorMessage: 'Mật khẩu phải chứa ít nhất một ký tự đặc biệt!',
      },
    ])
    .onSuccess((event) => {
      const fullName = event.target.fullName.value;
      const email = event.target.email.value;
      const phone = event.target.phone.value;
      const role = event.target.role.value;
      const positionCompany = event.target.positionCompany.value;
      const status = event.target.status.value;
      const password = event.target.password.value;
      const avatars = filePond.avatar.getFiles();
      let avatar = null;
      if(avatars.length > 0) {
        avatar = avatars[0].file;
      }

      console.log(fullName);
      console.log(email);
      console.log(phone);
      console.log(role);
      console.log(positionCompany);
      console.log(status);
      console.log(password);
      console.log(avatar);

      //Tạo form
      const formData=new FormData();
      formData.append("fullName",fullName)
      formData.append("email",email)
      formData.append("phone",phone)
      formData.append("role",role)
      formData.append("positionCompany",positionCompany)
      formData.append("status",status)
      formData.append("passWord",password)
      formData.append("avatar",avatar)
   

      fetch(`/${pathAdmin}/setting/account-admin/create`,{
        method:"POST",
        body:formData
      })
        .then(res=>res.json())
        .then(data=>{
          if(data.code=="success")
          {
             window.location.href=`/${pathAdmin}/setting/account-admin/list`
          }
          else
          {
            alert(data.message)
          }
        })
    })
  ;
}
// End Setting Account Admin Create Form


// Setting Account Admin Create Form
const settingAccountAdminEditForm = document.querySelector("#setting-account-admin-edit-form");
if(settingAccountAdminEditForm) {
  const validation = new JustValidate('#setting-account-admin-edit-form');

  validation
    .addField('#fullName', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập họ tên!'
      },
      {
        rule: 'minLength',
        value: 5,
        errorMessage: 'Họ tên phải có ít nhất 5 ký tự!',
      },
      {
        rule: 'maxLength',
        value: 50,
        errorMessage: 'Họ tên không được vượt quá 50 ký tự!',
      },
    ])
    .addField('#email', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập email!'
      },
      {
        rule: 'email',
        errorMessage: 'Email không đúng định dạng!',
      },
    ])
    .addField('#phone', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập số điện thoại!'
      },
      {
        rule: 'customRegexp',
        value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
        errorMessage: 'Số điện thoại không đúng định dạng!'
      },
    ])
    .addField('#positionCompany', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập chức vụ!'
      },
    ])

    .onSuccess((event) => {
      const id=event.target.id.value;
      const fullName = event.target.fullName.value;
      const email = event.target.email.value;
      const phone = event.target.phone.value;
      const role = event.target.role.value;
      const positionCompany = event.target.positionCompany.value;
      const status = event.target.status.value;
      const password = event.target.password.value;
      const avatars = filePond.avatar.getFiles();
      let avatar = null;
      if(avatars.length > 0) {
        avatar = avatars[0].file;
        const elementImageDefault = event.target.avatar.closest("[image-default]");
        const imageDefault = elementImageDefault.getAttribute("image-default");
        if(imageDefault.includes(avatar.name)) {
          avatar = null;
        }
      }



      //Tạo form
      const formData=new FormData();
      formData.append("fullName",fullName)
      formData.append("id",id)
      formData.append("email",email)
      formData.append("phone",phone)
      formData.append("role",role)
      formData.append("positionCompany",positionCompany)
      formData.append("status",status)
      if(password)
      {
        formData.append("passWord",password)
      }
  
      formData.append("avatar",avatar)
   

      fetch(`/${pathAdmin}/setting/account-admin/edit/${id}`,{
        method:"PATCH",
        body:formData
      })
        .then(res=>res.json())
        .then(data=>{
          if(data.code=="success")
          {
             window.location.href=`/${pathAdmin}/setting/account-admin/list`
          }
          else
          {
            alert(data.message)
          }
        })
    })
  ;
}
// End Setting Account Admin Edit Form





// Setting Role Create Form
const settingRoleCreateForm = document.querySelector("#setting-role-create-form");
if(settingRoleCreateForm) {
  const validation = new JustValidate('#setting-role-create-form');

  validation
    .addField('#name', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập tên nhóm quyền!'
      },
    ])
    .onSuccess((event) => {
      const name = event.target.name.value;
      const description = event.target.description.value;
      const permissions = [];

      // permissions
      const listElementPermission = settingRoleCreateForm.querySelectorAll('input[name="permissions"]:checked');
      listElementPermission.forEach(input => {
        permissions.push(input.value);
      });
      // End permissions

      console.log(name);
      console.log(description);
      console.log(permissions);


      const dataForm={
        name:name,
        description:description,
        permissions:permissions
      }

      fetch(`/${pathAdmin}/setting/role/create`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify(dataForm)
      })
      .then(res=>res.json())
      .then(data=>{
        if(data.code=="error")
        {
          alert("Tạo mới không thành công!")

        }
        else
        {
          window.location.href=`/${pathAdmin}/setting/role/list`
        }
      })

    })
  ;
}
// End Setting Role Create Form



// Setting Role Edit Form
const settingRoleEditForm = document.querySelector("#setting-role-edit-form");
if(settingRoleEditForm) {
  const validation = new JustValidate('#setting-role-edit-form');

  validation
    .addField('#name', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập tên nhóm quyền!'
      },
    ])
    .onSuccess((event) => {
      const id=event.target.id.value;
      const name = event.target.name.value;
      const description = event.target.description.value;
      const permissions = [];

      // permissions
      const listElementPermission = settingRoleEditForm.querySelectorAll('input[name="permissions"]:checked');
      listElementPermission.forEach(input => {
        permissions.push(input.value);
      });
      // End permissions

      console.log(name);
      console.log(description);
      console.log(permissions);


      const dataForm={
        name:name,
        description:description,
        permissions:permissions
      }

      fetch(`/${pathAdmin}/setting/role/edit/${id}`,{
        method:"PATCH",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify(dataForm)
      })
      .then(res=>res.json())
      .then(data=>{
        if(data.code=="error")
        {
          alert("Cập nhật không thành công!")

        }
        else
        {
          window.location.href=`/${pathAdmin}/setting/role/list`
        }
      })

    })
  ;
}
// End Setting Role Edit Form


// Profile Edit Form
const profileEditForm = document.querySelector("#profile-edit-form");
if(profileEditForm) {
  const validation = new JustValidate('#profile-edit-form');

  validation
    .addField('#fullName', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập họ tên!'
      },
      {
        rule: 'minLength',
        value: 5,
        errorMessage: 'Họ tên phải có ít nhất 5 ký tự!',
      },
      {
        rule: 'maxLength',
        value: 50,
        errorMessage: 'Họ tên không được vượt quá 50 ký tự!',
      },
    ])
    .addField('#email', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập email!'
      },
      {
        rule: 'email',
        errorMessage: 'Email không đúng định dạng!',
      },
    ])
    .addField('#phone', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập số điện thoại!'
      },
      {
        rule: 'customRegexp',
        value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
        errorMessage: 'Số điện thoại không đúng định dạng!'
      },
    ])
    .onSuccess((event) => {
      const fullName = event.target.fullName.value;
      const email = event.target.email.value;
      const phone = event.target.phone.value;
      const avatars = filePond.avatar.getFiles();
      let avatar = null;
      if(avatars.length > 0) {
        avatar = avatars[0].file;
        const elementImage=document.querySelector("[image-default]");
        const ImageDefault=elementImage.getAttribute("image-default");
        if(ImageDefault.includes(avatar.name))
        {
          avatar=null;
        }
      }

      console.log(fullName);
      console.log(email);
      console.log(phone);
      console.log(avatar);

      //Tạo form data
      const formData=new FormData();
      formData.append("fullName",fullName)
      formData.append("email",email)
      formData.append("phone",phone)
      formData.append("avatar",avatar)

      fetch(`/${pathAdmin}/profile/edit`,{
        method:"PATCH",
        body:formData
      })
        .then(res=>res.json())
        .then(data=>{
          if(data.code=="success") window.location.reload()
          else alert(data.message);
        })
    })
  ;
}
// End Profile Edit Form

// Profile Change Password Form
const profileChangePasswordForm = document.querySelector("#profile-change-password-form");
if(profileChangePasswordForm) {
  const validation = new JustValidate('#profile-change-password-form');

  validation
    .addField('#password', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập mật khẩu!',
      },
      {
        validator: (value) => value.length >= 8,
        errorMessage: 'Mật khẩu phải chứa ít nhất 8 ký tự!',
      },
      {
        validator: (value) => /[A-Z]/.test(value),
        errorMessage: 'Mật khẩu phải chứa ít nhất một chữ cái in hoa!',
      },
      {
        validator: (value) => /[a-z]/.test(value),
        errorMessage: 'Mật khẩu phải chứa ít nhất một chữ cái thường!',
      },
      {
        validator: (value) => /\d/.test(value),
        errorMessage: 'Mật khẩu phải chứa ít nhất một chữ số!',
      },
      {
        validator: (value) => /[@$!%*?&]/.test(value),
        errorMessage: 'Mật khẩu phải chứa ít nhất một ký tự đặc biệt!',
      },
    ])
    .addField('#confirmPassword', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng xác nhận mật khẩu!',
      },
      {
        validator: (value, fields) => {
          const password = fields['#password'].elem.value;
          return value == password;
        },
        errorMessage: 'Mật khẩu xác nhận không khớp!',
      }
    ])
    .onSuccess((event) => {
      const password = event.target.password.value;
      console.log(password);

      const dataFinal={
        passWord:password
      }
      console.log(dataFinal)
      fetch(`/${pathAdmin}/profile/change-password`,{
        method:"PATCH",
        headers:{
          'Content-Type':"application/json"
        },
        body:JSON.stringify(dataFinal)
      })
        .then(res=>res.json())
        .then(data=>{
          if(data.code=="success") window.location.href=`/${pathAdmin}/dashboard`
          else alert(data.message)
        })
    })
  ;
}
// End Profile Change Password Form



// Sider
const sider = document.querySelector(".sider");
if(sider) {
  const pathNameCurrent = window.location.pathname;
  const splitPathNameCurrent = pathNameCurrent.split("/");
  const menuList = sider.querySelectorAll("a");
  menuList.forEach(item => {
    const href = item.href;
    const pathName = new URL(href).pathname;
    const splitPathName = pathName.split("/");
    if(splitPathNameCurrent[1] == splitPathName[1] && splitPathNameCurrent[2] == splitPathName[2]) {
      item.classList.add("active");
    }
  })
}
// End Sider


//logout

const buttonLogout=document.querySelector(".sider .inner-logout")

if(buttonLogout)
{
  
  buttonLogout.addEventListener("click",()=>
  {
    fetch(`/${pathAdmin}/account/logout`,
      {
        method:"POST",  
      }
    )
    .then(res=>res.json())
    .then(data=>{
      if(data.code=='success')
      {
        window.location.href=`/${pathAdmin}/account/login`
      }
    })
  })
}
else
{
  console.log("ákdhaksdhasd")
}

//Endlogout

// Alert
const alertTime = document.querySelector("[alert-time]");
if(alertTime) {
  let time = alertTime.getAttribute("alert-time");
  time = time ? parseInt(time) : 4000;
  setTimeout(() => {
    alertTime.remove(); // Xóa phần tử khỏi giao diện
  }, time);
}
// End Alert


// Button Delete
const listButtonDelete = document.querySelectorAll("[button-delete]");
if(listButtonDelete.length > 0) {
  listButtonDelete.forEach(button => {
    button.addEventListener("click", () => {
      const dataApi = button.getAttribute("data-api");
     
      fetch(dataApi, {
        method: "PATCH"
      })
        .then(res => res.json())
        .then(data => {
          if(data.code == "error") {
            alert(data.message);
          }

          if(data.code == "success") {
            window.location.reload();
          }
        })
    })
  })
}
// End Button Delete


//filter status

const filterStatus=document.querySelector("[filter-status]");

if(filterStatus)
{
  const url = new URL(window.location.href);

  // Lắng nghe thay đổi lựa chọn
  filterStatus.addEventListener("change", () => {
    const value = filterStatus.value;
    console.log(value)
    if(value) {
      url.searchParams.set("status", value);
      console.log(url)
      
    } else {
      url.searchParams.delete("status");
    }

    window.location.href = url.href;
  })

  // Hiển thị lựa chọn mặc định
  const valueCurrent = url.searchParams.get("status");
  if(valueCurrent) {
    filterStatus.value = valueCurrent;
  }

}

//End filter status
// Filter Created By
const filterCreatedBy = document.querySelector("[filter-created-by]");
if(filterCreatedBy) {
  const url = new URL(window.location.href);

  // Lắng nghe thay đổi lựa chọn
  filterCreatedBy.addEventListener("change", () => {
    const value = filterCreatedBy.value;
    if(value) {
      url.searchParams.set("createdBy", value);
    } else {
      url.searchParams.delete("createdBy");
    }

    window.location.href = url.href;
  })

  // Hiển thị lựa chọn mặc định
  const valueCurrent = url.searchParams.get("createdBy");
  if(valueCurrent) {
    filterCreatedBy.value = valueCurrent;
  }
}
// End Filter Created By


// Filter Start date
const filterSatrtDate = document.querySelector("[filter-start-date]");
if(filterSatrtDate) {
  const url = new URL(window.location.href);

  // Lắng nghe thay đổi lựa chọn
  filterSatrtDate.addEventListener("change", () => {
    const value = filterSatrtDate.value;
    if(value) {
      url.searchParams.set("startDate", value);
    } else {
      url.searchParams.delete("startDate");
    }

    window.location.href = url.href;
  })

  // Hiển thị lựa chọn mặc định
  const valueCurrent = url.searchParams.get("startDate");
  if(valueCurrent) {
    filterSatrtDate.value = valueCurrent;
  }
}
// End Filter Start date


// Filter End date
const filterEndDate = document.querySelector("[filter-end-date]");
if(filterEndDate) {
  const url = new URL(window.location.href);

  // Lắng nghe thay đổi lựa chọn
  filterEndDate.addEventListener("change", () => {
    const value = filterEndDate.value;
    if(value) {
      url.searchParams.set("endDate", value);
    } else {
      url.searchParams.delete("endDate");
    }

    window.location.href = url.href;
  })

  // Hiển thị lựa chọn mặc định
  const valueCurrent = url.searchParams.get("endDate");
  if(valueCurrent) {
    filterEndDate.value = valueCurrent;
  }
}
// End Filter End date


//Filter category

const filterCategory=document.querySelector("[filter-category]");
if(filterCategory)
{
  const url =new URL(window.location.href);

  filterCategory.addEventListener("change",()=>
  {
      const value=filterCategory.value;
      if(value)
      {
        url.searchParams.set("category",value)
      }
      else
      {
        url.searchParams.delete("category");
      }

      window.location.href=url;
  })


  if(url.searchParams.get("category"))
  {
    filterCategory.value=url.searchParams.get("category")
  }
};
//End filter category


//Filter price

const filterPrice=document.querySelector("[filter-price]");
if(filterPrice)
{
  const url =new URL(window.location.href);
  filterPrice.addEventListener("change",()=>
  {
    const value =filterPrice.value;
    if(value)
    {
      url.searchParams.set("price",value)
    }
    else
    {
        url.searchParams.delete("price");
    }
    window.location.href=url;
  })

  if( url.searchParams.get("price"))
  {
    filterPrice.value= url.searchParams.get("price")
  }
  
}

//End filter price

// Filter reset
const filterReset = document.querySelector("[ filter-reset]");
if(filterReset) {
  const url = new URL(window.location.href);

  // Lắng nghe thay đổi lựa chọn
  filterReset.addEventListener("click", () => {
 


    url.search="";
    window.location.href = url.href;
  })


}
//End  Filter reset

//Filter payment method
const filterPaymentMethod=document.querySelector("[filter-payment-method]");
if(filterPaymentMethod)
{
  const url=new URL(window.location.href);
  filterPaymentMethod.addEventListener("change",()=>
  {
      const value=filterPaymentMethod.value;
      if(value)
      {
        url.searchParams.set("paymentMethod",value);
      }
      else
      {
        url.searchParams.delete("paymentMethod");
      }
      window.location.href=url;
  });

  if(url.searchParams.get("paymentMethod"))
  {
    filterPaymentMethod.value=url.searchParams.get("paymentMethod")
  }
}

//End Filter payment method


//Filter payment status
const filterPaymentStatus=document.querySelector("[filter-payment-status]");
if(filterPaymentStatus)
{
  const url=new URL(window.location.href);
  filterPaymentStatus.addEventListener("change",()=>
  {
      const value=filterPaymentStatus.value;
      if(value)
      {
        url.searchParams.set("paymentStatus",value);
      }
      else
      {
        url.searchParams.delete("paymentStatus");
      }
      window.location.href=url;
  });

  if(url.searchParams.get("paymentStatus"))
  {
    filterPaymentStatus.value=url.searchParams.get("paymentStatus");
  }
}
//End Filter payment status



//Check-all

const checkAll=document.querySelector("[check-all]")
if(checkAll)
{
  const checkItem=document.querySelectorAll("[check-item]");
  
  checkAll.addEventListener("click",()=>
  {
    checkItem.forEach((item)=>{
      item.checked=checkAll.checked;
    })
  })
}

//End check-all

//Change-multi
const changeMulti=document.querySelector("[change-multi]");
if(changeMulti)
{
  const dataApi=changeMulti.getAttribute("data-api");
  const buttonChange=changeMulti.querySelector("button");
  const selectChange=changeMulti.querySelector("select");
  buttonChange.addEventListener("click",()=>
  {
    const option=selectChange.value;
    const listInput=document.querySelectorAll("[check-item]:checked");
    if(option&&listInput.length>0)
    {
      const ids=[];
      listInput.forEach((item)=>{
        ids.push(item.getAttribute("check-item"))
      })
    

      const dataFinal={
        option,
        ids,
      }
      fetch(dataApi,{
        method:"PATCH",
        headers:{
          'Content-Type':"application/json"
        },
        body:JSON.stringify(dataFinal)
      })
        .then(res=>res.json())
        .then(data=>{
          if(data.code=='error')
          {
            alert(data.message)
          }
          else
          {
            window.location.reload();
          }
        
        })
    }
    else
    {
      alert("Vui lòng chọn option và bản ghi muốn thực hiện")
    }
   
  })
}
//End change-multi


//Search

const search=document.querySelector("[search]")
if(search)
{
  const url=new URL(window.location.href);
  search.addEventListener("keyup",(event)=>
  {
   
    const url=new URL(window.location.href);
    if(event.code=='Enter')
    {
      const input=search.value;
      if(input)
      {
        url.searchParams.set('keyword',input)
      }
      else
      {
        url.searchParams.delete('keyword')
      }

      window.location.href=url

    }
  })

  //Hiển thị mặc định 
  if(url.searchParams.get("keyword"))  search.value=url.searchParams.get("keyword")
 
}

//End Search


//Phân trang 
const pagination=document.querySelector("[pagination]");
if(pagination)
{
  console.log(pagination)
  const url= new URL(window.location.href);
  pagination.addEventListener("change",()=>
  {
    const valuecurrent=pagination.value;
    if(valuecurrent)
    {
      url.searchParams.set("page",valuecurrent)
    }
    else
    {
      url.searchParams.delete("page");
    }
    window.location.href=url.href;
  })

  //Giữ trang đang ở
  if(url.searchParams.get("page"))
  {
    pagination.value=url.searchParams.get("page")
  }
}
//Phân trang
//Hết Phân trang



//Không cho chọn ngày trong quá khứ
 // Lấy ngày hiện tại ở định dạng YYYY-MM-DD
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Thêm '0' nếu tháng < 10
  const day = today.getDate().toString().padStart(2, '0'); // Thêm '0' nếu ngày < 10
  const todayFormatted = `${year}-${month}-${day}`;

  // Đặt giá trị min cho input date
  const inputDate=document.querySelector("[futureDate]");
  if(inputDate)
  {
   
    inputDate.setAttribute('min', todayFormatted);
  }
//Hết Không cho chọn ngày trong quá khứ


//Coupon-create-from
const couponCreateFrom = document.querySelector("#coupon-create-form");
if(couponCreateFrom) {
  const validation = new JustValidate('#coupon-create-form');

  validation
    .addField('#name', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập tên sự kiện!'
      },
      {
        rule: 'minLength',
        value: 5,
        errorMessage: 'tên phải có ít nhất 5 ký tự!',
      },
      {
        rule: 'maxLength',
        value: 50,
        errorMessage: ' tên không được vượt quá 50 ký tự!',
      },
    ])
    .addField('#code', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập số điện thoại!'
      },
      {
        rule: 'minLength',
        value: 5,
        errorMessage: 'tên phải có ít nhất 5 ký tự!',
      },
    ])
    .addField('#quantity', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập số lượng!'
      },
    ])
    .addField('#percent', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập số phầm trăm giảm giá!'
      },
    ])
    .addField('#maximumPrice', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập  giảm tối đa!'
      },
    ])
    .onSuccess((event) => {
      
      const name = event.target.name.value;
      const code = event.target.code.value;
      const quantity = event.target.quantity.value;
      const percent = event.target.percent.value;
      const maximumPrice = event.target.maximumPrice.value;
      const expired = event.target.expired.value;

   

        const dataFinal={
          name:name,
          couponCode:code,
          quantity:quantity,
          percent:percent,
          maximumPrice:maximumPrice,
          expired:expired
        }
        console.log(dataFinal)
        fetch(`/${pathAdmin}/coupon/create`,{
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify(dataFinal)
        })    
          .then(res=>res.json())
          .then(data=>{
            if(data.code=="success") window.location.reload()
            else alert(data.message)
          })


    })
  ;
}
//EndCoupon-create-from