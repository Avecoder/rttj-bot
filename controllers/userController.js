const axios = require('axios')


class UserController {
	async getInfo(ctx) {
		try {
			const res = await axios.get(`${process.env.mainUrl}/info/${ctx.update.message.from.id}`)

			return res.data
		} catch(e) {
			console.log(e)
		}
	}
}

module.exports = new UserController()