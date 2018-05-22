import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';


export default class WelcomePage extends Component {
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <Text style={styles.welcomeText}>Welcome to urbanXPlorer</Text>
        <View style={styles.optionsContainer}>
            <TouchableOpacity style={styles.button} onPress={() => {
              navigate("Login");
            }}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => {
              navigate("Signup"); }}>
              <Text style={styles.buttonText}>Signup</Text>
            </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    marginBottom: 200,
    fontSize: 20,
    fontFamily: 'monospace',
  },
  optionsContainer: {},
  button: {
    marginBottom: 20,
    width: 200,
    height: 50,
    backgroundColor: 'lightgrey',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 20,
    fontFamily: 'monospace',
  },
});
