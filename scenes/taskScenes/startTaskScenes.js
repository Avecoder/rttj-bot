const WizardScene = require('telegraf/scenes/wizard')



module.exports = new WizardScene(
  'startTask',
  async ctx => {
    try {

      const {message_id} = await ctx.editMessageText(ctx.i18n.t('startLearn', {ctx}), {
        reply_markup: JSON.stringify({
          inline_keyboard: [
            [{text: 'Начать', callback_data: 'startLearn'}],
            [{text: 'Вернуться назад', callback_data: 'back'}]
          ]
        })
      })

      ctx.session.startMessageID = message_id

			return ctx.wizard.next()
    } catch(e) {
      console.log(e)
    }
  },
  async ctx => {
    try {
      const data = ctx.update?.callback_query?.data
      // Проверяем, что начали занятие
      if(data === 'startLearn') {
        const time = new Date()
        ctx.session.first = time.getMinutes()
        // Выводим сообщение о завершении занятия
  			await ctx.editMessageText(ctx.i18n.t('endLearn', {ctx}), {
          reply_markup: JSON.stringify({
            inline_keyboard: [
              [{text: 'Закончить', callback_data: 'endLearn'}],
              [{text: 'Вернуться назад', callback_data: 'back'}]
            ]
          })
        })

        return ctx.wizard.next()
      }

      if(data === 'back') {
        await ctx.deleteMessage(ctx.session.startMessageID)
        return ctx.scene.enter('taskScenes')
      }

			return false
    } catch(e) {
      console.log(e);
    }
  },
  async ctx => {
    try {
      const data = ctx.update?.callback_query?.data
      if(data === 'back') {
        await ctx.deleteMessage(ctx.session.startMessageID)
        return ctx.scene.enter('taskScenes')
      }

      if(data === 'endLearn') {
        const time = new Date()
        const allTime = ((time.getMinutes() - ctx.session.first) / 60).toFixed(1)

        if(allTime < 0.5) {
          await ctx.editMessageText(ctx.i18n.t('errorTask'))
          await ctx.replyWithSticker('CAACAgIAAxkBAAEER41iP7tQ0thyzRpgD0Cn_M12nR5SVAACRA0AAlqPsUmvCoOB9MD71iME')
          return ctx.scene.enter('taskScenes')
        }


        return ctx.scene.enter('checkTaskToday')
      }

      return false
    } catch(e) {
      console.log(e);
    }
  }
)
