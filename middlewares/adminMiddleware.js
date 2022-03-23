const axios = require('axios')

const adminMiddleware = async (ctx, next) => {

	if(ctx.update.message.text === '/admin') {
		try {
			const userInfo = await axios.get(`${process.env.mainUrl}/info/${ctx.update.message.from.id}`)
			if(userInfo.data.status !== 'ADMIN') {
				ctx.reply('Ты по-моему перепутал.')
				ctx.replyWithPhoto(`https://i.ytimg.com/vi/0qr8KDvxrmo/maxresdefault.jpg`)
			}
		} catch(e) {
			console.log(e)
		}
	}
	return next()
}


module.exports = adminMiddleware