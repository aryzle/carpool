import React, { Component } from 'react'
import { DropTarget } from 'react-dnd'
import PropTypes from 'prop-types'
import firebase from 'firebase'
import { Button, Confirm, Icon, Image, Label } from 'semantic-ui-react'
import moment from 'moment'
import { ItemTypes } from '../../../Constants'
import PersonModal from '../../modals/Person'
import EditCar from '../../modals/EditCar'
import Passenger from '../../Passenger'
import AddFromWaitlist from '../../modals/AddFromWaitlist'
import Driver from './Driver'
import './styles.css'
import carSmall from '../../../static/car-small.svg'
import carMedium from '../../../static/car-medium.svg'

const { bool, func, object, string } = PropTypes
const mql = window.matchMedia('(max-width: 425px)')

const passengerTarget = {
  canDrop(props, monitor) {
    const {
      car: { id: carId, seats, depPassengers = {}, retPassengers = {} },
      departure
    } = props
    const { carId: oldCarId } = monitor.getItem()
    const passengers = departure ? depPassengers : retPassengers

    return seats > Object.keys(passengers).length && carId !== oldCarId
  },

  drop(props, monitor) {
    const { eventId, car: { id: carId }, departure } = props
    const { passengerId, carId: oldCarId } = monitor.getItem('passengerId')
    const passengerPath = departure ? 'depPassengers' : 'retPassengers'
    const carPath = departure ? 'depCar' : 'retCar'

    if (oldCarId) {
      firebase
        .database()
        .ref(`events/${eventId}/cars/${oldCarId}/${passengerPath}`)
        .update({
          [passengerId]: null
        })
    }
    firebase
      .database()
      .ref(`events/${eventId}/persons/${passengerId}`)
      .update({
        [carPath]: carId
      })
    firebase
      .database()
      .ref(`events/${eventId}/cars/${carId}/${passengerPath}`)
      .update({
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
    car: object,
    departure: bool,
    eventId: string,
    connectDropTarget: func.isRequired,
    isOver: bool.isRequired,
    canDrop: bool.isRequired
  }

  static initialState = {
    removingPassengerId: null,
    showCarDeleteConfirm: false,
    showPassengerRemoveConfirm: false
  }
  state = CarRow.initialState

  deleteCar = () => {
    const { eventId, car } = this.props
    const { depPassengers = {}, retPassengers = {} } = car

    Promise.all([
      ...Object.keys(depPassengers).map(id => {
        firebase
          .database()
          .ref(`events/${eventId}/persons/${id}/depCar`) // remove car from departure passengers
          .remove()
      }),
      ...Object.keys(retPassengers).map(id => {
        firebase
          .database()
          .ref(`events/${eventId}/persons/${id}/retCar`) // remove car from return passengers
          .remove()
      })
    ]).then(() =>
      firebase
        .database()
        .ref(`/events/${eventId}/cars/${car.id}`)
        .remove()
    )
  }

  removePassenger = () => {
    const { eventId, car, departure } = this.props
    const { removingPassengerId } = this.state
    const passengerPath = departure ? 'depPassengers' : 'retPassengers'
    const carPath = departure ? 'depCar' : 'retCar'

    firebase
      .database()
      .ref(
        `/events/${eventId}/cars/${car.id}/${passengerPath}/${removingPassengerId}`
      ) // remove passenger from car
      .remove()

    firebase
      .database()
      .ref(`/events/${eventId}/persons/${removingPassengerId}/${carPath}`) // remove car from person
      .remove()

    this.setState(CarRow.initialState)
  }

  showCarDeleteConfirm = () => this.setState({ showCarDeleteConfirm: true })
  showPassengerRemoveConfirm = passengerId => () =>
    this.setState({
      removingPassengerId: passengerId,
      showPassengerRemoveConfirm: true
    })
  handleCarDeleteCancel = () => this.setState({ showCarDeleteConfirm: false })
  handlePassengerRemoveCancel = () =>
    this.setState({
      removingPassengerId: null,
      showPassengerRemoveConfirm: false
    })

  renderRiderIcons({ id, seats }, passengers) {
    const { departure, eventId } = this.props
    const passengerIds = Object.keys(passengers)
    const seatsLeft = seats - passengerIds.length
    let emptySeats = []

    for (let i = 0; i < seatsLeft; i++) {
      emptySeats.push(
        <PersonModal
          key={i}
          eventId={eventId}
          trigger={<Icon size="big" color="teal" name="add user" link />}
          carId={id}
        />
      )
    }
    mql.matches &&
      emptySeats.push(
        <AddFromWaitlist
          key={seatsLeft}
          departure={departure}
          eventId={eventId}
          trigger={<Icon size="big" color="yellow" name="add user" link />}
          carId={id}
        />
      )

    return (
      <div className="CarRow-passengers">
        {passengerIds.map(id => (
          <Icon key={id} size="large" name="user" color="teal" disabled />
        ))}
        {emptySeats}
      </div>
    )
  }

  render() {
    const {
      car,
      departure,
      eventId,
      connectDropTarget,
      isOver,
      canDrop
    } = this.props
    const { showCarDeleteConfirm, showPassengerRemoveConfirm } = this.state
    const {
      depPassengers,
      retPassengers,
      driver,
      departureDateTime,
      returnDateTime,
      label,
      seats
    } = car
    const passengers = (departure ? depPassengers : retPassengers) || {}

    return connectDropTarget(
      <div
        className="CarRow"
        style={{ backgroundColor: isOver && canDrop && '#EEE' }}
      >
        {seats <= Object.keys(passengers).length && (
          <Label className="CarRow-full" size="tiny" color="red" ribbon>
            Full
          </Label>
        )}
        <Image
          label={
            !!label && {
              color: 'teal',
              content: label,
              size: 'small',
              ribbon: 'right'
            }
          }
          className="CarRow-image"
          src={car.seats > 4 ? carMedium : carSmall}
          alt="car"
        />
        <div className="CarRow-center">
          <p className="CarRow-center-time">{`Leaving at: ${departureDateTime
            ? `${moment(departureDateTime).format('MMM Do, h:mm a')}`
            : 'open'}`}</p>
          <p className="CarRow-center-time">{`Returning by: ${returnDateTime
            ? `${moment(returnDateTime).format('MMM Do, h:mm a')}`
            : 'open'}`}</p>
          <Driver driverId={driver} eventId={eventId} />
          {this.renderRiderIcons(car, passengers)}
        </div>
        <div className="CarRow-right">
          <p>Passengers</p>
          {Object.keys(passengers).map(passengerId => (
            <div key={passengerId} className="PassengerRow">
              <Passenger
                passengerId={passengerId}
                carId={car.id}
                eventId={eventId}
              />
              {mql.matches && (
                <Button
                  icon="delete"
                  color="yellow"
                  size={'small'}
                  className="no-shadow"
                  onClick={this.showPassengerRemoveConfirm(passengerId)}
                  inverted
                />
              )}
            </div>
          ))}
        </div>
        <EditCar
          eventId={eventId}
          car={car}
          trigger={
            <Button
              icon="edit"
              color="orange"
              size={mql.matches ? 'big' : 'small'}
              attached="right"
              className="no-shadow"
              style={editStyles}
              inverted
            />
          }
        />
        <Button
          icon="delete"
          color="red"
          size={mql.matches ? 'big' : 'small'}
          attached="right"
          className="no-shadow"
          style={deleteStyles}
          onClick={this.showCarDeleteConfirm}
          inverted
        />
        <Confirm
          open={showCarDeleteConfirm}
          content="Are you sure? The driver will also be deleted and all of the passengers will be notified and moved to the Waitlist."
          confirmButton="Delete"
          onCancel={this.handleCarDeleteCancel}
          onConfirm={this.deleteCar}
        />
        <Confirm
          open={showPassengerRemoveConfirm}
          content="Are you sure? The passenger will also be moved to the Waitlist."
          confirmButton="Remove"
          onCancel={this.handlePassengerRemoveCancel}
          onConfirm={this.removePassenger}
        />
      </div>
    )
  }
}

const editStyles = {
  padding: '6px',
  position: 'absolute',
  right: mql.matches ? null : 35,
  left: mql.matches ? 47 : null,
  borderRadius: 0
}
const deleteStyles = {
  padding: '6px',
  position: 'absolute',
  right: mql.matches ? null : 10,
  left: mql.matches ? 10 : null,
  borderRadius: 0
}

export default DropTarget(ItemTypes.PASSENGER, passengerTarget, collect)(CarRow)
