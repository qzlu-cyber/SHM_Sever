const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const chatMessageSchame = new mongoose.Schema({
	from: {
		type: String,
		required: true
	},
	to: {
		type: String,
		required: true
	},
	chat_id: {
		type: String,
		required: true
	},
	content: {
		type: String,
		required: true
	},
	read: {
		type: Boolean,
		default: false
	},
	createTime: {
		type: Number
	}
});

const ChatMessages = mongoose.model('ChatMessages', chatMessageSchame);

function chatMessagesValidate(reqBody) {
	const schema = Joi.object({
		from: Joi.string().required(),
		to: Joi.string().required(),
		chat_id: Joi.string().required(),
		content: Joi.string().required(),
		createTime: Joi.number()
	});
	return ({
		error,
		value
	} = schema.validate(reqBody));
}

exports.ChatMessages = ChatMessages;
exports.validate = chatMessagesValidate;