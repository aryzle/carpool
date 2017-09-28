import React, { Component } from 'react'
import { DropTarget } from 'react-dnd'
import PropTypes from 'prop-types'
import firebase from 'firebase'
import { Icon } from 'semantic-ui-react'
import moment from 'moment'
import AddPerson from '../../modals/AddPerson'
import Passenger from '../../Passenger'
import { toArr } from '../../../utils'
import { ItemTypes } from '../../../Constants'
import carSmall from '../../../static/car-small.svg'
import './styles.css'
import Driver from "./Driver"

const passengerTarget = {
  canDrop(props) {
    const { car = {} } = props
    const { seats, passengers = {} } = car

    return seats > Object.keys(passengers).length
  },

  drop(props, monitor) {
    const { eventId, car: { id: carId } } = props
    const { passengerId, carId: oldCarId } = monitor.getItem('passengerId')
    if (oldCarId) {
      firebase.database().ref(`events/${eventId}/cars/${oldCarId}/passengers`).update({
        [passengerId]: null
      })
    }
    firebase.database().ref(`events/${eventId}/persons/${passengerId}`).update({
      car: carId
    })
    firebase.database().ref(`events/${eventId}/cars/${carId}/passengers`).update({
      [passengerId]: true
    })
  }
}

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  }
}

class CarRow extends Component {
  static propTypes = {
    eventId: PropTypes.string,
    car: PropTypes.object,
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired
  }

  renderRiderIcons({ id, passengers = {}, seats }) {
    const { eventId } = this.props
    const passengersArr = toArr(Object.keys(passengers), passengers)
    const seatsLeft = seats - passengersArr.length
    let emptySeats = []

    for(let i=0; i<seatsLeft; i++) {
      emptySeats.push(<AddPerson key={i} eventId={eventId} trigger={<Icon link size="big" name="add user"/>} carId={id} />)
    }

    return (
      <div className="riders">
        {passengersArr.map(p => <Icon key={p.id} link size="large" name="user" />)}
        {emptySeats}
      </div>
    )
  }

  render() {
    const { eventId, car, connectDropTarget, isOver, canDrop } = this.props
    const { passengers = {} } = car
    return (
      connectDropTarget(
        <div className="CarRow" style={{
          backgroundColor: isOver && canDrop && 'yellow'
        }}>
          <img className="CarRow-image" src={carSmall} alt="small car" />
          <div className="CarRow-center">
            <Driver driverId={car.driver} eventId={eventId} />
            <p className="CarRow-center-depTime">{`Departure: ${moment(car.departureDateTime).format('MMM Do, h:mm a')}`}</p>
            {this.renderRiderIcons(car)}
          </div>
          <div className="CarRow-right">
            <p>Passengers</p>
            {Object.keys(passengers).map(passengerId => <Passenger key={passengerId} passengerId={passengerId} carId={car.id} eventId={eventId} />)}
          </div>
        </div>
      )
    )
  }
}

export default DropTarget(ItemTypes.PASSENGER, passengerTarget, collect)(CarRow)