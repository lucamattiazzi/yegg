import TrackballControls from 'three-trackballcontrols'
const { requestAnimationFrame } = window

export class Drawer3d {
  constructor(scene, camera, renderer) {
    this.camera = camera
    this.scene = scene
    this.renderer = renderer
    this.controls = new TrackballControls(this.camera, this.renderer.domElement)
    this.controls.target.set(0, 0, 0)
    this.controls.rotateSpeed = 1.0
    this.controls.zoomSpeed = 4
    this.controls.panSpeed = 0.8
    this.controls.noZoom = false
    this.controls.noPan = false
    this.controls.staticMoving = true
    this.camera.position.z = 10
    this.animate()
  }

  animate = () => {
    requestAnimationFrame(this.animate)
    this.controls.update()
    this.renderer.render(this.scene, this.camera)
  }
}
