import { groupBy, meanBy, minBy, maxBy, sortBy, uniq } from 'lodash'

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
  'mode',
]

const getStats = (grouped, color) => (
  Object.entries(grouped).map(([key, values]) => (
    { key, value: meanBy(values, color) }
  ))
)

export const drawer = ({ canvas, state, setScale }) => {
  const { width, height } = canvas
  const ctx = canvas.getContext('2d')
  const { xAxys, yAxys, color, data } = state
  ctx.clearRect(0, 0, width, height)
  const grouped = groupBy(data, row => [row[xAxys], row[yAxys]])
  const stats = getStats(grouped, color)
  const xVals = sortBy(uniq(stats.map(({ key }) => key.split(',')[0])))
  const yVals = sortBy(uniq(stats.map(({ key }) => key.split(',')[1])))
  const colWidth = width / xVals.length
  const colHeight = height / yVals.length
  const { value: min } = minBy(stats, 'value')
  const { value: max } = maxBy(stats, 'value')
  const scale = v => (v - min) / (max - min)
  stats.forEach(p => {
    const [xVal, yVal] = p.key.split(',')
    const xIdx = xVals.findIndex(v => v === xVal)
    const yIdx = yVals.findIndex(v => v === yVal)
    const x = colWidth * xIdx
    const y = colHeight * yIdx
    const val = scale(p.value)
    ctx.fillStyle = `rgba(0, 0, 0, ${val})`
    ctx.fillRect(x, y, colWidth, colHeight)
  })
  setScale('min')(min)
  setScale('max')(max)
}
