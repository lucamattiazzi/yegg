import { groupBy, meanBy, minBy, maxBy, sortBy, uniq, round } from 'lodash'
const MARGIN = 80

export const independentVars = [
  'seedNumber',
  'mutationRate',
  'survivalRate',
  'goalLength',
]

export const dependentVars = [
  'goalDistance',
  'mean',
  'stdev',
  'median',
]

const getStats = (grouped, color) => (
  Object.entries(grouped).map(([key, values]) => (
    { key, value: meanBy(values, color) }
  ))
)

export const drawer = ({ canvas, state, setScale }) => {
  const { width, height } = canvas
  const availableWidth = width - MARGIN
  const availableHeight = height - MARGIN
  const ctx = canvas.getContext('2d')
  const { xAxys, yAxys, color, data } = state
  ctx.clearRect(0, 0, width, height)
  ctx.font = '20px monospace'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const grouped = groupBy(data, row => [row[xAxys], row[yAxys]])
  const stats = getStats(grouped, color)
  const xVals = sortBy(uniq(stats.map(({ key }) => Number(key.split(',')[0]))))
  const yVals = sortBy(uniq(stats.map(({ key }) => Number(key.split(',')[1]))))
  const colWidth = availableWidth / xVals.length
  const colHeight = availableHeight / yVals.length
  const { value: min } = minBy(stats, 'value')
  const { value: max } = maxBy(stats, 'value')
  const scale = v => (v - min) / (max - min)
  stats.forEach(p => {
    const [xVal, yVal] = p.key.split(',')
    const xIdx = xVals.findIndex(v => v === Number(xVal))
    const yIdx = yVals.findIndex(v => v === Number(yVal))
    const x = MARGIN + colWidth * xIdx
    const y = height - colHeight * (yIdx + 1) - MARGIN
    const val = scale(p.value)
    ctx.fillStyle = `rgba(0, 0, 0, ${val})`
    ctx.fillRect(x, y, colWidth, colHeight)
    ctx.fillStyle = val > 0.5 ? 'white' : 'black'
    ctx.fillText(round(p.value, 2), x + colWidth / 2, y + colHeight / 2)
  })
  xVals.forEach((xLeg, idx) => {
    const x = MARGIN + colWidth * (idx + 0.5)
    const y = height - MARGIN / 2
    ctx.fillStyle = 'rgb(1, 1, 1)'
    ctx.fillText(round(xLeg, 2), x, y)
  })
  yVals.forEach((yLeg, idx) => {
    const x = MARGIN / 2
    const y = height - colHeight * (idx + 1) - MARGIN / 2
    ctx.fillStyle = 'rgb(1, 1, 1)'
    ctx.fillText(round(yLeg, 2), x, y)
  })
  setScale('min')(min)
  setScale('max')(max)
}
