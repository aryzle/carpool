import React from 'react';
import firebase from 'firebase';
import { Card, Icon, Label } from 'semantic-ui-react';
import moment from 'moment';

const handleDelete = (personId, eventId) => () =>
  firebase
    .database()
    .ref(`events/${eventId}/persons/${personId}`)
    .remove();

const PassengerCard = ({ passenger, eventId }) => {
  const {
    name,
    email,
    address,
    city,
    state,
    earliestDepartureDateTime,
    latestReturnDateTime,
    info
  } = passenger;

  return (
    <Card>
      <Card.Content>
        <Card.Header>{name}</Card.Header>
        <Card.Meta>
          {email}
          <br />
          {`${address ? `${address},` : ''} ${city}, ${state} `}
        </Card.Meta>
        <Card.Description>
          The earliest I can leave
          <Label
            content={
              earliestDepartureDateTime
                ? moment(earliestDepartureDateTime).format('ddd h:mm a')
                : 'any time'
            }
            pointing="left"
            icon="time"
            basic
          />
          <br />
          I'd like to be back by
          <Label
            content={
              latestReturnDateTime
                ? moment(latestReturnDateTime).format('ddd h:mm a')
                : 'any time'
            }
            pointing="left"
            icon="time"
            basic
          />
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Icon name="user" />
        {info}
        <Icon
          color="red"
          name="trash outline"
          style={{ float: 'right' }}
          onClick={handleDelete(passenger.id, eventId)}
          link
        />
      </Card.Content>
    </Card>
  );
};

export default PassengerCard;
