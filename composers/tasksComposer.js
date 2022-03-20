const { Composer } = require('telegraf')
require('dotenv').config()

const composer = new Composer()

composer.command('tasks', async ctx => {
  try {
    await ctx.scene.enter('taskScenes')

  } catch (e) {
    console.log('cant enter start learn scene', e)
  }
})

module.exports = composer
