import React,{Component} from 'react';
import { StyleSheet, View,ActivityIndicator, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Router from './app/config/Router';
import {HOST,ACCESS_TOKEN, PHONE_NUMBER, PASSWORD} from "./app/components/Variables";
//import * as Font from 'expo-font';
import { StackActions, NavigationActions } from 'react-navigation'; // Version can be specified in package.json
import axios from 'axios';

//import { useScreens } from 'react-native-screens';

//useScreens();

//https://medium.com/the-react-native-log/organizing-a-react-native-project-9514dfadaa0
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      routeName:'Login'
    };
  }
  someEvent() {
    // call navigate for AppNavigator here:
    this.navigator &&
      this.navigator.dispatch(StackActions.reset({
        index: 0,
        actions: [
        NavigationActions.navigate({ routeName: this.state.routeName })
        ],
    }));
  }
  async componentDidMount()  {
      await AsyncStorage.getItem(ACCESS_TOKEN)
      .then((accessToken) => {
        if(!accessToken) {
          this.signup();
        } else {
            this.verifyToken(JSON.parse(accessToken));
        }
      })
      .catch((error) => {
        this.setState({isLoaded: true});
        //console.log("Error :"+error);
      });
  }

  async storeToken(data){
    await AsyncStorage.setItem(ACCESS_TOKEN,JSON.stringify(data), (err)=> {
      if(err){
        //console.log("an error");
        throw err;
      }
      this.setState({routeName: data.kullaniciTur == "Çaycı" ? 'CayciMain' : 'MusteriMain',isLoaded: true},()=>{this.someEvent()});
    }).catch((err)=> {
      //console.log("error is: " + err);
  });
  }

  async signup() {
    await AsyncStorage.getItem(PHONE_NUMBER)
    .then(async (phoneNumber) => {
      if(!phoneNumber) {
        //throw "Telefon No not set";
        this.setState({routeName:'Login',isLoaded: true},()=>{this.someEvent()});
      } else {
          await AsyncStorage.getItem(PASSWORD)
          .then(async (password) => {
            if(!password) {
              this.setState({routeName:'Login',isLoaded: true},()=>{this.someEvent()});
            } else {
              await axios.post(HOST+"/api/Account/Login",{
                PhoneNumber: JSON.parse(phoneNumber),
                password: JSON.parse(password),
                },{headers: {
                    'Content-Type': 'application/json',},
                })
                .then((response) => {
                    if(response.data.access_token!=null && response.data.kullaniciTur!=null)
                    {
                        this.storeToken(response.data);
                    }
                    else{
                        alert("Hatalı Giriş");
                    }
                })
                .catch((error) => {
                    alert("error signup " + error);
                    this.setState({isLoaded: false});
                    this.setState({routeName:'Login',isLoaded: true},()=>{this.someEvent()});
                });
            }
          })
          .catch((error) => {
            this.setState({routeName:'Login',isLoaded: true},()=>{this.someEvent()});
          })
      }
    })
    .catch((error) => {
      this.setState({routeName:'Login',isLoaded: true},()=>{this.someEvent()});
    })
  }
  //If token is verified we will redirect the user to the home page
  async verifyToken(token) {

    await axios.post(HOST+"/api/Account/VerifyToken",{
      },{
        headers: {
          'Content-Type': 'application/json',
          'Authorization':'bearer '+token.access_token
        },
      })
      .then((response) => {
        if(response.data=="Successfully")
        {
          this.setState({routeName: token.kullaniciTur == "Çaycı" ? 'CayciMain' : 'MusteriMain',isLoaded: true},()=>{this.someEvent()});
        }
        else{
          this.signup();
          this.verifyToken();
        }
      })
      .catch((error) => {
        ////console.log(error);
        this.setState({routeName:'Login',isLoaded: true},()=>{this.someEvent()});
      });
  }
//<Image source={{uri: './assets/splash.png'}}/>
  render() {
   return !this.state.isLoaded?(
    <View style={[styles.containerActivity, styles.horizontal]}>
      <StatusBar hidden/>
      <ActivityIndicator size="large" color="#c40233" />
    </View>
  )
  :(
    <View style={styles.container}>
        <StatusBar hidden/>
        <Router ref={nav => {
                    this.navigator = nav;
                  }}/>
      </View>
  );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerActivity: {
    flex: 1,
    justifyContent: 'center'
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  },
});
