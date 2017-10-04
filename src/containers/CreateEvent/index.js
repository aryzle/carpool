import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import firebase from 'firebase'
import { Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react'

export default class CreateEvent extends Component {
  static initialState = {
    adminName: '',
    adminEmail: '',
    eventName: '',
    address: '',
    locationName: '',
    startDateTime: '',
    endDateTime: '',
    info: '',
    loading: false,
    success: false,
    error: false,
    newEventId: ''
  }

  state = CreateEvent.initialState

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  handleSubmit = () => {
    this.setState({ loading: true })
    const {
      startDateTime: t1,
      endDateTime: t2,
      adminName,
      adminEmail,
      eventName,
      address,
      locationName
    } = this.state
    const startDateTime = Date.parse(t1) || ''
    const endDateTime = Date.parse(t2) || ''

    const newEventRef = firebase
      .database()
      .ref('/events')
      .push()
    newEventRef
      .set({
        id: newEventRef.key,
        name: eventName,
        location: {
          address,
          name: locationName
        },
        startDateTime,
        endDateTime,
        admin: {
          name: adminName,
          email: adminEmail
        }
      })
      .then(() => {
        this.setState({
          ...CreateEvent.initialState,
          success: true
        })
        setTimeout(() => this.setState({ success: false }), 3000)
      })
      .then(() => this.setState({ newEventId: newEventRef.key }))
      .catch(e => {
        console.log(e)
        this.setState({ error: true })
        setTimeout(() => this.setState({ error: false }), 6000)
      })
  }

  render() {
    const {
      adminName,
      adminEmail,
      eventName,
      address,
      locationName,
      startDateTime,
      endDateTime,
      loading,
      success,
      error,
      newEventId
    } = this.state

    return (
      <div className="login-form">
        {/*
          Heads up! The styles below are necessary for the correct render of this example.
          You can do same with CSS, the main idea is that all the elements up to the `Grid`
          below must have a height of 100%.
        */}
        <style>{`
          body > div,
          body > div > div,
          body > div > div > div.login-form {
            height: 100%;
          }
        `}</style>
        <Grid
          textAlign="center"
          style={{ height: '100%' }}
          verticalAlign="middle"
        >
          <Grid.Column style={{ maxWidth: 450 }}>
            {newEventId && <Redirect push to={`/e/${newEventId}`} />}
            <Header as="h2" color="teal" textAlign="center">
              Create your event
            </Header>
            <Form
              onSubmit={this.handleSubmit}
              size="large"
              success={success}
              error={error}
            >
              <Segment stacked>
                <Header as="h3" color="teal">
                  About you
                </Header>
                <Form.Input
                  fluid
                  icon="user"
                  iconPosition="left"
                  placeholder="Name"
                  name="adminName"
                  value={adminName}
                  onChange={this.handleChange}
                />
                <Form.Input
                  fluid
                  icon="user"
                  iconPosition="left"
                  placeholder="E-mail address"
                  name="adminEmail"
                  value={adminEmail}
                  onChange={this.handleChange}
                />
                <Header as="h3" color="teal">
                  About your event
                </Header>
                <Form.Input
                  fluid
                  placeholder="Event name"
                  name="eventName"
                  value={eventName}
                  onChange={this.handleChange}
                />
                <Form.Input
                  fluid
                  placeholder="Address"
                  name="address"
                  value={address}
                  onChange={this.handleChange}
                />
                <Form.Input
                  fluid
                  placeholder="Name of location (e.g. Camp Galilee)"
                  name="locationName"
                  value={locationName}
                  onChange={this.handleChange}
                />
                <Form.Input
                  required
                  label="Start time"
                  type="datetime-local"
                  name="startDateTime"
                  value={startDateTime}
                  onChange={this.handleChange}
                />
                <Form.Input
                  label="End time"
                  type="datetime-local"
                  name="endDateTime"
                  value={endDateTime}
                  onChange={this.handleChange}
                />

                <Button color="teal" fluid size="large" loading={loading}>
                  Create
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
              </Segment>
            </Form>
          </Grid.Column>
        </Grid>
      </div>
    )
  }
}
