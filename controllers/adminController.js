const axios = require('axios')


class AdminController {
	async getUsersList(ctx) {
		try {
			const res = await axios.post(`${process.env.mainUrl}/users-list` ,{
				status: ctx.session.userStatus,
				count: 8
			})

			return res.data.users.filter(item => item.userID !== ctx.update.callback_query.from.id)
		} catch(e) {
			console.log(e)
		}
	}


	async getStatus(ctx) {
		const user = await axios.get(`${process.env.mainUrl}/info/${ctx.update.message.from.id}`)

		return user.data.status
	}

	async bannedUser(ctx, userID) {
		userID = parseInt(userID)

		const user = await axios.post(`${process.env.mainUrl}/banned`, {
			status: ctx.session.userStatus,
			userID
		})

		return user.data.message
	}

	async unbannedUser(ctx, userID) {
		userID = parseInt(userID)

		const user = await axios.post(`${process.env.mainUrl}/unbanned`, {
			status: ctx.session.userStatus,
			userID
		})

		return user.data.message
	}
}

module.exports = new AdminController()