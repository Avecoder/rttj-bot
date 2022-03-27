const { Composer } = require('telegraf')
require('dotenv').config()
const {Markup} = require('telegraf')
const axios = require('axios')

const taskController = require('../controllers/taskController')

const composer = new Composer()

composer.command('ui', async ctx => {
  try {
    const token = await axios.post(`${process.env.mainUrl}/get-token`, {
      userID: ctx.from.id
    })
    await ctx.reply(ctx.i18n.t('UI'), {
       reply_markup: {
           inline_keyboard: [[{ text: "Перейти", url: `${process.env.uiLink}?user=${token.data.token}` } ]]
       }
     })

  } catch (e) {
    console.log(e)
  }
})

module.exports = composer
