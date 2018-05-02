const fs = require('fs')
const levDist = require('fast-levenshtein')
const statCalc = require('stats-lite')
const { sortBy, map, uniq } = require('lodash')
const { lower } = require('alphabet')

const CHARACTER_SET = [...lower, ' ']
const CONVERGED_LIMIT = 100
const KEY_ITERATIONS = 20
const randomLetter = () => CHARACTER_SET[Math.floor(Math.random() * CHARACTER_SET.length)]
const randomString = length => () => Array.from({ length }, randomLetter).join('')

const stream = fs.createWriteStream('./genetic-hello-world-results.json', { flags: 'a' })

const SEEDS = [
  Array.from({ length: KEY_ITERATIONS }, (_, idx) => ({ key: 'seedNumber', value: 10 + idx * 5 })),
  Array.from({ length: KEY_ITERATIONS }, (_, idx) => ({ key: 'survivalRate', value: 0.1 + idx * (1 - 0.1) / (KEY_ITERATIONS - 1) })),
  Array.from({ length: KEY_ITERATIONS }, (_, idx) => ({ key: 'mutationRate', value: 0.01 + idx * (1 - 0.01) / (KEY_ITERATIONS - 1) })),
  Array.from({ length: KEY_ITERATIONS }, (_, idx) => ({ key: 'goal', value: randomString(idx + 5)() })),
]

const cartesianProd = array => {
  const output = []
  let jdx
  if (!array || array.length === 0) return array

  const firstRow = array.splice(0, 1)[0]
  const newArray = cartesianProd(array)
  for (let idx = 0; idx < firstRow.length; idx++) {
    if (newArray && newArray.length !== 0) {
      for (jdx = 0; jdx < newArray.length; jdx++) {
        output.push([firstRow[idx]].concat(newArray[jdx]))
      }
    } else {
      output.push([firstRow[idx]])
    }
  }
  return output
}

const allPermutations = cartesianProd(SEEDS)

class GeneticGenerator {
  constructor({ seedNumber, survivalRate, mutationRate, goal }) {
    this.seedNumber = seedNumber
    this.mutationRate = mutationRate
    this.survivalRate = survivalRate
    this.goal = goal
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

  generateNewLineage() {
    const best = this.currentGeneration.slice(0, Math.round(this.survivalRate * this.currentGeneration.length))
    const remaining = this.currentGeneration.length - best.length
    const coupled = this.coupler(best)
    const generated = Array.from({ length: remaining }, (_, idx) => {
      const couple = coupled[idx % coupled.length]
      const letters = Array.from({ length: this.goal.length }, (__, jdx) => {
        const mutation = Math.random() <= this.mutationRate
        if (mutation) return randomLetter()
        const parent = couple[Math.round(Math.random())]
        return parent.string[jdx]
      })
      const string = letters.join('')
      const dist = levDist.get(this.goal, string)
      return { string, dist }
    })
    const newGeneration = [ ...generated, ...best ]
    this.currentGeneration = sortBy(newGeneration, 'dist')
  }

  checkIfOver() {
    if (this.allGenerations.length < CONVERGED_LIMIT) return false
    const allLastBests = map(this.allGenerations.slice(-CONVERGED_LIMIT), l => l[0].dist)
    return uniq(allLastBests).length === 1
  }

  getStats() {
    const lastDistance = map(this.allGenerations.slice(-1)[0], 'dist')
    return [
      { name: 'iterations', value: this.allGenerations.length },
      { name: 'mean', value: statCalc.mean(lastDistance) },
      { name: 'median', value: statCalc.median(lastDistance) },
      { name: 'mode', value: statCalc.mode(lastDistance) },
      { name: 'stdev', value: statCalc.stdev(lastDistance) },
      { name: 'best', value: this.currentGeneration[0].string },
    ]
  }

  runUntilConvergence() {
    this.allGenerations = [this.currentGeneration]
    while (true) {
      this.generateNewLineage()
      this.allGenerations.push(this.currentGeneration)
      if (this.checkIfOver()) break
    }
    const stats = this.getStats()
    return { stats }
  }
}

const run = () => {
  allPermutations.forEach((env, idx) => {
    if (idx % 100 === 0) { console.log(`${idx} / ${allPermutations.length}`) }
    const params = env.reduce((acc, { key, value }) => ({ ...acc, [key]: value }), {})
    const gg = new GeneticGenerator(params)
    const { stats } = gg.runUntilConvergence()
    const objectStats = stats.reduce((acc, { name, value }) => ({ ...acc, [name]: value }), {})
    const results = { ...objectStats, ...params }
    stream.write(`${JSON.stringify(results)}\n`)
  })
  stream.end()
}

run()
