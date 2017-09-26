import React, { Component } from 'react'
import PropTypes from 'prop-types'
import firebase from 'firebase'
import moment from 'moment'
import { Icon } from 'semantic-ui-react'
import AddCar from '../modals/AddCar'
import { toArr } from '../../utils'
import carSmall from '../../static/car-small.svg'
import './styles.css'
import AddPerson from "../modals/AddPerson/index"

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

  renderRiders({ id, riders = {}, seats }) {
    const { eventId } = this.props
    const ridersArr = toArr(Object.keys(riders), riders)
    const seatsLeft = seats - ridersArr.length
    let emptySeats = []

    for(let i=0; i<seatsLeft; i++) {
      emptySeats.push(<AddPerson eventId={eventId} trigger={<Icon name="add user"/>} carId={id} />)
    }

    return (
      <div className="riders">
        {ridersArr.map(rider => <Icon name="user"/>)}
        {emptySeats}
      </div>
    )
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
              {this.renderRiders(car)}
            </div>
          )
        })}
        <AddCar eventId={eventId} />
      </div>
    );
  }
}
