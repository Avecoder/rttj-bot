const WizardScene = require('telegraf/scenes/wizard')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')

const taskController = require('../controllers/taskController')

module.exports = new WizardScene(
  'checkTaskToday',
  async ctx => {
    try {
      const {markup, taskToday} = await taskController.checkTaskToday(ctx)

      if(taskToday.length === 0)  return ctx.scene.enter('labelTask')

      markup.push(Markup.callbackButton('Новое задание', 'newTask'))

      ctx.session.taskToday = taskToday

      await ctx.reply(ctx.i18n.t('taskToday', {ctx}), Markup.inlineKeyboard(markup, {columns: 2}).extra())

      return ctx.wizard.next()
    } catch(e) {
      console.log(e)
    }
  },
  async ctx => {
    try {
      if(ctx.update.callback_query.data === 'newTask') return ctx.scene.enter('labelTask')

      const tasks = ctx.session.taskToday.filter(task => task.taskID === ctx.update.callback_query.data)

      if(tasks[0].isCompleted) await taskController.addHoursTask(ctx)
      else {
        ctx.session.lastTime = tasks[0].hours
        await taskController.completeTask(ctx)
      }
    } catch(e) {
      console.log(e)
    }
  }
)
