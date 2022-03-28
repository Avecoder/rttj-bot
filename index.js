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


const startTask = require('./scenes/taskScenes/startTaskScenes.js')
const labelTask = require('./scenes/taskScenes/labelTaskScenes.js')
const checkTaskToday = require('./scenes/taskScenes/checkTaskTodayScenes.js')
const task = require('./scenes/taskScenes/taskScenes.js')
const putDownTasks = require('./scenes/taskScenes/putDownTasksScenes.js')
const addPlannedTask = require('./scenes/taskScenes/addPlannedTaskScenes.js')
const plannedTaskList = require('./scenes/taskScenes/plannedTaskListScenes.js')

const static = require('./scenes/staticScenes/staticScenes.js')

const adminMain = require('./scenes/adminScenes/adminMainScenes.js')
const adminUserList = require('./scenes/adminScenes/adminUserListScenes.js')
const adminSearch = require('./scenes/adminScenes/adminSearchScenes.js')
const adminChangeStatus = require('./scenes/adminScenes/adminChangeStatusScenes.js')
const adminSendAllMessage = require('./scenes/adminScenes/adminSendAllMessageScenes.js')

const friendMain = require('./scenes/friendScenes/friendMainScenes.js')
const friendList = require('./scenes/friendScenes/friendListScenes.js')
const friendAdd = require('./scenes/friendScenes/friendAddScenes.js')


const stage = new Stage([
	startTask,
	labelTask,
	checkTaskToday,
	static,
	task,
	putDownTasks,
	addPlannedTask,
	adminMain,
	adminUserList,
	adminSearch,
	adminChangeStatus,
	friendMain,
	adminSendAllMessage,
	friendList,
	friendAdd,
	plannedTaskList
])

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




bot.launch().then(() => {
	console.log(`bot started on @${bot.options.username}`)
})
