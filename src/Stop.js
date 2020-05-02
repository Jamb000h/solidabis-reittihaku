import React from 'react'

export const Stop = ({ stop, index, previousStop }) => {
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

  let lineStatus = ''
  switch (index) {
    case 0:
      break
    case 1:
      lineStatus = 'start'
      break
    default:
      if (stop.line !== previousStop.line) {
        lineStatus = 'change'
      }
  }
  return (
    <div className="stop">
      <div
        className={`stop__line-indicator ${lineColor} stop__line-indicator--index-${index}`}
      >
        {lineStatus === 'start' && (
          <span className="stop__line-change">
            Take a {lineColor} bus from stop {previousStop.name}
          </span>
        )}
        {lineStatus === 'change' && (
          <span className="stop__line-change">
            Switch to a {lineColor} bus at stop {previousStop.name}
          </span>
        )}
        <span className="stop__duration">{stop.roadDuration} min</span>
        <div className="stop__line-arrow"></div>
      </div>
      <span className="stop__name">{stop.name}</span>
    </div>
  )
}
