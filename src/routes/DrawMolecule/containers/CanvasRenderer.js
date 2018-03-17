import React from 'react'
import { observer, inject } from 'mobx-react'
import { Drawer3d } from 'routes/DrawMolecule/lib/drawer3d'
import * as THREE from 'three'

@inject('state')
@observer
export class CanvasRenderer extends React.Component {
  containerRendered = div => {
    const { state } = this.props
    const width = div.offsetWidth
    const height = div.offsetHeight
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    const canvas = new THREE.WebGLRenderer()
    canvas.setSize(width, height)
    div.appendChild(canvas.domElement)
    this.canvas = new Drawer3d(scene, camera, canvas)
    state.setContext3d(scene, camera, canvas)
  }

  render() {
    return (
      <div ref={this.containerRendered} className={this.props.className} />
    )
  }
}
