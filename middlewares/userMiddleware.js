const axios = require('axios')

const userMiddleware = async (ctx, next) => {

	if(ctx.update.message.text[0] === '/') {
		const userInfo = await axios.get(`${process.env.mainUrl}/info/${ctx.update.message.from.id}`)
		if(userInfo.data.status === 'BANNED') {
			await ctx.replyWithHTML(ctx.i18n.t('bannedMessgage'))
			return false
		}
	}
	
	return next()
}


module.exports = userMiddleware
