import React, { Component } from 'react'
import { DropTarget } from 'react-dnd'
import PropTypes from 'prop-types'
import firebase from 'firebase'
import { Header, List } from 'semantic-ui-react'
import PersonModal from '../modals/Person'
import Passenger from '../Passenger'
import { normToArr, sortByDepartureDateTime } from '../../utils/index'
import { ItemTypes } from '../../Constants'
import './styles.css'

const { bool, func, string } = PropTypes

const passengerTarget = {
  drop(props, monitor) {
    const { eventId, departure } = props
    const { passengerId, carId } = monitor.getItem()
    const passengerPath = departure ? 'depPassengers' : 'retPassengers'
    const carPath = departure ? 'depCar' : 'retCar'

    firebase
      .database()
      .ref(`events/${eventId}/persons/${passengerId}`)
      .update({
        [carPath]: null
      })
    firebase
      .database()
      .ref(`events/${eventId}/cars/${carId}/${passengerPath}`)
      .update({
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
    departure: bool,
    eventId: string,
    connectDropTarget: func.isRequired,
    isOver: bool.isRequired
  }
  state = {
    personData: {},
    personArr: []
  }

  componentDidMount() {
    const { eventId } = this.props
    const personsRef = firebase.database().ref(`events/${eventId}/persons`)

    personsRef.on('value', snap => {
      const personData = snap.val() || {}
      const personArr = normToArr({
        ids: Object.keys(personData),
        data: personData
      }).sort(sortByDepartureDateTime)

      this.setState(
        {
          personData,
          personArr
        },
        () => console.log('Waitlist state', this.state)
      )
    })
  }

  render() {
    const { departure, eventId, connectDropTarget, isOver } = this.props
    const { personArr } = this.state

    return connectDropTarget(
      <div
        style={{
          height: '100%',
          backgroundColor: isOver && '#EEE'
        }}
      >
        <Header as="h2">Waitlist</Header>
        <PersonModal eventId={eventId} departure={departure} />
        <div style={listContainerStyles}>
          <List>
            {personArr
              .filter(p => (departure ? !p.depCar : !p.retCar))
              .filter(p => !p.car)
              .map(({ id }) => (
                <List.Item key={`${id}-List.Item`}>
                  <List.Content>
                    <Passenger
                      inline
                      key={id}
                      passengerId={id}
                      eventId={eventId}
                    />
                  </List.Content>
                </List.Item>
              ))}
          </List>
        </div>
      </div>
    )
  }
}

const listContainerStyles = {
  height: 'calc(75vh - 125px)',
  overflowY: 'auto',
  marginTop: '15px',
  textAlign: 'left'
}

export default DropTarget(ItemTypes.PASSENGER, passengerTarget, collect)(
  Waitlist
)
