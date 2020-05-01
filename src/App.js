import React, { useState, useEffect } from 'react'
import { Stop } from './Stop'
import './App.css'
import reittiData from './reittiopas.json'

function App() {
  const [from, setFrom] = useState(reittiData.pysakit[0])
  const [to, setTo] = useState(reittiData.pysakit[1])
  const [route, setRoute] = useState(undefined)

  useEffect(() => {
    const route = findRoute(from, to)
    setRoute(route)
  }, [from, to])

  const removePassedStopsNotOnRoute = (passedStops, currentStop) => {
    const stops = [currentStop]
    let stopOnRoute = passedStops.find(
      stop => stop.name === currentStop.previousStop
    )
    stops.push(stopOnRoute)

    // Early return
    if (stopOnRoute.name === from) {
      return stops.reverse()
    }

    while (true) {
      if (stopOnRoute.previousStop === from) {
        return [
          ...stops,
          passedStops.find(stop => stop.name === from),
        ].reverse()
      }
      stopOnRoute = passedStops.find(
        stop => stop.name === stopOnRoute.previousStop
      )
      stops.push(stopOnRoute)
    }
  }

  const getClosestLine = (road, passedStops) => {
    // Start from the longest line
    let lines = Object.entries(reittiData.linjastot)
      .sort((a, b) => a[1].length - b[1].length)
      .reverse()

    if (passedStops.length > 1) {
      // If we have passed two stops, we are on some line, so let's actually try to stay on that one
      const currentLine = passedStops[passedStops.length - 1].line
      // Remove current line from wherever it is hiding and ensure it is processed first
      lines = [
        lines.find(line => line[0] === currentLine),
        ...lines.filter(line => line[0] !== currentLine),
      ]
    }

    // Separate names and stops as we were using [name, stops] pairs earlier
    const lineNames = lines.map(line => line[0])
    const lineStops = lines.map(line => line[1])

    // Go through all lines
    for (let i = 0; i < lineStops.length; i++) {
      // Go through all stops for a line
      for (let j = 0; j < lineStops[i].length; j++) {
        // If we find our road's starting point
        if (lineStops[i][j] === road.mista) {
          // Make sure we are not at the start of the line
          if (j > 0) {
            if (lineStops[i][j - 1] === road.mihin) {
              // Aww yiss this line goes through this road
              return lineNames[i]
            }
          }

          // Make sure we are not at the end of the line
          if (j < lineStops[i].length - 1) {
            // Aww yiss this line goes through this road
            if (lineStops[i][j + 1] === road.mihin) {
              return lineNames[i]
            }
          }
        }
      }
    }

    // Return false if no movement available
    return false
  }

  const getRoadsFromCurrentStop = (reittiData, currentStop, passedStops) =>
    reittiData.tiet
      // Get all roads that connect to current stop
      .filter(
        road =>
          road.mihin === currentStop.name || road.mista === currentStop.name
      )
      // Remove roads that connect to stops that have been passed already
      .filter(road =>
        passedStops.every(
          passedStop =>
            road.mista !== passedStop.name && road.mihin !== passedStop.name
        )
      )
      // Normalize roads to always be from current stop to somewhere else
      .map(road => {
        if (road.mista === currentStop.name) {
          return road
        }

        return { ...road, mista: road.mihin, mihin: road.mista }
      })

  const findRoute = (from, to) => {
    // Initialize variables
    const passedStops = []

    let currentStop = {
      name: from,
      duration: 0,
      previousStop: undefined,
    }

    // Remove starting stop from remaining stops
    let remainingStops = reittiData.pysakit
      .filter(stop => stop !== currentStop.name)
      .map(stop => ({
        name: stop,
        duration: Infinity,
        previousStop: undefined,
      }))

    // Yay Dijkstra
    while (remainingStops.length > 0) {
      // Get roads from current stop
      const roadsFromCurrentStop = getRoadsFromCurrentStop(
        reittiData,
        currentStop,
        passedStops
      )

      // Check for all roads if they're the fastest route to their target stop
      roadsFromCurrentStop.forEach(road => {
        // Calculate closest line for the road (hopefully the same the user is riding already)
        const closestLine = getClosestLine(road, passedStops)
        if (closestLine !== false) {
          // Get the road's other (not the current) stop from remaining stops
          const nextStop = remainingStops.find(stop => stop.name === road.mihin)

          // If we can get to the other stop faster than before, update its route to go through current stop
          if (road.kesto + currentStop.duration < nextStop.duration) {
            // Get index
            const nextStopIndex = remainingStops.findIndex(
              stop => stop.name === nextStop.name
            )
            // Aaaaand update
            remainingStops[nextStopIndex] = {
              ...nextStop,
              duration: road.kesto + currentStop.duration,
              roadDuration: road.kesto,
              previousStop: currentStop.name,
              line: closestLine,
            }
          }
        }
      })

      // Great, one stop passed
      passedStops.push(currentStop)
      // Sort remaining stop to have the closest stop on top
      remainingStops.sort((a, b) => a.duration - b.duration).reverse()
      // Pick a new stop and remove it from remaining stops
      currentStop = remainingStops.pop()

      // If we would next process our target stop, return it!
      if (currentStop.name === to) {
        return {
          from: from,
          to: to,
          duration: currentStop.duration,
          route: removePassedStopsNotOnRoute(passedStops, currentStop),
        }
      }
    }

    // If no route between stops
    return false
  }

  return (
    <div>
      <header className="header">
        <h1>Find a route</h1>
      </header>
      <main className="main">
        <div className="inputs">
          <div>
            <label htmlFor="from">Origin: </label>
            <select
              name="from"
              id="from"
              value={from}
              onChange={e => {
                setFrom(e.target.value)
              }}
            >
              {reittiData.pysakit.map((stop, index) => (
                <option key={index} value={stop}>
                  {stop}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="to">Destination: </label>
            <select
              name="to"
              id="to"
              value={to}
              onChange={e => {
                setTo(e.target.value)
              }}
            >
              {reittiData.pysakit
                .filter(stop => stop !== from)
                .map((stop, index) => (
                  <option key={index} value={stop}>
                    {stop}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <div className="route">
          {route !== undefined && route.route !== undefined && (
            <span className="description">
              Route from stop {from} to stop {to}
            </span>
          )}
          {route !== undefined &&
            route.route !== undefined &&
            route.route
              .reverse()
              .map((stop, index) => (
                <Stop stop={stop} key={index} index={index} />
              ))}
          {route !== undefined && route.route !== undefined && (
            <span className="duration">
              Total travel time: {route.route[route.route.length - 1].duration}{' '}
              min
            </span>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
