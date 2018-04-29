const levDist = require('fast-levenshtein')
const stats = require('stats-lite')
const { sortBy, map, uniq } = require('lodash')
const { lower } = require('alphabet')

const CHARACTER_SET = [...lower, ' ']
const randomLetter = () => CHARACTER_SET[Math.floor(Math.random() * CHARACTER_SET.length)]
const randomString = length => () => Array.from({ length }, randomLetter).join('')

export class GeneticGenerator {
  constructor({ seedNumber, mutationRate, goal, convergedLimit }) {
    this.seedNumber = seedNumber
    this.mutationRate = mutationRate
    this.goal = goal
    this.convergedLimit = convergedLimit
    this.currentGeneration = this.generateSeeds()
  }

  coupler(group) {
    const bestCouples = group.map(first => {
      const furthest = group.reduce((acc, second) => {
        const dist = levDist.get(first.string, second.string)
        return dist > acc.dist
          ? { ...second, dist }
          : acc
      }, { ...first, dist: 0 })
      return [first, furthest]
    })
    return bestCouples
  }

  generateSeeds() {
    const strings = Array.from({ length: this.seedNumber }, randomString(this.goal.length))
    const seeds = strings.map(string => {
      const dist = levDist.get(this.goal, string)
      return { string, dist }
    })
    return sortBy(seeds, 'dist')
  }

  generateNewLineage = () => {
    const halfBest = this.currentGeneration.slice(0, this.currentGeneration.length / 2)
    const coupled = this.coupler(halfBest)
    const generated = coupled.map(couple => {
      const letters = Array.from({ length: this.goal.length }, (_, idx) => {
        const mutation = Math.random() <= this.mutationRate
        if (mutation) return randomLetter()
        const parent = couple[Math.round(Math.random())]
        return parent.string[idx]
      })
      const string = letters.join('')
      const dist = levDist.get(this.goal, string)
      return { string, dist }
    })
    const newGeneration = [ ...generated, ...halfBest ]
    this.currentGeneration = sortBy(newGeneration, 'dist')
  }

  checkIfOver = () => {
    if (this.allDistances.length < this.convergedLimit) return false
    const allLastBests = map(this.allDistances.slice(-this.convergedLimit), l => l[0].dist)
    return uniq(allLastBests).length === 1
  }

  getStats = () => {
    const lastDistance = this.allDistances.slice(-1)[0]
    return [
      { name: 'mean', value: stats.mean(lastDistance) },
      { name: 'median', value: stats.median(lastDistance) },
      { name: 'mode', value: stats.mode(lastDistance) },
      { name: 'stdev', value: stats.stdev(lastDistance) },
      { name: 'best', value: this.currentGeneration[0].string },
    ]
  }

  runUntilConvergence = () => {
    this.allDistances = [map(this.currentGeneration, 'dist')]
    while (true) {
      this.generateNewLineage()
      const distances = map(this.currentGeneration, 'dist')
      this.allDistances.push(distances)
      console.log(distances)
      if (this.checkIfOver()) break
    }
    return this.getStats()
  }
}
