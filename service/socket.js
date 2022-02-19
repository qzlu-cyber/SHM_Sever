const {
	ChatMessages
} = require('../models/chatMessages');

module.exports = function socket(sever) {
	const io = require('socket.io')(sever);
	io.on('connection', (socket) => {
		console.log('客户端连接成功');
		socket.on('sendMessage', ({
			from,
			to,
			content
		}) => {
			const {
				content: chat_message
			} = content;
			const chat_id = [from, to].sort().join('_');
			const createTime = Date.now();
			let message = new ChatMessages({
				from,
				to,
				content: chat_message,
				chat_id,
				createTime
			});
			const saveMessage = async (message) => {
				await message.save();
			}
			saveMessage(message);
		});
	})
}