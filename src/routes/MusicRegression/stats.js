import regression from 'regression'
import { KEYS } from './player'

export const valueToFrequency = val => {
  const exp = (val - 49) / 12
  return Math.round(440 * 2 ** exp)
}

export const regress = data => {
  const order = data.length - 1
  const { equation } = regression('polynomial', data, order)
  const transformer = x => equation.reduce((acc, coeff, idx) => acc + coeff * x ** idx, 0)
  return transformer
}

export const regressNotes = positions => {
  const points = positions.map((line, idx) => {
    const key = valueToFrequency(KEYS[idx])
    const y = line[0][1]
    return [y, key]
  })
  const { equation } = regression('polynomial', points, 1)
  const transformer = x => equation.reduce((acc, coeff, idx) => acc + coeff * x ** idx, 0)
  return transformer
}
