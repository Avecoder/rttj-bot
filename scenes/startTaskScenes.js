const WizardScene = require('telegraf/scenes/wizard')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')


// Сцена для посчета времени
module.exports = new WizardScene(
  'startTask',
  async ctx => {
    try {
      // Сообщение о начале занятия
      await ctx.reply(ctx.i18n.t('startLearn', {ctx}),
        Markup.inlineKeyboard([
            Markup.callbackButton('Начать', 'StartLearnAction'),
        ]).extra())
      // Следующая сцена
			return ctx.wizard.next()
    } catch(e) {
      console.log(e);
    }
  },
  async ctx => {
    try {
      // Проверяем, что начали занятие
      if(ctx.update.callback_query.data !== 'StartLearnAction') return
      // Начинаем отсчет времени
      const time = new Date()
      ctx.session.first = time.getMinutes()
      // Выводим сообщение о завершении занятия
			await ctx.reply(
        ctx.i18n.t('endLearn', {ctx}),
        Markup.inlineKeyboard([
            Markup.callbackButton('Закончить', 'EndLearnAction'),
        ]).extra())
      // Следующая сцена
			return ctx.wizard.next()
    } catch(e) {
      console.log(e);
    }
  },
  async ctx => {
    try {
      // Проверяем, что завершили занятие
      if(ctx.update.callback_query.data !== 'EndLearnAction') return
      // Подсчитываем время
      const time = new Date()
      const allTime = ((time.getMinutes() - ctx.session.first) / 60).toFixed(1)

      if(allTime < 0.5) {
        await ctx.reply(ctx.i18n.t('errorTask'))
        await ctx.replyWithSticker('CAACAgIAAxkBAAEEBoRiHVwBTNGeoLLu2m8Gd6_ULsFcmgACQQwAAlw8qEuOS1wxwMe03SME')
        return ctx.scene.leave()
      }

      ctx.session.allTime = allTime

      // Переходим на сцену для записи занятия
      return ctx.scene.enter('checkTaskToday')
    } catch(e) {
      console.log(e);
    }
  }
)
