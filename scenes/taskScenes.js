const WizardScene = require('telegraf/scenes/wizard')
const {Calendar} = require('@michpl/telegram-calendar')
const keyboard = require('../assets/keyboard')
const dateAssets = require('../assets/dateAssets')
const taskController = require('../controllers/taskController')

module.exports = new WizardScene(
  'taskScenes',
  async ctx => {
    try {
      await ctx.replyWithHTML('<b>Выбери чем хочешь заниматься или покинь сцену</b>', {
        reply_markup: keyboard.taskKeyboard
      })

      return ctx.wizard.next()
    } catch(e) {
      console.log(e)
    }
  },
  async ctx => {
    try {
      if(ctx.update.callback_query.data === 'output') {
        await ctx.reply('Вы покинули сцену')
        return ctx.scene.leave()
      }
      if(ctx.update.callback_query.data === 'start') return ctx.scene.enter('startTask')
      if(ctx.update.callback_query.data === 'add_task') return ctx.scene.enter('putDownTasks')
      if(ctx.update.callback_query.data === 'planned_task') {
        const data = await taskController.getPlannedTask(ctx)
        const plannedTask = await data.filter(item => !item.isCompleted)


        await ctx.editMessageText(`<b>Твои запланированные задания:</b>`, {
          parse_mode: 'html'
        })

        for(let item of plannedTask) {
          item.date = await dateAssets.dotsDate(item.date)
          await ctx.replyWithHTML(ctx.i18n.t('plannedTaskItem', {item}))
        }

        await ctx.replyWithHTML(`<b>Вернуться в сцену с заданиями:</b>\n/tasks`)

      }

      
      
      
      return ctx.scene.leave()
    } catch(e) {
      console.log(e)
    }
  }
)
