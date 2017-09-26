import React, { Component } from 'react'
import PropTypes from 'prop-types'
import firebase from 'firebase'
import { Button, Form, Message, Modal } from 'semantic-ui-react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css';
import { omit } from 'lodash/object'
import uuid from 'uuid/v4'
import { seatOptions, stateOptions } from '../shared'

export default class AddCar extends Component {
  static propTypes = {
    eventId: PropTypes.string
  }

  state = {
    name: '',
    email: '',
    phone: '',
    seats: 4,
    address: '',
    city: '',
    state: '',
    departureDateTime: '',
    info: '',
    success: false,
    error: false
  }


  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  handleDateChange = date => {
    console.log(date)
    console.log(date.valueOf())
    this.setState({ departureDateTime: date })
  }

  handleSubmit = () => {
    const { eventId } = this.props
    const newPersonId = uuid()
    const newCarId = uuid()
    const departureDateTime = this.state.departureDateTime.valueOf()
    console.log(departureDateTime)
    firebase.database().ref(`events/${eventId}/persons/${newPersonId}`).set(
      {
        ...omit(this.state, ['seats', 'departureDateTime']),
        car: newCarId,
        id: newPersonId,
        driver: newPersonId
      }
    )
    .then(() => {
      firebase.database().ref(`events/${eventId}/cars/${newCarId}`).set(
        {
          id: newCarId,
          seats: this.state.seats,
          departureDateTime
        }
      )
    })
    .then(this.setState({ success: true }))
    .catch(e => {
      console.log(e)
      this.setState({ error: true })
    })
  }

  render() {
    const { name, email, phone, seats, city, address, state, departureDateTime, info, success, error } = this.state
    return (
      <Modal trigger={<Button>Add your Car</Button>}>
        <Modal.Header>Add Car</Modal.Header>
        <Modal.Content form>
          <Form onSubmit={this.handleSubmit} size="small" success={success} error={error}>
            <label>About you</label>
            <Form.Input required placeholder="Name" name="name" value={name} onChange={this.handleChange} />
            <Form.Input required placeholder="Email" name="email" value={email} onChange={this.handleChange} />
            <Form.Input placeholder="Phone" name="phone" value={phone} onChange={this.handleChange} />
            <Form.Input required placeholder="City" name="city" value={city} onChange={this.handleChange} />
            <Form.Input placeholder="Address" name="address" value={address} onChange={this.handleChange} />
            <Form.Select placeholder="State" name="state" value={state} options={stateOptions} onChange={this.handleChange} />
            <Form.TextArea placeholder="Please tell us if you have any constraints" name="info" value={info} onChange={this.handleChange} />
            <label>About your car</label>
            <Form.Select placeholder="Seats" name="seats" value={seats} options={seatOptions} onChange={this.handleChange} />
            <DatePicker onChange={this.handleDateChange} selected={departureDateTime} showTimeSelect timeIntervals={15} dateFormat="LLL" />
            <Button type="submit">Submit</Button>
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
