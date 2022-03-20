const WizardScene = require('telegraf/scenes/wizard')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const staticController = require('../controllers/staticController')
const { Keyboard } = require('telegram-keyboard')

module.exports = new WizardScene(
  'staticScenes',
  async ctx => {
    try {
      await ctx.replyWithHTML('<b>Выбери нужную статистику или покинь сцену</b>',
        Keyboard.reply(['Твоя статистика', 'Статистика всех', 'Статистика за сегодня', 'Покинуть сцену'],
        {columns: 2})
      )

      return ctx.wizard.next()
    } catch(e) {
      console.log(e)
    }
  },
  async ctx => {
    try {
      if(ctx.update.message.text === 'Твоя статистика') {
        const data = await staticController.static(ctx)
        const chartLabels = data.map(item => item.date.substr(5, 5))
        const chartHours = data.map(item => item.hours)
        const weekInf = data
                          .filter(item => item.label !== undefined)
                          .map(item => `------------------------------------\n<b>${item.label}</b> - ${item.hours}ч ( ${item.date.substr(5, 5)} ).\n`)
                          .reduce((prev, curr) => prev + curr)

        // console.log(weekInf);
        const sumHours = chartHours.reduce((prev, curr) => prev + curr)
        const url = await staticController.getLineChart(chartLabels, chartHours)

        await ctx.replyWithPhoto({url})
        await ctx.reply(ctx.i18n.t('weekStatic', {sumHours}))
        await ctx.replyWithHTML(ctx.i18n.t('weekStaticInf', {weekInf}))

        return ctx.scene.reenter()
      }

      if(ctx.update.message.text === 'Статистика всех') {
        await ctx.reply(ctx.i18n.t('warningAllStatic'))
        const data = await staticController.allStatic(ctx)


        const chartLabels= data.map(item => item.username)
        const thisWeekHours = data.map(item => item.data[0])
        const lastWeekHours = data.map(item => item.data[1])

        const usersInf = data
                          .map(item => `------------------------------------\n<b>${item.userID === ctx.update.message.from.id ? 'Ты' : item.username}:</b>\n  Текущая неделя: ${item.data[0]}ч.\n  Прошлая неделя: ${item.data[1]}ч.\n`)
                          .reduce((prev, curr) => prev + curr)

        const url = await staticController.getRadarChart(chartLabels, thisWeekHours, lastWeekHours)

        await ctx.replyWithPhoto({url})
        await ctx.replyWithHTML(ctx.i18n.t('allStaticInf', {usersInf}))

        return ctx.scene.reenter()
      }

      if(ctx.update.message.text === 'Статистика за сегодня') {
        const data = await staticController.dateStatic(ctx)


        const outputData = data
                            .map(item => `------------------------------------\n<b>${item.label}</b> - ${item.hours}ч.\n`)
                            .reduce((prev, curr) => prev + curr)

        await ctx.replyWithHTML(ctx.i18n.t('todayStaticInf', {outputData}))
        return ctx.scene.reenter()
      }

      if(ctx.update.message.text === 'Покинуть сцену') {
        await ctx.replyWithHTML('<b>Ты покинул сцену</b>')
        return ctx.scene.leave()
      }

      await ctx.reply('Выйди из сцены тогда')
      return ctx.scene.reenter()
    } catch(e) {
      console.log(e)
    }
  },
)
