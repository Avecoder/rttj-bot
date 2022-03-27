const WizardScene = require('telegraf/scenes/wizard')
const keyboard = require('../../assets/keyboard')


const adminController = require('../../controllers/adminController')


module.exports = new WizardScene(
	'adminChangeStatus',
	async ctx => {
		try {
			await ctx.editMessageText('Введи статус пользователя:', {
				reply_markup: {
					inline_keyboard: [
						[{text: 'Вернуться назад', callback_data: 'backSearch'}]
					]
				}
			})

			return ctx.wizard.next()
		} catch(e) {
			console.log(e)
		}
	},
	async ctx => {
		try {
			const data = ctx.update?.callback_query?.data
			if(data === 'backSearch') {
				await ctx.reply('Введи имя пользователя:', {
					reply_markup: {
						inline_keyboard: [
							[{text: 'Вернуться назад', callback_data: 'back'}]
						]
					}
				})
				await ctx.deleteMessage()
				return ctx.scene.enter('adminSearch')
			}

			const mess = ctx.update?.message?.text



			if(mess && mess.trim().length > 3) {
				const user = await adminController.changeStatus(ctx, mess)

				ctx.reply(user.message, {
					reply_markup: {
						inline_keyboard: [
							[{text: 'Вернуться назад', callback_data: 'back'}]
						]
					}
				})

				return false
			}
			else ctx.scene.reenter()
		} catch(e) {
			console.log(e)
		}
	},
)
