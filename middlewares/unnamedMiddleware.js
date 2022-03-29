const unnamedMiddleware = async (ctx, next) => {
	
	if(ctx.update?.message?.text && ctx.from?.username) return next()
	else {
		await ctx.reply(`У тебя нет ника, ты не можешь пользоваться ботом.`)
		return false
	}
	
}

module.exports = unnamedMiddleware