import React from 'react'

export const Button = ({ text, clickHandler }) => {
  return (
    <div className="flex flex-column h-100 justify-center items-center">
      <div
        className="pa2 pointer bg-blue"
        onClick={clickHandler}
      >
        { text }
      </div>
    </div>
  )
}
