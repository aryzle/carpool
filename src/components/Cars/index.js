import React, { Component } from 'react'
import PropTypes from 'prop-types'
import firebase from 'firebase'
import { Checkbox, Header, Icon, Menu, Segment } from 'semantic-ui-react'
import AddCar from '../modals/AddCar'
import CarRow from './CarRow'
import './styles.css'

const mql = window.matchMedia('(max-width: 425px)')

export default class Cars extends Component {
  static propTypes = {
    eventId: PropTypes.string
  }
  state = {
    carData: {},
    carIds: [],
    filterFull: false
  }

  toggleFilterFull = () => {
    this.setState({
      filterFull: !this.state.filterFull
    })
  }

  componentDidMount() {
    const { eventId } = this.props
    const eventRef = firebase
      .database()
      .ref()
      .child('events')
      .child(eventId)
    const carRef = eventRef.child('cars')

    carRef.on('value', snap => {
      const carData = snap.val() || {}
      const carIds = Object.keys(carData)
      this.setState(
        {
          carData,
          carIds
        },
        () => console.log('Cars state', this.state)
      )
    })
  }

  // media query used here to render components in a certain order
  // needed for mobile vs tablet/desktop
  render() {
    const { eventId } = this.props
    const { carIds, carData, filterFull } = this.state
    return (
      <div className="Cars">
        {!mql.matches && (
          <div className="Cars-menu-wrapper" style={menuWrapperStyles}>
            <Menu className="Cars-menu" style={menuStyles} vertical>
              <Menu.Item header>
                <Icon name="filter" /> Filter
              </Menu.Item>
              <Menu.Item>
                <Checkbox
                  onChange={this.toggleFilterFull}
                  label="full"
                  color="red"
                  toggle
                />
              </Menu.Item>
            </Menu>
          </div>
        )}
        <div className="Cars-header">
          <Header as="h2">{carIds.length} Cars</Header>
          <AddCar eventId={eventId} />
        </div>
        {mql.matches && (
          <div className="Cars-menu-wrapper" style={menuWrapperStyles}>
            <Menu className="Cars-menu" style={menuStyles} vertical>
              <Menu.Item header>
                <Icon name="filter" /> Filter
              </Menu.Item>
              <Menu.Item>
                <Checkbox
                  onChange={() => this.toggleFilterFull()}
                  label="full"
                  color="red"
                  toggle
                />
              </Menu.Item>
            </Menu>
          </div>
        )}
        <div className="Cars-list">
          {carIds.filter(id => filterCars(carData[id], filterFull)).map(id => (
            <Segment key={id} raised>
              <CarRow car={carData[id]} eventId={eventId} />
            </Segment>
          ))}
        </div>
      </div>
    )
  }
}

const filterCars = ({ seats, passengers = {} }, filterFull) =>
  !filterFull || seats > Object.keys(passengers).length

const menuWrapperStyles = {
  position: mql.matches ? '' : 'sticky',
  top: mql.matches ? '' : '55px',
  zIndex: mql.matches ? '' : 2,
  minHeight: mql.matches ? '90px' : '',
  marginTop: mql.matches ? '10px' : ''
}
const menuStyles = {
  position: mql.matches ? 'static' : 'absolute',
  margin: mql.matches ? 'auto' : '',
  maxWidth: '150px'
}
