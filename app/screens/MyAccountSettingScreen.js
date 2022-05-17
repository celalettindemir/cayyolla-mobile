import React, { Component } from 'react';
import MyAccountSetting from '../components/Profil/Profile';
import { Container } from 'native-base';
import MyHeader from "../components/MyHeader";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const icon = Icon.getImageSource('account', 20, 'grey');

export default class MyAccountSettingScreen extends Component {

    render() {
      return (
        <Container>
          <MyAccountSetting
            avatar={icon._55.uri}
            name={"Celal"} navigation={this.props.navigation} email={"celal258@mail.com"} />

      </Container>
      );
    }
  }
