const axios = require('axios')
const QuickChart = require('quickchart-js')

const lineChart = require('../charts/lineChart')
const radarChart = require('../charts/radarChart')
const dateAssets = require('../assets/dateAssets')

class StaticController {
  async static(ctx) {
    try {
      const today = new Date()
      const lastWeekDay = new Date(today.getTime() - 1000*60*60*24*7)

      const res = await axios.post(`${process.env.mainUrl}/data`, {
        firstDate: dateAssets.dashDate(lastWeekDay),
        secondDate: dateAssets.dashDate(today),
        userID: ctx.update.callback_query.from.id
      })
      return res.data
    } catch (e) {
      console.log(e);
    }
  }

  async getLineChart(chartLabels, chartHours) {
    const myChart = new QuickChart()

    lineChart.data.labels = chartLabels
    lineChart.data.datasets[0].data = chartHours
    myChart
    .setConfig({
      type: 'line',
      data: lineChart.data,
      options: lineChart.options
    })
    .setWidth(1200)
    .setHeight(700)
    .setBackgroundColor('#0D0D0D')

    return myChart.getUrl()
  }

  async allStatic(ctx) {
    try {
      const today = new Date()
      const lastWeekDay = new Date(today.getTime() - 1000*60*60*24*14)


      const res = await axios.post(`${process.env.mainUrl}/data-all`, {
        firstDate: dateAssets.dashDate(lastWeekDay),
        secondDate: dateAssets.dashDate(today),
        userID: ctx.update.callback_query.from.id
      })

      return res.data
    } catch (e) {
      console.log(e)
    }
  }

  async getRadarChart(chartLabels, thisWeekHours, lastWeekHours) {
    try {
      const myChart = new QuickChart()

      radarChart.data.labels = chartLabels
      radarChart.data.datasets[0].data = thisWeekHours
      radarChart.data.datasets[1].data = lastWeekHours

      myChart
      .setConfig({
        type: 'radar',
        data: radarChart.data,
        options: radarChart.options
      })
      .setWidth(1300)
      .setHeight(1300)
      .setBackgroundColor('#0D0D0D')

      return myChart.getUrl()
    } catch(e) {
      console.log(e)
    }
  }

  async dateStatic(ctx) {
    try {
      const res = await axios.get(`${process.env.mainUrl}/get-task-date/${ctx.from.id}/${dateAssets.dashDate(new Date())}`)

      return res.data.map(item => {
        return {
          label: item.label,
          hours: (item.hours).toFixed(1),
          date: dateAssets.dMDate(item.date),
          taskID: item.taskID,
          isCompleted: item.isCompleted
        }
      })
    } catch (e) {
      console.log(e)
    }
  }


}


module.exports = new StaticController()
