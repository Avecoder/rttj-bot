const WizardScene = require('telegraf/scenes/wizard')
const userController = require('../../controllers/userController')



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
      ctx.session.allTime = 0

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
        ctx.session.first = Date.now()
        await userController.changeActivity(ctx.from.id, '♂Ботает♂')
        // Выводим сообщение о завершении занятия
  			await ctx.editMessageText(ctx.i18n.t('endLearn', {ctx}), {
          reply_markup: JSON.stringify({
            inline_keyboard: [
              [
                {text: 'Закончить', callback_data: 'endLearn'},
                {text: 'Пауза', callback_data: 'pause'}
              ],
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
      if(ctx.update?.message?.text) return false


      const data = ctx.update?.callback_query?.data
      if(data === 'back') {
        await ctx.deleteMessage(ctx.session.startMessageID)
        await userController.changeActivity(ctx.from.id, 'Чиллит')
        return ctx.scene.enter('taskScenes')
      }

      if(data === 'pause') {
        ctx.session.allTime += Date.now() - ctx.session.first

        await userController.changeActivity(ctx.from.id, 'Перекур')

        await ctx.editMessageText('Таймер поставлен на паузу.', {
          reply_markup: JSON.stringify({
            inline_keyboard: [
              [{text: 'Продолжить', callback_data: 'continue'}],
              [{text: 'Вернуться назад', callback_data: 'back'}]
            ]
          })
        })
        return false
      }

      if(data === 'continue') {
        ctx.session.first = Date.now()

        await userController.changeActivity(ctx.from.id, '♂Ботает♂')
        await ctx.editMessageText(ctx.i18n.t('endLearn', {ctx}), {
          reply_markup: JSON.stringify({
            inline_keyboard: [
              [
                {text: 'Закончить', callback_data: 'endLearn'},
                {text: 'Пауза', callback_data: 'pause'}
              ],
              [{text: 'Вернуться назад', callback_data: 'back'}]
            ]
          })
        })
        return false
      }

      if(data === 'endLearn') {

        ctx.session.allTime += (Date.now() - ctx.session.first)

        await userController.changeActivity(ctx.from.id, 'Чиллит')

        ctx.session.allTime = (ctx.session.allTime / (1000 * 60 * 60)).toFixed(1)

        if(ctx.session.allTime < 0.5) {
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
