const WizardScene = require('telegraf/scenes/wizard')

const keyboard = require('../../assets/keyboard')
const dateAssets = require('../../assets/dateAssets')
const taskController = require('../../controllers/taskController')


module.exports = new WizardScene(
  'plannedTaskList',
  async ctx => {
    try {
      await ctx.editMessageText('Подожди немного')
      const planTask = await taskController.getPlannedTask(ctx)
      const plannedTask = await planTask.filter(item => !item.isCompleted)

      ctx.session.plannedTask = plannedTask

      const currentKeyboard = plannedTask.map(item => {
        return [{text: item.label, callback_data: item.taskID}]
      })
      currentKeyboard.push([{text: 'Вернуться назад', callback_data: 'back'}])



      if(plannedTask.length === 0) {
        const {message_id} = await ctx.editMessageText('У тебя нет запланированных заданий.', {
          reply_markup: JSON.stringify({
            inline_keyboard: [[{text: 'Вернуться назад', callback_data: 'back'}]]
          })
        })

        ctx.session.taskPlannedListID = message_id
      } else {
        const {message_id} = await ctx.editMessageText(`<b>Твои запланированные задания:</b>`, {
          reply_markup: JSON.stringify({
            inline_keyboard: currentKeyboard
          }),
          parse_mode: 'html'
        })

        ctx.session.taskPlannedListID = message_id
      }



      return ctx.wizard.next()
    } catch (e) {
      console.log(e)
    }
  },
  async ctx => {
    try {
      const data = ctx.update?.callback_query?.data

      if(data === 'back') {
        await ctx.deleteMessage(ctx.session.taskPlannedListID)
        return ctx.scene.enter('taskScenes')
      }

      if(data) {
        const currentTask = ctx.session.plannedTask.filter(item => item.taskID == data)[0]
        ctx.session.currentTask = currentTask
        currentTask.date = dateAssets.dMDate(currentTask.date)
        await ctx.editMessageText(ctx.i18n.t('plannedTaskItem', {currentTask}), {
          reply_markup: JSON.stringify({
            inline_keyboard: [[
              {text: 'Удалить', callback_data: 'delete_task'},
              {text: 'Вернуться назад', callback_data: 'back'}
            ]]
          }),
          parse_mode: 'html'
        })

        return ctx.wizard.next()
      }

      return false
    } catch (e) {
      console.log(e)
    }
  },
  async ctx => {
    try {
      const data = ctx.update?.callback_query?.data

      if(data === 'back') {
        return ctx.scene.reenter()
      }

      if(data === 'delete_task') {
        const deletedTask = await taskController.deletePlannedTask(ctx)

        await ctx.editMessageText(`Задание ${ctx.session.currentTask.label} удалено.`, {
          reply_markup: JSON.stringify({
            inline_keyboard: [[{text: 'Вернуться назад', callback_data: 'back'}]]
          })
        })

        return false
      }
    } catch (e) {
      console.log(e)
    }
  }
)
