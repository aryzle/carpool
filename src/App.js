import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Home from './containers/Home'
import Event from './containers/Event'
import CreateEvent from './containers/CreateEvent'
import LoginForm from './containers/Login/Login'
import './App.css'
import './css/core.css'
import './css/semantic-overrides.css'

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Route exact path="/" component={Home} />
          <Route path="/login" component={LoginForm} />
          <Route exact path="/e" component={CreateEvent} />
          <Route path="/e/:eventId" component={Event} />
          <Route path="/404" component={() => <h1>Page Not Found</h1>} />
        </div>
      </Router>
    )
  }
}

export default App
