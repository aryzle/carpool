import React, { Component } from 'react'
import { DropTarget } from 'react-dnd'
import PropTypes from 'prop-types'
import firebase from 'firebase'
import { Container, Header, Label, List } from 'semantic-ui-react'
import moment from 'moment'
import AddPerson from '../modals/AddPerson'
import Passenger from '../Passenger'
import { normToArr } from "../../utils/index"
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
    personArr: []
  }

  componentDidMount() {
    const { eventId } = this.props
    const personsRef = firebase.database().ref(`events/${eventId}/persons`)
      .orderByChild('car')
      .endAt(null)

    personsRef.on('value', snap => {
      const personData = snap.val()
      const personArr = normToArr({ ids: Object.keys(personData), data: personData })
        .sort((a, b) => a.earliestDepartureDateTime > b.earliestDepartureDateTime)
      this.setState({
        personData,
        personArr
      }, () => console.log('Waitlist state', this.state))
    })
  }

  render() {
    const { eventId, connectDropTarget, isOver } = this.props
    const { personArr } = this.state

    return (
      connectDropTarget(
        <div className="Waitlist" style={{
          backgroundColor: isOver && 'yellow'
        }}>
          <Header as="h2">Waitlist</Header>
          <AddPerson eventId={eventId} />
          <List>
            {personArr.map(({ id, earliestDepartureDateTime }) => (
              <List.Item key={`${id}-List.Item`}>
                <List.Content>
                  <Passenger inline key={id} passengerId={id} eventId={eventId} />
                  <Label color="blue" tag>{moment(earliestDepartureDateTime).format('ddd h:mm a')}</Label>
                </List.Content>
              </List.Item>))}
          </List>
        </div>
      )
    )
  }
}

export default DropTarget(ItemTypes.PASSENGER, passengerTarget, collect)(Waitlist)
