import React, { Component } from 'react';
import { Text, View, StyleSheet, TextInput, AsyncStorage } from 'react-native';
import { Button } from 'react-native-elements';
import Expo from 'expo';
import { Actions } from 'react-native-router-flux';

export default class SignupPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      email: '',
      loading: false,
      usernameEmailOccupied: false,
      requestError: false
    };
    this.signupRequest = this.signupRequest.bind(this);
    this.setCredentialsInKeychain = this.setCredentialsInKeychain.bind(this);
  }
   signupRequest() {
    if (this.state.username && this.state.email && this.state.password) {
   fetch(
        'https://urban-explorer-atheos.c9users.io/auth/signup', {
        body: JSON.stringify( {
          name: this.state.username,
          password: this.state.password,
          email: this.state.email
        }),
        headers: new Headers({'content-type': 'application/json'}),
        method: 'POST'
      }
      ).then(res => {
          return res.json();

      }).then(res => {
        if (res.status === 200) {
       this.setCredentialsInKeychain();
        } else {
          return Promise.reject(res);
        }
      }).catch(err => {
        //api responds with status code of 409 if username is already in use
        if (err.status === 409) {
          this.setState({ usernameEmailOccupied: true });
        } else {
          this.setState({ requestError: true });
        }
      });
    }
  }
  
   setCredentialsInKeychain() {
    //Saves Credentials to Android Keychain and navigates to main user page 
    
    //sent authentication request to acquire token to log user in and save in secure storage
    fetch(
        'https://urban-explorer-atheos.c9users.io/auth/login', {
        body: JSON.stringify( {
          user: this.state.username,
          password: this.state.password,
        }),
        headers: new Headers({'content-type': 'application/json'}),
        method: 'POST'
      }).then(res => {
        return res.json()
        }).then(res => {
          if (res.status === 200) {
            //save token to secure storage
        
      Expo.SecureStore.setItemAsync(this.state.username, res.data.token).then(async () => {
              await AsyncStorage.setItem('registeredUser', this.state.username);

      Actions.home();
      })
        this.setState({loading: false});
        } else {
          return Promise.reject(res);
        }

    }).catch(err => {
      this.setState({requestError: true});
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
        />
        <TextInput
          style={styles.input}
          underlineColorAndroid="transparent"
          onChangeText={text => {
            this.setState({ email: text });
          }}
        />
        <TextInput
          style={styles.input}
          underlineColorAndroid="transparent"
          onChangeText={text => {
            this.setState({ password: text });
          }}
        />
        <Button
          title={!this.state.loading ? "Sign Up" : ""}
          buttonStyle={{
            backgroundColor: 'rgba(255,165,0, 1)',
            width: 300,
            height: 45,
            borderColor: 'transparent',
            borderWidth: 0,
            borderRadius: 5,
            fontSize: 10,
          }}
          titleStyle={{}}
          loading={this.state.loading}
          onPress={this.signupRequest}
        />
        {this.state.usernameEmailOccupied ? <Text>Username or Email are already in use. Please try again</Text> : <Text></Text>}
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
