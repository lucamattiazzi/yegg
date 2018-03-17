import { max, min } from 'lodash'
const PADDING = 10

const decodeCanvas = (image, ws) => {
  return new Promise((resolve, reject) => {
    ws.addEventListener('message', mess => {
      resolve(mess.data)
    })
    const payload = JSON.stringify({ body: image, message: 'image' })
    ws.send(payload)
  })
}

const getExtent = (word, padding = 0) => {
  const xValues = word.reduce((a, l) => [ ...a, ...l.map(p => p[0]) ], [])
  const yValues = word.reduce((a, l) => [ ...a, ...l.map(p => p[1]) ], [])
  const minX = min(xValues) - padding
  const maxX = max(xValues) + padding
  const minY = min(yValues) - padding
  const maxY = max(yValues) + padding
  return { maxX, maxY, minX, minY }
}

export const getCenter = (word, canvas) => {
  const { maxX, maxY, minX, minY } = getExtent(word)
  return {
    x: (minX + (maxX - minX) / 2) / canvas.width,
    y: (minY + (maxY - minY) / 2) / canvas.height,
  }
}

export const uploadLine = async (word, ws) => {
  const virtualCanvas = document.createElement('canvas')
  const { maxX, maxY, minX, minY } = getExtent(word, PADDING)
  virtualCanvas.width = maxX - minX
  virtualCanvas.height = maxY - minY
  const virtualCtx = virtualCanvas.getContext('2d')
  word.forEach(line => {
    virtualCtx.beginPath()
    line.forEach(point => {
      virtualCtx.lineTo(point[0] - minX, point[1] - minY)
    })
    virtualCtx.lineWidth = 4
    virtualCtx.strokeStyle = 'black'
    virtualCtx.stroke()
  })
  const image = virtualCanvas.toDataURL()
  const result = await decodeCanvas(image, ws)
  return result
}

export const distancePointLine = (l1, l2, p0) => {
  const dy = l2.y - l1.y
  const dx = l2.x - l1.x
  const numerator = Math.abs(dy * p0.x - dx * p0.y + l2.x * l1.y - l2.y * l1.x)
  const denominator = Math.sqrt(dy ** 2 + dx ** 2)
  return numerator / denominator
}

export const atomFilled = (atom, bonds) => {
  const occupiedSlots = bonds.reduce((acc, b) => {
    if (b.atoms.indexOf(atom.uid) === -1) return acc
    return acc + b.strength
  }, 0)
  return occupiedSlots < atom.maxBonds
}
