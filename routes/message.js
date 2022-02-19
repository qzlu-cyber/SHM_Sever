const express = require('express');
const router = express.Router();

const {
  Messages,
  validate
} = require('../models/message');

router.get('/', async (req, res) => {
  const messages = await Messages.find();
  res.send(messages);
});

router.post('/', async (req, res) => {
  validate(req.body);
  if (error) return res.status(400).send(error);

  let message = new Messages({
    message: req.body.message,
    listingId: req.body.listingId,
    name: req.body.name,
    avatar: req.body.avatar
  });

  message = await message.save();
  res.send(message);
});

module.exports = router;