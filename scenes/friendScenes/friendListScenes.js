const WizardScene = require('telegraf/scenes/wizard')

const keyboard = require('../../assets/keyboard')
const userController = require('../../controllers/userController')


module.exports = new WizardScene(
  'friendList',
  async ctx => {
    try {
      const users = await userController.getFriendList(ctx)

      if(users.length !== 0) {
        let friendKeyboard = users.filter(item => item.status !== 'BANNED').map(item => {
          return {text: item.username, callback_data: item.userID}
        })

        friendKeyboard = await friendKeyboard.map((_, i, a) => a.slice(i * 2, i * 2 + 2)).filter((el) => el.length)
        friendKeyboard.push([{text: 'Вернуться назад', callback_data: 'back_to_main'}])

        const {message_id} = await ctx.editMessageText(`<b>Список друзей</b>\nУ тебя всего ${users.length} ${users.length > 1 ? 'друзей' : 'друг'}`, {
          reply_markup: JSON.stringify({
            inline_keyboard: friendKeyboard
          }),
          parse_mode: 'html'
        })

        ctx.session.friendListMessageID = message_id
      }

      return ctx.wizard.next()
    } catch (e) {
      console.log(e)
    }
  },
  async ctx => {
    try {

      const data = ctx.update?.callback_query?.data

      if(data === 'back_to_main') {
        await ctx.deleteMessage(ctx.session.friendListMessageID)
        return ctx.scene.enter('friendMain')
      }

      if(data) {
        const user = await userController.getInfo(data)

        ctx.session.currentFriendUser = user.userID
        await ctx.reply(ctx.i18n.t('friendListItem', {user}), {
          reply_markup: JSON.stringify({
            inline_keyboard: [
              [
                {text: 'Удалить пользователя', callback_data: 'delete'},
                {text: 'Вернуться назад', callback_data: 'back'},
              ]
            ]
          }),
          parse_mode: 'html'
        })

        return ctx.wizard.next()
      }

      return ctx.scene.reenter()

    } catch (e) {
      console.log(e)
    }
  },
  async ctx => {
    try {
      const data = ctx.update?.callback_query?.data


      if(data === 'back') return ctx.scene.reenter()

      if(data === 'delete') {
        const deleteUser = await userController.deletedUser(ctx)

        await ctx.reply(`${deleteUser.message}`)
        await ctx.telegram.sendMessage(ctx.session.currentFriendUser, `Пользователь @${deleteUser.friendItem.user.username} удалил Вас из друзей.`)

        return ctx.scene.reenter()
      }
    } catch (e) {
      console.log(e)
    }
  }
)
