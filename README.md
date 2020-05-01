# Solidabis Reittihaku

This repository contains an application that takes in a specific type of JSON file containing stops, roads and bus lines.
The application then allows the user to choose any origin and destination from the stops and calculates
an optimal route between two stops, while using only the provided bus lines, and displays them nicely to the user.

Built on React/JS. Tested on latest FF/Chrome (Win 10)

## About

Pathfinding is based on Dijkstra's algorithm. The only "optimization" that is built on top of that, is that the user is always
directed to use the same bus line as long as possible in a case where two separate bus lines would have an identical duration
between same stops. Other than that, nothing fancy.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm run build`

Builds the app for production to the `build` folder.<br />

### Thanks

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
