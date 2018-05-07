import { mean, flattenDeep, max, min } from 'lodash'

export const independentVars = [
  'seedNumber',
  'mutationRate',
  'survivalRate',
  'goalLength',
]

const independentVarsDomain = {
  seedNumber: [10, 100],
  mutationRate: [0, 1],
  survivalRate: [0, 1],
  goalLength: [1, 40],
}

export const dependentVars = [
  'goalDistance',
  'mean',
  'stdev',
  'median',
]

const getValue = (coefficients, xCoeff, yCoeff) => {
  const usefulCoefficients = coefficients.filter(coeff => Math.abs(coeff.coefficient) > 0.01)
  const handleCoefficient = coeff => ({ x, y }) => {
    const { variable, coefficient } = coeff
    const handledVars = variable.reduce((acc, v) => {
      const [realVar, expon = 1] = v.split('^')
      if (realVar === xCoeff) return acc * (x ** expon)
      if (realVar === yCoeff) return acc * (y ** expon)
      return acc * (mean(independentVarsDomain[realVar]) ** expon)
    }, 1)
    return handledVars * coefficient
  }
  return (x, y) => {
    const total = usefulCoefficients.reduce((acc, coeff) => {
      const val = handleCoefficient(coeff)({ x, y })
      return acc + val
    }, 0)
    return total
  }
}

export const drawer = ({ canvas, state, setScale, setScore }) => {
  const { width, height } = canvas
  const ctx = canvas.getContext('2d')
  const { xAxys, yAxys, color, data } = state
  ctx.clearRect(0, 0, width, height)

  const xDomain = independentVarsDomain[xAxys]
  const yDomain = independentVarsDomain[yAxys]
  const xScale = x => xDomain[0] + (x / height) * (xDomain[1] - xDomain[0])
  const yScale = y => yDomain[0] + (y / height) * (yDomain[1] - yDomain[0])

  const values = data[color]
  const valueGetter = getValue(values.coefficients, xAxys, yAxys)
  //
  const allValues = []
  for (let x = 0; x < Number(width); x++) {
    const row = []
    for (let y = 0; y < Number(height); y++) {
      const total = valueGetter(xScale(x), yScale(y))
      row.push(total)
    }
    allValues.push(row)
  }

  const flattened = flattenDeep(allValues)
  const minVal = min(flattened)
  const maxVal = max(flattened)

  const valScale = v => (v - minVal) / (maxVal - minVal)

  for (let x = 0; x < Number(width); x++) {
    for (let y = 0; y < Number(height); y++) {
      const value = Math.round(valScale(allValues[x][y]) * 255)
      ctx.fillStyle = `rgb(${value}, ${value}, ${value})`
      ctx.fillRect(x, y, 1, 1)
    }
  }
  setScale('min')(minVal)
  setScale('max')(maxVal)
  setScore(values.score)
}
