import { Dices } from 'routes/Dices'
import { RandomWalk } from 'routes/RandomWalk'
import { DrawMolecule } from 'routes/DrawMolecule'
import { Pca2d } from 'routes/Pca2d'
import { Election2d } from 'routes/Election2d'
import { Election3d } from 'routes/Election3d'
import { CutMap } from 'routes/CutMap'
import { MusicRegression } from 'routes/MusicRegression'

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
  {
    path: '/pca2d',
    route: 'PCA 2d',
    component: Pca2d,
    description: 'Do you grok PCA? Me neither!',
  },
  {
    path: '/election-2d',
    route: 'Election PCA2d',
    component: Election2d,
    description: 'Election data plotted from n-dimensionality(where n is party number) to 2. Color represents distance from total.',
  },
  {
    path: '/election-3d',
    route: 'Election PCA3d',
    component: Election3d,
    description: 'Election data plotted from n-dimensionality(where n is party number) to 3. Color represents distance from total.',
  },
  {
    path: '/cut-map',
    route: 'Cut Map',
    component: CutMap,
    description: 'Cut the map',
  },
  {
    path: '/music-regression',
    route: 'Music Regression',
    component: MusicRegression,
    description: 'Music Regression',
  },
]

export { routes }
