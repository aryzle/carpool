import React, { Component } from 'react'
import PropTypes from 'prop-types'
import firebase from 'firebase'
import AddCar from '../modals/AddCar'
import CarRow from './CarRow'
import './styles.css'

export default class Cars extends Component {
  static propTypes = {
    eventId: PropTypes.string
  }
  state = {
    carIds: []
  }

  componentDidMount() {
    const { eventId } = this.props
    const eventRef = firebase.database().ref().child('events').child(eventId)
    const carRef = eventRef.child('cars')

    carRef.on('value', snap => {
      const carData = snap.val()
      const carIds = Object.keys(carData)
      this.setState({
        carIds
      }, () => console.log('Cars state', this.state))
    })
  }

  render() {
    const { eventId } = this.props
    const { carIds } = this.state
    return (
      <div className="Cars">
        <h2>Cars</h2>
        <div className="Cars-list">
          {carIds.map(id => <CarRow carId={id} eventId={eventId} />)}
        </div>
        <AddCar eventId={eventId} />
      </div>
    );
  }
}
