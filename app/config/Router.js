import { createAppContainer, createStackNavigator } from 'react-navigation'; // Version can be specified in package.json
import { MusteriDrawMenu, CayciDrawMenu } from './DrawerNav';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import CategoryScreen from '../screens/CategoryScreen';
import RaporScreen from '../screens/CayciRaporScreen';
import { Animated, Easing } from 'react-native';
import React from 'react';
import MyHeader from '../components/MyHeader';

//Animasyonları kapatmak için: logout edildiğinde bütün geçmiş ekranları sırayla göstermesini engellemek için
/*const transitionConfig = () => ({
    transitionSpec: {
      duration: 0,
      timing: Animated.timing,
      easing: Easing.step0,
    },
  })*/

const AppNavigator = createStackNavigator({
  Login: {
    screen: LoginScreen,
  },
  
  CayciMain: {
    screen: CayciDrawMenu,
  },
  MusteriMain: {
    screen: MusteriDrawMenu,
  },
  Register: {
    screen: RegisterScreen,
  }

}, {
  initialRouteName: 'Login',
  /*defaultNavigationOptions: {
    header: <MyHeader name="Çay Ocağı Adı" raporIcon={false}/>
  },*/
  //transitionConfig: transitionConfig,
});
export default createAppContainer(AppNavigator);
