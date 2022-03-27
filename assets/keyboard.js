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
			{ text: '7', callback_data: 7 },
    		{ text: '7.5', callback_data: 7.5 },
    		{ text: '8', callback_data: 8 },
    		{ text: '8.5', callback_data: 8.5 },
    		{ text: '9', callback_data: 9 },
    		{ text: '9.5', callback_data: 9.5 }
		],
		[
			{ text: 'Изменить дату', callback_data: 'change_date' },
		],
		[
			{text: 'Вернуться назад', callback_data: 'back'}
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
			{ text: 'Написать сообщение всем', callback_data: 'send_all_message' },
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
		],
		[{text: 'Вернуться назад', callback_data: 'back'}]
	]
}
const adminBannedUserKeyboard = {
	inline_keyboard: [
		[
    		{ text: 'Разбанить', callback_data: 'unbanned'},
    		{ text: 'Поменять статус', callback_data: 'change_status'},
		],
		[{text: 'Вернуться назад', callback_data: 'back'}]
	]
}


const staticKeyboard = JSON.stringify({
	inline_keyboard: [
		[
			{text: 'Твоя статистика', callback_data: 'your_static'},
			{text: 'Статистика всех', callback_data: 'all_static'}
		],
		[
			{text: 'За сегодня', callback_data: 'today_static'},
			{text: 'Выйти', callback_data: 'output'}
		]
	]
})

const userInfoKeyboard = JSON.stringify({
	inline_keyboard: [
		[
			{text: 'Просмотреть друзей', callback_data: 'friend_list'},
			{text: 'Добавить друга', callback_data: 'add_friend'}
		],
		[
			{text: 'Узнать информацию о себе', callback_data: 'info_self'},
		],
		[
			{text: 'Выйти', callback_data: 'output'}
		]
	]
})



module.exports = {
	hours,
	access,
	taskKeyboard,
	adminMainKeyboard,
	adminUnbannedUserKeyboard,
	adminBannedUserKeyboard,
	staticKeyboard,
	userInfoKeyboard
}
