const axios = require('axios')


class AdminController {
	async getUsersList(ctx) {
		try {
			const res = await axios.post(`${process.env.mainUrl}/users-list` ,{
				status: ctx.session.userStatus,
				count: ctx.session.count
			})

			return res.data.users.filter(item => item.userID !== ctx.from.id)
		} catch(e) {
			console.log(e)
		}
	}


	async getStatus(ctx) {
		try {
			const userID = ctx.from.id
			const user = await axios.get(`${process.env.mainUrl}/info/${userID}`)

			return user.data.status
		} catch(e) {
			console.log(e)
		}
	}

	async bannedUser(ctx) {
		try {
			const userID = parseInt(ctx.session.currentUserID)


			const user = await axios.post(`${process.env.mainUrl}/banned`, {
				status: ctx.session.userStatus,
				userID
			})

			return user.data.message
		} catch(e) {
			console.log(e)
		}
	}

	async unbannedUser(ctx) {
		try {
			const userID = parseInt(ctx.session.currentUserID)

			// console.log(ctx.session)

			const user = await axios.post(`${process.env.mainUrl}/unbanned`, {
				status: ctx.session.userStatus,
				userID
			})

			return user.data.message
		} catch(e) {
			console.log(e)
		}
	}

	async userInfo(userID) {
		try {
			const user = await axios.get(`${process.env.mainUrl}/info/${userID}`)

			return user.data
		} catch(e) {
			console.log(e)
		}
	}

	async searchUser(ctx) {
		try {
			const username = ctx.update?.message?.text

			if(username) {
				const user = await axios.post(`${process.env.mainUrl}/find-users-username`, {
					status: ctx.session.userStatus,
					username
				})

				return user.data
			} else {
				return []
			}
		} catch(e) {
			console.log(e)
		}
	}

	async changeStatus(ctx, substatus) {
		try {
			const userID = parseInt(ctx.session.currentUserID)

			console.log(userID)
			console.log(ctx.session.userStatus)
			console.log(substatus)

			const res = await axios.post(`${process.env.mainUrl}/change-user-status`, {
				userID,
				substatus,
				status: ctx.session.userStatus
			})

			console.log(res.data)

			return res.data
		} catch(e) {
			console.log(e)
		}
	}
}

module.exports = new AdminController()
