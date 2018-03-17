import { ATOM_RADIUS_MULTIPLIER_3D } from 'routes/DrawMolecule/constants/index'
import * as THREE from 'three'
import { MeshLine, MeshLineMaterial } from 'three.meshline'
const OPACITY = 0.3
const DIVISOR = 50
const BASE_DELTA = 0.15
const LINE_WIDTH = 0.07
const COLOR = new THREE.Color('#CCCCCC')

const drawAtom = (color, letter, radius) => {
  const geometry = new THREE.SphereBufferGeometry(radius * ATOM_RADIUS_MULTIPLIER_3D, 16, 16)
  const material = new THREE.MeshBasicMaterial({ color })
  return (scene, canvas, coords, center) => {
    const { width, height } = canvas.getSize()
    const x = (coords.x - center[0]) * width / DIVISOR
    const y = -(coords.y - center[1]) * height / DIVISOR
    const sphere = new THREE.Mesh(geometry, material)
    scene.add(sphere)
    sphere.position.set(x, y, 0)
  }
}

export const bondDrawer = (scene, canvas, atoms, center, strength) => {
  const { width, height } = canvas.getSize()
  const [ xAtom0, yAtom0, xAtom1, yAtom1 ] = [
    (atoms[0].coords.x - center[0]) * width / DIVISOR,
    -(atoms[0].coords.y - center[1]) * height / DIVISOR,
    (atoms[1].coords.x - center[0]) * width / DIVISOR,
    -(atoms[1].coords.y - center[1]) * height / DIVISOR,
  ]
  const angle = Math.atan2(yAtom1 - yAtom0, xAtom1 - xAtom0)
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  const cosNorm = angle > 0
    ? Math.sqrt(1 - cos ** 2)
    : -Math.sqrt(1 - cos ** 2)
  const sinNorm = angle > Math.PI
    ? Math.sqrt(1 - sin ** 2)
    : -Math.sqrt(1 - sin ** 2)
  const bonds = Array.from({ length: strength })
  bonds.forEach((_, idx, all) => {
    const middle = (all.length + 1) / 2
    const delta = BASE_DELTA * ((idx + 1) - middle)
    const [ x0, y0, x1, y1 ] = [
      xAtom0 + delta * cosNorm,
      yAtom0 + delta * sinNorm,
      xAtom1 + delta * cosNorm,
      yAtom1 + delta * sinNorm,
    ]
    const geometry = new THREE.Geometry()
    geometry.vertices.push(new THREE.Vector3(x0, y0, 0))
    geometry.vertices.push(new THREE.Vector3(x1, y1, 0))
    const line = new MeshLine()
    line.setGeometry(geometry)
    const material = new MeshLineMaterial({ color: COLOR, lineWidth: LINE_WIDTH })
    const mesh = new THREE.Mesh(line.geometry, material)
    scene.add(mesh)
  })
}

export const ATOM_DRAWERS = {
  O: drawAtom(`rgba(255, 0, 0, ${OPACITY})`, 'O', 0.66),
  C: drawAtom(`rgba(0, 0, 255, ${OPACITY})`, 'C', 0.76),
  H: drawAtom(`rgba(255, 255, 255, ${OPACITY})`, 'H', 0.31),
  S: drawAtom(`rgba(255, 255, 0, ${OPACITY})`, 'S', 1.05),
  N: drawAtom(`rgba(127, 127, 127, ${OPACITY})`, 'N', 0.71),
  P: drawAtom(`rgba(255, 165, 0, ${OPACITY})`, 'P', 1.4),
}
