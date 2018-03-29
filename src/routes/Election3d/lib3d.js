import * as THREE from 'three'
import { PerspectiveMercatorViewport } from 'viewport-mercator-project'
import TrackballControls from 'three-trackballcontrols'
import { commaToDecimal } from 'lib/election-stats'
const { requestAnimationFrame } = window

const ANIMATION_LENGTH = 1000
const STARTING_Z = 10
const Z_BUFFER = -20
const CAMERA_DEFAULT = { x: 0, y: 0, z: STARTING_Z, target: [0, 0, 0] }

export class Drawer3d {
  constructor(scene, camera, canvas, { viewport, ...mapMode }) {
    this.camera = camera
    this.scene = scene
    this.canvas = canvas
    this.controls = new TrackballControls(this.camera, this.canvas.domElement)
    this.controls.target.set(0, 0, 0)
    this.controls.rotateSpeed = 1.0
    this.controls.zoomSpeed = 4
    this.controls.panSpeed = 0.8
    this.controls.noZoom = false
    this.controls.noPan = false
    this.controls.staticMoving = true
    this.camera.position.x = CAMERA_DEFAULT.x
    this.camera.position.y = CAMERA_DEFAULT.y
    this.camera.position.z = CAMERA_DEFAULT.z
    this.cameraStarting = {}
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
    this.cities.forEach(({ city }) => {
      city.startingPosition = [...city.currentPosition]
      city.finalPosition = adapter(city)
    })
    console.log(this.camera)
    this.cameraStarting = { ...position }
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
    updateCamera && this.updateCamera()
    requestAnimationFrame(() => this.updateAnimation(updateCamera))
  }

  updateCamera = () => {
    console.log(this.cameraStarting)
    console.log('ciaoooo')
  }

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
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.beginPath()
      ctx.fillStyle = `rgba(${city.color}, ${city.color}, ${city.color}, 0.9)`
      ctx.strokeStyle = 'rgb(0, 0, 0)'
      ctx.arc(128, 128, 64, 0, 2 * Math.PI)
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
