import React, { Component } from 'react'
import PropTypes from 'prop-types'
import firebase from 'firebase'
import moment from 'moment'
import AddCar from '../modals/AddCar'
import carSmall from '../../static/car-small.svg'
import './styles.css'

export default class Cars extends Component {
  static propTypes = {
    eventId: PropTypes.string
  }
  state = {
    carData: {},
    carIds: []
  }

  componentDidMount() {
    const { eventId } = this.props
    const eventRef = firebase.database().ref().child('events').child(eventId)
    const carRef = eventRef.child('cars')
    const personRef = eventRef.child('persons')
    carRef.on('value', snap => {
      const carData = snap.val()
      const carIds = Object.keys(carData)
      carIds.map(id => {
        const car = carData[id]
        return personRef.child(car.driver).on('value', snap => {
          carData[id] = {
            ...carData[id],
            driver: snap.val()
          }
        })
      })
      this.setState({
        carData,
        carIds
      })
      console.log('Cars state', this.state)
    })
  }

  render() {
    const { eventId } = this.props
    const {carData, carIds } = this.state
    return (
      <div className="Cars">
        <h2>Cars</h2>
        {carIds.map(id => {
          const car = carData[id]
          return (
            <div key={id} className="car">
              <img className="image" src={carSmall} alt="small car" />
              <p>{`driver: ${car.driver.name}`} -- {`${car.seats} seats`}</p>
              <p>{`Departure: ${moment(car.departureDateTime).format('MMM Do, h:mm a')}`}</p>
            </div>
          )
        })}
        <AddCar eventId={eventId} />
      </div>
    );
  }
}
