import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { Checkbox, Container, Menu, Segment } from 'semantic-ui-react'
import EventInfo from '../../components/EventInfo'
import Waitlist from '../../components/Waitlist'
import Cars from '../../components/Cars/index'
import './styles.css'

class Event extends Component {
  static propTypes = {
    match: PropTypes.object
  }

  state = {
    departure: true
  }

  sliderOnChange = () => this.setState({ departure: !this.state.departure })

  render() {
    const { match } = this.props
    const { departure } = this.state

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
          departure <Checkbox slider onChange={this.sliderOnChange} /> return
          <EventInfo eventId={match.params.eventId} departure={departure} />
          <div className="Cars-Waitlist-Container">
            <Cars eventId={match.params.eventId} departure={departure} />
            <div style={waitlistContainerStyle}>
              <Segment raised style={segmentStyle}>
                <Waitlist
                  eventId={match.params.eventId}
                  departure={departure}
                />
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
