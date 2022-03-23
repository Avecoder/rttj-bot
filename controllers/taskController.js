const Markup = require('telegraf/markup')
const reaction = require('../assets/reactionAssets')
const axios = require('axios')
const dateAssets = require('../assets/dateAssets')


class TaskController {
  async checkTaskToday(ctx) {
    try {
      const d = new Date()

      const currentDate = dateAssets.dashDate(d)

      let taskToday = await axios.get(`${process.env.mainUrl}/get-task-date/${ctx.update.callback_query.from.id}/${currentDate}`)

      const markup = taskToday.data.map(task => {
        return Markup.callbackButton(task.label, task.taskID)
      })

      taskToday = taskToday.data

      return {
        markup,
        taskToday
      }
    } catch(e) {
      console.log(e)
    }
  }


  async addHoursTask(ctx) {
    try {
        const data = await axios.post(`${process.env.mainUrl}/add-today-task`, {
        taskID: ctx.update.callback_query.data,
        hours: ctx.session.allTime
      })

      const task = data.data
      console.log(task.newTask)

      await ctx.reply(ctx.i18n.t('taskTodayCompletedTrue', {task}))

      return ctx.scene.leave()
    } catch(e) {
      console.log(e)
    }
  }

  async completeTask(ctx) {
    try {
        const data = await axios.post(`${process.env.mainUrl}/complete-today-task`, {
        taskID: ctx.update.callback_query.data,
        hours: ctx.session.allTime
      })

      const task = data.data
      console.log(task.newTask)

      await ctx.reply(ctx.i18n.t('taskTodayUncompletedTrue', {task, ctx}))

      return ctx.scene.leave()
    } catch(e) {
      console.log(e)
    }
  }

  async saveTask(ctx) {
    try {
      const d = new Date()

      const data = await axios.post(`${process.env.mainUrl}/add-task`, {
        label: ctx.session.taskLabel,
        hours: ctx.session.allTime,
        isCompleted: true,
        userID: ctx.update.callback_query.from.id,
        date: dateAssets.dashDate(d)
      })
    } catch(e) {
      console.log(e)
    }
  }

  async addPlannedTask(ctx) {

    try {
      const res = await axios.post(`${process.env.mainUrl}/add-task`, {
        label: ctx.session.taskLabel,
        primordialHours: ctx.session.allTime,
        hours: ctx.session.allTime,
        userID: ctx.update.callback_query.from.id,
        date: dateAssets.dashDate(ctx.session.currentDate)
      })

      return res.data
    } catch(e) {
      console.log(e)
    }
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

  async getPlannedTask(ctx) {
    try {
      const firstDate = new Date()
      const secondDate = new Date(new Date(firstDate).getTime() + 1000 * 60 * 60 *24 * 14)

      const res = await axios.post(`${process.env.mainUrl}/get-task-during-period`, {
        userID: ctx.update.callback_query.from.id,
        firstDate: dateAssets.dashDate(firstDate),
        secondDate: dateAssets.dashDate(secondDate)
      })

      return res.data
    } catch(e) {
      console.log(e)
    }
  }
}


module.exports = new TaskController()
