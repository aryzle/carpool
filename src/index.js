import React from 'react'
import ReactDOM from 'react-dom'
import firebase from 'firebase'
import 'semantic-ui-css/semantic.min.css'
import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'

const config = {
  apiKey: "AIzaSyA7a4ryBo7amZGoFASr4rDXiaSqtmzb0l8",
  authDomain: "carpool-a38a5.firebaseapp.com",
  databaseURL: "https://carpool-a38a5.firebaseio.com",
  projectId: "carpool-a38a5",
  storageBucket: "carpool-a38a5.appspot.com",
  messagingSenderId: "1055662899094"
}
firebase.initializeApp(config)

ReactDOM.render(<App />, document.getElementById('root'))
registerServiceWorker()
