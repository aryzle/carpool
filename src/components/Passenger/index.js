import React, { Component } from 'react'
import { DragSource } from 'react-dnd'
import PropTypes from 'prop-types'
import firebase from 'firebase'
import { Label, Popup } from 'semantic-ui-react'
import moment from 'moment'
import { ItemTypes } from '../../Constants'
import PassengerCard from './Card'
import chrisJPG from '../../static/chris.jpg'
import adeJPG from '../../static/ade.jpg'
import defaultUserJPG from '../../static/default-user.jpg'
import './styles.css'

const passengerSource = {
  beginDrag(props) {
    return {
      passengerId: props.passengerId,
      carId: props.carId
    }
  }
}

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

class Passenger extends Component {
  static propTypes = {
    passengerId: PropTypes.string,
    eventId: PropTypes.string,
    carId: PropTypes.string,
    inline: PropTypes.bool,
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired
  }

  state = {
    passengerData: {}
  }

  componentDidMount() {
    const { passengerId, eventId } = this.props
    const personRef = firebase
      .database()
      .ref(`events/${eventId}/persons/${passengerId}`)
    personRef.on('value', snap => {
      const passengerData = snap.val()
      this.setState({
        passengerData
      })
    })
  }

  componentWillUnmount() {
    const { passengerId, eventId } = this.props
    const personRef = firebase
      .database()
      .ref(`events/${eventId}/persons/${passengerId}`)
    personRef.off()
  }

  render() {
    const { connectDragSource, isDragging, inline, eventId } = this.props
    const { passengerData } = this.state
    const { car, name, city, earliestDepartureDateTime, gender } = passengerData
    let imgSrc = defaultUserJPG

    if (gender === 'M') imgSrc = chrisJPG
    if (gender === 'F') imgSrc = adeJPG

    return connectDragSource(
      <div
        className="PassengerInfo"
        style={{
          opacity: isDragging ? 0.5 : 1,
          display: inline && 'inline-block',
          cursor: 'move'
        }}
      >
        <Popup
          trigger={
            <Label image basic color={car ? 'teal' : 'blue'}>
              <img src={imgSrc} alt="image" />
              <div className="ellipsis">
                {name}@{city}
              </div>
              {!car && (
                <Label.Detail>
                  {earliestDepartureDateTime
                    ? moment(earliestDepartureDateTime).format('ddd h:mm a')
                    : 'open'}
                </Label.Detail>
              )}
            </Label>
          }
          content={
            <PassengerCard passenger={passengerData} eventId={eventId} />
          }
          closeOnDocumentClick={false}
          hideOnScroll
          on="click"
        />
      </div>
    )
  }
}

export default DragSource(ItemTypes.PASSENGER, passengerSource, collect)(
  Passenger
)
