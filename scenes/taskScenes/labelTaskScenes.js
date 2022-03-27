const WizardScene = require('telegraf/scenes/wizard')


const taskController = require('../../controllers/taskController')
const keyboard = require('../../assets/keyboard')


// Сцена для посчета времени
module.exports = new WizardScene(
  'labelTask',
  async ctx => {
    try {
      // Отправляем сообщение с просьбой написать тему занятия
      await ctx.editMessageText(ctx.i18n.t('taskLabel', {ctx}))
      // Следующая сцена
      return ctx.wizard.next()
    } catch(e) {
      console.log(e);
    }
  },
  async ctx => {
    try {
      const label = ctx.update?.message?.text

      if(label) {
        ctx.session.taskLabel = label

        await ctx.reply(ctx.i18n.t('confirmLabel', {label}), {
          reply_markup: keyboard.access
        })

        return ctx.wizard.next()
      }
      return false
    } catch(e) {
      console.log(e);
    }
  },
  async ctx => {
    try {
      const data = ctx.update?.callback_query?.data
      if(data === 'no') {
        return ctx.scene.reenter()
      }

      if(data === 'yes') {
        await ctx.editMessageText(ctx.i18n.t('finalTask', {ctx}))
        await taskController.saveTask(ctx)
        await taskController.getReaction(ctx)
        return ctx.scene.enter('taskScenes')
      }
    } catch(e) {
      console.log(e)
    }
  },
)
