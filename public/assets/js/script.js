// Menu Mobile
const buttonMenuMobile = document.querySelector(".header .inner-menu-mobile");
if (buttonMenuMobile) {
  const menu = document.querySelector(".header .inner-menu");

  // Click vào button mở menu
  buttonMenuMobile.addEventListener("click", () => {
    menu.classList.add("active");
  });

  // Click vào overlay đóng menu
  const overlay = menu.querySelector(".inner-overlay");
  if (overlay) {
    overlay.addEventListener("click", () => {
      menu.classList.remove("active");
    });
  }

  // Click vào icon down mở sub menu
  const listButtonSubMenu = menu.querySelectorAll("ul > li > i");
  listButtonSubMenu.forEach((button) => {
    button.addEventListener("click", () => {
      button.parentNode.classList.toggle("active");
    });
  });
}
// End Menu Mobile

//Active header
document.addEventListener('DOMContentLoaded', function() {
  const currentPath = window.location.pathname; 
  const currentPathArray=currentPath.split("/");
 
  // Lấy tất cả các liên kết trong menu
  const navLinks = document.querySelectorAll('.header .inner-menu ul li a');
 
  navLinks.forEach(link => {
    const linkPath = new URL(link.href).pathname; // Lấy pathname từ href của liên kết

    const linkPathArray=linkPath.split("/");
  
    // So sánh đường dẫn. Có thể cần điều chỉnh để khớp chính xác hoặc một phần
    if (currentPathArray[1]==linkPathArray[1]&&currentPathArray[2]==linkPathArray[2]) 
    {
      link.classList.add('active'); // Thêm class 'active' nếu khớp
    }
    else
    {
        link.classList.remove('active'); 
    }
  });
});
//End Active header

// Box Address Section 1
const boxAddressSection1 = document.querySelector(
  ".section-1 .inner-form .inner-box.inner-address"
);
if (boxAddressSection1) {
  // Ẩn/hiện box suggest
  const input = boxAddressSection1.querySelector(".inner-input");

  input.addEventListener("focus", () => {
    boxAddressSection1.classList.add("active");
  });

  input.addEventListener("blur", () => {
    boxAddressSection1.classList.remove("active");
  });

  // Sự kiện click vào từng item
  const listItem = boxAddressSection1.querySelectorAll(
    ".inner-suggest-list .inner-item"
  );
  listItem.forEach((item) => {
    item.addEventListener("mousedown", () => {
      const title = item.querySelector(".inner-item-title").innerHTML.trim();
      if (title) {
        input.value = title;
      }
    });
  });
}
// End Box Address Section 1

// Box User Section 1
const boxUserSection1 = document.querySelector(
  ".section-1 .inner-form .inner-box.inner-user"
);
if (boxUserSection1) {
  // Hiện box quantity
  const input = boxUserSection1.querySelector(".inner-input");

  input.addEventListener("focus", () => {
    boxUserSection1.classList.add("active");
  });

  // Ẩn box quantity
  document.addEventListener("click", (event) => {
    // Kiểm tra nếu click không nằm trong khối `.inner-box.inner-user`
    if (!boxUserSection1.contains(event.target)) {
      boxUserSection1.classList.remove("active");
    }
  });

  // Thêm số lượng vào ô input
  const updateQuantityInput = () => {
    const listBoxNumber = boxUserSection1.querySelectorAll(
      ".inner-count .inner-number"
    );
    const listNumber = [];
    listBoxNumber.forEach((boxNumber) => {
      const number = parseInt(boxNumber.innerHTML.trim());
      listNumber.push(number);
    });
    const value = `NL: ${listNumber[0]}, TE: ${listNumber[1]}, EB: ${listNumber[2]}`;
    input.value = value;
  };

  // Bắt sự kiện click nút up
  const listButtonUp = boxUserSection1.querySelectorAll(
    ".inner-count .inner-up"
  );
  listButtonUp.forEach((button) => {
    button.addEventListener("click", () => {
      const parent = button.parentNode;
      const boxNumber = parent.querySelector(".inner-number");
      const number = parseInt(boxNumber.innerHTML.trim());
      const numberUpdate = number + 1;
      boxNumber.innerHTML = numberUpdate;
      updateQuantityInput();
    });
  });

  // Bắt sự kiện click nút down
  const listButtonDown = boxUserSection1.querySelectorAll(
    ".inner-count .inner-down"
  );
  listButtonDown.forEach((button) => {
    button.addEventListener("click", () => {
      const parent = button.parentNode;
      const boxNumber = parent.querySelector(".inner-number");
      const number = parseInt(boxNumber.innerHTML.trim());
      if (number > 0) {
        const numberUpdate = number - 1;
        boxNumber.innerHTML = numberUpdate;
        updateQuantityInput();
      }
    });
  });
}
// End Box User Section 1

// Clock Expire
const clockExpire = document.querySelector("[clock-expire]");
if (clockExpire) {
  const expireDateTimeString = clockExpire.getAttribute("clock-expire");

  // Chuyển đổi chuỗi thời gian thành đối tượng Date
  const expireDateTime = new Date(expireDateTimeString);

  // Hàm cập nhật đồng hồ
  const updateClock = () => {
    const now = new Date();
    const remainingTime = expireDateTime - now; // quy về đơn vị mili giây

    if (remainingTime > 0) {
      const days = Math.floor(remainingTime / (24 * 60 * 60 * 1000));
      // Tính số ngày, 24 * 60 * 60 * 1000 Tích của các số này = số mili giây trong 1 ngày

      const hours = Math.floor((remainingTime / (60 * 60 * 1000)) % 24);
      // Tính số giờ, 60 * 60 * 1000 Chia remainingTime cho giá trị này để nhận được tổng số giờ.
      // % 24 Lấy phần dư khi chia tổng số giờ cho 24 để chỉ lấy số giờ còn lại trong ngày.

      const minutes = Math.floor((remainingTime / (60 * 1000)) % 60);
      // Tính số phút, 60 * 1000 Chia remainingTime cho giá trị này để nhận được tổng số phút.
      // % 60 Lấy phần dư khi chia tổng số phút cho 60 để chỉ lấy số phút còn lại trong giờ.

      const seconds = Math.floor((remainingTime / 1000) % 60);
      // Tính số giây, 1000 Chia remainingTime cho giá trị này để nhận được tổng số giây.
      // % 60 Lấy phần dư khi chia tổng số giây cho 60 để chỉ lấy số giây còn lại trong phút.

      // Cập nhật giá trị vào thẻ span
      const listBoxNumber = clockExpire.querySelectorAll(".inner-number");
      listBoxNumber[0].innerHTML = `${days}`.padStart(2, "0");
      listBoxNumber[1].innerHTML = `${hours}`.padStart(2, "0");
      listBoxNumber[2].innerHTML = `${minutes}`.padStart(2, "0");
      listBoxNumber[3].innerHTML = `${seconds}`.padStart(2, "0");
    } else {
      // Khi hết thời gian, dừng đồng hồ
      clearInterval(intervalClock);
    }
  };

  // Gọi hàm cập nhật đồng hồ mỗi giây
  const intervalClock = setInterval(updateClock, 1000);
}
// End Clock Expire

// Box Filter
const buttonFilterMobile = document.querySelector(
  ".section-9 .inner-filter-mobile"
);
if (buttonFilterMobile) {
  const boxLeft = document.querySelector(".section-9 .inner-left");
  buttonFilterMobile.addEventListener("click", () => {
    boxLeft.classList.add("active");
  });

  const overlay = document.querySelector(
    ".section-9 .inner-left .inner-overlay"
  );
  overlay.addEventListener("click", () => {
    boxLeft.classList.remove("active");
  });
}
// End Box Filter

// Box Tour Info
const boxTourInfo = document.querySelector(".box-tour-info");
if (boxTourInfo) {
  const buttonReadMore = boxTourInfo.querySelector(".inner-read-more button");
  buttonReadMore.addEventListener("click", () => {
    boxTourInfo.classList.add("active");
  });

  new Viewer(boxTourInfo);
}
// End Box Tour Info

// Khởi tạo AOS
AOS.init();
// Hết Khởi tạo AOS

// Swiper Section 2
const swiperSection2 = document.querySelector(".swiper-section-2");
if (swiperSection2) {
  new Swiper(".swiper-section-2", {
    slidesPerView: 1,
    spaceBetween: 20,
    autoplay: {
      delay: 4000,
    },
    loop: true,
    breakpoints: {
      992: {
        slidesPerView: 2,
      },
      1200: {
        slidesPerView: 3,
      },
    },
  });
}
// End Swiper Section 2

// Swiper Section 3
const swiperSection3 = document.querySelector(".swiper-section-3");
if (swiperSection3) {
  new Swiper(".swiper-section-3", {
    slidesPerView: 1,
    spaceBetween: 20,
    autoplay: {
      delay: 4000,
    },
    loop: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      576: {
        slidesPerView: 2,
      },
      992: {
        slidesPerView: 3,
      },
    },
  });
}
// End Swiper Section 3

// Swiper Box Images
const boxImages = document.querySelector(".box-images");
if (boxImages) {
  const swiperBoxImagesThumb = new Swiper(".swiper-box-images-thumb", {
    spaceBetween: 5,
    slidesPerView: 4,
    breakpoints: {
      576: {
        spaceBetween: 10,
      },
    },
  });

  const swiperBoxImagesMain = new Swiper(".swiper-box-images-main", {
    spaceBetween: 0,
    thumbs: {
      swiper: swiperBoxImagesThumb,
    },
  });
}
// End Swiper Box Images

// Zoom Box Images Main
const boxImagesMain = document.querySelector(".box-images .inner-images-main");
if (boxImagesMain) {
  new Viewer(boxImagesMain);
}
// End Zoom Box Images Main

// Box Tour Schedule
const boxTourSchedule = document.querySelector(".box-tour-schedule");
if (boxTourSchedule) {
  new Viewer(boxTourSchedule);
}
// End Box Tour Schedule
// Coupon Form
const couponForm = document.querySelector("#coupon-form");
if (couponForm) {
  const validation = new JustValidate("#coupon-form");

  validation.onSuccess((event) => {
    const coupon = event.target.coupon.value;

    const dataFinal={
      coupon:coupon
    }
    fetch(`/coupon/detail`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(dataFinal)
    })
      .then(res=>res.json())
      .then(data=>{
        if(data.code=="success") 
        {
          //Nếu chưa tồn tại coupon trong sessionStorage thì set và load lại trang
          if(!sessionStorage.getItem("coupon"))
          {
              sessionStorage.setItem("coupon",JSON.stringify(data.couponDetail));
              window.location.reload();
          }
          else
          {
            //Nếu mã coupon người dùng mới nhập khác với mã coupon đang được lưu thì set lại và load lại trang
            const couponDetail=JSON.parse(sessionStorage.getItem("coupon"));
            if(couponDetail.couponCode!=data.couponDetail.couponCode&&
              couponDetail.maximumPrice!=data.couponDetail.maximumPrice&&
              couponDetail.percent!=data.couponDetail.percent)
            {
              sessionStorage.setItem("coupon",JSON.stringify(data.couponDetail));
              window.location.reload();
            }
            else sessionStorage.setItem("coupon",JSON.stringify(data.couponDetail));
          }
          
        
        }
        else alert(data.message)

      })
   
  });
}
// End Coupon Form

// Email Form
const emailForm = document.querySelector("#email-form");
if (emailForm) {
  const validation = new JustValidate("#email-form");

  validation
    .addField("#email-input", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập email của bạn!",
      },
      {
        rule: "email",
        errorMessage: "Email không đúng định dạng!",
      },
    ])
    .onSuccess((event) => {
      const email = event.target.email.value;
      console.log(email);

      const dataForm = {
        email: email,
      };

      fetch(`/contact/create`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(dataForm),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code == "success") window.location.reload();
          else alert(data.message);
        });
    });
}
// End Email Form


// Order Form
const orderForm = document.querySelector("#order-form");
if (orderForm) {
  const validation = new JustValidate("#order-form");

  validation
    .addField("#full-name-input", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập họ tên!",
      },
      {
        rule: "minLength",
        value: 5,
        errorMessage: "Họ tên phải có ít nhất 5 ký tự!",
      },
      {
        rule: "maxLength",
        value: 50,
        errorMessage: "Họ tên không được vượt quá 50 ký tự!",
      },
    ])
    .addField("#phone-input", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập số điện thoại!",
      },
      {
        rule: "customRegexp",
        value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
        errorMessage: "Số điện thoại không đúng định dạng!",
      },
    ])
    .addField("#email-input", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập email!",
      },
      {
        rule: "email",
        errorMessage: "Email không đúng định dạng!",
      },
    ])
    .onSuccess((event) => {
      const fullName = event.target.fullName.value;
      const phone = event.target.phone.value;
      const note = event.target.note.value;
      const method = event.target.method.value;
      const email=event.target.email.value;
      let coupon="";
      
      if(JSON.parse(sessionStorage.getItem("coupon")))
      { 
          const couponDetail=JSON.parse(sessionStorage.getItem("coupon"));  
          coupon=couponDetail.couponCode;
                 
      }
     

      let cart =JSON.parse(localStorage.getItem("cart"));
        cart=cart.filter(item=>{
          return (item.checked==true)&& (item.quantityAdult+item.quantityChildren+item.quantityBaby)>=1;
        })

        cart=cart.map(item=>{
          return {
            tourId:item.tourId,
            locationFrom:item.locationFrom,
            quantityAdult:item.quantityAdult,
            quantityChildren:item.quantityChildren,
            quantityBaby:item.quantityBaby
          }
        })
        if(cart.length<1)
        {
          alert("Vui lòng đặt ít nhất 1 tour!")
        }
        else
        {
            const dataFinal={
              fullName:fullName,
              phone:phone,
              email:email,
              note:note,
              paymentMethod:method,
              items:cart,
              coupon:coupon,
            }
            
            fetch(`/order/create`,{
              method:"POST",
              headers:{
                "Content-Type":"application/json"
              },
              body:JSON.stringify(dataFinal)
            })
              .then(res=>res.json())
              .then(data=>{
                if(data.code=="success")
                {

                  //Cập nhật lại giỏ hàng 
                  let cart =JSON.parse(localStorage.getItem("cart"));
                  cart=cart.filter((item)=> item.checked==false);
                  localStorage.setItem("cart",JSON.stringify(cart))

                  switch (method) {
                    case "money":
                    case "bank":
                       //Chuyển sang trang đặt hàng thành công 
                        window.location.href=`/order/success?orderCode=${data.orderCode}&&phone=${data.phone}&&orderId=${data.orderId}`;
                      break;
                    
                    case "zalopay":
                      //Chuyển hướng sang trang thanh toán bằng zalopay
                      window.location.href=`/order/payment-zalopay?orderCode=${data.orderCode}&&phone=${data.phone}&&orderId=${data.orderId}`;
                      break;
                    case "vnpay":
                      //Chuyển hướng sang trang thanh toán bằng zalopay
                      window.location.href=`/order/payment-vnpay?orderCode=${data.orderCode}&&phone=${data.phone}&&orderId=${data.orderId}`;
                      break;
                  }

                }
                else
                {
                  alert(data.message);
                }
              })
        }

    
    });

  // List Input Method
  const listInputMethod = orderForm.querySelectorAll("input[name='method']");
  const elementInfoBank = orderForm.querySelector(".inner-info-bank");

  listInputMethod.forEach((inputMethod) => {
    inputMethod.addEventListener("change", () => {
      if (inputMethod.value == "bank") {
        elementInfoBank.classList.add("active");
      } else {
        elementInfoBank.classList.remove("active");
      }
    });
  });
  // End List Input Method
}
// End Order Form

// Alert
const alertTime = document.querySelector("[alert-time]");
if (alertTime) {
  let time = alertTime.getAttribute("alert-time");
  time = time ? parseInt(time) : 4000;
  setTimeout(() => {
    alertTime.remove(); // Xóa phần tử khỏi giao diện
  }, time);
}
// End Alert

// Box Filter
const boxFilter = document.querySelector(".box-filter");
if (boxFilter) {
  const url = new URL(`${window.location.origin}/search`);

  const buttonApply = boxFilter.querySelector(".inner-button");

  const filterList = [
    "locationFrom",
    "locationTo",
    "departureDate",
    "stockAdult",
    "stockChildren",
    "stockBaby",
    "price",
  ];

  buttonApply.addEventListener("click", () => {
    filterList.forEach((name) => {
      const value = boxFilter.querySelector(`[name="${name}"]`).value;
      if (value) {
        url.searchParams.set(name, value);
      } else {
        url.searchParams.delete(name);
      }
    });

    window.location.href = url.href;
  });
}
// End Box Filter

//Form search
const formSearch = document.querySelector("[form-search]");
if (formSearch) {
  const url = new URL(`${window.location.origin}/search`);
  formSearch.addEventListener("submit", (event) => {
    event.preventDefault();

    //Điểm đến
    const locationTo = event.target.locationTo.value;
    if (locationTo) {
      url.searchParams.set("locationTo", locationTo);
    } else {
      url.searchParams.delete("locationTo");
    }

    //Số lượng
    const stockAdult = formSearch.querySelector("[stock-adult]").innerHTML;
    if (stockAdult) {
      if (parseInt(stockAdult)) {
        url.searchParams.set("stockAdult", parseInt(stockAdult));
      } else {
        url.searchParams.delete("stockAdult");
      }
    }

    const stockChildren =
      formSearch.querySelector("[stock-children]").innerHTML;
    if (stockChildren) {
      if (parseInt(stockChildren)) {
        url.searchParams.set("stockChildren", parseInt(stockChildren));
      } else {
        url.searchParams.delete("stockChildren");
      }
    }
    const stockBaby = formSearch.querySelector("[stock-baby]").innerHTML;
    if (stockBaby) {
      if (parseInt(stockBaby)) {
        url.searchParams.set("stockBaby", parseInt(stockBaby));
      } else {
        url.searchParams.delete("stockBaby");
      }
    }

    //Thời gian bắt đầu đi
    const departureDate = event.target.departureDate.value;
    if (departureDate) {
      url.searchParams.set("departureDate", departureDate);
    } else {
      url.searchParams.delete("departureDate");
    }

    window.location.href = url.href;
  });
}
//End Form search

// Box Tour Detail
const boxTourDetail = document.querySelector(".box-tour-detail");
if (boxTourDetail) {
  // Bước 1
  const inputStockAdult = document.querySelector("[input-stock-adult]");
  const inputStockChildren = document.querySelector("[input-stock-children]");
  const inputStockBaby = document.querySelector("[input-stock-baby]");

  // Bước 3
  const drawBoxDetail = () => {
    const quantityAdult = parseInt(inputStockAdult.value);
    const quantityChildren = parseInt(inputStockChildren.value);
    const quantityBaby = parseInt(inputStockBaby.value);

    const stockAdult = document.querySelector("[stock-adult]");
    const stockChildren = document.querySelector("[stock-children]");
    const stockBaby = document.querySelector("[stock-baby]");

    if (stockAdult) stockAdult.innerHTML = quantityAdult;
    if (stockChildren) stockChildren.innerHTML = quantityChildren;
    if (stockBaby) stockBaby.innerHTML = quantityBaby;

    const priceAdult = parseInt(inputStockAdult.getAttribute("price"));
    const priceChildren = parseInt(inputStockChildren.getAttribute("price"));
    const priceBaby = parseInt(inputStockBaby.getAttribute("price"));
    const totalPrice =
      quantityAdult * priceAdult +
      quantityChildren * priceChildren +
      quantityBaby * priceBaby;

    const elementTotalPrice = document.querySelector("[total-price]");
    elementTotalPrice.innerHTML = totalPrice.toLocaleString("vi-VN");
  };

  // Bước 2
  inputStockAdult.addEventListener("change", drawBoxDetail);
  inputStockChildren.addEventListener("change", drawBoxDetail);
  inputStockBaby.addEventListener("change", drawBoxDetail);

  // Bước 4
  const buttonAddToCart = boxTourDetail.querySelector(".inner-button-add-cart");
  console.log(buttonAddToCart);
  buttonAddToCart.addEventListener("click", () => {
    const tourId = buttonAddToCart.getAttribute("tour-id");
    const quantityAdult = parseInt(inputStockAdult.value);
    const quantityChildren = parseInt(inputStockChildren.value);
    const quantityBaby = parseInt(inputStockBaby.value);
    const locationFrom = boxTourDetail.querySelector("[location-from]").value;

    if (quantityAdult > 0 || quantityChildren > 0 || quantityBaby > 0) {
      const cartItem = {
        tourId: tourId,
        quantityAdult: quantityAdult,
        quantityChildren: quantityChildren,
        quantityBaby: quantityBaby,
        locationFrom: locationFrom,
        checked:true,
      };

      const cart = JSON.parse(localStorage.getItem("cart"));

      const indexItemExist = cart.findIndex((item) => item.tourId == tourId);
      if (indexItemExist != -1) {
        cart[indexItemExist] = cartItem;
      } else {
        cart.push(cartItem);
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      window.location.href = "/cart";
    }
  });
}
// End Box Tour Detail

// Initial Cart
const cart = localStorage.getItem("cart");
if (!cart) {
  localStorage.setItem("cart", JSON.stringify([]));
}
// End Initial Cart

// Mini Cart
const miniCart = document.querySelector("[mini-cart]");
if (miniCart) {
  const cart = JSON.parse(localStorage.getItem("cart"));
  miniCart.innerHTML = cart.length;
}
// End Mini Cart

//Page cart
const drawCart = () => {
  const cart = localStorage.getItem("cart");

  fetch(`/cart/detail`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: cart,
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.code == "success") {
        if (data.cart) {
          //Hiển thị các tou
          const htmlCart = data.cart.map(
            (item) =>
              `<div class="inner-tour-item">
                      <div class="inner-actions">
                        <button class="inner-delete"   tourId="${item.tourId}" >
                          <i class="fa-solid fa-xmark"></i>
                        </button>
                        <input class="inner-check" type="checkbox" ${item.checked? 'checked':''}
                        input-check
                        tourId="${item.tourId}"
                        >
                      </div>
                      <div class="inner-product">
                        <div class="inner-image">
                          <a href="tour/detail/${item.slug}">
                            <img alt="" src=${item.avatar}
                          </a>
                        </div>
                        <div class="inner-content">
                          <div class="inner-title">
                            <a href="tour/detail/${item.slug}">${item.name}</a>
                          </div>
                          <div class="inner-meta">
                            <div class="inner-meta-item">Mã Tour: <b>123456789</b>
                            </div>
                            <div class="inner-meta-item">Ngày Khởi Hành: <b>${
                              item.departureDateFormat
                            }</b>
                            </div>
                            <div class="inner-meta-item">Khởi Hành Tại: <b>${
                              item.locationFromName
                            }</b>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="inner-quantity">
                        <label class="inner-label">Số Lượng Hành Khách</label>
                        <div class="inner-list">
                          <div class="inner-item">
                            <div class="inner-item-label">Người lớn:</div>
                            <div class="inner-item-input">
                              <input value="${item.quantityAdult}" max="${
                item.stockAdult
              }" min="0"
                              input-quantity="quantityAdult"
                              tourId="${item.tourId}"
                              type="number">
                            </div>
                            <div class="inner-item-price">
                              <span>${item.quantityAdult}</span>
                              <span>x</span>
                              <span class="inner-highlight">${item.priceNewAdult.toLocaleString(
                                "vi-vn"
                              )}</span>
                            </div>
                          </div>
                          <div class="inner-item">
                            <div class="inner-item-label">Trẻ em:</div>
                            <div class="inner-item-input">
                              <input value="${item.quantityChildren}" max="${
                item.stockChildren
              }"
                                 input-quantity="quantityChildren"
                              tourId="${item.tourId}"
                              min="0" type="number">
                            </div>
                            <div class="inner-item-price">
                              <span>${item.quantityChildren}</span>
                              <span>x</span>
                              <span class="inner-highlight">${item.priceNewChildren.toLocaleString(
                                "vi-vn"
                              )}</span>
                            </div>
                          </div>
                          <div class="inner-item">
                            <div class="inner-item-label">Em bé:</div>
                            <div class="inner-item-input">
                              <input value="${
                                item.quantityBaby
                              }" min="0" max="${item.stockBaby}"
                                 input-quantity="quantityBaby"
                              tourId="${item.tourId}"
                              type="number">
                            </div>
                            <div class="inner-item-price">
                              <span>${item.quantityBaby}</span>
                              <span>x</span>
                              <span class="inner-highlight">${item.priceNewBaby.toLocaleString(
                                "vi-vn"
                              )}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>`
          );

          const tourList = pageCart.querySelector(".inner-tour-list");
          if (tourList) {
            tourList.innerHTML = htmlCart.join("");
          }
          //Hết Hiển thị các tour

          //Cập nhật lại giỏ hàng
          localStorage.setItem("cart", JSON.stringify(data.cart));
          miniCart.innerHTML = data.cart.length;
          //Hết Cập nhật lại giỏ

          //Tính tổng tiền
          const subTotaldata = data.cart.reduce((sum, item) => {
           
              if(item.checked)
              {
                 return (
                      sum +
                      (item.priceNewAdult * item.quantityAdult +
                        item.priceNewChildren * item.quantityChildren +
                        item.priceNewBaby * item.quantityBaby)
                    );
              }
              else
              {
                return sum;
              }
           
          }, 0);

          //Tính giảm giá
          let discount=0;
          //Kiểm tra xem có tồn tại mã coupon không
          if(JSON.parse(sessionStorage.getItem("coupon")))
          {
              const couponDetail=JSON.parse(sessionStorage.getItem("coupon"));
              
              const percent=couponDetail.percent;
              const maximumPrice=couponDetail.maximumPrice;
              discount = (subTotaldata/100*percent)>maximumPrice? maximumPrice:(subTotaldata/100*percent);
             
             
              const discountHtml=document.querySelector("[coupon-price]");
              discountHtml.innerHTML=`${discount.toLocaleString("vi-VN")}đ`;
             
          }
        
          const totalPrice = subTotaldata - discount;
          //Hết  Tính giảm giá

          const cartSubTotal = document.querySelector("[cart-sub-total]");
          if (cartSubTotal)
            cartSubTotal.innerHTML = subTotaldata.toLocaleString("vi-VN");

          const cartTotal = document.querySelector("[cart-total]");
          if (cartTotal)
            cartTotal.innerHTML = totalPrice.toLocaleString("vi-VN");
          //Hết Tính tổng tiền

          //Sự kiện cập nhật số lựong
          const listInputQuantity =
            document.querySelectorAll("[input-quantity]");
          if (listInputQuantity) {
            listInputQuantity.forEach((input) => {
              input.addEventListener("change", () => {
                const tourId = input.getAttribute("tourId");
                const name = input.getAttribute("input-quantity");
                const quantity = parseInt(input.value);
                const cart = JSON.parse(localStorage.getItem("cart"));

                const itemUpdate = cart.find((item) => item.tourId == tourId);

                itemUpdate[name] = quantity;

                localStorage.setItem("cart", JSON.stringify(cart));

                drawCart();
              });
            });
          }
          //Hết Sự kiện cập nhật số lựong

          //Xóa tour
          const listButtonDelete = document.querySelectorAll(".inner-delete");
          if (listButtonDelete) {
            listButtonDelete.forEach((buttonDelete) => {
              buttonDelete.addEventListener("click", () => {
                const tourId = buttonDelete.getAttribute("tourId");
                const cart = JSON.parse(localStorage.getItem("cart"));
                if (cart) {
                  //Lấy ra vị trí item cần xóa
                  const itemIndex = cart.findIndex(
                    (item) => item.tourId == tourId
                  );

                  //Xóa item 
                  cart.splice(itemIndex, 1);

                  //Cập nhật lại giỏ hàng 
                  localStorage.setItem("cart", JSON.stringify(cart));
                  drawCart();
                }
              });
            });
          }
          //Hết Xóa tour

          //Sự kiến check item
          const listInputCheck=document.querySelectorAll("[input-check]")
          if(listInputCheck)
          {
            listInputCheck.forEach(inputCheck=>{
                inputCheck.addEventListener("change",()=>
                {
                    const tourId=inputCheck.getAttribute("tourId");
                    const status=inputCheck.checked;

                    const cart=JSON.parse(localStorage.getItem("cart"));
                    if(cart)
                    {
                      const itemUpdate=cart.find(item=>item.tourId==tourId);
                        itemUpdate.checked=status;
                        localStorage.setItem("cart",JSON.stringify(cart));
                        drawCart();


                    }
                })
            })
          }
          //HếtSự kiến check item

        }
      } else {
        alert(data.message);
      }
    });
};
const pageCart = document.querySelector("[page-cart]");
if (pageCart) {
  drawCart();
}
//End Page cart



//Sử dụng mã coupon trong sessionStorage
if(sessionStorage.getItem("coupon")&&JSON.parse(localStorage.getItem("cart")).length>0)
{
  const couponInput=document.querySelector("#coupon-input");
  const couponDetail=JSON.parse(sessionStorage.getItem("coupon"));
  couponInput.value=couponDetail.couponCode
  document.querySelector("#coupon-form >button").click();
  
}
//Sử dụng mã coupon trong sessionStorage


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





//Tracking Form
const trackingForm=document.querySelector("#tracking-form");
if(trackingForm)
{
   const validation = new JustValidate("#tracking-form");

  validation
    .addField("#orderCode", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập mã đơn hàng!",
      },
    ])
    .addField("#email", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập email của bạn!",
      },
      {
        rule: "email",
        errorMessage: "Email không đúng định dạng!",
      },
    ])
    .addField("#phone", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập số điện thoại!",
      },
      {
        rule: "customRegexp",
        value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
        errorMessage: "Số điện thoại không đúng định dạng!",
      },
    ])
    .onSuccess((event)=>{
        const email=event.target.email.value;
        const phone=event.target.phone.value;
        const orderCode=event.target.orderCode.value;

       window.location.href=`/tracking/detail?email=${email}&phone=${phone}&orderCode=${orderCode}`
    })
}
//End Tracking Form
