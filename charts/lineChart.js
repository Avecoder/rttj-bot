let data = {
  datasets: [
    {
      backgroundColor: 'transparent',
      borderColor: '#00EEE1',
      borderWidth: 1,
      lineTension: .4,
      cursor: 'pointer',
      pointRadius: 6
    },
  ]
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
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
          fontFamily: 'Roboto',
          fontSize: 22,
          fontColor: '#fff',
          padding: 20,
          stepSize: 1
        },
        gridLines: {
          color: 'transparent'
        },
      },
    ],
    xAxes: [
      {
        ticks: {
          fontFamily: 'Montserrat',
          fontColor: '#fff',
          fontSize: 22,
          padding: 20,
          fontWeigth: 200
        },
        gridLines: {
          color: '#323232'
        },
      },

    ],
  },
}

module.exports = {
  data,
  options
}
