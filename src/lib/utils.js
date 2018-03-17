import { sum, sample } from 'lodash'

const OPERATORS = ['+', '-', ':', '*', '*']
const MAX_RANDOM_DIGITS = 3
const MIN_FACTORS = 3
const MAX_FACTORS = 2
const randomThrow = faces => () => Math.floor(Math.random() * faces)

export const testRandom = ({ faces, rounds }) => {
  const results = Array.from({ length: faces }, () => rounds / faces)
  const dice = randomThrow(faces)
  for (let i = 0; i <= rounds; i++) {
    results[dice()]--
  }
  const errors = results.map(Math.abs)
  const error = sum(errors) / rounds
  return error
}

export const wait = ms => new Promise((resolve, reject) => setTimeout(resolve, ms))

const randomLargeNumber = () => (
  Math.floor(Math.random() * 10) +
  Math.floor(Math.random() * (10 ** Math.floor(Math.random() * MAX_RANDOM_DIGITS)))
)

export const randomCalculation = () => {
  const factorsNumber = MIN_FACTORS + Math.floor(Math.random() * MAX_FACTORS)
  const factors = Array.from({ length: factorsNumber }, randomLargeNumber)
  const operation = factors.reduce((acc, factor, idx) => (
    idx === 0
      ? `${factor}`
      : `${acc} ${sample(OPERATORS)} ${factor}`
  ), '')
  return operation
}
