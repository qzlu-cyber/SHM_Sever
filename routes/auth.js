const _ = require('lodash');
const bcrypt = require('bcryptjs');
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');
const config = require('config');
const express = require('express');
const router = express.Router();

const {
  Users
} = require('../models/users');

router.post('/', async (req, res) => {
  validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await Users.findOne({
    email: req.body.email
  });
  if (!user) return res.status(400).send('邮箱或密码错误');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('邮箱或密码错误');

  const token = jwt.sign({
      _id: user._id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
      avatar: user.avatar
    },
    config.get('jwtToken')
  );
  res.send(token);
});

function validate(reqBody) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(1).max(20).required(),
  });
  return ({
    error,
    value
  } = schema.validate(reqBody));
}

module.exports = router;