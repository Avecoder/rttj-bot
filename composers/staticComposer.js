const { Composer } = require('telegraf')

const composer = new Composer()

composer.command('static', async ctx => {
  try {
    await ctx.scene.enter('staticScenes')
  } catch(e) {
    console.log(e)
  }
})


module.exports = composer
