import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Home from './containers/Home'
import Event from './containers/Event'
import LoginForm from './containers/Login/Login'
import './App.css'
import './css/core.css'

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Route exact path="/" component={Home}/>
          <Route path="/login" component={LoginForm} />
          <Route path="/e/:eventId" component={Event} />
        </div>
      </Router>
    )
  }
}

export default App
