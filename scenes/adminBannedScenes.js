const WizardScene = require('telegraf/scenes/wizard')
const keyboard = require('../assets/keyboard')


const adminController = require('../controllers/adminController')


module.exports = new WizardScene(
	'adminBanned',
	async ctx => {
		try {
			const users = await adminController.getUsersList(ctx)
				
			await ctx.editMessageText('<b>Список пользователей</b>', {parse_mode: 'html'})
			for(let user of users) {
				const currentKeyboard = user.status === 'BANNED' ? keyboard.adminBannedUserKeyboard : keyboard.adminUnbannedUserKeyboard
				currentKeyboard.callback_data += ` ${user.userID}`
				await ctx.replyWithHTML(ctx.i18n.t('userItem', {user}), {
					reply_markup: currentKeyboard
				})
			}

			return ctx.wizard.next()
		} catch(e) {
			console.log(e)
		}
	},
	async ctx => {
		try {
			const data = ctx.update.callback_query.data.split(' ')
			const messID = ctx.update.callback_query.message.message_id
			const textData = ctx.update.callback_query.message.text

			if(data[0] === 'banned') {
				const message = await adminController.bannedUser(ctx, data[1])
				await ctx.reply(message)
				// await ctx.editMessageReplyMarkup(textData, messID)
				return false
			}

			if(data[0] === 'unbanned') {
				// const message = await adminController.unbannedUser(ctx, data[1])
				// await ctx.reply(message)
				await ctx.editMessageReplyMarkup(textData, messID)
				return false
			}

		} catch(e) {
			console.log(e)
		}
	}
)