const WizardScene = require('telegraf/scenes/wizard')
const keyboard = require('../../assets/keyboard')



const adminController = require('../../controllers/adminController')



module.exports = new WizardScene(
	'adminUserList',
	async ctx => {
		try {

			const users = await adminController.getUsersList(ctx)
			ctx.session.allUsers = users


			let currentKeyboard = users.map(item => {
				return {text: item.username, callback_data: item.userID}
			})

			currentKeyboard = await currentKeyboard.map((_, i, a) => a.slice(i * 2, i * 2 + 2)).filter((el) => el.length)
			currentKeyboard.push(
				[{text: 'Добавить еще пользователей', callback_data: 'add_more'}],
				[{text: 'Вернуться назад', callback_data: 'back'}]
			)

			await ctx.reply('<b>Список пользователей</b>', {
				parse_mode: 'html',
				reply_markup: JSON.stringify({
					inline_keyboard: currentKeyboard
				})
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

			if(data === 'add_more') {
				ctx.session.count += 10
				await ctx.deleteMessage()
				return ctx.scene.reenter()
			}

			if(data) {
				const user = ctx.session.allUsers.filter(item => item.userID == data)[0]

				ctx.session.currentUserID = user.userID

				const currentKeyboard = await user.status === 'BANNED' ? keyboard.adminBannedUserKeyboard : keyboard.adminUnbannedUserKeyboard

				await ctx.editMessageText(ctx.i18n.t('userItem', {user}), {
					parse_mode: 'html',
					reply_markup: currentKeyboard
				})

				return ctx.wizard.next()
			}
			return false
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
		} catch (e) {
			console.log(e)
		}
	}
)
