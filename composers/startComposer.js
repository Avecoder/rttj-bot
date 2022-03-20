const { Composer } = require('telegraf')
// const Markup = require('telegraf/markup')
const axios = require('axios')
const composer = new Composer()


composer.command('start', async ctx => {
	try {
		await ctx.replyWithHTML(ctx.i18n.t('welcome', {ctx}))

    	const data = await axios.post(`${process.env.mainUrl}/login`, {
			userID: ctx.update.message.from.id,
			username: ctx.update.message.from.username
		})

	
	} catch (e) {
		console.error('cant handle help command', e)
	}
})

composer.command('help', async ctx => {
  try {

		await ctx.replyWithHTML(ctx.i18n.t('help'))
		// console.log(ctx.update.message.entities);
	} catch (e) {
		console.error('cant handle help command', e)
	}
})

module.exports = composer
