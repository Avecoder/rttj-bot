const WizardScene = require('telegraf/scenes/wizard')
const Markup = require('telegraf/markup')

const taskController = require('../../controllers/taskController')

module.exports = new WizardScene(
  'checkTaskToday',
  async ctx => {
    try {
      const {markup, taskToday} = await taskController.checkTaskToday(ctx)

      if(taskToday.length === 0)  return ctx.scene.enter('labelTask')

      markup.push([{text: 'Новое задание', callback_data: 'newTask'}])

      ctx.session.taskToday = taskToday

      await ctx.editMessageText(ctx.i18n.t('taskToday', {ctx}), {
        reply_markup: JSON.stringify({
          inline_keyboard: markup
        })
      })

      return ctx.wizard.next()
    } catch(e) {
      console.log(e)
    }
  },
  async ctx => {
    try {
      const data = ctx.update?.callback_query?.data

      if(data === 'newTask') return ctx.scene.enter('labelTask')

      const tasks = ctx.session.taskToday.filter(task => task.taskID === data)


      if(tasks[0].isCompleted) {
        const task = await taskController.addHoursTask(ctx)

        await ctx.editMessageText(ctx.i18n.t('taskTodayCompletedTrue', {task}))

        return ctx.scene.enter('taskScenes')
      } else {
        ctx.session.lastTime = tasks[0].hours
        const task = await taskController.completeTask(ctx)

        await ctx.editMessageText(ctx.i18n.t('taskTodayUncompletedTrue', {task, ctx}))

        return ctx.scene.enter('taskScenes')
      }

      return false
    } catch(e) {
      console.log(e)
    }
  }
)
