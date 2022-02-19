const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const notificationTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
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
});

const NotificationTokens = mongoose.model(
  'NotificationTokens',
  notificationTokenSchema
);

function tokensValidate(reqBody) {
  const schema = Joi.object({
    token: Joi.string().required(),
  });
  return ({ error, value } = schema.validate(reqBody));
}

exports.notificationTokenSchema = notificationTokenSchema;
exports.NotificationTokens = NotificationTokens;
exports.validate = tokensValidate;
