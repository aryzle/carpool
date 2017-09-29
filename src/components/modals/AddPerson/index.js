import React, { Component } from 'react'
import PropTypes from 'prop-types'
import firebase from 'firebase'
import { Button, Form, Message, Modal } from 'semantic-ui-react'
import DatePicker from 'react-datepicker'
import { omit } from 'lodash/object'
import uuid from 'uuid/v4'
import { stateOptions } from '../shared'

export default class AddPerson extends Component {
  static propTypes = {
    eventId: PropTypes.string,
    trigger: PropTypes.element,
    carId: PropTypes.string
  }

  state = {
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    earliestDepartureDateTime: '',
    latestReturnDateTime:'',
    info: '',
    success: false,
    error: false
  }


  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  handleDepDateChange = date => this.setState({ earliestDepartureDateTime: date })
  handleRetDateChange = date => this.setState({ latestReturnDateTime: date })

  handleSubmit = () => {
    const { eventId, carId } = this.props
    const newPersonId = uuid()
    const earliestDepartureDateTime = this.state.earliestDepartureDateTime.valueOf()
    const latestReturnDateTime = this.state.latestReturnDateTime.valueOf()
    firebase.database().ref(`events/${eventId}/persons/${newPersonId}`).set({
      ...omit(this.state, ['earliestDepartureDateTime', 'latestReturnDateTime', 'success', 'error']),
      id: newPersonId,
      car: carId || null,
      earliestDepartureDateTime,
      latestReturnDateTime
    })
    .then(() => {
      if (carId) {
        return firebase.database().ref(`events/${eventId}/cars/${carId}/riders`).update({
          [newPersonId]: true
        })
      }
    })
    .then(() => this.setState({ success: true }))
    .catch(e => {
      console.log(e)
      this.setState({ error: true })
    })
  }

  render() {
    const { trigger } = this.props
    const { name, email, phone, city, address, state, earliestDepartureDateTime, latestReturnDateTime, info, success, error } = this.state

    return (
      <Modal trigger={trigger || <Button inverted color="blue">Need a ride?</Button>}>
        <Modal.Header>Join the Carpool!</Modal.Header>
        <Modal.Content form>
          <Form onSubmit={this.handleSubmit} size="small" success={success} error={error}>
            <Form.Input required placeholder="Name*" name="name" value={name} onChange={this.handleChange} />
            <Form.Input required placeholder="Email*" name="email" value={email} onChange={this.handleChange} />
            <Form.Input placeholder="Phone" name="phone" value={phone} onChange={this.handleChange} />
            <Form.Input required placeholder="City*" name="city" value={city} onChange={this.handleChange} />
            <Form.Input placeholder="Address" name="address" value={address} onChange={this.handleChange} />
            <Form.Select required placeholder="State" name="state" value={state} options={stateOptions} onChange={this.handleChange} />
            <Form.Field required>
              <label>When is the earliest you could leave?</label>
              <DatePicker onChange={this.handleDepDateChange} selected={earliestDepartureDateTime} shouldCloseOnSelect={false} timeIntervals={15} dateFormat="LLL" showTimeSelect />
            </Form.Field>
            <Form.Field required>
              <label>When is the latest you want to be back by?</label>
              <DatePicker onChange={this.handleRetDateChange} selected={latestReturnDateTime} shouldCloseOnSelect={false} timeIntervals={15} dateFormat="LLL" showTimeSelect />
            </Form.Field>
            <Form.TextArea placeholder="Is there anything more you'd like us to know?" name="info" value={info} onChange={this.handleChange} />
            <Button type="submit">Submit</Button>
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
