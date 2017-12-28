import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { Container, Menu, Segment } from 'semantic-ui-react'
import EventInfo from '../../components/EventInfo'
import Waitlist from '../../components/Waitlist'
import Cars from '../../components/Cars/index'
import './styles.css'

class Event extends Component {
  static propTypes = {
    match: PropTypes.object
  }

  render() {
    const { match } = this.props

    return (
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
            <div style={waitlistContainerStyle}>
              <Segment raised style={segmentStyle}>
                <Waitlist eventId={match.params.eventId} />
              </Segment>
            </div>
          </div>
        </Container>
      </div>
    )
  }
}

const waitlistContainerStyle = {
  padding: '15px',
  flexGrow: 1
}

const segmentStyle = {
  height: '75vh',
  position: 'sticky',
  top: '55px'
}

export default DragDropContext(HTML5Backend)(Event)
