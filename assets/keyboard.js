const hours = JSON.stringify({
	inline_keyboard: [
		[
			{ text: '1', callback_data: 1 },
    		{ text: '1.5', callback_data: 1.5 },
    		{ text: '2', callback_data: 2 },
    		{ text: '2.5', callback_data: 2.5 },
    		{ text: '3', callback_data: 3 },
    		{ text: '3.5', callback_data: 3.5 }
		],
		[
			{ text: '4', callback_data: 4 },
    		{ text: '4.5', callback_data: 4.5 },
    		{ text: '5', callback_data: 5 },
    		{ text: '5.5', callback_data: 5.5 },
    		{ text: '6', callback_data: 6 },
    		{ text: '6.5', callback_data: 6.5 }
		],		
		[
			{ text: 'Изменить дату', callback_data: 'change_date' },
		],
	]
})

const access = JSON.stringify({
	inline_keyboard: [
		[
			{ text: 'Да', callback_data: 'yes' },
    		{ text: 'Нет', callback_data: 'no' }
		]
	]
})

const taskKeyboard = JSON.stringify({
	inline_keyboard: [
		[
			{ text: 'Начать заниматься', callback_data: 'start' },
    		{ text: 'Проставить уроки', callback_data: 'add_task' },
		],		
		[
			{ text: 'Запланированные задания', callback_data: 'planned_task' },
    		{ text: 'Выйти', callback_data: 'output' },
		],
	]
})

const adminMainKeyboard = JSON.stringify({
	inline_keyboard: [
		[
			{ text: 'Список пользователей', callback_data: 'users_list' },
    		{ text: 'Поиск пользователя', callback_data: 'users_search' },
		],		
		[
    		{ text: 'Выйти', callback_data: 'output' },
		],
	]
})


const adminUnbannedUserKeyboard = {
	inline_keyboard: [
		[
    		{ text: 'Забанить', callback_data: 'banned'},
    		{ text: 'Поменять статус', callback_data: 'change_status'},
		]
	]
}
const adminBannedUserKeyboard = {
	inline_keyboard: [
		[
    		{ text: 'Забанить', callback_data: 'banned'},
    		{ text: 'Поменять статус', callback_data: 'change_status'},
		]
	]
}




module.exports = {
	hours,
	access,
	taskKeyboard,
	adminMainKeyboard,
	adminUnbannedUserKeyboard,
	adminBannedUserKeyboard
}