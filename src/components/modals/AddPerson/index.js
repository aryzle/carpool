import React, { Component } from 'react'
import firebase from 'firebase'
import { Button, Form, Message, Modal } from 'semantic-ui-react'
import uuid from 'uuid/v4'
import { stateOptions } from '../shared'

export default class AddPerson extends Component {
  constructor() {
    super()
    this.state = {
      name: '',
      email: '',
      phone: '',
      city: '',
      address: '',
      state: '',
      info: '',
      success: false,
      error: false
    }
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  handleSubmit = () => {
    const newId = uuid()
    firebase.database().ref(`events/f04bdaed-7414-48a5-a96f-0f1f2bb0ff5b/persons/${newId}`).set(
      {
        ...this.state,
        id: newId
      }
    )
    .then(this.setState({ success: true }))
    .catch(e => {
      console.log(e)
      this.setState({ error: true })
    })
  }

  render() {
    const { name, email, phone, city, address, state, info, success, error } = this.state
    return (
      <Modal trigger={<Button>Need a ride?</Button>}>
        <Modal.Header>Join Waitlist</Modal.Header>
        <Modal.Content form>
          <Form onSubmit={this.handleSubmit} size="small" success={success} error={error}>
            <Form.Input required placeholder='Name' name='name' value={name} onChange={this.handleChange} />
            <Form.Input required placeholder='Email' name='email' value={email} onChange={this.handleChange} />
            <Form.Input placeholder='Phone' name='phone' value={phone} onChange={this.handleChange} />
            <Form.Input required placeholder='City' name='city' value={city} onChange={this.handleChange} />
            <Form.Input placeholder='Address' name='address' value={address} onChange={this.handleChange} />
            <Form.Select required placeholder='State' name='state' value={state} options={stateOptions} onChange={this.handleChange} />
            <Form.TextArea placeholder='Please tell us if you have any constraints' name='info' value={info} onChange={this.handleChange} />
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
