import { ATOM_DRAWERS, bondDrawer } from 'routes/DrawMolecule/lib/renderer2d'

const drawBond = (ctx, canvas, bond, atoms) => {
  const atomCoords = bond.atoms.map(uid => {
    const coords = atoms.find(a => a.uid === uid).coords
    return coords
  })
  bondDrawer(ctx, canvas, atomCoords, bond.strength)
}

const drawAtom = (ctx, canvas, atom) => {
  const atomDrawer = ATOM_DRAWERS[atom.symbol]
  const x = atom.coords.x * canvas.width
  const y = atom.coords.y * canvas.height
  atomDrawer(ctx, x, y)
}

export const drawStructure2d = ({ canvas, ctx, atoms, bonds }) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  bonds.forEach(l => drawBond(ctx, canvas, l, atoms))
  atoms.forEach(a => drawAtom(ctx, canvas, a))
}
