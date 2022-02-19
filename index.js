const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const app = express();
const http = require("http").createServer(app);
const bodyParser = require("body-parser");
require("./service/socket")(http);

const listings = require("./routes/listings");
const users = require("./routes/users");
const auth = require("./routes/auth");
const expoNotificationToken = require("./routes/expoNotificationToken");
const message = require("./routes/message");
const chatMessages = require("./routes/chatMessages");
const images = require("./routes/images");

app.use(
  express.urlencoded({
    extended: true,
  })
);

if (!config.get("jwtToken")) {
  console.error("严重错误，未设置jwtToken!");
  process.exit(1);
}

mongoose
  .connect("mongodb://localhost/SecondHandMarket", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("数据库连接成功..."))
  .catch((error) => console.error(error));

app.all("*", function (req, res, next) {
  //设置允许跨域的域名，*代表允许任意域名跨域
  res.header("Access-Control-Allow-Origin", "http://localhost:8081");
  //允许的header类型
  res.header("Access-Control-Allow-Headers", "content-type");
  //跨域允许的请求方式
  res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
  if (req.method.toLowerCase() == "options") res.send(200);
  //让options尝试请求快速结束
  else next();
});

app.use(
  express.json({
    limit: "5mb",
  })
);

app.use(express.static(__dirname + "/public"));

app.use("/api/listings", listings);
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/expoNotificationToken", expoNotificationToken);
app.use("/api/message", message);
app.use("/api/chatMessages", chatMessages);
app.use("/public/uploads/listingsImages", images);

const port = process.env.PORT || 3000;

http.listen(port, console.log(`正在监听${port}端口...`));