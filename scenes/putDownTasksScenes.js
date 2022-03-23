const WizardScene = require('telegraf/scenes/wizard')
const {Calendar} = require('@michpl/telegram-calendar')
const keyboard = require('../assets/keyboard')
const dateAssets = require('../assets/dateAssets')



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
      
      await ctx.editMessageText('Выбери дату', {
        parse_mode: 'html',
        reply_markup: JSON.stringify({
          inline_keyboard: calendar.getPage(currentMonth)
        })
      })

      return ctx.wizard.next()
    } catch(e) {
      console.log(e)
    }
  },
  async ctx => {
    try {
      const data = JSON.parse(ctx.update.callback_query.data)
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
        await ctx.editMessageText(`Ок, ты будешь заниматься ${data.date}, но сколько часов?`,{ 
          reply_markup: keyboard.hours
        })
        return ctx.wizard.next()
      }  
    } catch(e) {
      console.log(e)
    }
  },
  async ctx => {
    try {
      if(ctx.update.callback_query.data === 'change_date') {
        return ctx.scene.reenter()
      }
      ctx.session.allTime = ctx.update.callback_query.data
      return ctx.scene.enter('addPlannedTask')
    } catch(e) {
      console.log(e)
    }
  }
)
