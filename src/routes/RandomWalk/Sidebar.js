import React from 'react'
import { Input } from 'routes/RandomWalk/Input'
import { Dimensions } from 'routes/RandomWalk/Dimensions'
import { Result } from 'routes/RandomWalk/Result'

export const Sidebar = props => {
  const {
    dimensions,
    size,
    color,
    results,
    constants,
    setValue,
    addDimension,
    removeDimension,
    startWalking,
  } = props
  return (
    <div className="w-100 h-100 flex flex-column items-center justify-between">
      <div className="w-100 flex flex-column items-center">
        {
          dimensions.length < 5 &&
          <Input
            setValue={setValue}
            color={color}
            size={size}
            addDimension={addDimension}
          />
        }
        <Dimensions
          dimensions={dimensions}
          removeDimension={removeDimension}
        />
        <input type="submit" value="Start" onClick={startWalking} />
      </div>
      <Result results={results} constants={constants} />
    </div>
  )
}
