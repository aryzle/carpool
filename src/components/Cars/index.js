import React, { Component } from 'react'
import firebase from 'firebase'
import carSmall from '../../static/car-small.svg'
import './styles.css'

export default class Cars extends Component {
  constructor() {
    super()
    this.state = {
      carData: {},
      carIds: []
    }
  }

  componentDidMount() {
    const eventRef = firebase.database().ref().child('events').child('f04bdaed-7414-48a5-a96f-0f1f2bb0ff5b')
    const carRef = eventRef.child('cars')
    const personRef = eventRef.child('persons')
    carRef.on('value', snap => {
      const carData = snap.val()
      const carIds = Object.keys(carData)
      carIds.map(id => {
        const car = carData[id]
        personRef.child(car.driver).on('value', snap => {
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
      console.log(this.state)
    })
  }

  render() {
    const {carData, carIds } = this.state
    return (
      <div className="Waitlist">
        <h2>Cars</h2>
        {carIds.map(id => {
          const car = carData[id]
          return (
            <div key={id} className="car">
              <img className="image" src={carSmall} alt="small car" />
              <p>{`driver: ${car.driver.name}`} -- {`${car.seats} seats`}</p>
              <p>{`Departure: ${new Date(car.departureTime)}`}</p>
            </div>
          )
        })}
      </div>
    );
  }
}
