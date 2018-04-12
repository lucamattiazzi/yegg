import Tone from 'tone'
import { valueToFrequency } from './stats'

export const KEYS = [44, 47, 51, 54, 57]

const synth = new Tone.Synth().toMaster()
const wait = ms => new Promise((resolve, reject) => setTimeout(resolve, ms))

export const notesPlayer = async data => {
  let last = 0
  for (let i = 0; i < data.length; i++) {
    const point = data[i]
    const ms = point.coordinates[0] - last
    last = point.coordinates[0]
    await wait(ms * 2)
    const freq = valueToFrequency(point.key)
    synth.triggerAttackRelease(freq, '4n')
  }
}

export const equationPlayer = ({ width, height }, yToNote, drawer) => async fn => {
  const notes = 500
  synth.triggerAttack('C4')
  for (let i = 0; i < notes; i++) {
    const ms = 10
    await wait(ms)
    const x = i * width / notes
    drawer(x)
    const mirroredFrequency = fn(x)
    const frequency = height / 2 + (height / 2 - mirroredFrequency)
    synth.setNote(yToNote(frequency))
  }
  synth.triggerRelease()
}
