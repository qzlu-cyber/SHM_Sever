const express = require('express');
const router = express.Router();

const {
  NotificationTokens,
  validate,
} = require('../models/expoNotificationToken');
const { Users } = require('../models/users');
const auth = require('../middlewares/auth');

router.post('/', auth, async (req, res) => {
  validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const user = await Users.findById(req.user._id);
  // if (user) {
  //   let token = new NotificationTokens({
  //     token: req.body.token,
  //   });

  //   token = await token.save();
  //   return res.send(token, req.user);
  // } else return res.status(404).send('查无此人');

  let expotoken = new NotificationTokens({
    token: req.body.token,
    name: req.user.name,
    email: req.user.email,
  });

  expotoken = await expotoken.save();
  res.status(201).send(expotoken);
});

module.exports = router;
