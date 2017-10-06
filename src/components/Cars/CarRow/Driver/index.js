import React, { Component } from 'react'
import PropTypes from 'prop-types'
import firebase from 'firebase'
import { Label, Popup } from 'semantic-ui-react'
import DriverCard from './Card'
import chrisJPG from '../../../../static/chris.jpg'
import adeJPG from '../../../../static/ade.jpg'
import defaultUserJPG from '../../../../static/default-user.jpg'
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
      this.setState(
        {
          driverData
        },
        () => console.log('Driver state', this.state)
      )
    })
  }

  render() {
    const { eventId } = this.props
    const { driverData } = this.state
    let imgSrc = defaultUserJPG

    if (driverData.gender === 'M') imgSrc = chrisJPG
    if (driverData.gender === 'F') imgSrc = adeJPG

    return (
      <div>
        <Popup
          trigger={
            <Label as="a" color="teal" image>
              <img src={imgSrc} alt="chris" />
              {driverData.name}
              <Label.Detail>Driver</Label.Detail>
            </Label>
          }
          content={<DriverCard passenger={driverData} eventId={eventId} />}
          closeOnDocumentClick={false}
          hideOnScroll
          on="click"
        />
      </div>
    )
  }
}
