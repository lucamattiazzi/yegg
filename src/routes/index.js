import { Dices } from 'routes/Dices'
import { RandomWalk } from 'routes/RandomWalk'

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
]

export { routes }
