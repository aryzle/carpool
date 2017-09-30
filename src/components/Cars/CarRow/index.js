import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';
import PropTypes from 'prop-types';
import firebase from 'firebase';
import { Button, Confirm, Icon, Image, Segment } from 'semantic-ui-react';
import moment from 'moment';
import { ItemTypes } from '../../../Constants';
import AddPerson from '../../modals/AddPerson';
import Passenger from '../../Passenger';
import Driver from './Driver';
import './styles.css';
import carSmall from '../../../static/car-small.svg';
import carMedium from '../../../static/car-medium.svg';

const passengerTarget = {
  canDrop(props, monitor) {
    const { car: { id: carId, seats, passengers = {} } } = props;
    const { carId: oldCarId } = monitor.getItem();

    return seats > Object.keys(passengers).length && carId !== oldCarId;
  },

  drop(props, monitor) {
    const { eventId, car: { id: carId } } = props;
    const { passengerId, carId: oldCarId } = monitor.getItem('passengerId');
    if (oldCarId) {
      firebase
        .database()
        .ref(`events/${eventId}/cars/${oldCarId}/passengers`)
        .update({
          [passengerId]: null
        });
    }
    firebase
      .database()
      .ref(`events/${eventId}/persons/${passengerId}`)
      .update({
        car: carId
      });
    firebase
      .database()
      .ref(`events/${eventId}/cars/${carId}/passengers`)
      .update({
        [passengerId]: true
      });
  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  };
}

class CarRow extends Component {
  static propTypes = {
    eventId: PropTypes.string,
    car: PropTypes.object,
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired
  };
  state = {
    showConfirm: false
  };

  deleteCar = () => {
    const { eventId, car } = this.props;
    const { passengers = {} } = car;

    Promise.all(
      Object.keys(passengers).map(id =>
        firebase
          .database()
          .ref(`events/${eventId}/persons/${id}/car`)
          .remove()
      )
    ).then(() =>
      firebase
        .database()
        .ref(`/events/${eventId}/cars/${car.id}`)
        .remove()
    );
  };

  showConfirm = () => this.setState({ showConfirm: true });
  handleCancel = () => this.setState({ showConfirm: false });

  renderRiderIcons({ id, passengers = {}, seats }) {
    const { eventId } = this.props;
    const passengerIds = Object.keys(passengers);
    const seatsLeft = seats - passengerIds.length;
    let emptySeats = [];

    for (let i = 0; i < seatsLeft; i++) {
      emptySeats.push(
        <AddPerson
          key={i}
          eventId={eventId}
          trigger={<Icon link size="big" color="teal" name="add user" />}
          carId={id}
        />
      );
    }

    return (
      <div className="CarRow-passengers">
        {passengerIds.map(id => (
          <Icon key={id} size="large" name="user" color="teal" disabled />
        ))}
        {emptySeats}
      </div>
    );
  }

  render() {
    const { eventId, car, connectDropTarget, isOver, canDrop } = this.props;
    const { showConfirm } = this.state;
    const {
      passengers = {},
      driver,
      departureDateTime,
      returnDateTime,
      label
    } = car;

    return connectDropTarget(
      <div
        className="CarRow"
        style={{
          backgroundColor: isOver && canDrop && '#EEE'
        }}
      >
        <Segment
          raised
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            backgroundColor: 'inherit',
            margin: '5px 0'
          }}
        >
          <Image
            label={{
              color: 'teal',
              content: label,
              size: 'small',
              ribbon: 'right'
            }}
            className="CarRow-image"
            src={car.seats > 4 ? carMedium : carSmall}
            alt="small car"
          />
          <div className="CarRow-center">
            <p className="CarRow-center-time">{`Leaving at: ${departureDateTime
              ? `${moment(departureDateTime).format('MMM Do, h:mm a')}`
              : 'open'}`}</p>
            <p className="CarRow-center-time">{`Returning by: ${returnDateTime
              ? `${moment(returnDateTime).format('MMM Do, h:mm a')}`
              : 'open'}`}</p>
            <Driver driverId={driver} eventId={eventId} />
            {this.renderRiderIcons(car)}
          </div>
          <div className="CarRow-right">
            <p>Passengers</p>
            {Object.keys(passengers).map(passengerId => (
              <Passenger
                key={passengerId}
                passengerId={passengerId}
                carId={car.id}
                eventId={eventId}
              />
            ))}
          </div>
          <Button
            icon="delete"
            color="red"
            size="mini"
            attached="right"
            style={styles}
            onClick={this.showConfirm}
            inverted
          />
          <Confirm
            open={showConfirm}
            content="Are you sure? The driver will also be deleted and all of the passengers will be notified and moved to the Waitlist."
            confirmButton="Delete"
            onCancel={this.handleCancel}
            onConfirm={this.deleteCar}
          />
        </Segment>
      </div>
    );
  }
}

const mql = window.matchMedia('(max-width: 425px)');
const styles = {
  height: '30px',
  position: 'absolute',
  right: mql.matches ? null : 10,
  left: mql.matches ? 10 : null
};

export default DropTarget(ItemTypes.PASSENGER, passengerTarget, collect)(
  CarRow
);
