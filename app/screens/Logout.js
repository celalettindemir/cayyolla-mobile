import React, {Component} from 'react';
import {StyleSheet,ActivityIndicator, Alert} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {ACCESS_TOKEN, PHONE_NUMBER, PASSWORD} from "../components/Variables";
import { StackActions, NavigationActions } from 'react-navigation';

//https://github.com/aryaminus/RN-login-register-screen
export default class Logo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      routeName:'Login'
    };
  }
  someEvent() {
    // call navigate for AppNavigator here:
    this.props.navigation.dispatch(StackActions.reset({
      index: 0,
      actions: [
      NavigationActions.navigate({ routeName: this.state.routeName })
      ],
  }));
  }
    async Logout()
    {
      await AsyncStorage.removeItem(ACCESS_TOKEN);
      await AsyncStorage.removeItem(PHONE_NUMBER);
      await AsyncStorage.removeItem(PASSWORD);
      await AsyncStorage.removeItem("fcmToken");
      this.someEvent();
    }
    async discardLogout()
    { 
      
      await AsyncStorage.getItem(ACCESS_TOKEN)
      .then((accessToken) => {
        if(accessToken) {
          this.setState({routeName: JSON.parse(accessToken).kullaniciTur == 'Çaycı' ? 'CayciMain' : 'MusteriMain'},
          ()=>{this.someEvent()});
        }
      })
      .catch((error) => {
      });
    }
    async componentDidMount() {
        try {
            
            Alert.alert(
              'Çıkış',
              'Çıkmak istediğinize emin misiniz ?',
              [
                { 
                  text: 'Hayır',
                  style: 'cancel',
                  onPress: () => this.discardLogout()

                },
                {text: 'Onayla', onPress: () => this.Logout()},
              ],
              {cancelable: false},
            );
        } catch(error) {
          alert("Something went wrong" + error);
        }

      }
    static navigationOptions = {
        header: null,
      };
    render() {
      return (
        <ActivityIndicator color="#fff"/>
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
