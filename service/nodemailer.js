const nodemailer = require('nodemailer');

//创建一个smtp服务器
const config = {
  host: 'smtp.163.com',
  port: 465,
  auth: {
    user: 'qzlu3773@163.com', //注册的邮箱账号
    pass: 'QAWBJMBIORNLXHPP' //邮箱的授权码
  }
};
// 创建一个SMTP客户端对象
const transporter = nodemailer.createTransport(config);

function createSixNum() {
  var Num = "";
  for (var i = 0; i < 6; i++) {
    Num += Math.floor(Math.random() * 10);
  }
  return Num;
}

function nodemail(mail) {
  transporter.sendMail(mail, function (error, info) {
    if (error) {
      return console.log(error);
    }
    console.log('mail sent:', info.response);
  });
}

//发送邮件
exports.createSixNum = createSixNum;
exports.nodemail = nodemail;