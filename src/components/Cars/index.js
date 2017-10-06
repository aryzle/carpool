import React, { Component } from 'react'
import PropTypes from 'prop-types'
import firebase from 'firebase'
import { Header, Item } from 'semantic-ui-react'
import AddCar from '../modals/AddCar'
import CarRow from './CarRow'
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
    const eventRef = firebase
      .database()
      .ref()
      .child('events')
      .child(eventId)
    const carRef = eventRef.child('cars')

    carRef.on('value', snap => {
      const carData = snap.val() || {}
      const carIds = Object.keys(carData)
      this.setState(
        {
          carData,
          carIds
        },
        () => console.log('Cars state', this.state)
      )
    })
  }

  render() {
    const { eventId } = this.props
    const { carIds, carData } = this.state
    return (
      <div className="Cars">
        <Header as="h2">{carIds.length} Cars</Header>
        <AddCar eventId={eventId} />
        <Item.Group>
          {carIds.map(id => (
            <CarRow key={id} car={carData[id]} eventId={eventId} />
          ))}
        </Item.Group>
      </div>
    )
  }
}
