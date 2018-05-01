import React from 'react'

export const Stats = ({ stats }) => {
  return (
    <div className="flex flex-column w-100 flex-auto justify-center items-center">
      {
        stats.map(({ name, value }, idx) => {
          return <div key={idx}>{name} - {value}</div>
        })
      }
    </div>
  )
}
