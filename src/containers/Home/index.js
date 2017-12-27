import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import {
  Button,
  Container,
  // Divider,
  // Grid,
  Header,
  Icon,
  // Image,
  // List,
  Menu,
  Segment,
  Visibility
} from 'semantic-ui-react'
import carpoolMP4 from '../../static/carpool.mp4'
import './styles.css'

const mql = window.matchMedia('(max-width: 425px)')
const FixedMenu = () => (
  <Menu fixed="top" size="large">
    <Container>
      <Menu.Item as="a" active>
        Home
      </Menu.Item>
      <Menu.Menu position="right">
        <Menu.Item className="item">
          <Button as="a">Log in</Button>
        </Menu.Item>
        <Menu.Item>
          <Button as="a" primary>
            Sign Up
          </Button>
        </Menu.Item>
      </Menu.Menu>
    </Container>
  </Menu>
)

export default class Home extends Component {
  state = {}

  hideFixedMenu = () => this.setState({ visible: false })
  showFixedMenu = () => this.setState({ visible: true })

  render() {
    const { visible } = this.state

    return (
      <div>
        {visible ? <FixedMenu /> : null}

        <Visibility
          onBottomPassed={this.showFixedMenu}
          onBottomVisible={this.hideFixedMenu}
          once={false}
        >
          <Segment
            textAlign="center"
            style={{ minHeight: 700, padding: '0em 0em' }}
            vertical
            className="Hero"
          >
            <div className="filter" />
            <video autoPlay loop muted style={videoStyles}>
              <source src={carpoolMP4} />
            </video>
            <Container className="navbar-container">
              <Menu
                inverted
                pointing
                secondary
                size="large"
                className="navbar-menu"
              >
                <Menu.Item as="a" active>
                  Home
                </Menu.Item>
                <Menu.Item position="right">
                  <Button inverted>Log in</Button>
                  <Button as="a" inverted style={{ marginLeft: '0.5em' }}>
                    Sign Up
                  </Button>
                </Menu.Item>
              </Menu>
            </Container>

            <Container text className="title-container">
              <Header
                as="h1"
                content="carpool"
                inverted
                style={{
                  fontSize: '4em',
                  fontWeight: 'normal',
                  marginBottom: 0,
                  marginTop: '3em'
                }}
              />
              <Header
                as="h2"
                content="Let's get there, together."
                inverted
                style={{ fontSize: '1.7em', fontWeight: 'normal' }}
              />
              <Button primary size="huge">
                <Link to="/e">Get Started</Link>
                <Icon name="right arrow" />
              </Button>
            </Container>
          </Segment>
        </Visibility>
      </div>
    )
  }
}

const videoStyles = {
  position: 'relative',
  height: '100%',
  width: 'auto',
  overflow: 'hidden',
  background: '#000',
  marginLeft: mql.matches ? '-290px' : ''
}
