const pad = (s) => ('00' + s).slice(-2)

const dotsDate = (date) => {
  const d = new Date(date)
  return  `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`
}

const dashDate = (date) => {
  const d = new Date(date)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

const dMDate = (date) => {
  const d = new Date(date)
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}`
}

const getMiliseconds = (date) => {
	const d = new Date(date)
	return d.getTime()
}

module.exports =  {
  dotsDate,
  dashDate,
  dMDate,
  getMiliseconds
}
