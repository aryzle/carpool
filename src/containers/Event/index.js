import React from 'react'
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { Container, Menu } from 'semantic-ui-react'
import EventInfo from '../../components/EventInfo'
import Waitlist from '../../components/Waitlist'
import Cars from "../../components/Cars/index"
import './styles.css'

const Event = ({ match }) => (
  <div>
    <Menu fixed='top' inverted>
      <Container>
        <Menu.Item as='a' header>
          cru carpool
        </Menu.Item>
      </Container>
    </Menu>
    <Container>
      <EventInfo eventId={match.params.eventId} />
      <div className="Cars-Waitlist-Container">
        <Cars eventId={match.params.eventId} />
        <Waitlist eventId={match.params.eventId} />
      </div>
    </Container>
  </div>
)

export default DragDropContext(HTML5Backend)(Event)
