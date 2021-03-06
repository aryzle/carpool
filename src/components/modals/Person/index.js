import React, { Component } from 'react'
import PropTypes from 'prop-types'
import firebase from 'firebase'
import { Button, Form, Message, Modal } from 'semantic-ui-react'
import { omit } from 'lodash/object'
import moment from 'moment'
import uuid from 'uuid/v4'
import { classOptions, genderOptions } from '../shared'

const { bool, element, object, string } = PropTypes

export default class PersonModal extends Component {
  static propTypes = {
    departure: bool,
    eventId: string,
    trigger: element,
    carId: string,
    person: object
  }

  static initialState = {
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    gender: '',
    classYear: '',
    earliestDepartureDateTime: '',
    latestReturnDateTime: '',
    info: '',
    loading: false,
    success: false,
    error: false
  }

  state = PersonModal.initialState

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  handleSubmit = () => {
    this.setState({ loading: true })

    const { departure, eventId, carId, person = {} } = this.props
    const isEdit = !!person.id
    const personId = person.id || uuid()
    const earliestDepartureDateTime =
      Date.parse(this.state.earliestDepartureDateTime) || ''
    const latestReturnDateTime =
      Date.parse(this.state.latestReturnDateTime) || ''
    const passengerPath = departure ? 'depPassengers' : 'retPassengers'
    const carPath = departure ? 'depCar' : 'retCar'

    firebase
      .database()
      .ref(`events/${eventId}/persons/${personId}`)
      .set({
        ...omit(this.state, [
          'earliestDepartureDateTime',
          'latestReturnDateTime',
          'loading',
          'success',
          'error'
        ]),
        id: personId,
        [carPath]: carId || null,
        earliestDepartureDateTime,
        latestReturnDateTime
      })
      .then(() => {
        if (carId) {
          return firebase
            .database()
            .ref(`events/${eventId}/cars/${carId}/${passengerPath}`)
            .update({
              [personId]: true
            })
        }
      })
      .then(() => {
        isEdit
          ? this.setState({
              success: true,
              loading: false
            })
          : this.setState({
              ...PersonModal.initialState,
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
    const { person } = this.props

    if (person) {
      this.setState({
        ...person,
        earliestDepartureDateTime: person.earliestDepartureDateTime
          ? moment(person.earliestDepartureDateTime)
              .local()
              .format()
              .slice(0, 19)
          : '',
        latestReturnDateTime: person.latestReturnDateTime
          ? moment(person.latestReturnDateTime)
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
    const { trigger, person } = this.props
    const {
      name,
      email,
      phone,
      city,
      address,
      state,
      gender,
      classYear,
      earliestDepartureDateTime,
      latestReturnDateTime,
      info,
      loading,
      success,
      error
    } = this.state

    return (
      <Modal
        trigger={trigger || <Button color="yellow">Need a ride?</Button>}
        closeIcon
      >
        <Modal.Header>
          {person ? 'Edit Person' : 'Join the Carpool!'}
        </Modal.Header>
        <Modal.Content>
          <Form
            onSubmit={this.handleSubmit}
            size="small"
            success={success}
            error={error}
          >
            <Form.Input
              required
              placeholder="Name*"
              name="name"
              value={name}
              onChange={this.handleChange}
            />
            <Form.Input
              required
              placeholder="Email*"
              name="email"
              value={email}
              onChange={this.handleChange}
            />
            <Form.Input
              placeholder="Phone"
              name="phone"
              value={phone}
              onChange={this.handleChange}
            />
            <Form.Input
              required
              placeholder="City*"
              name="city"
              value={city}
              onChange={this.handleChange}
            />
            <Form.Input
              placeholder="Address"
              name="address"
              value={address}
              onChange={this.handleChange}
            />
            <Form.Input
              required
              placeholder="State* (e.g. VA, MD)"
              name="state"
              value={state}
              onChange={this.handleChange}
            />
            <Form.Select
              required
              placeholder="Gender"
              name="gender"
              value={gender}
              options={genderOptions}
              onChange={this.handleChange}
            />
            <Form.Select
              required
              placeholder="Class"
              name="classYear"
              value={classYear}
              options={classOptions}
              onChange={this.handleChange}
            />
            <Form.Input
              required
              label="When is the earliest you could leave?"
              type="datetime-local"
              name="earliestDepartureDateTime"
              value={earliestDepartureDateTime}
              onChange={this.handleChange}
            />
            <Form.Input
              label="Is there a time you need to be back by?"
              type="datetime-local"
              name="latestReturnDateTime"
              value={latestReturnDateTime}
              onChange={this.handleChange}
            />
            <Form.TextArea
              placeholder="Is there anything more you'd like us to know?"
              name="info"
              value={info}
              onChange={this.handleChange}
            />
            <Button type="submit" loading={loading}>
              Submit
            </Button>
            <Message
              success
              header="Submit Completed"
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
