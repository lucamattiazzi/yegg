import React from 'react'

export const Result = ({ results, constants }) => {
  return (
    <div className="flex flex-column">
      {
        results.length !== 0 &&
        <div className="f2 tc">Results</div>
      }
      <div className="w-100 flex flex-column items-center justify-center">
        {
          results.map((res, idx) => (
            <div className="pv2 w-100 ph1 flex flex-column" key={idx} style={{ color: res.dimension.color }}>
              <div className="f4 fw6">{res.dimension.color}</div>
              <div className="f5 fw2">
                <li>DISTANCE MAX: {Math.floor(res.all.max)}</li>
                <li>DISTANCE MODE: {res.median}</li>
                <li>DISTANCE AVG: {res.avg}</li>
                <li>DISTANCE STD: {res.std}</li>
                <li>FREQUENCY MAX: {res.maxBar}</li>
                <li>TIMES CROSSED: {res.all.crossed} / {constants.TIMES}</li>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}
