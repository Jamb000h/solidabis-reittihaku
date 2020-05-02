import React, { useReducer } from 'react'
import { Stop } from './Stop'
import './App.css'
import reittiData from './reittiopas.json'
import { calculateRoute, findRoute } from './utils/routeUtils'

function App() {
  const [route, setRoute] = useReducer(
    calculateRoute,
    findRoute(reittiData.pysakit[0], reittiData.pysakit[1])
  )

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
              value={route.from}
              onChange={e => {
                setRoute({ type: 'setFrom', from: e.target.value })
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
              value={route.to}
              onChange={e => {
                setRoute({ type: 'setTo', to: e.target.value })
              }}
            >
              {reittiData.pysakit
                .filter(stop => stop !== route.from)
                .map((stop, index) => (
                  <option key={index} value={stop}>
                    {stop}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <div className="route">
          {route.route.map((stop, index) => (
            <Stop
              stop={stop}
              key={index}
              index={index}
              previousStop={index > 0 ? route.route[index - 1] : undefined}
            />
          ))}

          <span className="duration">
            Total travel time: {route.route[route.route.length - 1].duration}{' '}
            min
          </span>
        </div>
      </main>
    </div>
  )
}

export default App
