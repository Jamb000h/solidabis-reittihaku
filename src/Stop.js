import React from 'react'

export const Stop = ({ stop, index }) => {
  let lineColor = 'lightgrey'
  switch (stop.line) {
    case 'keltainen':
      lineColor = 'yellow'
      break
    case 'punainen':
      lineColor = 'red'
      break
    case 'vihreä':
      lineColor = 'green'
      break
    case 'sininen':
      lineColor = 'blue'
      break
    default:
      break
  }
  return (
    <div className="stop">
      <div
        className={`stop__line-indicator ${lineColor} stop__line-indicator--index-${index}`}
      >
        <span className="stop__duration">{stop.roadDuration} min</span>
      </div>
      <span className="stop__name">{stop.name}</span>
    </div>
  )
}
