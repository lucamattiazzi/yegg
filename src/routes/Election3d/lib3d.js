import * as THREE from 'three'
import { PerspectiveMercatorViewport } from 'viewport-mercator-project'
import TrackballControls from 'three-trackballcontrols'
import { commaToDecimal } from 'lib/election-stats'
const { requestAnimationFrame } = window

const ANIMATION_LENGTH = 1000
const STARTING_Z = 10
const Z_BUFFER = -20
const CAMERA_DEFAULT = [0, 0, STARTING_Z]
const TARGET_DEFAULT = [0, 0, 0]

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
    this.starting = {}
    this.cities = []
    this.mapMode = mapMode
    this.viewport = new PerspectiveMercatorViewport(viewport)
    this.animate()
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
    this.starting = { camera: position, controls: target }
    this.controls.target.set(...TARGET_DEFAULT)
    this.controls.reset()
    this.camera.position.set(...CAMERA_DEFAULT)
    this.camera.updateProjectionMatrix()
    this.controls.update()
    this.updateAnimation(true)
  }

  updateAnimation = (updateCamera = false) => {
    const part = (Date.now() - this.startAnimation) / ANIMATION_LENGTH
    if (part >= 1) return
    this.cities.forEach(({ city }) => {
      const { startingPosition, finalPosition } = city
      city.currentPosition = [
        startingPosition[0] + part * (finalPosition[0] - startingPosition[0]),
        startingPosition[1] + part * (finalPosition[1] - startingPosition[1]),
        startingPosition[2] + part * (finalPosition[2] - startingPosition[2]),
      ]
    })
    this.updateCities()
    // updateCamera && this.updateCamera(part)
    requestAnimationFrame(() => this.updateAnimation(updateCamera))
  }

  // updateCamera = part => {
  //   const { camera, controls } = this.starting.camera
  //   this.camera.position.x = camera.x + part * CAMERA_DEFAULT.x
  //   this.camera.position.y = camera.y + part * CAMERA_DEFAULT.y
  //   this.camera.position.z = camera.z + part * CAMERA_DEFAULT.z
  //   this.camera.updateProjectionMatrix()
  //   this.controls.target.x = controls.x + part * TARGET_DEFAULT.x
  //   this.controls.target.y = controls.y + part * TARGET_DEFAULT.y
  //   this.controls.target.z = controls.z + part * TARGET_DEFAULT.z
  // }

  getBBox = () => {
    const { fov, aspect, position: { z } } = this.camera
    const fovRad = fov * Math.PI / 180
    const height = 2 * Math.tan(fovRad / 2) * z
    const width = height * aspect
    return { width, height }
  }

  update = state => {
    this.viewport = new PerspectiveMercatorViewport(state)
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
    this.cities.forEach(({ city }) => { city.currentPosition = adapter(city) })
  }

  updateCities = () => {
    this.cities.forEach(({ object, city }) => object.position.set(...city.currentPosition))
  }

  draw2d = () => {
    this.cities.forEach(({ object }) => this.scene.add(object))
    this.updateCitiesMap()
    this.updateCities()
  }

  generateCitySprite = canvas => {
    const ctx = canvas.getContext('2d')
    return city => {
      console.log(city)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.beginPath()
      const color = 100 + Math.ceil(city.color * 155)
      console.log(color)
      ctx.fillStyle = `rgba(${color}, 0, 0, 0.9)`
      ctx.strokeStyle = 'rgb(0, 0, 0)'
      ctx.arc(128, 128, 50 + 50 * city.population, 0, 2 * Math.PI)
      ctx.stroke()
      ctx.fill()
      const texture = new THREE.Texture(canvas)
      texture.needsUpdate = true
      const material = new THREE.SpriteMaterial({ map: texture })
      return new THREE.Sprite(material)
    }
  }

  generateCitySphere = city => {
    const color = 100 + Math.ceil(city.color * 155)
    const geometry = new THREE.SphereBufferGeometry(5 + city.population * 5, 16, 16)
    const material = new THREE.MeshBasicMaterial({ color: `rgb(${color}, 100, 100)` })
    return new THREE.Mesh(geometry, material)
  }

  addCities = cities => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const cityGenerator = this.generateCitySprite(canvas)
    this.cities = cities.map(city => {
      const object = cityGenerator(city)
      return { object, city }
    })
  }
}
