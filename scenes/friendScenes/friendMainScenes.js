const WizardScene = require('telegraf/scenes/wizard')

const keyboard = require('../../assets/keyboard')
const userController = require('../../controllers/userController')



module.exports = new WizardScene(
  'friendMain',
  async ctx => {
    try {
      await ctx.reply('<b>Что ты хочешь сделать?</b>', {
        reply_markup: keyboard.userInfoKeyboard,
        parse_mode: 'html'
      })

      return ctx.wizard.next()
    } catch (e) {
      console.log(e)
    }
  },
  async ctx => {
    try {
      const data = ctx.update?.callback_query?.data

      if(data === 'output') {
        await ctx.editMessageText(ctx.i18n.t('leaveScenes'), {parse_mode: 'html'})
        return ctx.scene.leave()
      }

      if(data === 'friend_list') {
        return ctx.scene.enter('friendList')
      }

      if(data === 'info_self') {
        const user = await userController.getInfo(ctx.from.id)

        const {message_id} = await ctx.editMessageText('<b>Информация о тебе:</b>\n' + ctx.i18n.t('userItem', {user}), {
          parse_mode: 'html',
          reply_markup: JSON.stringify({
            inline_keyboard: [[{text: 'Вернуться назад', callback_data: 'back'}]]
          })
        })

        ctx.session.infoUserMessageID = message_id

        return ctx.wizard.next()
      }

      if(data === 'add_friend') {
        return ctx.scene.enter('friendAdd')
      }
    } catch (e) {
      console.log(e)
    }
  },
  async ctx => {
    try {
      const data = ctx.update?.callback_query?.data

      if(data === 'back') {
        await ctx.deleteMessage(ctx.session.infoUserMessageID)
        return ctx.scene.reenter()
      }
      return false
    } catch (e) {
      console.log(e)
    }
  }
)
