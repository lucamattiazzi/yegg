import * as d3 from 'd3'
import { matrix, multiply, transpose } from 'mathjs'
import { POINTS, CHOLESKY } from './constants'

const generateRandomData = (generator = Math.random) => (
  matrix(
    Array.from(
      { length: POINTS },
      () => [generator(), generator()]
    )
  )
)

const getExtent = points => {
  const extent = {
    x: { min: Infinity, max: -Infinity },
    y: { min: Infinity, max: -Infinity },
  }
  return points.reduce((acc, point) => {
    return {
      x: {
        min: Math.min(point[0], acc.x.min),
        max: Math.max(point[0], acc.x.max),
      },
      y: {
        min: Math.min(point[1], acc.y.min),
        max: Math.max(point[1], acc.y.max),
      },
    }
  }, extent)
}

const normalizePoints = points => {
  const ext = getExtent(points)
  const normalized = points.map(p => {
    const x = (p[0] - ext.x.min) / (ext.x.max - ext.x.min)
    const y = (p[1] - ext.y.min) / (ext.y.max - ext.y.min)
    return [x, y]
  })
  return normalized
}

export const generateCorrelatedData = () => {
  const gaussian = d3.randomNormal()
  const randomPoints = generateRandomData(gaussian)
  const points = randomPoints.toArray()
  const cholesky = transpose(matrix(CHOLESKY))
  const transposed = transpose(matrix(points))
  const correlated = multiply(cholesky, transposed)
  const normalizedPoints = normalizePoints(transpose(correlated).toArray())
  return normalizedPoints
}
