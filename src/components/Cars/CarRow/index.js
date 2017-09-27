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

const passengerTarget = {
  drop(props, monitor) {
    const { eventId, carId } = props
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
    isOver: monitor.isOver()
  }
}

class CarRow extends Component {
  static propTypes = {
    eventId: PropTypes.string,
    carId: PropTypes.string,
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired
  }

  state = {
    carData: {}
  }

  componentDidMount() {
    const { eventId, carId } = this.props
    const eventRef = firebase.database().ref().child('events').child(eventId)
    const carRef = eventRef.child('cars').child(carId)
    carRef.on('value', snap => {
      const carData = snap.val()
      this.setState({
        carData
      }, () => console.log('CarRow state', this.state))
    })
  }

  renderRiderIcons({ id, passengers = {}, seats }) {
    const { eventId } = this.props
    const passengersArr = toArr(Object.keys(passengers), passengers)
    const seatsLeft = seats - passengersArr.length
    let emptySeats = []

    for(let i=0; i<seatsLeft; i++) {
      emptySeats.push(<AddPerson eventId={eventId} trigger={<Icon link size="big" name="add user"/>} carId={id} />)
    }

    return (
      <div className="riders">
        {passengersArr.map(_ => <Icon link size="large" name="user"/>)}
        {emptySeats}
      </div>
    )
  }

  render() {
    const { eventId, carId, connectDropTarget, isOver } = this.props
    const { carData } = this.state
    const { passengers = {} } = carData
    return (
      connectDropTarget(
        <div className="CarRow" style={{
          backgroundColor: isOver && 'yellow'
        }}>
          <img className="CarRow-image" src={carSmall} alt="small car" />
          <div className="CarRow-center">
            <p>{`driver: ${carData.driver}`} -- {`${carData.seats} seats`}</p>
            <p>{`Departure: ${moment(carData.departureDateTime).format('MMM Do, h:mm a')}`}</p>
            {this.renderRiderIcons(carData)}
          </div>
          <div className="CarRow-right">
            <p>Passengers</p>
            {Object.keys(passengers).map(passengerId => <Passenger key={passengerId} passengerId={passengerId} carId={carId} eventId={eventId} />)}
          </div>
        </div>
      )
    )
  }
}

export default DropTarget(ItemTypes.PASSENGER, passengerTarget, collect)(CarRow)