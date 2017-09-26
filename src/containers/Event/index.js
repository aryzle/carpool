import React from 'react'
import EventInfo from '../../components/EventInfo'
import Waitlist from '../../components/Waitlist'
import Cars from "../../components/Cars/index"

const Event = ({ match }) => (
  <div>
    <EventInfo eventId={match.params.eventId} />
    <Waitlist eventId={match.params.eventId} />
    <Cars eventId={match.params.eventId} />
  </div>
)

export default Event
