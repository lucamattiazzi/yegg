import { observable, action, reaction, toJS, computed } from 'mobx'
import { MOUSE_STATES } from './constants/index'
import { drawStructure2d } from './lib/structure2d'
import { drawStructure3d } from './lib/structure3d'
const { localStorage, WebSocket } = window

const connectWebSocket = () => {
  const ws = new WebSocket('wss://server.yegg.it/decoder')
  ws.onmessage = e => {
    console.log(e.data)
    return false
  }
  ws.onopen = () => console.log('Connected, MARONN!')
  return ws
}

class State {
  constructor() {
    this.ws = connectWebSocket()
    this.canvas2d = undefined
    this.context2d = undefined
    this.camera3d = undefined
    this.reglCtx3d = undefined
    this.oldState = localStorage.getItem('molecule')
      ? JSON.parse(localStorage.getItem('molecule'))
      : {}
  }

  @observable atoms = this.oldState.atoms || []

  @observable bonds = this.oldState.bonds || []

  @observable draggingAtom = undefined

  mouseState = MOUSE_STATES.IDLE

  addAtom = atom => {
    this.atoms = [ ...this.atoms, atom ]
  }

  removeAtom = atom => {
    this.bonds = this.bonds.filter(l => (
      l.atoms.indexOf(atom.uid) === -1
    ))
    this.atoms = this.atoms.filter(a => a.uid !== atom.uid)
  }

  moveAtom = (uid, coords) => {
    const newAtom = {
      ...this.atoms.find(a => a.uid === uid),
      coords,
    }
    this.atoms = [
      ...this.atoms.filter(a => a.uid !== uid),
      newAtom,
    ]
  }

  reset = () => {
    this.bonds = []
    this.atoms = []
    localStorage.clear()
  }

  logStructure = () => {
    const structure = JSON.parse(window.localStorage.getItem('molecule'))
    console.log(structure)
  }

  addBond = bond => {
    this.bonds = [
      ...this.bonds.filter(l => l.uid !== bond.uid),
      bond,
    ]
  }

  removeBond = bond => {
    if (bond.strength === 1) {
      this.bonds = this.bonds.filter(l => l.uid !== bond.uid)
    } else {
      const newBond = { ...bond, strength: bond.strength - 1 }
      this.bonds = [
        ...this.bonds.filter(l => l.uid !== bond.uid),
        newBond,
      ]
    }
  }

  @action.bound
  setMouseState(state) {
    this.mouseState = state
  }

  @action.bound
  draggingStart(atom) {
    this.mouseState = MOUSE_STATES.DRAGGING_ATOM
    this.draggingAtom = atom
  }

  @action.bound
  draggingStop() {
    this.draggingAtom = undefined
    this.mouseState = MOUSE_STATES.IDLE
  }

  @action.bound
  saveState() {
    const atoms = toJS(this.atoms)
    const bonds = toJS(this.bonds)
    const state = JSON.stringify({ atoms, bonds })
    localStorage.setItem('molecule', state)
  }

  @action.bound
  setContext2d(canvas, ctx) {
    this.canvas2d = canvas
    this.context2d = ctx
    setTimeout(this.drawMolecule, 0) // WHY? WHY??
  }

  @action.bound
  setContext3d(scene, camera, renderer) {
    this.camera3d = camera
    this.scene3d = scene
    this.canvas3d = renderer
    setTimeout(this.drawMolecule, 0) // WHY? WHY??
  }

  @action.bound
  drawMolecule() {
    this.context2d &&
    drawStructure2d({
      canvas: this.canvas2d,
      ctx: this.context2d,
      atoms: toJS(this.atoms),
      bonds: toJS(this.bonds),
    })
    this.scene3d &&
    drawStructure3d({
      camera: this.camera3d,
      canvas: this.canvas3d,
      scene: this.scene3d,
      atoms: toJS(this.atoms),
      bonds: toJS(this.bonds),
    })
  }

  @computed
  get currentAtoms() {
    return toJS(this.atoms)
  }

  @computed
  get currentBonds() {
    return toJS(this.bonds)
  }
}

export const createState = () => {
  const newState = new State()
  reaction(
    () => this.a.atoms,
    atoms => {
      this.a.saveState()
      this.a.drawMolecule()
    },
    newState
  )

  reaction(
    () => this.a.bonds,
    bonds => {
      this.a.saveState()
      this.a.drawMolecule()
    },
    newState
  )
  return newState
}
