const axios = require('axios')
const QuickChart = require('quickchart-js');

const lineChart = require('../charts/lineChart')
const radarChart = require('../charts/radarChart')

class StaticController {
  async static(ctx) {
    try {
      const today = new Date()
      const lastWeekDay = new Date(today.getTime() - 1000*60*60*24*7)

      const pad = (s) => ('00' + s).slice(-2)

      const data = await axios.post(`${process.env.mainUrl}/data`, {
        firstDate: `${lastWeekDay.getFullYear()}-${pad(lastWeekDay.getMonth()+1)}-${pad(lastWeekDay.getDate())}`,
        secondDate: `${today.getFullYear()}-${pad(today.getMonth()+1)}-${pad(today.getDate())}`,
        userID: ctx.update.message.from.id
      })
      return data.data
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
    .setBackgroundColor('#0F0D22')

    // console.log(lineChart.data);
    return myChart.getUrl()
  }

  async allStatic(ctx) {
    try {
      const today = new Date()
      const lastWeekDay = new Date(today.getTime() - 1000*60*60*24*14)

      const pad = (s) => ('00' + s).slice(-2)

      const data = await axios.post(`${process.env.mainUrl}/data-all`, {
        firstDate: `${lastWeekDay.getFullYear()}-${pad(lastWeekDay.getMonth()+1)}-${pad(lastWeekDay.getDate())}`,
        secondDate: `${today.getFullYear()}-${pad(today.getMonth()+1)}-${pad(today.getDate())}`,
        userID: ctx.update.message.from.id
      })

      return data.data
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
      .setBackgroundColor('#0F0D22')

      // console.log(lineChart.data);
      return myChart.getUrl()
    } catch(e) {
      console.log(e)
    }
  }

  async dateStatic(ctx) {
    try {
      const today = new Date('2022-02-24')
      const pad = (s) => ('00' + s).slice(-2)
      const data = await axios.get(`${process.env.mainUrl}/get-task-date/${ctx.update.message.from.id}/${today.getFullYear()}-${pad(today.getMonth()+1)}-${pad(today.getDate())}`)

      return data.data
    } catch (e) {
      console.log(e)
    }
  }


}


module.exports = new StaticController()
