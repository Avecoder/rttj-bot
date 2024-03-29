const WizardScene = require('telegraf/scenes/wizard')

const staticController = require('../../controllers/staticController')
const dateAssets = require('../../assets/dateAssets')
const keyboard = require('../../assets/keyboard')
const { Keyboard } = require('telegram-keyboard')

module.exports = new WizardScene(
  'staticScenes',
  async ctx => {
    try {
      await ctx.replyWithHTML('<b>Выбери нужную статистику или покинь сцену</b>', {
        reply_markup: keyboard.staticKeyboard
      })

      return ctx.wizard.next()
    } catch(e) {
      console.log(e)
    }
  },
  async ctx => {
    try {
      const data = ctx.update?.callback_query?.data

      if(data === 'back') return ctx.scene.reenter()

      if(data === 'your_static') {
        let yourStatic = await staticController.static(ctx)


        const weekInf = await yourStatic.filter(item => item.label !== undefined).map(item => {
          return {
            hours: (item.hours).toFixed(1),
            date: dateAssets.dMDate(item.date),
            label: item.label
          }
        })


        const mergeDataset = arr => {
          for(let [i, item] of arr.entries()) {
              if(item.date === arr[i - 1]?.date) {
                item.hours += arr[i - 1]?.hours
                arr.splice(i - 1, 1)
              }
          }
          return arr
        }

        while(yourStatic.length > 7) userDataset = mergeDataset(yourStatic)

        const chartLabels = await yourStatic.map(item => item.date.substr(5, 5))
        const chartHours = await yourStatic.map(item => item.hours)


        const sumHours = chartHours.reduce((prev, curr) => prev + curr).toFixed(1)
        const url = await staticController.getLineChart(chartLabels, chartHours)



        await ctx.editMessageText(ctx.i18n.t('weekStatic', {sumHours}))

        for(let item of weekInf) {
          await ctx.replyWithHTML(ctx.i18n.t('userStatic', {item}))
        }


        await ctx.replyWithPhoto({url}, {
          reply_markup: JSON.stringify({inline_keyboard: [[{text: 'Вернуться назад', callback_data: 'back'}]]})
        })


        return false
      }

      if(data === 'all_static') {
        await ctx.editMessageText(ctx.i18n.t('warningAllStatic'))
        let all = await staticController.allStatic(ctx)


        all = all.filter(item => item.status !== 'BANNED')

        const chartLabels= all.map(item => item.username)
        const thisWeekHours = all.map(item => item.data[0])
        const lastWeekHours = all.map(item => item.data[1])


        const url = await staticController.getRadarChart(chartLabels, thisWeekHours, lastWeekHours)

        await ctx.editMessageText('<b>Статистика всех</b>', {parse_mode: 'html'})

        if(all.length < 2) {
          await ctx.reply('У тебя нет друзей')
          return ctx.scene.reenter()
        }

        for(let item of all) {
          item.data[0] = item.data[0].toFixed(1)
          item.data[1] = item.data[1].toFixed(1)
          await ctx.replyWithHTML(ctx.i18n.t('friendStaticItem', {item}))
        }

        await ctx.replyWithPhoto({url}, {
          reply_markup: JSON.stringify({inline_keyboard: [[{text: 'Вернуться назад', callback_data: 'back'}]]})
        })


        return false
      }

      if(data === 'today_static') {
        let today = await staticController.dateStatic(ctx)
        today = today.filter(item => item.isCompleted)

        if(today.length === 0) {
          await ctx.editMessageText('Сегодня ты ничего не делал.', {
            reply_markup: JSON.stringify({inline_keyboard: [[{text: 'Вернуться назад', callback_data: 'back'}]]})
          })
        }


        for(let i = 0; i < today.length; i++) {
          let item = today[i]
          console.log(item)
          if(i === (today.length - 1)) {
            await ctx.replyWithHTML(ctx.i18n.t('todayStaticItem', {item}), {
              reply_markup: JSON.stringify({
                inline_keyboard: [[{text: 'Вернуться назад', callback_data: 'back'}]]
              })
            })
          }
          else await ctx.replyWithHTML(ctx.i18n.t('todayStaticItem', {item}))
        }

        return false
      }

      if(data === 'output') {
        await ctx.editMessageText(ctx.i18n.t('leaveScenes'))
        return ctx.scene.leave()
      }

    } catch(e) {
      console.log(e)
    }
  },
)
