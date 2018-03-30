import React from 'react'
import * as THREE from 'three'
import ReactMapGL from 'react-map-gl'
import { decorateCities, MAPBOX_TOKEN } from 'lib/election-stats'
import { Drawer3d } from './lib3d'

export class Election3d extends React.Component {
  state = {
    width: 0,
    height: 0,
    latitude: 41,
    longitude: 12,
    zoom: 5,
    minPop: 10000,
    mapMode: true,
  }

  retrieveData = async () => {
    const res = await window.fetch('/analysis_1.json')
    const cities = await res.json()
    const allCities = cities.filter(city => (
      city.latitudine &&
      city.longitudine &&
      city.pop_residente
    ))
    const filteredCities = allCities.filter(city => Number(city.pop_residente) > this.state.minPop)
    const decoratedCities = decorateCities(filteredCities)
    this.renderer.addCities(decoratedCities)
    this.renderer.draw2d()
    this.setState({ loading: false })
  }

  updateRenderer = () => this.renderer.update(this.state)

  handleViewportChange = vw => this.setState(vw, this.updateRenderer)

  renderCanvasContainer = async container => {
    if (!container) return
    const width = container.offsetWidth
    const height = container.offsetHeight
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10000)
    const canvas = new THREE.WebGLRenderer({ alpha: true })
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    // directionalLight.position = [0, -1, 0]
    scene.add(directionalLight)
    canvas.setSize(width, height)
    container.appendChild(canvas.domElement)
    this.renderer = new Drawer3d(scene, camera, canvas, this.state)
    this.setState({ loading: true }, async () => {
      await this.retrieveData()
    })
  }

  renderContainer = container => {
    if (!container) return
    const width = container.offsetWidth
    const height = container.offsetHeight
    this.setState({ width, height })
  }

  switchMode = () => this.setState({ mapMode: !this.state.mapMode }, this.renderer.animateCities)

  render() {
    const { mapMode } = this.state
    return (
      <div className="w-100 h-100 flex flex-column justify-end">
        <div className="w-100 h-20 flex justify-center items-center">
          <input type="submit" value="Maronn!" onClick={this.switchMode} />
        </div>
        <div className="w-100 h-80 relative" ref={this.renderContainer}>
          <div className={`w-100 h-100 absolute ${mapMode ? '' : 'o-20 pointer-events-none'}`}>
            <ReactMapGL
              {...this.state}
              onViewportChange={this.handleViewportChange}
              mapboxApiAccessToken={MAPBOX_TOKEN}
              mapStyle="mapbox://styles/mapbox/dark-v9"
            />
          </div>
          <div className={`w-100 h-100 absolute ${!mapMode ? '' : 'o-60 pointer-events-none'}`} ref={this.renderCanvasContainer} />
        </div>
      </div>
    )
  }
}
