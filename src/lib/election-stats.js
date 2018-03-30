import { min, max, map } from 'lodash'

const cityScales = cities => {
  const xValues = map(cities, c => c.transformed[0])
  const yValues = map(cities, c => c.transformed[1])
  const zValues = map(cities, c => c.transformed[2])
  const xExtent = [min(xValues), max(xValues)]
  const yExtent = [min(yValues), max(yValues)]
  const zExtent = [min(zValues), max(zValues)]
  const coordScale = ([x, y, z]) => {
    return [
      (x - xExtent[0]) / (xExtent[1] - xExtent[0]),
      (y - yExtent[0]) / (yExtent[1] - yExtent[0]),
      (z - zExtent[0]) / (zExtent[1] - zExtent[0]),
    ]
  }
  const popValues = map(cities, c => Number(c.pop_residente))
  const popExtent = [min(popValues), max(popValues)]
  const popScale = pop => (pop - popExtent[0]) / (popExtent[1] - popExtent[0])
  const distValues = map(cities, c => Number(c.distance))
  const distExtent = [min(distValues), max(distValues)]
  const distScale = distance => (distance - distExtent[0]) / (distExtent[1] - distExtent[0])
  return { coordScale, popScale, distScale }
}

const decorateCity = ({ distScale, coordScale, popScale }) => city => {
  const color = distScale(city.distance)
  const population = popScale(Number(city.pop_residente))
  const coords = coordScale(city.transformed)
  return { ...city, color, coords, population }
}

export const distanceSq = (p1, p2) => (p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2

export const decorateCities = cities => {
  const scales = cityScales(cities)
  return cities.map(decorateCity(scales))
}

export const commaToDecimal = n => Number(n.replace(',', '.'))

export const MAPBOX_TOKEN = 'pk.eyJ1IjoieWVhc3RlcmVnZyIsImEiOiJjamY5dTY2bGwxbzhjMnhtbWtuOWF5a2k1In0.QVys4EgiR2BCfvabF5wVsg'

export const tween = ({ start, end, part }) => {
  return [
    start[0] + part * (end[0] - start[0]),
    start[1] + part * (end[1] - start[1]),
    start[2] + part * (end[2] - start[2]),
  ]
}
