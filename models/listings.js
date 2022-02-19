const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const listingsSchema = new mongoose.Schema({
  title: {
    type: String,
    minlength: 1,
    maxlength: 30,
    required: true,
  },
  images: {
    type: Array,
    minlength: 1,
    maxlength: 5,
    required: true,
  },
  price: {
    type: Number,
    min: 0,
    required: true,
  },
  description: {
    type: String,
    minlength: 1,
    maxlength: 500,
    required: true,
  },
  id: {
    type: String,
    required: true
  },
  saleOut: {
    type: Boolean,
    default: false
  }
});

const Listings = mongoose.model('Listings', listingsSchema);

function listingsValidate(reqBody) {
  const schema = Joi.object({
    title: Joi.string().min(1),
    price: Joi.number().min(0),
    description: Joi.string().min(1),
    location: Joi.string(),
    images: Joi.array(),
    id: Joi.string(),
    saleOut: Joi.boolean()
  });
  return ({
    error,
    value
  } = schema.validate(reqBody));
}

exports.listingsSchema = listingsSchema;
exports.Listings = Listings;
exports.validate = listingsValidate;