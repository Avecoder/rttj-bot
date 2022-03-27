const WizardScene = require('telegraf/scenes/wizard')
const {Calendar} = require('@michpl/telegram-calendar')
const keyboard = require('../../assets/keyboard')
const dateAssets = require('../../assets/dateAssets')
const taskController = require('../../controllers/taskController')

module.exports = new WizardScene(
  'taskScenes',
  async ctx => {
    try {
      await ctx.replyWithHTML('<b>Что ты хочешь сделать?</b>', {
        reply_markup: keyboard.taskKeyboard
      })

      return ctx.wizard.next()
    } catch(e) {
      console.log(e)
    }
  },
  async ctx => {
    try {
      const data = ctx.update?.callback_query?.data
      if(data === 'output') {
        await ctx.editMessageText(ctx.i18n.t('leaveScenes'))
        return ctx.scene.leave()
      }
      if(data === 'start') return ctx.scene.enter('startTask')
      if(data === 'add_task') return ctx.scene.enter('putDownTasks')
      if(data === 'planned_task') return ctx.scene.enter('plannedTaskList')

      return false
    } catch(e) {
      console.log(e)
    }
  },

)
