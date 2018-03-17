import { MOUSE_STATES, DRAWING_THROTTLE, ATOM_CLASS, BOND_CLASS, ATOM_RADIUS_MULTIPLIER_2D } from 'routes/DrawMolecule/constants/index'
import { ATOMS } from 'routes/DrawMolecule/constants/atoms'
import { uploadLine, getCenter, distancePointLine, atomFilled } from 'routes/DrawMolecule/lib/utils'
import { drawLine } from 'routes/DrawMolecule/lib/renderer2d'
import uuidv4 from 'uuid/v4'
const { setTimeout, clearTimeout } = window

export class Drawer2d {
  constructor(canvas, ctx, state) {
    this.canvas = canvas
    this.ctx = ctx
    this.state = state
    this.ws = state.ws
    this.canvas.addEventListener('click', this.handleClick)
    this.canvas.addEventListener('mousedown', this.handleMouseDown)
    this.canvas.addEventListener('mousemove', this.handleMouseMove)
    this.canvas.addEventListener('mouseup', this.handleMouseUp)
    this.startingAtom = undefined
    this.line = []
    this.word = []
    this.hoveredEntity = undefined
  }

  // BASIC HANDLERS

  handleClick = e => {
    if (e.metaKey) {
      this.removeEntity(this.hoveredEntity)
    }
  }

  handleMouseDown = e => {
    if (e.metaKey) {
      console.log('remove!')
    } else if (
      e.altKey &&
      this.hoveredEntity &&
      this.hoveredEntity.class === ATOM_CLASS
    ) {
      this.state.setMouseState(MOUSE_STATES.MOVING_ATOM)
    } else if (this.hoveredEntity && this.hoveredEntity.class) {
      this.startingAtom = this.hoveredEntity
      this.state.setMouseState(MOUSE_STATES.DRAWING_BOND)
    } else {
      this.state.setMouseState(MOUSE_STATES.DRAWING_ATOM)
      clearTimeout(this.stopDrawingAtomTimeout)
    }
  }

  handleMouseMove = e => {
    switch (this.state.mouseState) {
      case MOUSE_STATES.DRAGGING_ATOM:
        return
      case MOUSE_STATES.DRAWING_ATOM:
      case MOUSE_STATES.DRAWING_BOND:
        this.hover(e)
        return this.drawLine(e)
      case MOUSE_STATES.MOVING_ATOM:
        return this.moveAtom(e)
      default:
        return this.hover(e)
    }
  }

  handleMouseUp = e => {
    switch (this.state.mouseState) {
      case MOUSE_STATES.DRAGGING_ATOM:
        return this.stopDraggingAtom(e)
      case MOUSE_STATES.DRAWING_ATOM:
        return this.stopDrawingAtom(e)
      case MOUSE_STATES.DRAWING_BOND:
        return this.stopDrawingBond(e)
      case MOUSE_STATES.MOVING_ATOM:
        return this.stopMovingAtom(e)
      default:
        return null
    }
  }

  // COMMON

  mouseStateIn = (...states) => {
    return states.indexOf(this.state.mouseState) !== -1
  }

  hover = e => {
    this.hoveredEntity = this.detectEntity(e)
  }

  removeEntity = () => {
    if (this.hoveredEntity === undefined) return
    if (this.hoveredEntity.class === ATOM_CLASS) {
      this.state.removeAtom(this.hoveredEntity)
    } else if (this.hoveredEntity.class === BOND_CLASS) {
      this.state.removeBond(this.hoveredEntity)
    }
  }

  detectEntity = e => {
    const entity = this.detectAtom(e) || this.detectBond(e)
    return entity
  }

  drawLine = e => {
    const [ x, y ] = [ e.pageX, e.pageY ]
    this.line.push([x, y])
    drawLine(this.ctx, this.line)
  }

  // ATOM

  stopDrawingAtom = () => {
    this.word.push(this.line)
    this.line = []
    clearTimeout(this.stopDrawingAtomTimeout)
    this.stopDrawingAtomTimeout = setTimeout(this.decodeAtom, DRAWING_THROTTLE)
    this.state.setMouseState(MOUSE_STATES.IDLE)
  }

  decodeAtom = async () => {
    const result = await uploadLine(this.word, this.ws)
    const allowedAtoms = Object.keys(ATOMS)
    if (allowedAtoms.indexOf(result) === -1) {
      this.state.drawMolecule()
      this.word = []
    } else {
      const center = getCenter(this.word, this.canvas)
      const atom = ATOMS[result]
      this.state.addAtom({ ...atom, coords: center, uid: uuidv4(), class: ATOM_CLASS })
      this.word = []
    }
  }

  detectAtom = e => {
    const atoms = this.state.currentAtoms
    const [ x, y ] = [ e.pageX, e.pageY ]
    const selectedAtom = atoms.find(a => {
      const x0 = a.coords.x * this.canvas.width
      const y0 = a.coords.y * this.canvas.height
      const dist = Math.sqrt((x0 - x) ** 2 + (y0 - y) ** 2)
      return dist < ATOM_RADIUS_MULTIPLIER_2D
    })
    return selectedAtom
  }

  stopMovingAtom = e => {
    this.state.setMouseState(MOUSE_STATES.IDLE)
  }

  moveAtom = e => {
    const atom = this.hoveredEntity
    const x = e.pageX / this.canvas.width
    const y = e.pageY / this.canvas.height
    this.state.moveAtom(atom.uid, { x, y })
  }

  stopDraggingAtom = e => {
    const atom = this.state.draggingAtom
    const x = e.pageX / this.canvas.width
    const y = e.pageY / this.canvas.height
    const center = { x, y }
    this.state.addAtom({ ...atom, coords: center, uid: uuidv4(), class: ATOM_CLASS })
    this.state.draggingStop()
    this.state.setMouseState(MOUSE_STATES.IDLE)
  }

  // LINK

  resetDrawing = () => {
    this.state.drawMolecule()
    this.startingAtom = undefined
    this.state.setMouseState(MOUSE_STATES.IDLE)
  }

  stopDrawingBond = e => {
    this.line = []
    if (
      !this.hoveredEntity ||
      this.hoveredEntity.class !== ATOM_CLASS ||
      this.hoveredEntity.uid === this.startingAtom.uid ||
      !atomFilled(this.startingAtom, this.state.currentBonds) ||
      !atomFilled(this.hoveredEntity, this.state.currentBonds)
    ) return this.resetDrawing()
    const bond = this.state.currentBonds.find(l => (
      l.atoms.indexOf(this.startingAtom.uid) !== -1 &&
      l.atoms.indexOf(this.hoveredEntity.uid) !== -1
    )) || {
      uid: uuidv4(),
      atoms: [this.startingAtom.uid, this.hoveredEntity.uid],
      strength: 0,
      class: BOND_CLASS,
    }
    if (bond.strength === 3) {
      return this.resetDrawing()
    }
    this.state.addBond({ ...bond, strength: bond.strength + 1 })
    this.startingAtom = undefined
    this.state.setMouseState(MOUSE_STATES.IDLE)
  }

  detectBond = e => {
    const bonds = this.state.currentBonds
    const atoms = this.state.currentAtoms
    const [ x, y ] = [ e.pageX, e.pageY ]
    const selectedBond = bonds.find(b => {
      const [ l1, l2 ] = atoms.filter(a => (
        b.atoms.indexOf(a.uid) !== -1
      )).map(a => ({
        x: a.coords.x * this.canvas.width,
        y: a.coords.y * this.canvas.height,
      }))
      const p0 = { x, y }
      const dist = distancePointLine(l1, l2, p0)
      return dist < ATOM_RADIUS_MULTIPLIER_2D
    })
    return selectedBond
  }
}
