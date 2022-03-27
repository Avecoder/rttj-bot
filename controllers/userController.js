const axios = require('axios')


class UserController {
	async getInfo(userID) {
		try {
			const res = await axios.get(`${process.env.mainUrl}/info/${userID}`)

			return res.data
		} catch(e) {
			console.log(e)
		}
	}

	async getFriendList(ctx) {
		try {
			const res = await axios.get(`${process.env.mainUrl}/friend-list/${ctx.from.id}`)

			const users = []
			for(let item of res.data.friendsList) {
				const user = await axios.get(`${process.env.mainUrl}/info/${item.friendID}`)
				await users.push(user.data)
			}

			return users
		} catch(e) {
			console.log(e)
		}
	}

	async deletedUser(ctx) {
		try {
			const res = await axios.post(`${process.env.mainUrl}/delete-friend`, {
				userID: ctx.from.id,
				friendID: ctx.session.currentFriendUser
			})

			return res.data
		} catch (e) {
			console.log(e)
		}
	}

	async getListFriend(ctx, username) {
		try {
			const res = await axios.get(`${process.env.mainUrl}/info-by-username/${username.toLowerCase().trim()}`)

			const userInfo = await axios.get(`${process.env.mainUrl}/info/${ctx.from.id}`)
			const userID = userInfo.data.userID


			const userFriendsList = userInfo.data.friendsList.filter(item => {
				return item.isMutually || item.fromRequest === ctx.from.id
			}).map(item => item.friendID)

			const userFriendsFilters = new Set(userFriendsList)
			const friends = res.data
														.filter(item => !userFriendsFilters.has(item.userID))
														.filter(item => item.status !== 'BANNED')
														.filter(item => item.userID !== ctx.from.id)

			return {
				friends,
				userInfo: userInfo.data
			}
		} catch (e) {
			console.log(e)
		}
	}

	async addFriend(ctx){
		try {

			const res = await axios.post(`${process.env.mainUrl}/request-friend`, {
				userID: ctx.from.id,
				friendID: ctx.session.currentFriendUser
			})

			return res.data
		} catch (e) {
			console.log(e)
		}
	}
}

module.exports = new UserController()
