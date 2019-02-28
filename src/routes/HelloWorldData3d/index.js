import React from 'react'
import * as THREE from 'three'
import { independentVars, dependentVars, Drawer3d } from './lib'
import { Input } from './Input'
import { Scale } from './Scale'
const { fetch } = window

export class HelloWorldData3d extends React.Component {
  state = {
    width: 0,
    height: 0,
    data: [],
    xAxys: independentVars[0],
    yAxys: independentVars[0],
    zAxys: independentVars[0],
    color: dependentVars[1],
    size: dependentVars[1],
    max: 0,
    min: 0,
  }

  async componentDidMount() {
    const response = await fetch('/hello-world-results-160k.json')
    const data = await response.json()
    this.setState({ data }, this.updateCanvas)
  }

  renderContainer = div => {
    if (!div) return
    const width = div.offsetWidth
    const height = div.offsetHeight
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10000)
    // const camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 0.1, 10000)
    const canvas = new THREE.WebGLRenderer({ alpha: true })
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    // directionalLight.position = [0, -1, 0]
    scene.add(directionalLight)
    canvas.setSize(width, height)
    div.appendChild(canvas.domElement)
    this.renderer = new Drawer3d(scene, camera, canvas, this.state)
  }

  updateCanvas() {
    const { xAxys, yAxys, zAxys, color, size, data } = this.state
    const { setScale } = this
    this.renderer.updateValues({ xAxys, yAxys, zAxys, color, size, data, setScale })
  }

  setValue = k => e => this.setState({ [k]: e.target.value }, this.updateCanvas)

  setScale = key => val => this.setState({ [key]: val })

  render() {
    const { xAxys, yAxys, zAxys, color, size, max, min } = this.state
    return (
      <div className="w-100 h-100 flex flex-column justify-center items-center overflow-scroll relative">
        <Input
          setValue={this.setValue}
          independentVars={independentVars}
          dependentVars={dependentVars}
          xAxys={xAxys}
          yAxys={yAxys}
          zAxys={zAxys}
          color={color}
          size={size}
        />
        <Scale max={max} min={min} />
        <div className="w-80 h-60" ref={this.renderContainer} />
      </div>
    )
  }
}
