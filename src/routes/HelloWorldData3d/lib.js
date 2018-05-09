import { groupBy, meanBy, minBy, maxBy, sortBy, uniq, round } from 'lodash'
import * as THREE from 'three'
import TrackballControls from 'three-trackballcontrols'

const { requestAnimationFrame } = window
const STARTING_Z = 10
const CUBE_SIDE = 1.5
const CANVAS_SIZE = 64
const CUBE_VOLUM_MULT = (3 ** (1 / 3)) // the volume inside is three times the max cube size
const CAMERA_DEFAULT = [0, 0, STARTING_Z]
const TARGET_DEFAULT = [0, 0, 0]

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

const getStats = (grouped, color, size) => (
  Object.entries(grouped).map(([key, values]) => (
    { key, color: meanBy(values, color), size: meanBy(values, size) }
  ))
)

const newSprite = val => {
  const labelCanvas = document.createElement('canvas')
  labelCanvas.width = CANVAS_SIZE
  labelCanvas.height = CANVAS_SIZE
  const labelCtx = labelCanvas.getContext('2d')
  labelCtx.font = `50px monospace`
  labelCtx.textAlign = 'center'
  labelCtx.textBaseline = 'middle'
  labelCtx.clearRect(0, 0, labelCanvas.width, labelCanvas.height)
  labelCtx.fillText(val, labelCanvas.width / 2, labelCanvas.height / 2)
  const map = new THREE.CanvasTexture(labelCanvas)
  const labelMaterial = new THREE.SpriteMaterial({ map })
  const sprite = new THREE.Sprite(labelMaterial)
  return sprite
}

export class Drawer3d {
  constructor(scene, camera, canvas) {
    this.camera = camera
    this.scene = scene
    this.canvas = canvas
    this.controls = new TrackballControls(this.camera, this.canvas.domElement)
    this.controls.target.set(...TARGET_DEFAULT)
    this.camera.position.set(...CAMERA_DEFAULT)
    this.controls.rotateSpeed = 1.0
    this.controls.zoomSpeed = 4
    this.controls.panSpeed = 0.8
    this.controls.noZoom = false
    this.controls.noPan = false
    this.controls.staticMoving = true
    this.animate()
  }

  animate = () => {
    requestAnimationFrame(this.animate)
    this.controls.update()
    this.canvas.render(this.scene, this.camera)
  }

  generateCube = ({ position = [0, 0, 0], scale = [1, 1, 1], color = 0xff0000 }) => {
    const geometry = new THREE.BoxGeometry(CUBE_SIDE, CUBE_SIDE, CUBE_SIDE)
    const material = new THREE.MeshBasicMaterial({ color })
    const cube = new THREE.Mesh(geometry, material)
    const edgeGeometry = new THREE.EdgesGeometry(geometry)
    const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 })
    const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial)
    cube.position.set(...position)
    cube.scale.set(...scale)
    edges.position.set(...position)
    edges.scale.set(...scale)
    return { cube, edges }
  }

  drawAllAxys = ({ xVals, yVals, zVals }) => {
    const axysLength = Math.max(xVals.length, yVals.length, zVals.length) * CUBE_VOLUM_MULT * 2
    const material = new THREE.LineBasicMaterial({ color: 0x0000ff })
    const positions = [
      [[0, 0, 0], [axysLength, 0, 0]],
      [[0, 0, 0], [0, axysLength, 0]],
      [[0, 0, 0], [0, 0, axysLength]],
    ]
    positions.forEach(([p1, p2]) => {
      const geometry = new THREE.Geometry()
      geometry.vertices.push(new THREE.Vector3(...p1))
      geometry.vertices.push(new THREE.Vector3(...p2))
      const line = new THREE.Line(geometry, material)
      this.scene.add(line)
    })
    xVals.forEach((val, idx) => {
      const sprite = newSprite(round(val, 2))
      sprite.position.set((1 + idx) * CUBE_SIDE * CUBE_VOLUM_MULT, -1, -1)
      this.scene.add(sprite)
    })
    const xSprite = newSprite('X')
    xSprite.position.set((2 + xVals.length) * CUBE_SIDE * CUBE_VOLUM_MULT, -1, -1)
    this.scene.add(xSprite)
    yVals.forEach((val, idx) => {
      const sprite = newSprite(round(val, 2))
      sprite.position.set(-1, (1 + idx) * CUBE_SIDE * CUBE_VOLUM_MULT, -1)
      this.scene.add(sprite)
    })
    const ySprite = newSprite('Y')
    ySprite.position.set(-1, (2 + xVals.length) * CUBE_SIDE * CUBE_VOLUM_MULT, -1)
    this.scene.add(ySprite)
    zVals.forEach((val, idx) => {
      const sprite = newSprite(round(val, 2))
      sprite.position.set(-1, -1, (1 + idx) * CUBE_SIDE * CUBE_VOLUM_MULT)
      this.scene.add(sprite)
    })
    const zSprite = newSprite('Z')
    zSprite.position.set(-1, -1, (2 + xVals.length) * CUBE_SIDE * CUBE_VOLUM_MULT)
    this.scene.add(zSprite)
  }

  updateValues = ({ xAxys, yAxys, zAxys, color, data, setScale, size }) => {
    while (this.scene.children.length > 0) {
      this.scene.remove(this.scene.children[0])
    }
    const grouped = groupBy(data, row => [row[xAxys], row[yAxys], row[zAxys]])
    const stats = getStats(grouped, color, size)
    console.log(stats)
    const xVals = sortBy(uniq(stats.map(({ key }) => Number(key.split(',')[0]))))
    const yVals = sortBy(uniq(stats.map(({ key }) => Number(key.split(',')[1]))))
    const zVals = sortBy(uniq(stats.map(({ key }) => Number(key.split(',')[2]))))
    this.drawAllAxys({ xVals, yVals, zVals })
    const colX = CUBE_SIDE * CUBE_VOLUM_MULT
    const colY = CUBE_SIDE * CUBE_VOLUM_MULT
    const colZ = CUBE_SIDE * CUBE_VOLUM_MULT
    const { color: minColor } = minBy(stats, 'color')
    const { color: maxColor } = maxBy(stats, 'color')
    const { size: minSize } = minBy(stats, 'size')
    const { size: maxSize } = maxBy(stats, 'size')
    const scaleColor = v => (v - minColor) / (maxColor - minColor)
    const scaleSize = v => (v - minSize) / (maxSize - minSize)
    stats.forEach(p => {
      const [xVal, yVal, zVal] = p.key.split(',')
      const xIdx = xVals.findIndex(v => v === Number(xVal))
      const yIdx = yVals.findIndex(v => v === Number(yVal))
      const zIdx = zVals.findIndex(v => v === Number(zVal))
      const x = colX * (xIdx + 1)
      const y = colY * (yIdx + 1)
      const z = colZ * (zIdx + 1)
      const colorVal = scaleColor(p.color)
      const hexColor = Math.round(255 - 255 * colorVal)
      const sizeVal = scaleSize(p.size)
      const cubeOpts = {
        position: [x, y, z],
        scale: [sizeVal, sizeVal, sizeVal],
        color: `rgb(${hexColor}, ${hexColor}, ${hexColor})`,
      }
      const { cube, edges } = this.generateCube(cubeOpts)
      this.scene.add(cube)
      this.scene.add(edges)
    })
    setScale('min')(minColor)
    setScale('max')(maxColor)
  }
}
