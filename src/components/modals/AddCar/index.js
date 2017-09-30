import React, { Component } from 'react';
import PropTypes from 'prop-types';
import firebase from 'firebase';
import { Button, Form, Header, Icon, Message, Modal } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { pick } from 'lodash/object';
import uuid from 'uuid/v4';
import { seatOptions, stateOptions } from '../shared';

export default class AddCar extends Component {
  static propTypes = {
    eventId: PropTypes.string
  };

  state = {
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    seats: 4,
    model: '',
    color: '',
    licensePlate: '',
    departureDateTime: '',
    returnDateTime: '',
    label: '',
    info: '',
    success: false,
    error: false
  };

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  handleDepartureDateChange = date =>
    this.setState({ departureDateTime: date });
  handleReturnDateChange = date => this.setState({ returnDateTime: date });

  handleSubmit = () => {
    const { eventId } = this.props;
    const newPersonId = uuid();
    const newCarId = uuid();
    const departureDateTime = this.state.departureDateTime.valueOf();
    const returnDateTime = this.state.returnDateTime.valueOf();
    console.log(departureDateTime);
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
          'state'
        ]),
        car: newCarId,
        id: newPersonId
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
            returnDateTime
          });
      })
      .then(this.setState({ success: true }))
      .catch(e => {
        console.log(e);
        this.setState({ error: true });
      });
  };

  render() {
    const {
      name,
      email,
      phone,
      seats,
      city,
      address,
      state,
      departureDateTime,
      returnDateTime,
      model,
      color,
      licensePlate,
      label,
      info,
      success,
      error
    } = this.state;
    return (
      <Modal
        trigger={
          <Button inverted color="green">
            Add your Car
          </Button>
        }
        closeIcon
      >
        <Modal.Header>Add Car</Modal.Header>
        <Modal.Content form>
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
            <Form.TextArea
              placeholder="Is there anything more you'd like us to know?"
              name="info"
              value={info}
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
            <Form.Field>
              <label>Do you need to leave by a certain time?</label>
              <DatePicker
                onChange={this.handleDepartureDateChange}
                selected={departureDateTime}
                shouldCloseOnSelect={false}
                timeIntervals={15}
                dateFormat="LLL"
                showTimeSelect
              />
            </Form.Field>
            <Form.Field>
              <label>Is there a time you need to be back by?</label>
              <DatePicker
                onChange={this.handleReturnDateChange}
                selected={returnDateTime}
                shouldCloseOnSelect={false}
                timeIntervals={15}
                dateFormat="LLL"
                showTimeSelect
              />
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
    );
  }
}
