/*import React ,{Component} from 'react';
import { View, Text, Button,TouchableOpacity, StyleSheet,ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { StackActions, NavigationActions } from 'react-navigation'; // Version can be specified in package.json
import {CayciDrawMenu,MusteriDrawMenu} from '../config/DrawerNav'; // Version can be specified in package.json
//https://readybytes.in/blog/how-to-integrate-tabs-navigation-drawer-navigation-and-stack-navigation-together-in-react-navigation-v2

// gets the current screen from navigation state
function getActiveRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getActiveRouteName(route);
  }
  return route.routeName;
}

const ACCESS_TOKEN = 'access_token';

export default class MainScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      selectedType:'Müşteri',
    };
  }
  async removeLogin() {
    try {
        await AsyncStorage.removeItem(ACCESS_TOKEN);
    } catch(error) {
    }
  }
  async componentDidMount()  {

    await AsyncStorage.getItem(ACCESS_TOKEN)
    .then((kullaniciTur) => {
      if(!kullaniciTur) {
        throw "Token not set";
      } else {
        this.setState({
          selectedType:JSON.parse(kullaniciTur).kullaniciTur,
          isLoading:true,
        });
      }
    })
    .catch((error) => {
      alert("Error :"+error);
    });
}
  render() {
    return !this.state.isLoading ? (
        <View style={[styles.containerActivity, styles.horizontal]}>
          <ActivityIndicator size="large" color="#c40233" />
        </View>
      ) :
      (this.state.selectedType=='Çaycı' ?
        (
        <CayciDrawMenu onNavigationStateChange={(prevState, currentState) => {
          const currentScreen = getActiveRouteName(currentState);
          const prevScreen = getActiveRouteName(prevState);

          if (prevScreen !== currentScreen) {
            if(currentScreen=="Logout")
            {
              this.removeLogin();
              this.props.navigation.dispatch(StackActions.reset({
                index: 0,
                actions: [
                NavigationActions.navigate({ routeName: 'Login' })
                ],
            }));
            }
          }
        }} />
        ):(
          <MusteriDrawMenu onNavigationStateChange={(prevState, currentState) => {
            const currentScreen = getActiveRouteName(currentState);
            const prevScreen = getActiveRouteName(prevState);

            if (prevScreen !== currentScreen) {
              if(currentScreen=="Logout")
              {
                this.removeLogin();
                this.props.navigation.dispatch(StackActions.reset({
                  index: 0,
                  actions: [
                  NavigationActions.navigate({ routeName: 'Login' })
                  ],
              }));
              }
            }
          }} />
        )
      )

  }
}

const styles = StyleSheet.create({
  containerActivity: {
      flex: 1,
      justifyContent: 'center'
    },
    horizontal: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 10
    }
});*/
