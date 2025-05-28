const Category = require("../../models/categories.model");
const categoriesHelper = require("../../helpers/categories.helper");
const City = require("../../models/city.model");
const Tour = require("../../models/tour.model");
const accountAdmin = require("../../models/account-admin.model");
const moment = require("moment");

module.exports.list = async (req, res) => {
  try {
    const find = {
      deleted: false,
    };

    // Lọc theo trạng thái tour
    if (req.query.status) {
      find.status = req.query.status;
    }
    // Hết lọc theo trạng thái tour

    //Lọc người tạo tour
    if (req.query.createdBy) {
      find.createdBy = req.query.createdBy;
    }

    //Lọc theo ngày tạo tour
    const dateFilter = {};
    if (req.query.startDate) {
      const startDate = moment(req.query.startDate).startOf("date").toDate();
      dateFilter.$gte = startDate;
    }

    if (req.query.endDate) {
      const endDate = moment(req.query.endDate).endOf("date").toDate();
      dateFilter.$lte = endDate;
    }

    if (Object.keys(dateFilter).length > 0) {
      find.createdAt = dateFilter;
    }

    //Hết lọc theo ngày tạo tour

    //Hết lọc theo danh mục tour
    if (req.query.category) {
      find.category = req.query.category;
    }

    //Hết lọc theo danh mục tour

    //Lọc theo giá tiền

    const priceFilter = {};
    if (req.query.price) {
      const data = req.query.price.split("-");
      priceFilter.$gte = Number(data[0]);
      priceFilter.$lte = Number(data[1]);
    }
    if (Object.keys(priceFilter).length > 0) {
      find.priceNewAdult = priceFilter;
    }
    //Hết lọc theo giá tiền

    //Tìm kiếm tour theo tên tour
    if (req.query.keyword) {
      const keyWord = req.query.keyword;
      const keyWordRegex = new RegExp(keyWord, "i");
      find.name = keyWordRegex;
    }
    //Hết tìm kiếm tour theo tên tour

    //Phân trang
    let page = 1; //Nếu không gắn lên biến page thì mặc định hiển thị trang đầu tiên
    const limitItem = 3;
    if (req.query.page) {
      const pageCurrent = parseInt(req.query.page);
      if (pageCurrent > 0) {
        page = pageCurrent;
      }
    }
    const skip = (page - 1) * limitItem;
    const totalRecord = await Tour.countDocuments(find); //Lấy ra số lượng bản ghi
    const totalPage = Math.ceil(totalRecord / limitItem);

    //Nếu giá trị biến page gửi lên lớn hơn số trang tồn tại trong database thì cập nhật lại giá trị biến page
    if (page > totalPage) {
      page = totalPage;
    }

    const pagination = {
      skip: skip,
      totalRecord: totalRecord,
      totalPage: totalPage,
    };
    //Hết phân trang

    const tourList = await Tour.find(find)
      .sort({
        position: "desc",
      })
      .limit(limitItem)
      .skip(skip);

    // Tìm thông tin người tạo, cập nhật m thời gian tạo,cập nhật của mỗi tour
    for (let item of tourList) {
      if (item.createdBy) {
        const infoAccountCreated = await accountAdmin.findOne({
          _id: item.createdBy,
        });
        item.createdByFullName = infoAccountCreated.fullName;
      }
      if (item.updatedBy) {
        const infoAccountUpdated = await accountAdmin.findOne({
          _id: item.updatedBy,
        });
        item.updatedByFullName = infoAccountUpdated.fullName;
      }

      item.createdAtFormat = moment(item.createdAt).format(
        "HH:mm - DD/MM/YYYY"
      );
      item.updatedAtFormat = moment(item.updatedAt).format(
        "HH:mm - DD/MM/YYYY"
      );
    }
    // Hết Tìm thông tin người tạo, cập nhật m thời gian tạo,cập nhật của mỗi tour

    //Lấy ra id của  tất cả tài khoản
    const accountList = await accountAdmin.find({}).select("fullName");
    //Hết lấy ra id của  tất cả tài khoản

    //Lấy ra tất cả danh mục
    const categoryList = await Category.find({
      deleted: false,
    });
    //Hết lấy ra tất cả danh mục

    res.render("admin/pages/tour-list.pug", {
      pageTitle: "Quản lý tour",
      tourList: tourList,
      accountList: accountList,
      categoryList: categoryList,
      pagination: pagination,
    });
  } catch (error) {
    res.redirect(`/${pathAdmin}/dashboard`);
  }
};

module.exports.create = async (req, res) => {
  const categoryList = await Category.find({
    deleted: false,
  });

  const city = await City.find({});

  const categoryTree = categoriesHelper.buildCategoryTree(categoryList);
  res.render("admin/pages/tour-create.pug", {
    pageTitle: "Tạo tour",
    categoryList: categoryTree,
    city: city,
  });
};

module.exports.createPost = async (req, res) => {
  if (!req.permissions.includes("tour-create")) {
    return res.json({
      code: "error",
      message: "Không có quyền sử dụng tính năng này!",
    });
  }
  try {
    //kiểm tra xem có gửi lên biến position không
    if (req.body.position) {
      req.body.position = parseInt(req.body.position); // chuyển từ string sang number
    } else {
      //nếu không gửi lên biến position thì mặc định position là tăng dần
      const totalRecord = await Tour.countDocuments({});
      req.body.position = totalRecord + 1;
    }

    //lấy id của người tạo và người cập nhật, lần đầu tiên thì người tạo và người cập nhật là 1 người
    req.body.createdBy = req.account.id;
    req.body.updatedBy = req.account.id;
    req.body.avatar = req.file ? req.file.path : ""; //nếu gửi ảnh thì lấy đường dẫn của ảnh , nếu không thì lưu chuỗi rỗng

    req.body.priceAdult = req.body.priceAdult
      ? parseInt(req.body.priceAdult)
      : 0;
    req.body.priceChildren = req.body.priceChildren
      ? parseInt(req.body.priceChildren)
      : 0;
    req.body.priceBaby = req.body.priceBaby ? parseInt(req.body.priceBaby) : 0;

    req.body.priceNewAdult = req.body.priceNewAdult
      ? parseInt(req.body.priceNewAdult)
      : req.body.priceAdult;
    req.body.priceNewChildren = req.body.priceNewChildren
      ? parseInt(req.body.priceNewChildren)
      : req.body.priceChildren;
    req.body.priceNewBaby = req.body.priceNewBaby
      ? parseInt(req.body.priceNewBaby)
      : req.body.priceBaby;

    req.body.stockAdult = req.body.stockAdult
      ? parseInt(req.body.stockAdult)
      : 0;
    req.body.stockChildren = req.body.stockChildren
      ? parseInt(req.body.stockChildren)
      : 0;
    req.body.stockBaby = req.body.stockBaby ? parseInt(req.body.stockBaby) : 0;

    req.body.locations = req.body.locations
      ? JSON.parse(req.body.locations)
      : [];
    req.body.schedules = req.body.schedules
      ? JSON.parse(req.body.schedules)
      : [];
    req.body.departureDate = req.body.departureDate
      ? new Date(req.body.departureDate)
      : null;

    console.log(req.body);
    //lưu vào cơ sở dữ liệu
    const newRecord = new Tour(req.body);
    await newRecord.save();

    req.flash("success", "Tạo tour thành công");
    return res.json({
      code: "success",
    });
  } catch (error) {
    res.redirect(`/${pathAdmin}/tour/list`);
    console.log("Lỗi tạo tour");
  }
};

module.exports.edit = async (req, res) => {
  try {
    const tourDetail = await Tour.findOne({
      _id: req.params.id,
    });
    if (tourDetail) {
      tourDetail.departureDateFormat = new moment(
        tourDetail.departureDate
      ).format("YYYY-MM-DD");
    }

    const categoryList = await Category.find({});
    const cityList = await City.find({});

    res.render("admin/pages/tour-edit", {
      pageTitle: "Chỉnh sửa tour",
      tourDetail: tourDetail,
      categoryList: categoryList,
      cityList: cityList,
    });
  } catch (error) {}
};

module.exports.editPatch = async (req, res) => {
  if (!req.permissions.includes("tour-edit")) {
    return res.json({
      code: "error",
      message: "Không có quyền sử dụng tính năng này!",
    });
  }
  try {
    const id = req.params.id;

    if (req.body.position) {
      req.body.position = parseInt(req.body.position);
    } else {
      const totalRecord = await Tour.countDocuments({});
      req.body.position = totalRecord + 1;
    }

    req.body.updatedBy = req.account.id;

    if (req.files && req.files.avatar) {
      req.body.avatar = req.files["avatar"][0].path;
    } else {
      delete req.body.avatar;
    }
    if (req.files && req.files.images) {
      if(req.files.images.length>0)  req.body.images = req.files.images.map((file)=>file.path);
      else {
      delete req.body.images;
    }
    } 

    req.body.priceAdult = req.body.priceAdult
      ? parseInt(req.body.priceAdult)
      : 0;
    req.body.priceChildren = req.body.priceChildren
      ? parseInt(req.body.priceChildren)
      : 0;
    req.body.priceBaby = req.body.priceBaby ? parseInt(req.body.priceBaby) : 0;
    req.body.priceNewAdult = req.body.priceNewAdult
      ? parseInt(req.body.priceNewAdult)
      : req.body.priceAdult;
    req.body.priceNewChildren = req.body.priceNewChildren
      ? parseInt(req.body.priceNewChildren)
      : req.body.priceChildren;
    req.body.priceNewBaby = req.body.priceNewBaby
      ? parseInt(req.body.priceNewBaby)
      : req.body.priceBaby;
    req.body.stockAdult = req.body.stockAdult
      ? parseInt(req.body.stockAdult)
      : 0;
    req.body.stockChildren = req.body.stockAdult
      ? parseInt(req.body.stockChildren)
      : 0;
    req.body.stockBaby = req.body.stockBaby ? parseInt(req.body.stockBaby) : 0;
    req.body.locations = req.body.locations
      ? JSON.parse(req.body.locations)
      : [];
    req.body.departureDate = req.body.departureDate
      ? new Date(req.body.departureDate)
      : null;
    req.body.schedules = req.body.locations
      ? JSON.parse(req.body.schedules)
      : [];

    await Tour.updateOne(
      {
        _id: id,
        deleted: false,
      },
      req.body
    );

    req.flash("success", "Cập nhật tour thành công!");

    res.json({
      code: "success",
    });
  } catch (error) {
    res.json({
      code: "error",
      message: "Id không hợp lệ!",
    });
  }
};

module.exports.trash = async (req, res) => {
  const find = {
    deleted: true,
  };

  const tourList = await Tour.find(find).sort({
    deletedAt: "desc",
  });

  for (const item of tourList) {
    if (item.createdBy) {
      const infoAccountCreated = await accountAdmin.findOne({
        _id: item.createdBy,
      });
      item.createdByFullName = infoAccountCreated.fullName;
    }

    if (item.deletedBy) {
      const infoAccountDeleted = await accountAdmin.findOne({
        _id: item.deletedBy,
      });
      item.deletedByFullName = infoAccountDeleted.fullName;
    }

    item.createdAtFormat = moment(item.createdAt).format("HH:mm - DD/MM/YYYY");
    item.deletedAtFormat = moment(item.deletedAt).format("HH:mm - DD/MM/YYYY");
  }

  res.render("admin/pages/tour-trash", {
    pageTitle: "Thùng rác tour",
    tourList: tourList,
  });
};

module.exports.deletePatch = async (req, res) => {
  if (!req.permissions.includes("tour-delete")) {
    return res.json({
      code: "error",
      message: "Không có quyền sử dụng tính năng này!",
    });
  }
  try {
    const id = req.params.id;

    await Tour.updateOne(
      {
        _id: id,
        deleted: false,
      },
      {
        deleted: true,
        deletedBy: req.account.id,
        deletedAt: Date.now(),
      }
    );

    req.flash("success", "Xóa tour thành công!");

    res.json({
      code: "success",
    });
  } catch (error) {
    res.json({
      code: "error",
      message: "Id không hợp lệ!",
    });
  }
};
module.exports.undoPatch = async (req, res) => {
  if (!req.permissions.includes("tour-trash")) {
    return res.json({
      code: "error",
      message: "Không có quyền sử dụng tính năng này!",
    });
  }
  try {
    const id = req.params.id;

    await Tour.updateOne(
      {
        _id: id,
        deleted: true,
      },
      {
        deleted: false,
      }
    );

    req.flash("success", "Khôi phục tour thành công!");

    res.json({
      code: "success",
    });
  } catch (error) {
    res.json({
      code: "error",
      message: "Id không hợp lệ!",
    });
  }
};

module.exports.deleteDestroy = async (req, res) => {
  if (!req.permissions.includes("tour-trash")) {
    return res.json({
      code: "error",
      message: "Không có quyền sử dụng tính năng này!",
    });
  }
  try {
    const id = req.params.id;

    await Tour.deleteOne({
      _id: id,
    });
    req.flash("success", "Đã xóa vĩnh viễn !");

    res.json({
      code: "success",
    });
  } catch (error) {
    res.json({
      code: "error",
      message: "Id không hợp lệ!",
    });
  }
};

module.exports.changeMultiPatch = async (req, res) => {
  if (!req.permissions.includes("tour-trash")) {
    return res.json({
      code: "error",
      message: "Không có quyền sử dụng tính năng này!",
    });
  }
  try {
    const { option, ids } = req.body;
    switch (option) {
      case "undo":
        await Tour.updateMany(
          {
            _id: { $in: ids },
          },
          {
            deleted: false,
            updatedBy: req.account.id,
            updatedAt: Date.now(),
          }
        );
        req.flash("success", "Khôi phục thành công");
        res.json({
          code: "success",
        });
        break;
      case "delete-destroy":
        await Tour.deleteMany({
          _id: { $in: ids },
        });
        req.flash("success", "Xóa vĩnh viễn thành công");
        res.json({
          code: "success",
        });
        break;
      default:
        break;
    }
  } catch (error) {
    res.json({
      code: "error",
      message: "Lỗi ",
    });
  }
};

module.exports.changeMultiTour = async (req, res) => {
  if (!req.permissions.includes("tour-edit")) {
    return res.json({
      code: "error",
      message: "Không có quyền sử dụng tính năng này!",
    });
  }
  try {
    const { option, ids } = req.body;

    switch (option) {
      case "active":
      case "inactive":
        await Tour.updateMany(
          {
            _id: { $in: ids },
          },
          {
            status: option,
            updatedBy: req.account.id,
            updatedAt: Date.now(),
          }
        );
        req.flash("success", "Cập nhật thành công!");
        res.json({
          code: "success",
          message: "Cập nhật thành công!",
        });
        break;
      case "delete":
        await Tour.updateMany(
          {
            _id: { $in: ids },
          },
          {
            deleted: true,
            updatedBy: req.account.id,
            updatedAt: Date.now(),
          }
        );
        req.flash("success", "Xóa  thành công!");
        res.json({
          code: "success",
          message: "Xóa thành công!",
        });
        break;
      default:
        req.flash("error", "Cập nhật không thành công!");
        res.json({
          code: "error",
          message: "Cập nhật không thành công!",
        });
        break;
    }
  } catch (error) {
    consloe.log("Lỗi cập nhật!");
  }
};
