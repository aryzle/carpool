import React, { Component } from 'react'
import PropTypes from 'prop-types'
import firebase from 'firebase'
import { Button, Form, Header, Icon, Message, Modal } from 'semantic-ui-react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css';
import { pick } from 'lodash/object'
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
    address: '',
    city: '',
    state: '',
    seats: 4,
    model:'',
    color:'',
    licensePlate:'',
    departureDateTime: '',
    label: '',
    info: '',
    success: false,
    error: false
  }


  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  handleDateChange = date => this.setState({ departureDateTime: date })

  handleSubmit = () => {
    const { eventId } = this.props
    const newPersonId = uuid()
    const newCarId = uuid()
    const departureDateTime = this.state.departureDateTime.valueOf()
    console.log(departureDateTime)
    firebase.database().ref(`events/${eventId}/persons/${newPersonId}`).set(
      {
        ...pick(this.state,
          ['name', 'email', 'phone', 'address', 'city', 'state']),
        car: newCarId,
        id: newPersonId
      }
    )
    .then(() => {
      firebase.database().ref(`events/${eventId}/cars/${newCarId}`).set(
        {
          ...pick(this.state,
            ['seats', 'model', 'color', 'licensePlate', 'label']),
          id: newCarId,
          driver: newPersonId,
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
    const { name, email, phone, seats, city, address, state, departureDateTime,
      model, color, licensePlate, info, success, error } = this.state
    return (
      <Modal trigger={<Button color="green">Add your Car</Button>}>
        <Modal.Header>Add Car</Modal.Header>
        <Modal.Content form>
          <Form onSubmit={this.handleSubmit} size="small" success={success}
                error={error}>
            <Header as="h3">
              <Icon name="user" />
              <Header.Content>
                About you
              </Header.Content>
            </Header>
            <Form.Input required placeholder="Name*" name="name" value={name}
                        onChange={this.handleChange} />
            <Form.Input required placeholder="Email*" name="email"
                        value={email} onChange={this.handleChange} />
            <Form.Input placeholder="Phone" name="phone" value={phone}
                        onChange={this.handleChange} />
            <Form.Input required placeholder="City*" name="city" value={city}
                        onChange={this.handleChange} />
            <Form.Input placeholder="Address" name="address" value={address}
                        onChange={this.handleChange} />
            <Form.Select placeholder="State" name="state" value={state}
                         options={stateOptions} onChange={this.handleChange} />
            <Form.TextArea
              placeholder="Is there anything more you'd like us to know?"
              name="info"
              value={info}
              onChange={this.handleChange} />
            <Header as="h3">
              <Icon name="car" />
              <Header.Content>
                About your car
              </Header.Content>
            </Header>
            <Form.Select
              placeholder="Seats"
              name="seats"
              value={seats}
              options={seatOptions}
              onChange={this.handleChange} />
            <Form.Input
              placeholder="make model e.g. Ford Focus"
              name="model"
              value={model}
              onChange={this.handleChange} />
            <Form.Input
              placeholder="color"
              name="color"
              value={color}
              onChange={this.handleChange} />
            <Form.Input
              placeholder="License Plate"
              name="licensePlate"
              value={licensePlate}
              onChange={this.handleChange} />
            <Form.Field>
              <label>If you need to leave at a certain time, when?</label>
              <DatePicker
                onChange={this.handleDateChange}
                selected={departureDateTime}
                shouldCloseOnSelect={false}
                timeIntervals={15}
                dateFormat="LLL"
                showTimeSelect />
            </Form.Field>
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
