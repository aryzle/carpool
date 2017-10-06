import React, { Component } from 'react'
import PropTypes from 'prop-types'
import firebase from 'firebase'
import { Button, Form, Header, Icon, Message, Modal } from 'semantic-ui-react'
import { pick } from 'lodash/object'
import moment from 'moment'
import { seatOptions } from '../shared'

export default class EditCar extends Component {
  static propTypes = {
    eventId: PropTypes.string.isRequired,
    car: PropTypes.object.isRequired,
    trigger: PropTypes.element.isRequired
  }

  static initialState = {
    seats: 4,
    model: '',
    color: '',
    licensePlate: '',
    departureDateTime: '',
    returnDateTime: '',
    label: '',
    info: '',
    loading: false,
    success: false,
    error: false
  }

  state = EditCar.initialState

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  handleSubmit = () => {
    const { eventId, car } = this.props
    this.setState({ loading: true })
    const departureDateTime = Date.parse(this.state.departureDateTime) || ''
    const returnDateTime = Date.parse(this.state.returnDateTime) || ''
    firebase
      .database()
      .ref(`events/${eventId}/cars/${car.id}`)
      .update({
        ...pick(this.state, [
          'seats',
          'model',
          'color',
          'licensePlate',
          'label',
          'info'
        ]),
        departureDateTime,
        returnDateTime
      })
      .then(() => {
        this.setState({
          ...EditCar.initialState,
          success: true
        })
        setTimeout(() => this.setState({ success: false }), 3000)
      })
      .catch(e => {
        console.log(e)
        this.setState({ error: true, loading: false })
        setTimeout(() => this.setState({ error: false }), 6000)
      })
  }

  componentDidMount() {
    const { car } = this.props

    if (car) {
      this.setState({
        ...car,
        departureDateTime: car.departureDateTime
          ? moment(car.departureDateTime)
              .local()
              .format()
              .slice(0, 19)
          : '',
        returnDateTime: car.returnDateTime
          ? moment(car.returnDateTime)
              .local()
              .format()
              .slice(0, 19)
          : ''
      })
    }
  }

  componentWillUpdate() {
    this.fixBody()
  }

  componentDidUpdate() {
    this.fixBody()
  }

  //TODO: track new release for fix
  fixBody() {
    const anotherModal = document.getElementsByClassName('ui page modals')
      .length
    if (anotherModal > 0)
      document.body.classList.add('scrolling', 'dimmable', 'dimmed')
  }

  render() {
    const { trigger } = this.props
    const {
      seats,
      departureDateTime,
      returnDateTime,
      model,
      color,
      licensePlate,
      label,
      info,
      loading,
      success,
      error
    } = this.state
    return (
      <Modal
        trigger={trigger || <Button color="teal">Add your Car</Button>}
        closeIcon
      >
        <Modal.Header>Edit Car</Modal.Header>
        <Modal.Content form>
          <Form
            onSubmit={this.handleSubmit}
            size="small"
            success={success}
            error={error}
          >
            <Header as="h3">
              <Icon name="car" />
              <Header.Content>About your car</Header.Content>
            </Header>
            <Form.Select
              required
              placeholder="Seats"
              name="seats"
              value={seats}
              options={seatOptions}
              onChange={this.handleChange}
            />
            <Form.Input
              required
              placeholder="make model* e.g. Ford Focus"
              name="model"
              value={model}
              onChange={this.handleChange}
            />
            <Form.Input
              required
              placeholder="color*"
              name="color"
              value={color}
              onChange={this.handleChange}
            />
            <Form.Input
              required
              placeholder="License Plate* (this is so that your passengers can find you!)"
              name="licensePlate"
              value={licensePlate}
              onChange={this.handleChange}
            />
            <Form.Input
              placeholder="Label (think of something fun, like 'karaoke carpool' or 'coffee lovers')"
              name="label"
              value={label}
              onChange={this.handleChange}
            />
            <Form.Input
              required
              label="Do you need to leave by a certain time?"
              type="datetime-local"
              name="departureDateTime"
              value={departureDateTime}
              onChange={this.handleChange}
            />
            <Form.Input
              required
              label="Is there a time you need to be back by?"
              type="datetime-local"
              name="returnDateTime"
              value={returnDateTime}
              onChange={this.handleChange}
            />
            <Form.TextArea
              placeholder="Is there anything more you'd like us to know about your car?"
              name="info"
              value={info}
              onChange={this.handleChange}
            />
            <Button type="submit" loading={loading}>
              Submit
            </Button>
            <Message
              success
              header="Form Completed"
              content="You're all signed up!"
            />
            <Message
              error
              header="Oops!"
              content="Something went wrong, please try again later."
            />
          </Form>
        </Modal.Content>
      </Modal>
    )
  }
}
