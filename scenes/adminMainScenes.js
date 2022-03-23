const WizardScene = require('telegraf/scenes/wizard')
const keyboard = require('../assets/keyboard')


const adminController = require('../controllers/adminController')


module.exports = new WizardScene(
	'adminMain',
	async ctx => {
		try {
			await ctx.reply('Выбери что хочешь сделать?', {
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
			const data = ctx.update.callback_query.data
			if(data === 'output') return ctx.scene.leave()

			if(data === 'users_list') return ctx.scene.enter('adminBanned')

			if(data === 'users_search') return ctx.scene.enter('adminSearch')


			return ctx.scene.reenter()


		} catch(e) {
			console.log(e)
		}
	},
)