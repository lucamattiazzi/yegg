import React from 'react'
import { round } from 'lodash'

export const Scale = ({ max, min, score }) => {
  const style = {
    width: 40,
    height: 40,
  }
  return (
    <div className="absolute top-2 left-2 flex items-center">
      <div className="flex flex-column items-center mh3 mb2">
        <span>{round(min, 4)}</span>
        <span style={style} className="bg-white" />
      </div>
      <div className="flex flex-column items-center mh3 mb2">
        <span>{round(max, 4)}</span>
        <span style={style} className="bg-black" />
      </div>
      <div className="flex flex-column items-center mh5 mb2">
        <span>Score: {round(score, 4)}</span>
      </div>
    </div>
  )
}
