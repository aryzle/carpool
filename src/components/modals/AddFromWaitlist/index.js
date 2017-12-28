import React, { Component } from 'react'
import PropTypes from 'prop-types'
import firebase from 'firebase'
import { Button, List, Modal } from 'semantic-ui-react'
import Passenger from '../../Passenger'
import { normToArr } from '../../../utils/index'

export default class AddFromWaitlist extends Component {
  static propTypes = {
    eventId: PropTypes.string.isRequired,
    trigger: PropTypes.element.isRequired,
    carId: PropTypes.string.isRequired
  }

  static initialState = {
    personData: {},
    personArr: [],
    loading: false,
    success: false,
    error: false
  }

  state = AddFromWaitlist.initialState

  handleAdd = personId => () => {
    const { eventId, carId } = this.props
    this.setState({ loading: true })
    firebase
      .database()
      .ref(`events/${eventId}/persons/${personId}`)
      .update({
        car: carId
      })
      .then(() =>
        firebase
          .database()
          .ref(`events/${eventId}/cars/${carId}/passengers`)
          .update({
            [personId]: true
          })
      )
      .catch(e => {
        console.log(e)
        this.setState({ error: true, loading: false })
        setTimeout(() => this.setState({ error: false }), 6000)
      })
  }

  componentDidMount() {
    const { eventId } = this.props
    const personsRef = firebase
      .database()
      .ref(`events/${eventId}/persons`)
      .orderByChild('car')
      .endAt(null)

    personsRef.on('value', snap => {
      const personData = snap.val() || {}
      const personArr = normToArr({
        ids: Object.keys(personData),
        data: personData
      }).sort((a, b) => {
        if (!a.earliestDepartureDateTime) return -1
        if (!b.earliestDepartureDateTime) return 1
        if (a.earliestDepartureDateTime < b.earliestDepartureDateTime) return -1
        if (b.earliestDepartureDateTime < a.earliestDepartureDateTime) return 1
        return 0
      })
      this.setState({ personData, personArr })
    })
  }

  componentWillUpdate() {
    this.fixBody()
  }

  componentDidUpdate() {
    this.fixBody()
  }

  //TODO: track new release for fix
  fixBody() {
    const anotherModal = document.getElementsByClassName('ui page modals')
      .length
    if (anotherModal > 0)
      document.body.classList.add('scrolling', 'dimmable', 'dimmed')
  }

  render() {
    const { eventId, trigger } = this.props
    const {
      personArr
      // loading,
      // success,
      // error
    } = this.state

    return (
      <Modal trigger={trigger} closeIcon>
        <Modal.Header>Add from the Waitlist</Modal.Header>
        <Modal.Content>
          <div style={listWrapperStyle}>
            <List>
              {personArr.map(({ id }) => (
                <List.Item key={`${id}-List.Item`}>
                  <List.Content>
                    <Passenger
                      inline
                      key={id}
                      passengerId={id}
                      eventId={eventId}
                    />
                    <Button
                      icon="add"
                      color="green"
                      floated="right"
                      onClick={this.handleAdd(id)}
                    />
                  </List.Content>
                </List.Item>
              ))}
            </List>
          </div>
        </Modal.Content>
      </Modal>
    )
  }
}

const listWrapperStyle = {
  height: 'calc(75vh - 125px)',
  overflowY: 'auto',
  marginTop: '15px',
  textAlign: 'left'
}
