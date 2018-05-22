import React, { Component } from 'react';
import { Text, View, StyleSheet, TextInput } from 'react-native';
import { Button } from 'react-native-elements';
import Expo from 'expo';
//import FloatLabelTextInput from 'react-native-floating-label-text-input';

export default class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      loading: false,
      wrongCredentials: false,
      requestError: false
    };
    this.loginRequest = this.loginRequest.bind(this);
    this.setCredentialsInKeychain = this.setCredentialsInKeychain.bind(this);
  }
   loginRequest() {
     //sends request to route: /auth/login with login Credentials
     //expected response 200, containing jwtoken for authentication
    if (this.state.username && this.state.password) {
   fetch(
        'https://urban-explorer-atheos.c9users.io/auth/login', {
        body: JSON.stringify( {
          user: this.state.username,
          password: this.state.password
        }),
        headers: new Headers({'content-type': 'application/json'}),
        method: 'POST'
      }
      ).then(res => {
          return res.json();

      }).then(res => {
        if (res.status === 200) {

        this.setCredentialsInKeychain(res.data.token);
        this.setState({loading: false});
        } else {
          return Promise.reject(res);
        }
      }).catch(err => {
        if (err.status === 403 || err.status === 422) {
          this.setState({ wrongCredentials: true });
        } else {
          this.setState({ requestError: true });
        }
      });
    }
  }
  
  setCredentialsInKeychain(token) {
    //Saves Credentials to Android Keychain and navigates to main user page 
    Expo.SecureStore.setItemAsync(this.state.username, token).then(() => {
      const { navigate } = this.props.navigation;
      navigate("User");
    })
  }
  
  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          underlineColorAndroid="transparent"
          onChangeText={text => {
            this.setState({ username: text });
          }}
        /><TextInput
          style={styles.input}
          underlineColorAndroid="transparent"
          onChangeText={text => {
            this.setState({ password: text });
          }}
        />
        <Button
          title={!this.state.loading ? "Log in" : ""}
          buttonStyle={{
            backgroundColor: 'rgba(92, 99,216, 1)',
            width: 300,
            height: 45,
            borderColor: 'transparent',
            borderWidth: 0,
            borderRadius: 5,
            fontSize: 10,
          }}
          titleStyle={{}}
          loading={this.state.loading}
          onPress={this.loginRequest}
        />
        {this.state.wrongCredentials ? <Text>Invalid Username or Password</Text> : <Text></Text>}
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
  input: {
    width: 230,
    height: 40,
    borderWidth: 1,
    borderColor: 'lightgrey',
    padding: 10,
    marginBottom: 20,
  },
});
