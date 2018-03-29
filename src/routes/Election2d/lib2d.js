import { PerspectiveMercatorViewport } from 'viewport-mercator-project'
import { commaToDecimal, distanceSq } from 'lib/election-stats'
const { requestAnimationFrame } = window
const ANIMATION_LENGTH = 1000
const MARKER_RADIUS = val => 5 + 5 * val

export class Drawer2d {
  constructor(canvas, { viewport, ...mapMode }) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.cities = []
    this.mapMode = mapMode
    this.viewport = new PerspectiveMercatorViewport(viewport)
    this.startAnimation = undefined
    this.selected = undefined
  }

  onMouseMove = e => {
    const { clientX, clientY, target } = e
    const { top, left } = target.getBoundingClientRect()
    const mouseClick = [clientX - left, clientY - top]
    const selected = this.cities.find(city => distanceSq(city.vwPosition, mouseClick) < city.radius ** 2)
    if (!selected) {
      this.selected = selected
      this.drawCities()
    } else if (this.selected && (selected.id !== this.selected.id)) {
      this.selected = selected
      this.drawCities()
      this.renderTooltip(selected)
    } else if (!this.selected) {
      this.selected = selected
      this.renderTooltip(selected)
    }
  }

  renderTooltip = city => {
    this.ctx.font = '20px Monospace'
    this.ctx.fillStyle = 'black'
    this.ctx.textAlign = 'center'
    this.ctx.fillText(`${city.nome} - ${city.distance}`, ...city.vwPosition)
  }

  decorateCities = cities => {
    return cities.map(city => ({
      ...city,
      radius: Math.round(MARKER_RADIUS(city.population)),
      color: Math.round(city.color * 255),
      lat: commaToDecimal(city.latitudine),
      lng: commaToDecimal(city.longitudine),
      vwPosition: this.viewport.project([commaToDecimal(city.longitudine), commaToDecimal(city.latitudine)]),
    }))
  }

  setCities = cities => {
    this.cities = this.decorateCities(cities)
    this.drawCities()
  }

  animateCities = () => {
    this.mapMode = !this.mapMode
    this.mapMode ? this.moveToMap() : this.moveToPca()
  }

  moveToMap = () => {
    this.startAnimation = Date.now()
    this.cities.forEach((city, idx) => {
      city.startingPosition = [...city.vwPosition]
      city.finalPosition = this.viewport.project([city.lng, city.lat])
    })
    this.updateAnimation()
  }

  moveToPca = () => {
    this.startAnimation = Date.now()
    this.cities.forEach((city, idx) => {
      city.startingPosition = [...city.vwPosition]
      city.finalPosition = [
        this.canvas.width * city.coords[0],
        this.canvas.height * city.coords[1],
      ]
    })
    this.updateAnimation()
  }

  updateAnimation = () => {
    const part = (Date.now() - this.startAnimation) / ANIMATION_LENGTH
    if (part >= 1) return
    this.cities.forEach(city => {
      const { startingPosition, finalPosition } = city
      city.vwPosition = [
        startingPosition[0] + part * (finalPosition[0] - startingPosition[0]),
        startingPosition[1] + part * (finalPosition[1] - startingPosition[1]),
      ]
    })
    this.drawCities()
    requestAnimationFrame(this.updateAnimation)
  }

  update = state => {
    this.viewport = new PerspectiveMercatorViewport(state)
    if (!this.mapMode) return
    this.cities.forEach(city => { city.vwPosition = this.viewport.project([city.lng, city.lat]) })
    this.drawCities()
  }

  drawCities = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.cities.forEach(city => {
      this.ctx.beginPath()
      this.ctx.fillStyle = `rgba(${city.color}, ${city.color}, ${city.color}, 0.9)`
      this.ctx.strokeStyle = 'rgb(0, 0, 0)'
      this.ctx.arc(...city.vwPosition, city.radius, 0, 2 * Math.PI)
      this.ctx.stroke()
      this.ctx.fill()
    })
  }
}
