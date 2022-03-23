require('dotenv').config()

const { Telegraf, Stage, session } = require('telegraf')


const TelegrafI18n = require('telegraf-i18n')
const path = require('path')


const bot = new Telegraf(process.env.token)


const i18n = new TelegrafI18n({
	defaultLanguage: 'ru',
	allowMissing: false, // Default true
	directory: path.resolve(__dirname, 'locales')
})

const startTask = require('./scenes/startTaskScenes.js')
const labelTask = require('./scenes/labelTaskScenes.js')
const checkTaskToday = require('./scenes/checkTaskTodayScenes.js')
const static = require('./scenes/staticScenes.js')
const task = require('./scenes/taskScenes.js')
const putDownTasks = require('./scenes/putDownTasksScenes.js')
const addPlannedTask = require('./scenes/addPlannedTaskScenes.js')
const adminMain = require('./scenes/adminMainScenes.js')
const adminBanned = require('./scenes/adminBannedScenes.js')
const adminSearch = require('./scenes/adminSearchScenes.js')


const stage = new Stage([startTask, labelTask, checkTaskToday, static, task, putDownTasks, addPlannedTask, adminMain, adminBanned, adminSearch])

bot.use(session())
bot.use(i18n.middleware())
bot.use(stage.middleware())

bot.use(require('./middlewares/adminMiddleware'))
bot.use(require('./middlewares/userMiddleware'))




bot.use(require('./composers/startComposer'))
bot.use(require('./composers/uiComposer'))
bot.use(require('./composers/tasksComposer'))
bot.use(require('./composers/staticComposer'))
bot.use(require('./composers/userComposer'))
bot.use(require('./composers/adminComposer'))

bot.on('sticker', (ctx) => console.log(ctx))
bot.on('image', (ctx) => console.log(ctx.update))

bot.launch().then(() => {
	console.log(`bot started on @${bot.options.username}`)
})
