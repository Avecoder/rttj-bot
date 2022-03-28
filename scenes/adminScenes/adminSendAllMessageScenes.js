const WizardScene = require('telegraf/scenes/wizard')
const keyboard = require('../../assets/keyboard')

const adminController = require('../../controllers/adminController')



module.exports = new WizardScene(
  'adminSendAllMessage',
  async ctx => {
    try {
      await ctx.editMessageText('Напиши сообщение для всех.', {
        reply_markup: {
          inline_keyboard: [
            [{text: 'Вернуться назад', callback_data: 'back'}]
          ]
        }
      })

      return ctx.wizard.next()
    } catch(e) {
      console.log(e)
    }
  },
  async ctx => {
    try {
      const data = ctx.update?.callback_query?.data

      if(data === 'back') {
        await ctx.deleteMessage()
        return ctx.scene.enter('adminMain')
      }

      const mess = ctx.update?.message?.text

      if(mess.trim().length > 5) {
        const users = await adminController.getUsersList(ctx)

        const usersID = await users.filter(item => item.status !== 'BANNED').map(item => item.userID)

        const allMessage = `<b>Сообщение от админа:</b>\n${mess}`

        for(let userID of usersID) {
          await ctx.telegram.sendMessage(userID, allMessage, {parse_mode: 'html'})
        }

        await ctx.reply('Сообщение отправлено успешно.', {
          reply_markup: JSON.stringify({
            inline_keyboard: [[{text: 'Вернуться назад', callback_data: 'back'}]]
          })

        })
        return ctx.scene.reenter()
      }

      return false
    } catch(e) {
      console.log(e)
    }
  },
)
