import React from 'react'
import { Card, Icon, Label } from 'semantic-ui-react'
import moment from 'moment'
import PersonModal from '../../../../modals/Person'

const DriverCard = ({ passenger, eventId }) => {
  const {
    name,
    email,
    address,
    city,
    state,
    classYear,
    earliestDepartureDateTime,
    latestReturnDateTime,
    info
  } = passenger

  return (
    <Card>
      <Card.Content>
        <Card.Header>
          {name}
          <span style={{ float: 'right' }}>{classYear}</span>
        </Card.Header>
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
        <PersonModal
          eventId={eventId}
          trigger={
            <Icon name="edit" color="yellow" style={{ float: 'right' }} link />
          }
          person={passenger}
        />
      </Card.Content>
    </Card>
  )
}

export default DriverCard
