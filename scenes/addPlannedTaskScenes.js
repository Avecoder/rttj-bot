const WizardScene = require('telegraf/scenes/wizard')
const keyboard = require('../assets/keyboard')
const taskController = require('../controllers/taskController')



module.exports = new WizardScene(
    'addPlannedTask',
	async ctx => {
		try {
		  	await ctx.editMessageText('Чем ты будешь заниматься?')
		  	return ctx.wizard.next()
		} catch(e) {
		  	console.log(e)
		}
	},
	async ctx => {
		try {
			if(ctx.update.message.text.length < 3) {
				await ctx.reply('Длина названия должна быть больше двух.')
				return false
			}

			ctx.session.taskLabel = ctx.update.message.text
		  	await ctx.reply('Ты уверен?', {
		    	reply_markup: keyboard.access
		  	})
		  	return ctx.wizard.next()
		} catch(e) {
		  	console.log(e)
		}
	},
	async ctx => {
		try {
		  if(ctx.update.callback_query.data === 'no') {
		  	return ctx.scene.reenter()
		  }
		  if(ctx.update.callback_query.data === 'yes') {
		  	const data = await taskController.addPlannedTask(ctx)
		  	await ctx.editMessageText(ctx.i18n.t('plannedTaskSuccess'))
		  	return ctx.scene.leave()
		  }
		} catch(e) {
			console.log(e)
		}
	}
)