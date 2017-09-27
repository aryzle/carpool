import React, { Component } from 'react'
import PropTypes from 'prop-types'
import firebase from 'firebase'
import moment from 'moment'
import { Icon } from 'semantic-ui-react'
import { toArr } from '../../utils'
import AddCar from '../modals/AddCar'
import AddPerson from '../modals/AddPerson'
import RiderInfo from '../RiderInfo'
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
    const personsRef = eventRef.child('persons')

    carRef.on('value', snap => {
      const carData = snap.val()
      const carIds = Object.keys(carData)
      carIds.map(id => {
        const car = carData[id]
        return personsRef.child(car.driver).on('value', snap => {
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

  renderRiderIcons({ id, riders = {}, seats }) {
    const { eventId } = this.props
    const ridersArr = toArr(Object.keys(riders), riders)
    const seatsLeft = seats - ridersArr.length
    let emptySeats = []

    for(let i=0; i<seatsLeft; i++) {
      emptySeats.push(<AddPerson eventId={eventId} trigger={<Icon link size="big" name="add user"/>} carId={id} />)
    }

    return (
      <div className="riders">
        {ridersArr.map(rider => <Icon link size="large" name="user"/>)}
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
          const { riders = {} } = car
          return (
            <div key={id} className="car-row">
              <img className="car-image" src={carSmall} alt="small car" />
              <div className="car-center">
                <p>{`driver: ${car.driver.name}`} -- {`${car.seats} seats`}</p>
                <p>{`Departure: ${moment(car.departureDateTime).format('MMM Do, h:mm a')}`}</p>
                {this.renderRiderIcons(car)}
              </div>
              <div className="car-right">
                <p>Passengers</p>
                {Object.keys(riders).map(riderId => <RiderInfo riderId={riderId} eventId={eventId} />)}
              </div>
            </div>
          )
        })}
        <AddCar eventId={eventId} />
      </div>
    );
  }
}
