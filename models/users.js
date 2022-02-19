const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const usersSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 7,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    minlength: 6,
    maxlength: 1024,
    required: true,
  },
  isAdmin: Boolean,
  avatar: {
    type: String,
    default: 'https://s1.ax1x.com/2020/08/01/a3Pbff.jpg'
  }
});

const Users = mongoose.model('Users', usersSchema);

function usersValidate(reqBody) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(7).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(1).max(20).required(),
    avatar: Joi.string(),
    code: Joi.number()
  });
  return ({
    error,
    value
  } = schema.validate(reqBody));
}

exports.usersSchema = usersSchema;
exports.Users = Users;
exports.validate = usersValidate;