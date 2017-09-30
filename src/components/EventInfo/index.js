import React, { Component } from 'react';
import PropTypes from 'prop-types';
import firebase from 'firebase';
import { Divider, Header, Icon } from 'semantic-ui-react';
import moment from 'moment';
import './styles.css';

export default class EventInfo extends Component {
  static propTypes = {
    eventId: PropTypes.string
  };

  constructor() {
    super();
    this.state = {
      eventData: {}
    };
  }

  componentDidMount() {
    const { eventId } = this.props;
    const eventRef = firebase
      .database()
      .ref()
      .child('events')
      .child(eventId);
    eventRef.on('value', snap => {
      const eventData = snap.val();
      this.setState(
        {
          eventData
        },
        () => console.log('EventInfo state', this.state)
      );
    });
  }

  render() {
    const { eventData } = this.state;
    const { location = {} } = eventData;
    return (
      <div className="EventInfo">
        <Header as="h1" content={eventData.name} />
        <Divider />
        <Header as="h3">
          <Icon name="marker" />
          <Header.Content>
            <a
              target="_blank"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                location.name
              )}`}
            >
              {location.name}
            </a>
            <Header.Subheader>{location.address}</Header.Subheader>
          </Header.Content>
        </Header>
        <Header as="h3">
          <Icon name="time" />
          <Header.Content>
            {moment(eventData.startDateTime).format('dddd MMMM D, YYYY h:mm A')}
            <Header.Subheader>
              -{' '}
              {moment(eventData.endDateTime).format('dddd MMMM D, YYYY h:mm A')}
            </Header.Subheader>
          </Header.Content>
        </Header>
      </div>
    );
  }
}
