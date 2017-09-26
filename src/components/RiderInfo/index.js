import React, { Component } from 'react'
import PropTypes from 'prop-types'
import firebase from 'firebase'
import { Label } from 'semantic-ui-react'
import chrisJPG from '../../static/chris.jpg'
import './styles.css'

export default class RiderInfo extends Component {
  static propTypes = {
    riderId: PropTypes.string,
    eventId: PropTypes.string
  }

  constructor() {
    super()
    this.state = {
      eventData: {}
    }
  }

  componentDidMount() {
    const { riderId, eventId } = this.props
    const eventRef = firebase.database().ref().child('events').child(eventId)
    const personRef = eventRef.child('persons').child(riderId)
    personRef.on('value', snap => {
      const riderData = snap.val()
      this.setState({
        riderData
      })
      console.log('riderData', this.state)
    })
  }

  render() {
    const { riderData = {} } = this.state
    return (
      <div className="RiderInfo">
        <Label image>
          <img src={chrisJPG} />
          {riderData.name}
        </Label>
      </div>
    );
  }
}
