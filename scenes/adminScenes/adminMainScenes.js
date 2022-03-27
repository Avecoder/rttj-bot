const WizardScene = require('telegraf/scenes/wizard')
const keyboard = require('../../assets/keyboard')


const adminController = require('../../controllers/adminController')


module.exports = new WizardScene(
	'adminMain',
	async ctx => {
		try {
			ctx.session.mainMessage = await ctx.reply('Выбери что хочешь сделать?', {
				reply_markup: keyboard.adminMainKeyboard
			})

			ctx.session.userStatus = await adminController.getStatus(ctx)

			return ctx.wizard.next()
		} catch(e) {
			console.log(e)
		}
	},
	async ctx => {
		try {
			ctx.session.count = 8
			const data = ctx.update.callback_query.data
			if(data === 'output') {
				await ctx.editMessageText(ctx.i18n.t('adminOutput'), {parse_mode: 'html'})
				return ctx.scene.leave()
			}

			if(data === 'users_list') {
				await ctx.deleteMessage(ctx.session.mainMessage.message_id)
				return ctx.scene.enter('adminUserList')
			}

			if(data === 'users_search') {
				const {message_id} = await ctx.editMessageText('Введи имя пользователя:', {
					reply_markup: {
						inline_keyboard: [
							[{text: 'Вернуться назад', callback_data: 'back'}]
						]
					}
				})

				ctx.session.searchUserMessageID = message_id

				return ctx.scene.enter('adminSearch')
			}

			if(data === 'send_all_message') {

				return ctx.scene.enter('adminSendAllMessage')
			}


			return ctx.scene.reenter()


		} catch(e) {
			console.log(e)
		}
	},
)
