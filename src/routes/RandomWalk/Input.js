import React from 'react'

export const Input = ({ setValue, color, size, addDimension }) => {
  return (
    <div className="flex flex-column items-center justify-center bb b--black pb2">
      <div className="flex items-center justify-around w-100 pv2">
        <div className="flex flex-column items-center justify-center w-60">
          <label className="w-100 tc">Color</label>
          <input
            className="w-100 tc"
            type="text"
            onChange={setValue('color')}
            value={color}
          />
        </div>
        <div className="flex flex-column items-center justify-center w-30">
          <label className="w-100 tc">Size</label>
          <input
            className="w-100 tc"
            type="integer"
            min={1}
            max={1000}
            onChange={setValue('size')}
            value={size}
          />
        </div>
      </div>
      <input type="submit" value="Add dimension" onClick={addDimension} />
    </div>
  )
}
