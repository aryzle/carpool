import React, { Component } from 'react'
import firebase from 'firebase'
import moment from 'moment'

export default class Event extends Component {
  constructor() {
    super()
    this.state = {
      eventData: {}
    }
  }

  componentDidMount() {
    const eventRef = firebase.database().ref().child('events').child('f04bdaed-7414-48a5-a96f-0f1f2bb0ff5b')
    eventRef.on('value', snap => {
      const eventData = snap.val()
      this.setState({
        eventData
      })
      console.log('eventData', this.state)
    })
  }

  render() {
    const { eventData } = this.state
    const { location = {} } = eventData
    return (
      <div className="Event">
        <h2>{eventData.name}</h2>
        <h3>{location.name}</h3>
        <p>{location.address}</p>
        <p>{moment(eventData.beginTime).format('MMM Do, h:mm a')} - {moment(eventData.endTime).format('MMM Do, h:mm a')}</p>
      </div>
    );
  }
}
