import React, { Component } from 'react';
import RegisterForm from './RegisterForm';

export default class Register extends Component {
  render() {
    return (
        <RegisterForm navigation={this.props.navigation} />
    );
  }
}