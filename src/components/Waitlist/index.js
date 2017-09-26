import React, { Component } from 'react'
import PropTypes from 'prop-types'
import firebase from 'firebase'
import AddPerson from '../modals/AddPerson'
import './styles.css'

export default class Waitlist extends Component {
  static propTypes = {
    eventId: PropTypes.string
  }
  state = {
    personData: {},
    personIds: []
  }

  componentDidMount() {
    const { eventId } = this.props
    const personRef = firebase.database().ref().child('events').child(eventId).child('persons')
    personRef.on('value', snap => {
      const personData = snap.val()
      this.setState({
        personData,
        personIds: Object.keys(personData)
      })
      console.log('Waitlist state', this.state)
    })
  }

  render() {
    const { eventId } = this.props
    const {personData, personIds } = this.state
    return (
      <div className="Waitlist">
        <h2>Waitlist</h2>
        {personIds.map(id => {
          const person = personData[id]
          return (!person.car && <p key={id}>{`${person.name} -- ${person.city}`}</p>)
        })}
        <AddPerson eventId={eventId} />
      </div>
    );
  }
}
