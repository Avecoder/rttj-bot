const WizardScene = require('telegraf/scenes/wizard')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')

const taskController = require('../controllers/taskController')


// Сцена для посчета времени
module.exports = new WizardScene(
  'labelTask',
  async ctx => {
    try {
      // Отправляем сообщение с просьбой написать тему занятия
      await ctx.reply(ctx.i18n.t('taskLabel', {ctx}))
      // Следующая сцена
      return ctx.wizard.next()
    } catch(e) {
      console.log(e);
    }
  },
  async ctx => {
    try {
      // Получаем сообщение от пользователя
      const label = ctx.message.text
      ctx.session.taskLabel = label
      // Просим проверить тему
      await ctx.reply(ctx.i18n.t('confirmLabel', {label}),
      Markup.inlineKeyboard([
          Markup.callbackButton('Да', 'Yes'),
          Markup.callbackButton('Нет', 'No'),
      ]).extra())
      // Следующая сцена
      return ctx.wizard.next()
    } catch(e) {
      console.log(e);
    }
  },
  async ctx => {
    try {
      // Если пользователь ошибся, перезапускаем сцену
      if(ctx.update.callback_query.data !== 'Yes') {
        await ctx.reply(ctx.i18n.t('repeatTaskLabel'))
        return ctx.scene.reenter()
      }
      // Если пользователь нажал Да, сохраняем данные
      if(ctx.update.callback_query.data !== 'No') {
        await ctx.reply(ctx.i18n.t('finalTask', {ctx})) // Сообщение о сохраненом задании
        await taskController.saveTask(ctx)  // Сохранение данных о задании
        await taskController.getReaction(ctx)  // Отправка стикера с  реакцией
        return ctx.scene.leave() // Покидаем сцену
      }
    } catch(e) {
      console.log(e)
    }
  },
)
