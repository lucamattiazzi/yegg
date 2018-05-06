import React from 'react'

export const Input = ({ setValue, independentVars, dependentVars, xAxys, yAxys, zAxys, color, size }) => {
  return (
    <div className="absolute top-2 right-2 flex">
      <div className="flex flex-column items-center">
        <span>X axys</span>
        <select className="mv2" selected={xAxys} onChange={setValue('xAxys')}>
          { independentVars.map(cat => <option key={`xAxys-${cat}`} value={cat}>{cat}</option>) }
        </select>
      </div>
      <div className="flex flex-column items-center">
        <span>Y axys</span>
        <select className="mv2" selected={yAxys} onChange={setValue('yAxys')}>
          { independentVars.map(cat => <option key={`yAxys-${cat}`} value={cat}>{cat}</option>) }
        </select>
      </div>
      <div className="flex flex-column items-center">
        <span>Z axys</span>
        <select className="mv2" selected={zAxys} onChange={setValue('zAxys')}>
          { independentVars.map(cat => <option key={`zAxys-${cat}`} value={cat}>{cat}</option>) }
        </select>
      </div>
      <div className="flex flex-column items-center">
        <span>Size</span>
        <select className="mv2" selected={size} onChange={setValue('size')}>
          { dependentVars.map(cat => <option key={`size-${cat}`} value={cat}>{cat}</option>) }
        </select>
      </div>
      <div className="flex flex-column items-center">
        <span>Color</span>
        <select className="mv2" selected={color} onChange={setValue('color')}>
          { dependentVars.map(cat => <option key={`color-${cat}`} value={cat}>{cat}</option>) }
        </select>
      </div>
    </div>
  )
}
