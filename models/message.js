const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const messageSchema = new mongoose.Schema({
  message: {
    type: String,
    minlength: 1,
    required: true,
  },
  listingId: {
    type: String,
  },
  name: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
  }
});

const Messages = mongoose.model('Messages', messageSchema);

function messagesValidate(reqBody) {
  const schema = Joi.object({
    message: Joi.string().required(),
    listingId: Joi.string(),
    _id: Joi.string(),
    name: Joi.string().required(),
    avatar: Joi.string()
  });
  return ({
    error,
    value
  } = schema.validate(reqBody));
}

exports.Messages = Messages;
exports.validate = messagesValidate;