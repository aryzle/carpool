import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Event from './containers/Event'
import './App.css'

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <div className="App-header">
            <h1>Carpool</h1>
          </div>
          <Route path="/e/:eventId" component={Event} />
        </div>
      </Router>
    )
  }
}

export default App
