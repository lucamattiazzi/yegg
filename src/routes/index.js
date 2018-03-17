import { Dices } from 'routes/Dices'
import { RandomWalk } from 'routes/RandomWalk'
import { DrawMolecule } from 'routes/DrawMolecule'

const routes = [
  {
    path: '/dices',
    route: 'Dices',
    component: Dices,
    description: 'n-faced dice throw error correlation on face number.',
  },
  {
    path: '/random-walk',
    route: 'Multidimensional random walk',
    component: RandomWalk,
    description: 'Random walk distance frequency correlation on multidimensional space',
  },
  {
    path: '/draw-molecule',
    route: 'Molecule Drawing',
    component: DrawMolecule,
    description: 'Draw molecules with bonds and see them in 3d. Drag atoms or write their symbol (and wait quite a lot :/)',
  },
]

export { routes }
