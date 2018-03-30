import React from 'react'
import ReactMapGL from 'react-map-gl'
import { decorateCities, MAPBOX_TOKEN } from 'lib/election-stats'
import { Drawer2d } from './lib2d'

export class Election2d extends React.Component {
  state = {
    width: 0,
    height: 0,
    latitude: 41,
    longitude: 12,
    zoom: 5,
    minPop: 50000,
    mapMode: true,
  }

  async componentDidMount() {
    const res = await window.fetch('/analysis_1.json')
    const cities = await res.json()
    const allCities = cities.filter(city => (
      city.latitudine &&
      city.longitudine &&
      city.pop_residente
    ))
    const filteredCities = allCities.filter(city => Number(city.pop_residente) > this.state.minPop)
    const decoratedCities = decorateCities(filteredCities)
    this.renderer.setCities(decoratedCities)
  }

  handleViewportChange = vw => this.setState(vw, this.updateRenderer)

  updateRenderer = () => this.renderer.update(this.state)

  renderCanvas = canvas => {
    if (!canvas) return
    this.renderer = new Drawer2d(canvas, this.state)
  }

  renderContainer = container => {
    if (!container) return
    const width = container.offsetWidth
    const height = container.offsetHeight
    this.setState({ width, height })
  }

  onMouseMove = e => { this.renderer && this.renderer.onMouseMove(e) }

  switchMode = () => this.setState({ mapMode: !this.state.mapMode }, this.renderer.animateCities)

  render() {
    const { width, height, mapMode } = this.state
    return (
      <div className="w-100 h-100 flex flex-column justify-end">
        <div className="w-100 h-20 flex justify-center items-center">
          <input type="submit" value="Maronn!" onClick={this.switchMode} />
        </div>
        <div className="w-100 h-80 relative" ref={this.renderContainer} onMouseMove={this.onMouseMove}>
          <div className={`w-100 h-100 absolute ${mapMode ? '' : 'o-20 pointer-events-none'}`}>
            <ReactMapGL
              {...this.state}
              onViewportChange={this.handleViewportChange}
              mapboxApiAccessToken={MAPBOX_TOKEN}
              mapStyle="mapbox://styles/mapbox/dark-v9"
            />
          </div>
          <canvas width={width} height={height} ref={this.renderCanvas} className="w-100 h-100 absolute pointer-events-none" />
        </div>
      </div>
    )
  }
}
