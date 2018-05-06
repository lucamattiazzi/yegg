import { groupBy, meanBy, minBy, maxBy, sortBy, uniq } from 'lodash'
import * as THREE from 'three'
import TrackballControls from 'three-trackballcontrols'

const { requestAnimationFrame } = window
const STARTING_Z = 10
const CUBE_SIDE = 1
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

const getStats = (grouped, color) => (
  Object.entries(grouped).map(([key, values]) => (
    { key, value: meanBy(values, color) }
  ))
)

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
    const geometry = new THREE.BoxGeometry(1, 1, 1)
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

  updateValues = ({ xAxys, yAxys, zAxys, color, data, setScale }) => {
    while (this.scene.children.length > 0) {
      this.scene.remove(this.scene.children[0])
    }
    const grouped = groupBy(data, row => [row[xAxys], row[yAxys], row[zAxys]])
    const stats = getStats(grouped, color)
    console.log(stats)
    const xVals = sortBy(uniq(stats.map(({ key }) => key.split(',')[0])))
    const yVals = sortBy(uniq(stats.map(({ key }) => key.split(',')[1])))
    const zVals = sortBy(uniq(stats.map(({ key }) => key.split(',')[2])))
    const colX = CUBE_SIDE * (3 ** (1 / 3)) // the volume inside is three times the max cube size
    const colY = CUBE_SIDE * (3 ** (1 / 3)) // the volume inside is three times the max cube size
    const colZ = CUBE_SIDE * (3 ** (1 / 3)) // the volume inside is three times the max cube size
    const { value: min } = minBy(stats, 'value')
    const { value: max } = maxBy(stats, 'value')
    const scale = v => (v - min) / (max - min)
    stats.forEach(p => {
      const [xVal, yVal, zVal] = p.key.split(',')
      const xIdx = xVals.findIndex(v => v === xVal)
      const yIdx = yVals.findIndex(v => v === yVal)
      const zIdx = zVals.findIndex(v => v === zVal)
      const x = colX * xIdx
      const y = colY * yIdx
      const z = colZ * zIdx
      const val = scale(p.value)
      const { cube, edges } = this.generateCube({ position: [x, y, z], scale: [val, val, val] })
      this.scene.add(cube)
      this.scene.add(edges)
    })
    setScale('min')(min)
    setScale('max')(max)
  }
}
