const WizardScene = require('telegraf/scenes/wizard')

const keyboard = require('../../assets/keyboard')
const userController = require('../../controllers/userController')



module.exports = new WizardScene(
  'friendAdd',
  async ctx => {
    try {
      await ctx.editMessageText('Введите ник пользователя:', {
        reply_markup: JSON.stringify({
          inline_keyboard: [
            [{text: 'Вернуться назад', callback_data: 'back'}]
          ]
        })
      })

      return ctx.wizard.next()
    } catch (e) {
      console.log(e)
    }
  },
  async ctx => {
    try {
      const data = ctx.update?.callback_query?.data

      if(data === 'back') {
        await ctx.deleteMessage()
        return ctx.scene.enter('friendMain')
      }

      const mess = ctx.update?.message?.text

      if(mess) {
        const {friends, userInfo} = await userController.getListFriend(ctx, mess)
        ctx.session.friendList = friends

        if(friends.length !== 0) {
          let currentKeyboard = friends.map(item => {
            return {text: item.username, callback_data: item.userID}
          })

          currentKeyboard = await currentKeyboard.map((_, i, a) => a.slice(i * 2, i * 2 + 2)).filter((el) => el.length)
    			currentKeyboard.push([{text: 'Вернуться назад', callback_data: 'back'}])

          await ctx.reply('Выберите пользователя:', {
            reply_markup: JSON.stringify({
              inline_keyboard: currentKeyboard
            })
          })

          return ctx.wizard.next()
        } else {
          await ctx.reply('Пользователь не найден.\nПопробуй еще раз:', {
            reply_markup: JSON.stringify({
              inline_keyboard: [[{text: 'Вернуться назад', callback_data: 'back'}]]
            })
          })
          return false
        }
      }

      return ctx.scene.reenter()
    } catch (e) {
      console.log(e)
    }
  },
  async ctx => {
    try {
      const data = ctx.update?.callback_query?.data
      if(data === 'back') {
        await ctx.deleteMessage()
        return ctx.scene.enter('friendMain')
      }

      if(data) {
        const friend = ctx.session.friendList.filter(item => item.userID == data)[0]
        const friendData = friend.friendsList.filter(item => item.friendID == ctx.from.id)

        ctx.session.currentFriendUser = friend.userID

        if(friendData.length === 0) {
          await ctx.editMessageText(`Отправить заявку в друзья пользователю <b>${friend.username}</b>`, {
            reply_markup: JSON.stringify({
              inline_keyboard: [
                [{text: 'Отправить', callback_data: 'send_request'}],
                [{text: 'Вернуться назад', callback_data: 'back'}]
              ]
            }),
            parse_mode: 'html'
          })
        } else {
          await ctx.editMessageText(`Пользователь <b>${friend.username}</b> отправил вам уже заявку.`, {
            reply_markup: JSON.stringify({
              inline_keyboard: [
                [
                  {text: 'Принять', callback_data: 'accept_request'},
                  {text: 'Отклонить', callback_data: 'reject_request'}
                ],
                [{text: 'Вернуться назад', callback_data: 'back'}]
              ]
            }),
            parse_mode: 'html'
          })
        }


        return ctx.wizard.next()
      }

      return false
    } catch (e) {
      console.log(e)
    }
  },
  async ctx => {
    try {
      const data = ctx.update?.callback_query?.data

      if(data === 'back') {
        return ctx.scene.reenter()
      }

      if(data === 'send_request') {
        const newFriend = await userController.addFriend(ctx)


        await ctx.editMessageText(`Вы отправили пользователю <b>${newFriend.friend.username}</b> заявку в друзья.`, {parse_mode: 'html'})
        await ctx.telegram.sendMessage(ctx.session.currentFriendUser, ctx.i18n.t('sendRequest', {newFriend}), {parse_mode: 'html'})

        return ctx.scene.enter('friendMain')
      }

      if(data === 'accept_request') {
        const newFriend = await userController.addFriend(ctx)


        await ctx.editMessageText(`Вы приняли заявку ${newFriend.friend.username}.`, {parse_mode: 'html'})
        await ctx.telegram.sendMessage(ctx.session.currentFriendUser, `Пользователь <b>${newFriend.user.username}</b> принял Вашу заявку.`, {parse_mode: 'html'})

        return ctx.scene.enter('friendMain')
      }

      if(data === 'reject_request') {
        const deleteUser = await userController.deletedUser(ctx)

        await ctx.editMessageText(`Вы отклонили заявку ${deleteUser.friendItem.friend.username}.`, {parse_mode: 'html'})
        await ctx.telegram.sendMessage(ctx.session.currentFriendUser, `Пользователь <b>${deleteUser.friendItem.user.username}</b> отклонил Вашу заявку.`, {parse_mode: 'html'})
        return ctx.scene.enter('friendMain')
      }

      return false
    } catch (e) {
      console.log(e)
    }
  }
)
