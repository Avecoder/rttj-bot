const WizardScene = require('telegraf/scenes/wizard')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const Calendar = require('telegraf-calendar-telegram')




module.exports = new WizardScene(
  'putDownTasks',
  async (ctx, bot) => {
    try {
      const today = new Date();
    	const minDate = new Date();
    	minDate.setMonth(today.getMonth() - 2);
    	const maxDate = new Date();
    	maxDate.setMonth(today.getMonth() + 2);
    	maxDate.setDate(today.getDate());
      const calendar = new Calendar(bot, {
      	startWeekDay: 1,
      	weekDayNames: ["L", "M", "M", "G", "V", "S", "D"],
      	monthNames: [
      		"Gen", "Feb", "Mar", "Apr", "Mag", "Giu",
      		"Lug", "Ago", "Set", "Ott", "Nov", "Dic"
      	]
      })

      // console.log(bot)
      // console.log(ctx)
      calendar.setDateListener((context, date) => context.reply(date));
      await ctx.reply('good', calendar.setMinDate(minDate).setMaxDate(maxDate).getCalendar())

      return ctx.wizard.next()
    } catch(e) {
      console.log(e)
    }
  },
  async ctx => {
    try {

    } catch(e) {
      console.log(e)
    }
  }
)
