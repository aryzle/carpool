import React, { Component } from 'react'
import PropTypes from 'prop-types'
import firebase from 'firebase'
import { Label } from 'semantic-ui-react'
import chrisJPG from '../../../../static/chris.jpg'
import './styles.css'

export default class Driver extends Component {
  static propTypes = {
    driverId: PropTypes.string,
    eventId: PropTypes.string
  }

  state = {
    driverData: {}
  }

  componentDidMount() {
    const { driverId, eventId } = this.props
    const eventRef = firebase.database().ref(`events/${eventId}`)
    const personRef = eventRef.child('persons').child(driverId)
    personRef.on('value', snap => {
      const driverData = snap.val()
      this.setState({
        driverData
      }, () => console.log('Driver state', this.state))
    })
  }

  render() {
    const { driverData } = this.state
    return (
      <div>
        <Label image>
          <img src={chrisJPG} alt="chris" />
          {driverData.name}
          <Label.Detail>Driver</Label.Detail>
        </Label>
      </div>
    )
  }
}