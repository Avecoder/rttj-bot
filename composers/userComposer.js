const { Composer } = require('telegraf')
require('dotenv').config()



const composer = new Composer()

composer.command('info', async ctx => {
  try {
    await ctx.scene.enter('friendMain')

  } catch (e) {
    console.log(e)
  }
})

module.exports = composer
