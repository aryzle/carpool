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
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired
  }

  state = {
    passengerData: {}
  }

  componentDidMount() {
    const { passengerId, eventId } = this.props
    const eventRef = firebase.database().ref().child('events').child(eventId)
    const personRef = eventRef.child('persons').child(passengerId)
    personRef.on('value', snap => {
      const passengerData = snap.val()
      this.setState({
        passengerData
      }, () => console.log('Passenger state', this.state))
    })
  }

  render() {
    const { connectDragSource, isDragging } = this.props
    const { passengerData } = this.state
    return (
      connectDragSource(
        <div className="PassengerInfo" style={{
          opacity: isDragging ? 0.5 : 1,
          cursor: 'move'
        }}>
          <Label image>
            <img src={chrisJPG} />
            {passengerData.name} - {passengerData.city}
          </Label>
        </div>
      )
    );
  }
}

export default DragSource(ItemTypes.PASSENGER, passengerSource, collect)(Passenger)
