import React, { Component } from 'react'
import { DragSource } from 'react-dnd'
import PropTypes from 'prop-types'
import firebase from 'firebase'
import { Label } from 'semantic-ui-react'
import { ItemTypes } from '../../Constants'
import chrisJPG from '../../static/chris.jpg'
import './styles.css'

const passengerSource = {
  beginDrag(props) {
    return {
      passengerId: props.passengerId,
      carId: props.carId
    };
  }
}

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

class Passenger extends Component {
  static propTypes = {
    passengerId: PropTypes.string,
    eventId: PropTypes.string,
    carId: PropTypes.string,
    inline: PropTypes.bool,
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired
  }

  state = {
    passengerData: {}
  }

  componentDidMount() {
    const { passengerId, eventId } = this.props
    const eventRef = firebase.database().ref(`events/${eventId}`)
    const personRef = eventRef.child('persons').child(passengerId)
    personRef.on('value', snap => {
      const passengerData = snap.val()
      this.setState({
        passengerData
      }, () => console.log('Passenger state', this.state))
    })
  }

  render() {
    const { connectDragSource, isDragging, inline } = this.props
    const { passengerData } = this.state
    return (
      connectDragSource(
        <div className="PassengerInfo" style={{
          opacity: isDragging ? 0.5 : 1,
          display: inline && 'inline-block',
          cursor: 'move'
        }}>
          <Label image color="teal">
            <img src={chrisJPG} alt="chris" />
            {passengerData.name}@{passengerData.city}
            <Label.Detail>Passenger</Label.Detail>
          </Label>
        </div>
      )
    );
  }
}

export default DragSource(ItemTypes.PASSENGER, passengerSource, collect)(Passenger)
