const WizardScene = require('telegraf/scenes/wizard')
const keyboard = require('../../assets/keyboard')
const dateAssets = require('../../assets/dateAssets')
const taskController = require('../../controllers/taskController')



module.exports = new WizardScene(
  'addPlannedTask',
	async ctx => {
		try {
		  	const {message_id} = await ctx.editMessageText(`Чем ты будешь заниматься <b>${dateAssets.dMDate(ctx.session.currentDate)}</b> на протяжении <b>${ctx.session.allTime}ч</b>?`, {
          parse_mode: 'html',
          reply_markup: {inline_keyboard: [[{text: 'Вернуться назад', callback_data: 'back'}]]}
        })

        ctx.session.taskQuestion = message_id
		  	return ctx.wizard.next()
		} catch(e) {
		  	console.log(e)
		}
	},
	async ctx => {
		try {
      const data = ctx.update?.callback_query?.data

      if(data === 'back') {
        await ctx.deleteMessage(ctx.session.taskQuestion)
        return ctx.scene.enter('taskScenes')
      }
			if(ctx.update.message.text.length < 3) {
				await ctx.reply('Длина названия должна быть больше двух.')
				return false
			}

			ctx.session.taskLabel = ctx.update.message.text
		  await ctx.reply(`Ты уверен, что ты будешь заниматься: '${ctx.update.message.text}'?`, {
		    reply_markup: keyboard.access
		  })

		  	return ctx.wizard.next()
		} catch(e) {
		  	console.log(e)
		}
	},
	async ctx => {
		try {
      const data = ctx.update?.callback_query?.data
		  if(data === 'no') {
		  	return ctx.scene.reenter()
		  }
		  if(data === 'yes') {
		  	const data = await taskController.addPlannedTask(ctx)
		  	await ctx.editMessageText(ctx.i18n.t('plannedTaskSuccess'))
		  	return ctx.scene.enter('taskScenes')
		  }

      return false
		} catch(e) {
			console.log(e)
		}
	}
)
