import React from 'react'

export const Dimensions = ({ dimensions, removeDimension }) => {
  return (
    <div className="flex flex-column items-center justify-center pa2">
      <div className="f3">Dimensions:</div>
      {
        dimensions.map((dim, idx) => (
          <div
            className="pa1 fw8 f4 w-100"
            key={idx}
            style={{ color: dim.color }}
          >
            <span
              onClick={removeDimension(idx)}
              className="pointer pr3"
            >X</span>
            <span>Size: {dim.size}</span>
          </div>
        ))
      }
    </div>
  )
}
