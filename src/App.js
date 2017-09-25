import React, { Component } from 'react'
import Event from './components/Event'
import Waitlist from './components/Waitlist'
import Cars from "./components/Cars/index"
import './App.css'

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h1>Carpool</h1>
        </div>
        <Event />
        <Waitlist />
        <Cars />
      </div>
    )
  }
}

export default App
