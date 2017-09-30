import React from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { Container, Menu, Segment } from 'semantic-ui-react';
import EventInfo from '../../components/EventInfo';
import Waitlist from '../../components/Waitlist';
import Cars from '../../components/Cars/index';
import './styles.css';

const Event = ({ match }) => (
  <div>
    <Menu fixed="top" inverted>
      <Container>
        <Menu.Item as="a" header>
          cru carpool
        </Menu.Item>
      </Container>
    </Menu>
    <Container style={{ marginTop: '60px' }}>
      <EventInfo eventId={match.params.eventId} />
      <div className="Cars-Waitlist-Container">
        <Cars eventId={match.params.eventId} />
        <div style={{ padding: '15px', flexGrow: 1 }}>
          <Segment raised style={{ height: '100%' }}>
            <Waitlist eventId={match.params.eventId} />
          </Segment>
        </div>
      </div>
    </Container>
  </div>
);

export default DragDropContext(HTML5Backend)(Event);
