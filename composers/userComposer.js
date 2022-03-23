const { Composer } = require('telegraf')
require('dotenv').config()

const userController = require('../controllers/userController')

const composer = new Composer()

composer.command('info', async ctx => {
  try {
 
  	const user = await userController.getInfo(ctx)

    await ctx.replyWithHTML('<b>Информация о тебе:</b>')
    await ctx.replyWithHTML(ctx.i18n.t('userInfo', {user}))
  } catch (e) {
    console.log(e)
  }
})

module.exports = composer
