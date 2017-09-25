import React, { Component } from 'react'
import firebase from 'firebase'

export default class Waitlist extends Component {
  constructor() {
    super()
    this.state = {
      personData: {},
      personIds: []
    }
  }

  componentDidMount() {
    const personRef = firebase.database().ref().child('events').child('f04bdaed-7414-48a5-a96f-0f1f2bb0ff5b').child('persons')
    personRef.on('value', snap => {
      const personData = snap.val()
      this.setState({
        personData,
        personIds: Object.keys(personData)
      })
      console.log(this.state)
    })
  }

  render() {
    const {personData, personIds } = this.state
    return (
      <div className="Waitlist">
        <h2>Waitlist</h2>
        {personIds.map(id => {
          const person = personData[id]
          return (!person.car && <p key={id}>{`${person.name} -- Location: ${person.location}`}</p>)
        })}
      </div>
    );
  }
}
