import React, {Component} from 'react';
import Register from '../components/Register/Register';

export default class RegisterScreen extends Component {
    static navigationOptions = {
        header: null,
      };
    render() {
      return ( 
        <Register navigation={this.props.navigation} />
      );
    }
  }