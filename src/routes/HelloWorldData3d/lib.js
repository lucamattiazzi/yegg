import { groupBy, meanBy, minBy, maxBy, sortBy, uniq } from 'lodash'
import * as THREE from 'three'
import TrackballControls from 'three-trackballcontrols'

const { requestAnimationFrame } = window
const STARTING_Z = 10
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
  constructor(scene, camera, canvas, { viewport, ...mapMode }) {
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

  generateCube = position => {
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    const cube = new THREE.Mesh(geometry, material)
    cube.position.set(...position)
    return cube
  }

  updateValues = () => {
    const newCube = this.generateCube([10, 0, 0])
    this.scene.add(newCube)
  }
}
