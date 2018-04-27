import React, { Component } from 'react'
import PropTypes from 'prop-types'
import firebase from 'firebase'
import { Button, Form, Header, Icon, Message, Modal } from 'semantic-ui-react'
import { pick } from 'lodash/object'
import uuid from 'uuid/v4'
import { classOptions, genderOptions, seatOptions } from '../shared'

export default class AddCar extends Component {
  static propTypes = {
    eventId: PropTypes.string
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
    personInfo: '',
    seats: 4,
    model: '',
    color: '',
    licensePlate: '',
    departureDateTime: '',
    returnDateTime: '',
    label: '',
    carInfo: '',
    loading: false,
    success: false,
    error: false
  }

  state = AddCar.initialState

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  handleSubmit = () => {
    const { eventId } = this.props
    const {
      departureDateTime: t1,
      returnDateTime: t2,
      personInfo,
      carInfo
    } = this.state
    this.setState({ loading: true })
    const newPersonId = uuid()
    const newCarId = uuid()
    const departureDateTime = Date.parse(t1) || ''
    const returnDateTime = Date.parse(t2) || ''

    firebase
      .database()
      .ref(`events/${eventId}/persons/${newPersonId}`)
      .set({
        ...pick(this.state, [
          'name',
          'email',
          'phone',
          'address',
          'city',
          'state',
          'gender',
          'classYear'
        ]),
        depCar: newCarId,
        retCar: newCarId,
        id: newPersonId,
        info: personInfo
      })
      .then(() => {
        firebase
          .database()
          .ref(`events/${eventId}/cars/${newCarId}`)
          .set({
            ...pick(this.state, [
              'seats',
              'model',
              'color',
              'licensePlate',
              'label'
            ]),
            id: newCarId,
            driver: newPersonId,
            departureDateTime,
            returnDateTime,
            info: carInfo
          })
      })
      .then(() => {
        this.setState({
          ...AddCar.initialState,
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
      name,
      email,
      phone,
      city,
      address,
      state,
      gender,
      classYear,
      personInfo,
      seats,
      departureDateTime,
      returnDateTime,
      model,
      color,
      licensePlate,
      label,
      carInfo,
      loading,
      success,
      error
    } = this.state
    return (
      <Modal
        trigger={trigger || <Button color="teal">Add your Car</Button>}
        closeIcon
      >
        <Modal.Header>Add Car</Modal.Header>
        <Modal.Content>
          <Form
            onSubmit={this.handleSubmit}
            size="small"
            success={success}
            error={error}
          >
            <Header as="h3">
              <Icon name="user" />
              <Header.Content>About you</Header.Content>
            </Header>
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
            <Form.TextArea
              placeholder="Is there anything more you'd like us to know?"
              name="personInfo"
              value={personInfo}
              onChange={this.handleChange}
            />
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
              name="carInfo"
              value={carInfo}
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
