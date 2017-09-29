import React, { Component } from 'react'
import PropTypes from 'prop-types'
import firebase from 'firebase'
import moment from 'moment'
import './styles.css'

export default class EventInfo extends Component {
  static propTypes = {
    eventId: PropTypes.string
  }

  constructor() {
    super()
    this.state = {
      eventData: {}
    }
  }

  componentDidMount() {
    const { eventId } = this.props
    const eventRef = firebase.database().ref().child('events').child(eventId)
    eventRef.on('value', snap => {
      const eventData = snap.val()
      this.setState({
        eventData
      }, () => console.log('EventInfo state', this.state))
    })
  }

  render() {
    const { eventData } = this.state
    const { location = {} } = eventData
    return (
      <div className="EventInfo">
        <h2>{eventData.name}</h2>
        <h3>{location.name}</h3>
        <p>{location.address}</p>
        <p>{moment(eventData.startDateTime).format('MMM Do, h:mm a')} - {moment(eventData.endDateTime).format('MMM Do, h:mm a')}</p>
      </div>
    );
  }
}
