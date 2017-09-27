import React, { Component } from 'react'
import { DropTarget } from 'react-dnd'
import PropTypes from 'prop-types'
import firebase from 'firebase'
import AddPerson from '../modals/AddPerson'
import Passenger from '../Passenger'
import { ItemTypes } from '../../Constants'
import './styles.css'

const passengerTarget = {
  drop(props, monitor) {
    const { eventId } = props
    const { passengerId, carId } = monitor.getItem()
    firebase.database().ref(`events/${eventId}/persons/${passengerId}`).update({
      car: null
    })
    firebase.database().ref(`events/${eventId}/cars/${carId}/passengers`).update({
      [passengerId]: null
    })
  }
}

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  }
}

class Waitlist extends Component {
  static propTypes = {
    eventId: PropTypes.string,
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired
  }
  state = {
    personData: {},
    personIds: []
  }

  componentDidMount() {
    const { eventId } = this.props
    const personsRef = firebase.database().ref().child('events').child(eventId).child('persons')
    personsRef.on('value', snap => {
      const personData = snap.val()
      this.setState({
        personData,
        personIds: Object.keys(personData)
      }, () => console.log('Waitlist state', this.state))
    })
  }

  render() {
    const { eventId, connectDropTarget, isOver } = this.props
    const {personData, personIds } = this.state
    return (
      connectDropTarget(
        <div className="Waitlist" style={{
          backgroundColor: isOver && 'yellow'
        }}>
          <h2>Waitlist</h2>
          <div className="Waitlist-passengers">
            {personIds.map(id => {
              const person = personData[id]
              return (!person.car && <Passenger key={id} inline passengerId={id} eventId={eventId} />)
            })}
          </div>
          <AddPerson eventId={eventId} />
        </div>
      )
    )
  }
}

export default DropTarget(ItemTypes.PASSENGER, passengerTarget, collect)(Waitlist)
