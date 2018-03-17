import { ATOM_DRAWERS, bondDrawer } from 'routes/DrawMolecule/lib/renderer3d'
import { max, min } from 'lodash'

const drawAtom = (scene, canvas, atom, center) => {
  const atomDrawer = ATOM_DRAWERS[atom.symbol]
  atomDrawer(scene, canvas, atom.coords, center)
}

const drawBond = (scene, canvas, bond, center, allAtoms) => {
  const atoms = bond.atoms.map(uid => allAtoms.find(a => a.uid === uid))
  bondDrawer(scene, canvas, atoms, center, bond.strength)
}

export const drawStructure3d = ({ camera, canvas, scene, atoms, bonds }) => {
  while (scene.children.length) {
    scene.remove(scene.children[0])
  }
  const xValues = atoms.map(a => a.coords.x)
  const yValues = atoms.map(a => a.coords.y)
  const extent = {
    x0: min(xValues),
    y0: min(yValues),
    x1: max(xValues),
    y1: max(yValues),
  }
  const center = [ extent.x1 - extent.x0, extent.y1 - extent.y0 ]
  bonds.forEach(l => drawBond(scene, canvas, l, center, atoms))
  atoms.forEach(a => drawAtom(scene, canvas, a, center))
}
