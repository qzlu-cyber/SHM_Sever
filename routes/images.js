const express = require("express");
const router = express.Router();

router.get('/', function (req, res) {
  res.sendFile(__dirname + "/" + req.url);
  console.log("Request for " + req.url + " received.");
})

module.exports = router;