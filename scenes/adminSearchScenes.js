const WizardScene = require('telegraf/scenes/wizard')
const keyboard = require('../assets/keyboard')


const adminController = require('../controllers/adminController')


module.exports = new WizardScene(
	'adminSearch',
	async ctx => {
		try {
			await ctx.editMessageText('Введи имя пользователя')
		} catch(e) {
			console.log(e)
		}
	},
)