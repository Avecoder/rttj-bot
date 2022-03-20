const Markup = require('telegraf/markup')
const reaction = require('../assets/reactionAssets')
const axios = require('axios')


class TaskController {
  async checkTaskToday(ctx) {
    const d = new Date()

    const currentDate = '2022-02-25'

    let taskToday = await axios.get(`${process.env.mainUrl}/get-task-date/${ctx.update.callback_query.from.id}/${currentDate}`)

    const markup = taskToday.data.map(task => {
      return Markup.callbackButton(task.label, task.taskID)
    })

    taskToday = taskToday.data

    return {
      markup,
      taskToday
    }
  }


  async addHoursTask(ctx) {
    const data = await axios.post(`${process.env.mainUrl}/add-today-task`, {
      taskID: ctx.update.callback_query.data,
      hours: ctx.session.allTime
    })

    const task = data.data
    console.log(task.newTask)

    await ctx.reply(ctx.i18n.t('taskTodayCompletedTrue', {task}))

    return ctx.scene.leave()
  }

  async completeTask(ctx) {
    const data = await axios.post(`${process.env.mainUrl}/complete-today-task`, {
      taskID: ctx.update.callback_query.data,
      hours: ctx.session.allTime
    })

    const task = data.data
    console.log(task.newTask)

    await ctx.reply(ctx.i18n.t('taskTodayUncompletedTrue', {task, ctx}))

    return ctx.scene.leave()
  }

  async saveTask(ctx) {
    const d = new Date()

    const data = await axios.post(`${process.env.mainUrl}/add-task`, {
      label: ctx.session.taskLabel,
      hours: ctx.session.allTime,
      isCompleted: true,
      userID: ctx.update.callback_query.from.id,
      date: `${d.getFullYear()}-${(d.getMonth()+1) < 10 ? '0'+(d.getMonth()+1): (d.getMonth()+1)}-${d.getDate() < 10 ? '0' + d.getDate() : d.getDate()}`
    })
  }


  async getReaction(ctx) {
    if(ctx.session.allTime >= 30 && ctx.session.allTime < 60) {
      await ctx.reply(reaction[0].title)
      await ctx.replyWithSticker(reaction[0].stickerId)
    }
    if(ctx.session.allTime >= 60 && ctx.session.allTime < 120) {
      await ctx.reply(reaction[1].title)
      await ctx.replyWithSticker(reaction[1].stickerId)
    }
    if(ctx.session.allTime >= 120 && ctx.session.allTime < 180) {
      await ctx.reply(reaction[2].title)
      await ctx.replyWithSticker(reaction[2].stickerId)
    }
    if(ctx.session.allTime >= 180) {
      await ctx.reply(reaction[3].title)
      await ctx.replyWithSticker(reaction[3].stickerId)
    }
  }
}


module.exports = new TaskController()
