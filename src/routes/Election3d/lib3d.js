import * as THREE from 'three'
import { PerspectiveMercatorViewport } from 'viewport-mercator-project'
import TrackballControls from 'three-trackballcontrols'
import { commaToDecimal, tween } from 'lib/election-stats'
const { requestAnimationFrame } = window

const ANIMATION_LENGTH = 1000
const STARTING_Z = 10
const Z_BUFFER = -50
const CAMERA_DEFAULT = [0, 0, STARTING_Z]
const TARGET_DEFAULT = [0, 0, 0]
const SPHERE_BASE_SIZE = 0.5

export class Drawer3d {
  constructor(scene, camera, canvas, { viewport, ...mapMode }) {
    this.camera = camera
    this.scene = scene
    this.canvas = canvas
    this.axes = this.generateAxes
    this.controls = new TrackballControls(this.camera, this.canvas.domElement)
    this.controls.target.set(...TARGET_DEFAULT)
    this.camera.position.set(...CAMERA_DEFAULT)
    this.controls.rotateSpeed = 1.0
    this.controls.zoomSpeed = 4
    this.controls.panSpeed = 0.8
    this.controls.noZoom = false
    this.controls.noPan = false
    this.controls.staticMoving = true
    this.starting = {}
    this.cities = []
    this.mapMode = mapMode
    this.viewport = new PerspectiveMercatorViewport(viewport)
    this.animate()
  }

  generateAxes = () => {

  }

  animate = () => {
    requestAnimationFrame(this.animate)
    this.controls.update()
    this.canvas.render(this.scene, this.camera)
  }

  animateCities = () => {
    this.mapMode = !this.mapMode
    this.mapMode ? this.moveToMap() : this.moveToPca()
  }

  moveToPca = () => {
    this.startAnimation = Date.now()
    const { width, height } = this.getBBox()
    this.cities.forEach(({ city }) => {
      city.startingPosition = [...city.currentPosition, STARTING_Z]
      city.finalPosition = [
        width * (city.coords[0] - 0.5),
        -height * (city.coords[1] - 0.5),
        city.coords[2] * Z_BUFFER,
      ]
    })
    this.scene.add(this.axes)
    this.updateAnimation()
  }

  moveToMap = () => {
    this.startAnimation = Date.now()
    const { width, height } = this.getBBox()
    const adapter = this.adaptCityToMap({ width, height })
    const { position } = this.camera
    const { target } = this.controls
    this.cities.forEach(({ city }) => {
      city.startingPosition = [...city.currentPosition]
      city.finalPosition = adapter(city)
    })
    this.starting = { camera: [position.x, position.y, position.x], target: [target.x, target.y, target.x] }
    this.scene.remove(this.axes)
    this.updateAnimation(true)
  }

  updateAnimation = (updateCamera = false) => {
    const part = (Date.now() - this.startAnimation) / ANIMATION_LENGTH
    if (part >= 1) return this.update()
    this.cities.forEach(({ city }) => {
      const { startingPosition, finalPosition } = city
      city.currentPosition = tween({ start: startingPosition, end: finalPosition, part })
    })
    this.updateCities()
    updateCamera && this.updateCamera(part)
    requestAnimationFrame(() => this.updateAnimation(updateCamera))
  }

  updateCamera = part => {
    const { camera, target } = this.starting
    const targetValue = tween({ start: target, end: TARGET_DEFAULT, part })
    const cameraValue = tween({ start: camera, end: CAMERA_DEFAULT, part })
    this.controls.target.set(...targetValue)
    this.controls.reset()
    this.camera.position.set(...cameraValue)
    this.camera.updateProjectionMatrix()
    this.controls.update()
  }

  getBBox = () => {
    const { fov, aspect, position: { z } } = this.camera
    const fovRad = fov * Math.PI / 180
    const height = 2 * Math.tan(fovRad / 2) * z
    const width = height * aspect
    return { width, height }
  }

  update = state => {
    this.viewport = state ? new PerspectiveMercatorViewport(state) : this.viewport
    if (!this.mapMode) return
    this.updateCitiesMap()
    this.updateCities()
  }

  adaptCityToMap = ({ width, height }) => city => {
    const { domElement } = this.canvas
    const lat = commaToDecimal(city.latitudine)
    const lng = commaToDecimal(city.longitudine)
    const [xCanvas, yCanvas] = this.viewport.project([lng, lat])
    const x = width * (xCanvas / domElement.width - 0.5)
    const y = -height * (yCanvas / domElement.height - 0.5)
    return [x, y, 0]
  }

  updateCitiesMap = () => {
    const { width, height } = this.getBBox()
    const adapter = this.adaptCityToMap({ width, height })
    this.cities.forEach(({ city }) => {
      city.currentPosition = adapter(city)
      city.scale = SPHERE_BASE_SIZE / Math.sqrt(this.viewport.zoom)
    })
  }

  updateCities = () => {
    this.cities.forEach(({ sphere, outline, city }) => {
      sphere.position.set(...city.currentPosition)
      outline.position.set(...city.currentPosition)
      sphere.scale.set(city.scale, city.scale, city.scale)
      outline.scale.set(city.scale, city.scale, city.scale).multiplyScalar(1.05)
    })
  }

  draw2d = () => {
    this.cities.forEach(({ sphere, outline }) => this.scene.add(sphere, outline))
    this.updateCitiesMap()
    this.updateCities()
  }

  generateCitySphere = city => {
    const color = 100 + Math.ceil(city.color * 155)
    const geometry = new THREE.SphereBufferGeometry(1, 16, 16)
    const material = new THREE.MeshBasicMaterial({ color: `rgb(${color}, 100, 100)` })
    const sphere = new THREE.Mesh(geometry, material)
    const outlineMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff, side: THREE.BackSide })
    const outline = new THREE.Mesh(geometry, outlineMaterial)
    outline.position.set(sphere.position)
    outline.scale.multiplyScalar(1.05)
    return { sphere, outline }
  }

  addCities = cities => {
    this.cities = cities.map(city => {
      const { sphere, outline } = this.generateCitySphere(city)
      city.scale = 1
      return { sphere, outline, city }
    })
  }
}
