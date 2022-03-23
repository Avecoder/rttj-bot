const { Composer } = require('telegraf')
require('dotenv').config()
const {Markup} = require('telegraf')

const taskController = require('../controllers/taskController')

const composer = new Composer()

composer.command('ui', async ctx => {
  try {

    ctx.reply(
      ctx.i18n.t('UI'),
      {
       reply_markup: {
           inline_keyboard: [
               [ { text: "Перейти", url: `https://avecoder.github.io/` } ]
           ]
       }
     }
    )

  } catch (e) {
    console.log(e)
  }
})

module.exports = composer
