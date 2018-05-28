import React, { Component } from 'react';
import { Text, View, StyleSheet, Button, AsyncStorage } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import WelcomePage from './welcomePage.js';
import LoginPage from './loginPage.js';
import HomePage from './homePage.js';
import SignupPage from './signupPage.js';
import Expo from 'expo';
import { Router, Scene } from 'react-native-router-flux';


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      currentUser: null
    }
    this.checkLoginStatus = this.checkLoginStatus.bind(this);
  }
  componentWillMount() {
    this.checkLoginStatus();
  }

  
  async checkLoginStatus() {
    const currentUser = await AsyncStorage.getItem('registeredUser');
    let token = null;
    if (currentUser !== null) {
      try {
         token = await AsyncStorage.getItem(currentUser);
      } catch(e) {
        console.log(e)
      }
            if (token !== null) {
        this.setState({
          loggedIn: true,
          currentUser: currentUser
        })
        
      }
    }
  }
  
  render() {
    return (    <Router>
          <Scene key="root">
          <Scene key="welcomePage" component={WelcomePage} title="Welcome Page" initial/>
          <Scene key="loginPage" component={LoginPage} />
          <Scene key="signupPage" component={SignupPage} />
          <Scene key="home" component={HomePage} />
</Scene>
</Router> )
  }
}


