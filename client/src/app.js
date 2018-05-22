import React, { Component } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import WelcomePage from './components/welcomePage.js';
import LoginPage from './components/loginPage.js';
import HomePage from './components/homePage.js';
import SignupPage from './components/signupPage.js';

export default class App extends Component {
  render() {
   return <RootStack />
  }
}

const RootStack =  createStackNavigator({
  Home: {
    screen: WelcomePage,
    navigationOptions: {header: null}
  },
  Login: {
    screen: LoginPage
  },
  User: {
    screen: HomePage
  },
  Signup: {
    screen: SignupPage
  }

},
 {
    initialRouteName: 'Home',
  });

