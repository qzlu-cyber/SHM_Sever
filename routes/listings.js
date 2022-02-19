const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const multiparty = require("multiparty");
const upload = multer({
  dest: "./public/uploads/",
});

const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
const { Listings, validate } = require("../models/listings");
const { Users } = require("../models/users");

router.get("/", async (req, res) => {
  const listings = await Listings.find({
    saleOut: false,
  }).sort("title");
  res.send(listings);
});

router.get("/:id", async (req, res) => {
  const listing = await Listings.findById(req.params.id);
  if (!listing) return res.status(404).send("抱歉，你要找的资源不存在");

  res.send(listing);
});

router.get("/getUserListings/:id", async (req, res) => {
  const listings = await Listings.find({
    id: req.params.id,
  });
  if (!listings) return res.status(404).send("抱歉，你要找的资源不存在");

  res.send(listings);
});

router.post("/getListingsBySearch", async (req, res) => {
  const listings = await Listings.find({
    title: {
      $regex: req.body.searchContent,
      $options: "i",
    },
    saleOut: false,
  });

  if (!listings) return res.status(404).send("抱歉，你要找的资源不存在");

  res.send(listings);
});

router.get("/allListings/:id", async (req, res) => {
  const allListings = await Listings.find({
    id: req.params.id,
  });
  res.send(allListings);
});

router.get("/isSale/:id", async (req, res) => {
  const listings = await Listings.find({
    id: req.params.id,
    saleOut: false,
  });
  res.send(listings);
});

let imageArr = [];
router.patch("/", (req, res) => {
  let result = req.pipe(
    fs.createWriteStream(
      "./public/uploads/listingsImages/image" + Date.now() + ".png"
    )
  );
  imageArr.push(
    "http://192.168.31.101:3000/" + result.path.split("./public/").join("")
  );
  console.log(imageArr);
  res.end("OK");
});

router.post("/android", function (req, res) {
  const form = new multiparty.Form();
  const date = Date.now();
  form.parse(req, function (err, fields, files) {
    console.log(fields.images);
    //将前台传来的base64数据去掉前缀
    const image = fields.images[0].replace(/^data:image\/\w+;base64,/, "");
    const dataBuffer = new Buffer.from(image, "base64");
    //写⼊⽂件
    fs.writeFile(
      "./public/uploads/listingsImages/image" + date + ".png",
      dataBuffer,
      function (err) {
        if (err) {
          res.send(err);
        } else {
          imageArr.push(
            "http://192.168.31.101:3000/uploads/listingsImages/image" +
              date +
              ".png"
          );
          res.send("保存成功");
        }
      }
    );
  });
});

router.post("/", async (req, res) => {
  validate(req.body);
  if (!error) {
    let listing = new Listings({
      title: req.body.title,
      price: req.body.price,
      images: imageArr,
      description: req.body.description,
      id: req.body.id,
    });
    listing = await listing.save();
    imageArr = [];
    res.send(listing);
  } else {
    return res.status(400).send(error.details[0].message);
  }
});

router.post("/filestore/image/upload/:id", async (req, res) => {
  const user = await Users.findById(req.params.id);
  if (user) {
    let listing = new Listings({
      title: "Test",
      price: "Test",
      images: req.body.files,
      description: "description",
      id: req.params.id,
    });
    res.send(listing);
  }
  return;
});

router.put("/:id", async (req, res) => {
  validate(req.body);
  if (!error) {
    const listing = await Listings.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        price: req.body.price,
        images: req.body.images,
        description: req.body.description,
      },
      {
        new: true,
      }
    );
    return res.send(listing);
  } else {
    return res.status(400).send(error.details[0].message);
  }
});

router.put("/saleOut/:id", async (req, res) => {
  validate(req.body);
  if (!error) {
    const listing = await Listings.findByIdAndUpdate(
      req.params.id,
      {
        saleOut: "true",
      },
      {
        new: true,
      }
    );
    return res.send(listing);
  } else {
    return res.status(400).send(error.details[0].message);
  }
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const listing = await Listings.findByIdAndRemove(req.params.id);
  if (!listing) return res.status(404).send("你要删除的资源不存在...");
  return res.send(listing);
});

module.exports = router;
