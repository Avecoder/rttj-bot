const { Composer } = require('telegraf')
require('dotenv').config()


const composer = new Composer()

composer.command('admin', async ctx => {
  try {
    await ctx.scene.enter('adminMain')
  } catch (e) {
    console.log(e)
  }
})

module.exports = composer
