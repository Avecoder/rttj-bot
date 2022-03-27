const WizardScene = require('telegraf/scenes/wizard')
const keyboard = require('../../assets/keyboard')


const adminController = require('../../controllers/adminController')


module.exports = new WizardScene(
	'adminSearch',

	async ctx => {
		try {

			const data = ctx.update?.callback_query?.data

			if(data === 'back') {
				return ctx.scene.enter('adminMain')
			}

			const users = await adminController.searchUser(ctx)

			usersCallbackData = await users.map(item => {
				return {
					text: item.username,
					callback_data: item.userID
				}
			})
			usersCallbackData = await usersCallbackData.map((_, i, a) => a.slice(i * 2, i * 2 + 2)).filter((el) => el.length)
			usersCallbackData.push([{text: 'Вернуться назад', callback_data: 'back'}])

			if(users.length !== 0) {
				await ctx.reply('Список пользователей', {
					reply_markup: JSON.stringify({
						inline_keyboard: usersCallbackData
					})
				})
			}


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

			if(data) {
				const user = await adminController.userInfo(data)

				ctx.session.currentUserID = user.userID

				const currentKeyboard = await user.status === 'BANNED' ? keyboard.adminBannedUserKeyboard : keyboard.adminUnbannedUserKeyboard



				await ctx.editMessageText(ctx.i18n.t('userItem', {user}), {
					reply_markup: JSON.stringify(currentKeyboard),
					parse_mode: 'html'
				})

				return ctx.wizard.next()
			}


			return ctx.scene.reenter()
		} catch(e) {
			console.log(e)
		}
	},
	async ctx => {
		try {
			const data = ctx.update?.callback_query?.data

			if(data === 'banned') {

				const message = await adminController.bannedUser(ctx)
				const user = await adminController.userInfo(ctx.session.currentUserID)

				const currentKeyboard = await keyboard.adminBannedUserKeyboard

				await ctx.editMessageText(ctx.i18n.t('userItem', {user}), {
					reply_markup: JSON.stringify(currentKeyboard),
					parse_mode: 'html'
				})

				return false
			}

			if(data === 'unbanned') {

				const message = await adminController.unbannedUser(ctx)
				const user = await adminController.userInfo(ctx.session.currentUserID)

				const currentKeyboard = await keyboard.adminUnbannedUserKeyboard

				await ctx.editMessageText(ctx.i18n.t('userItem', {user}), {
					reply_markup: JSON.stringify(currentKeyboard),
					parse_mode: 'html'
				})

				return false
			}

			if(data === 'change_status') return ctx.scene.enter('adminChangeStatus')

			if(data === 'back') {
				await ctx.deleteMessage()
				return ctx.scene.enter('adminMain')
			}
			return false
		} catch(e) {
			console.log(e)
		}
	}
)
