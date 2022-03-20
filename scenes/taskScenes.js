const WizardScene = require('telegraf/scenes/wizard')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
// const staticController = require('../controllers/staticController')
const { Keyboard } = require('telegram-keyboard')
const {Calendar} = require('@michpl/telegram-calendar')

module.exports = new WizardScene(
  'taskScenes',
  async ctx => {
    try {
      await ctx.replyWithHTML('<b>Выбери чем хочешь заниматься или покинь сцену</b>',
        Keyboard.reply(['Начать заниматься', 'Проставить уроки'],
        {columns: 2})
      )

      return ctx.wizard.next()
    } catch(e) {
      console.log(e)
    }
  },
  async ctx => {
    try {
      if(ctx.update.message.text === 'Начать заниматься') return ctx.scene.enter('startTask')
      if(ctx.update.message.text === 'Проставить уроки') return ctx.scene.enter('putDownTasks')
      console.log('GG')
      return ctx.scene.leave()
    } catch(e) {
      console.log(e)
    }
  }
)
