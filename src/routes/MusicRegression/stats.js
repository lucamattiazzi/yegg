import regression from 'regression'

export const regress = data => {
  const order = data.length - 1
  const { equation } = regression('polynomial', data, order)
  const transformer = x => equation.reduce((acc, coeff, idx) => acc + coeff * x ** idx, 0)
  return transformer
}
