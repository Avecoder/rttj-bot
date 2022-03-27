const WizardScene = require('telegraf/scenes/wizard')
const {Calendar} = require('@michpl/telegram-calendar')
const keyboard = require('../../assets/keyboard')
const dateAssets = require('../../assets/dateAssets')



const currentMonth = new Date()


const calendar = new Calendar({
  weekDayNames: [
    'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'
  ],
  monthNames: [
    'Янв', 'Фев', 'Мар',
    'Апр', 'Май', 'Июн',
    'Июл', 'Авг', 'Сен',
    'Окт', 'Ноя', 'Дек'
  ],
  minDate: dateAssets.dashDate(new Date())
})


module.exports = new WizardScene(
  'putDownTasks',
  async ctx => {
    try {
      const currentKeyboard = calendar.getPage(currentMonth)
      currentKeyboard.push([{text: 'Вернуться назад', callback_data: 'back'}])

      const {message_id} = await ctx.editMessageText('Выбери дату', {
        parse_mode: 'html',
        reply_markup: JSON.stringify({
          inline_keyboard: currentKeyboard
        })
      })

      ctx.session.calendarId = message_id

      return ctx.wizard.next()
    } catch(e) {
      console.log(e)
    }
  },
  async ctx => {
    try {
      let data = ctx.update?.callback_query?.data
      if(data === 'back') {
        await ctx.deleteMessage(ctx.session.calendarId)
        return ctx.scene.enter('taskScenes')
      }

      data = JSON.parse(data)
      if(data.action === 'prev-month') {
        currentMonth.setMonth(currentMonth.getMonth() - 1)
        return ctx.scene.reenter()
      }
      if(data.action === 'next-month') {
        currentMonth.setMonth(currentMonth.getMonth() + 1)
        return ctx.scene.reenter()
      }
      if(data.action === null && data.date !== 0) {
        ctx.session.currentDate = data.date
        const {message_id} = await ctx.editMessageText(`Ты выбрал дату: <b>${dateAssets.dMDate(data.date)}</b>, сколько часов ты будешь заниматься?`,{
          reply_markup: keyboard.hours,
          parse_mode: 'html'
        })

        ctx.session.hoursKeyboardId = message_id
        return ctx.wizard.next()
      }
    } catch(e) {
      console.log(e)
    }
  },
  async ctx => {
    try {
      const data = ctx.update?.callback_query?.data
      if(data === 'change_date') {
        return ctx.scene.reenter()
      }

      if(data === 'back') {
        await ctx.deleteMessage(ctx.session.hoursKeyboardId)
        return ctx.scene.enter('taskScenes')
      }
      ctx.session.allTime = ctx.update.callback_query.data
      return ctx.scene.enter('addPlannedTask')
    } catch(e) {
      console.log(e)
    }
  }
)
