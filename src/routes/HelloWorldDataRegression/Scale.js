import React from 'react'
import { round } from 'lodash'

export const Scale = ({ max, min }) => {
  const style = {
    width: 40,
    height: 40,
  }
  return (
    <div className="absolute top-2 left-2 flex">
      <div className="flex flex-column items-center mh3 mb2">
        <span>{round(min, 4)}</span>
        <span style={style} className="bg-white" />
      </div>
      <div className="flex flex-column items-center mh3 mb2">
        <span>{round(max, 4)}</span>
        <span style={style} className="bg-black" />
      </div>
    </div>
  )
}
