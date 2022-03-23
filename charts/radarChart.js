let data = {
  // labels: ['first', 'second', 'third', 'fourth', 'fifth'],
  datasets: [{
    label: 'Прошлая неделя',
    backgroundColor: 'transparent',
    borderColor: '#00EEE1',
    borderWidth: 2,
    // data: [10, 26, 25, 24, 13],
    tension: .1,
    fontSize: 28
  },
  {
    label: 'Текущая неделя',
    backgroundColor: 'transparent',
    borderColor: '#FF708B',
    borderWidth: 2,
    // data: [20, 23, 15, 12, 8],
    tension: .1,
    fontSize: 28
  }]
}


const options = {
  legend: {
    labels: 'none'
  },
  title: {
    display: false,
  },
  layout: {
    padding: 40
  },
  scale: {
    ticks: {
      suggestedMin: 0,
      suggestedMax: 30,
      stepSize: 5,
      fontSize: 24,
      fontColor: '#fff',
      backdropColor: '#0d0d0d'
    },
    angleLines: {
      color: '#fff5',
      lineWidth: .5,
      // display: false
    },
    gridLines: {
      color: '#fff',
      lineWidth: .5,
      tension: .1,
      display: false
    },
    pointLabels: {
      fontColor: '#fff',
      fontSize: 24,
      padding: 28,
      backgroundColor: '#323232'
    }
  },
  plugins: {
    legend: {
      labels: false
    }
  }
}

module.exports = {
  data,
  options
}
