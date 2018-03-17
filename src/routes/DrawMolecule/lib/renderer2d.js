import { ATOM_RADIUS_MULTIPLIER_2D } from 'routes/DrawMolecule/constants/index'

const FONT = '10px Arial'
const OPACITY = 0.4
const BASE_COLOR = '#222222'
const BASE_DELTA = 10

export const bondDrawer = (ctx, canvas, points, strength) => {
  const [ xAtom0, yAtom0, xAtom1, yAtom1 ] = [
    points[0].x * canvas.width,
    points[0].y * canvas.height,
    points[1].x * canvas.width,
    points[1].y * canvas.height,
  ]
  const angle = Math.atan2(yAtom1 - yAtom0, xAtom1 - xAtom0)
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  const cosNorm = angle > 0
    ? Math.sqrt(1 - cos ** 2)
    : -Math.sqrt(1 - cos ** 2)
  const sinNorm = angle > Math.PI
    ? Math.sqrt(1 - sin ** 2)
    : -Math.sqrt(1 - sin ** 2)
  const bonds = Array.from({ length: strength })
  bonds.forEach((_, idx, all) => {
    const middle = (all.length + 1) / 2
    const delta = BASE_DELTA * ((idx + 1) - middle)
    const [ x0, y0, x1, y1 ] = [
      xAtom0 + 2 * ATOM_RADIUS_MULTIPLIER_2D * cos + delta * cosNorm,
      yAtom0 + 2 * ATOM_RADIUS_MULTIPLIER_2D * sin + delta * sinNorm,
      xAtom1 - 2 * ATOM_RADIUS_MULTIPLIER_2D * cos + delta * cosNorm,
      yAtom1 - 2 * ATOM_RADIUS_MULTIPLIER_2D * sin + delta * sinNorm,
    ]
    ctx.beginPath()
    ctx.moveTo(x0, y0)
    ctx.lineTo(x1, y1)
    ctx.lineWidth = 2
    ctx.strokeStyle = 'black'
    ctx.stroke()
  })
}

const drawAtom = (color, letter) => (ctx, x, y) => {
  ctx.beginPath()
  ctx.arc(x, y, ATOM_RADIUS_MULTIPLIER_2D, 0, 2 * Math.PI, false)
  ctx.fillStyle = color
  ctx.fill()
  ctx.lineWidth = 2
  ctx.strokeStyle = BASE_COLOR
  ctx.stroke()
  ctx.font = FONT
  ctx.fillStyle = BASE_COLOR
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(letter, x, y)
}

export const drawLine = (ctx, line) => {
  ctx.beginPath()
  line.forEach(point => {
    ctx.lineTo(...point)
  })
  ctx.lineWidth = 3
  ctx.strokeStyle = 'black'
  ctx.stroke()
}

export const ATOM_DRAWERS = {
  O: drawAtom(`rgba(255, 0, 0, ${OPACITY})`, 'O'),
  C: drawAtom(`rgba(0, 0, 255, ${OPACITY})`, 'C'),
  H: drawAtom(`rgba(255, 255, 255, ${OPACITY})`, 'H'),
  S: drawAtom(`rgba(255, 255, 0, ${OPACITY})`, 'S'),
  N: drawAtom(`rgba(127, 127, 127, ${OPACITY})`, 'N'),
  P: drawAtom(`rgba(255, 165, 0, ${OPACITY})`, 'P'),
}
