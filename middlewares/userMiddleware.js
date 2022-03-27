const axios = require('axios')
const path = require('path')
const fs = require('fs')


const userMiddleware = async (ctx, next) => {
	// const message = ctx.update?.message?.text[0] || ctx.update?.message?.text

	if(ctx.update?.message?.text && ctx.update?.message?.text[0] === '/') {
		const userInfo = await axios.get(`${process.env.mainUrl}/info/${ctx.update.message.from.id}`)
		if(userInfo?.data?.status === 'BANNED') {
			await ctx.reply(ctx.i18n.t('bannedMessgage'))
			await ctx.replyWithVideo({source: fs.createReadStream(path.resolve(__dirname, '../assets/video/banned.mp4'))})

			return false
		}
	}

	return next()
}


module.exports = userMiddleware
