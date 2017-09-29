import React, { Component } from 'react'
import { DragSource } from 'react-dnd'
import PropTypes from 'prop-types'
import firebase from 'firebase'
import { Card, Icon, Label, Popup } from 'semantic-ui-react'
import moment from 'moment'
import { ItemTypes } from '../../Constants'
import chrisJPG from '../../static/chris.jpg'
import './styles.css'

const passengerSource = {
  beginDrag(props) {
    return {
      passengerId: props.passengerId,
      carId: props.carId
    };
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
    const eventRef = firebase.database().ref(`events/${eventId}`)
    const personRef = eventRef.child('persons').child(passengerId)
    personRef.on('value', snap => {
      const passengerData = snap.val()
      this.setState({
        passengerData
      }, () => console.log('Passenger state', this.state))
    })
  }

  render() {
    const { connectDragSource, isDragging, inline } = this.props
    const { passengerData: { info, car, name, email, city, state, address, earliestDepartureDateTime, latestReturnDateTime } } = this.state
    return (
      connectDragSource(
        <div className="PassengerInfo" style={{
          opacity: isDragging ? 0.5 : 1,
          display: inline && 'inline-block',
          cursor: 'move'
        }}>
          <Popup
            trigger={
              <Label image color={car ? "teal" : "blue"}>
                <img src={chrisJPG} alt="chris" />
                {name}@{city}
                {earliestDepartureDateTime && !car &&
                  <Label.Detail>{moment(earliestDepartureDateTime).format('ddd h:mm a')}</Label.Detail>
                }
              </Label>}
            content={
              <Card>
                <Card.Content>
                  <Card.Header>
                    {name}
                  </Card.Header>
                  <Card.Meta>
                    {email}
                    <br/>
                    {`${address ? `${address},` : ''} ${city}, ${state} `}
                  </Card.Meta>
                  <Card.Description>
                    The earliest I can leave
                    <Label
                      content={earliestDepartureDateTime ? moment(earliestDepartureDateTime).format('ddd h:mm a') : 'any time'}
                      pointing="left"
                      basic
                      />
                    <br/>
                    I'd like to be back by
                    <Label
                      content={latestReturnDateTime ? moment(latestReturnDateTime).format('ddd h:mm a') : 'any time'}
                      pointing="left"
                      basic
                    />
                  </Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <a>
                    <Icon name='user' />
                    {info}
                  </a>
                </Card.Content>
              </Card>}
            on='click'
            hideOnScroll
          />
        </div>
      )
    );
  }
}

export default DragSource(ItemTypes.PASSENGER, passengerSource, collect)(Passenger)
