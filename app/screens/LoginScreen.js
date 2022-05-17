import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import Login from '../components/Login/Login';

//https://github.com/aryaminus/RN-login-register-screen
export default class LoginScreen extends Component {
    static navigationOptions = {
        header: null,
      };
    render() {
      return (
          <Login navigation={this.props.navigation} />
      );
    }
  }

  // define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2c3e50',
    },
    loginContainer:{
        alignItems: 'center',
        flexGrow: 1,
        justifyContent: 'center'
    },
    logo: {
        position: 'absolute',
        width: 200,
        height: 100
    },
});
