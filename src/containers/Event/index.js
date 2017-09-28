import React from 'react'
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import EventInfo from '../../components/EventInfo'
import Waitlist from '../../components/Waitlist'
import Cars from "../../components/Cars/index"
import './styles.css'

const Event = ({ match }) => (
  <div>
    <EventInfo eventId={match.params.eventId} />
    <dic className="Cars-Waitlist-Container">
      <Cars eventId={match.params.eventId} />
      <Waitlist eventId={match.params.eventId} />
    </dic>
  </div>
)

export default DragDropContext(HTML5Backend)(Event)
