import React ,{Component} from 'react';
import { Image, ImageBackground, View,SafeAreaView, Text, TouchableOpacity,StyleSheet,ActivityIndicator,Dimensions,FlatList,SectionList } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import BaseIcon from './Icon';
import {createAppContainer, createStackNavigator} from 'react-navigation'; // Version can be specified in package.json
import { HOST,ACCESS_TOKEN } from "../components/Variables";
import axios from 'axios';
import { Container } from 'native-base';
import CayciSiparisDetayScreen from './CayciSiparisDetayScreen';
import Sound from 'react-native-sound';

import firebase from "react-native-firebase";



/*const BaseIcon = ({ containerStyle, icon }) => (
  <View style={{    alignItems: 'center',
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderRadius: 10,
    borderWidth: 1,
    height: 34,
    justifyContent: 'center',
    marginLeft: 10,
    marginRight: 18,
    width: 34,}}>
    <Icon
      size={14}
      color="white"
      type="material"
      name="notifications"
      {...icon}
    />
  </View>
)*/


let orderList = [];
let orderListIn = [];
let orderListLastId = 0;
let sayac = 0;
var ses;
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
////////Cayci Siparis List - Cayci Order List//////////
class CayciSiparisListScreen extends Component {
  constructor(props) {
    super(props);
	Sound.setCategory('Playback');
    this.state = {
      refresh: false,
      isLoaded: false,
      token:"",
      timerId:0,
      screen_height: Dimensions.get('window').height,
      screen_width: Dimensions.get('window').width
    };
    this.onLayout = this.onLayout.bind(this);
  }


  onLayout(e) {
    this.setState({isLoaded: false},
      () => this.setState({screen_height: Dimensions.get('window').height, screen_width: Dimensions.get('window').width},
          ()=> this.setState({isLoaded: true})));


  }

  async componentDidMount()  {
	  ses = new Sound('incoming.mp3', Sound.MAIN_BUNDLE);
    //clearTimeout(this.state.timerId);


    await AsyncStorage.getItem(ACCESS_TOKEN)
    .then((accessToken) => {
      if(!accessToken) {
        throw "Token not set";
      } else {
          this.setState({token:JSON.parse(accessToken).access_token,timerId:setInterval(() => this.getSiparis(), 10000)},
          ()=>{
            this.getSiparis();
            this.checkPermission();
            this.getToken();
          }
        );
      }
    })
    .catch((error) => {
      this.setState({isLoaded: false });
      alert("Error :"+error);
    });
  }

  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    //console.log("before fcmToken: ", fcmToken);
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        console.log("after fcmToken: ", fcmToken);
        await AsyncStorage.setItem('fcmToken', fcmToken);
        await axios.post(HOST+"/api/Account/saveFcmToken",{"fcmToken":fcmToken},{headers: {
          'Content-Type': 'application/json',
            Authorization:'Bearer '+this.state.token
          },
        })
        .then((response) => {
        })
        .catch((error) => {
            alert(error);
            this.setState({isLoaded: false});
        });
      }
    }
  }
  createNotificationChannel = () => {
    // Build a android notification channel
    const channel = new firebase.notifications.Android.Channel(
      "reminder", // channelId
      "Reminders Channel", // channel name
      firebase.notifications.Android.Importance.High // channel importance
    ).setDescription("Used for getting reminder notification"); // channel description
    // Create the android notification channel
    firebase.notifications().android.createChannel(channel);
  };
  checkPermission = async () => {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {

      //console.log("İznimiz var paramız yok :D");
      // We've the permission
      this.notificationListener = firebase
        .notifications()
        .onNotification(async notification => {
          // Display your notification
          await firebase.notifications().displayNotification(notification);
        });
    } else {
      //console.log("İznimiz yok");
      // user doesn't have permission
      try {
        await firebase.messaging().requestPermission();
      } catch (error) {
        Alert.alert("Unable to access the Notification permission. Please enable the Notification Permission from the settings");
      }
    }
  };
  async componentWillUnmount() {
    clearInterval(this.state.timerId);
  }
  async getConfirmSiparis(sipId) {
    this.setState({
      isLoaded:false,
    });
    var data = { 
      "Id": sipId,
      "IsSiparis": true
      };
    await axios.post(HOST+"/api/SiparisCayci",data,{
        headers: {
          'Content-Type': 'application/json',
          Authorization:'Bearer '+this.state.token
        },
      })
      .then((response) => {
        this.setState({
          isLoaded:true,
        });
        this.getSiparis();
      })
      .catch((error) => {
        this.setState({isLoaded: false});
        alert("Error: "+error);
      });
  }
//If token is verified we will redirect the user to the home page
  async getSiparis() {
    await axios.get(HOST+"/api/SiparisCayci",{
      headers: {
        Authorization:'Bearer '+this.state.token
      },
    })
    .then((response) => {
      orderList=response.data;
      if(orderList.length>0){
        console.log(orderList,"girdi.")
      for (let i=0;i<orderList.length;i++) {
        //console.log(orderList[i])
        orderList[i].SiparisList=orderList.reduce((r,s) => {
          console.log(s)
          if(s.CounterId==orderList[i].CounterId)
            r.push({data:s.SiparisList});
          return r;
        }, []);
      }

      //console.log(orderList);
      //console.log(orderList[0].SiparisList)
      
        if( orderListLastId< orderList[orderList.length-1].Id) {
          orderListLength=orderList.length;
          ses.play();
        }
        orderListLastId=orderList[orderList.length-1].Id;
      }
      //this.flatList.scrollToIndex({index: 0, viewPosition: 0});
      this.setState({isLoaded: true, refresh: !this.state.refresh});
      //console.log("geldi")
    })
    .catch((error) => {
      this.setState({ isLoaded: false});
      alert(error);
    });

    
  }

    render() {
      //console.log(this.state.isLoaded)
      const Item = ({ title }) => (
        <View style={{flex: 1, alignItems: 'space-between' }}>
        <BaseIcon/>
        <Text style={[styles.email1]}>{title.Adet} {title.UrunName}</Text>
      </View>
      );
      return !this.state.isLoaded ? (
        <View style={[styles.containerActivity, styles.horizontal]}>
          <ActivityIndicator size="large" color="#c40233" />
        </View>
      ) : (
        <View style={styles.container} onLayout={this.onLayout}>
          <FlatList
          data={orderList}
          extraData={this.state.refresh}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) =>
          <View>

            <TouchableOpacity>
              <View style={{ marginBottom: 7,paddingBottom:5,backgroundColor: '#FFF',borderRadius:5,borderWidth: 1,borderColor: '#ddd'}}>
                    <View >
                      <Text style={styles.name}>{item.MusteriName}</Text>
                    </View>
                    <View style={{ flex: 1,flexDirection: 'row',justifyContent: 'space-between'}}>
                    <View>
                    
                    <View>
                        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center' }}></View>
                        <SectionList
                                
                                sections={item.SiparisList}
                                renderItem={({ item, index, section }) => 
                                (
                                  <View>
                                    <View style={{flex: 1 , flexDirection: 'row', alignItems: 'center' }}>
                                        <BaseIcon/>
                                        <Text style={[styles.email1]}>{item.Adet} {item.UrunName}</Text>
                                      </View>
                                    </View>
                                )}
                                keyExtractor={(item, index) => item.Id + index}
                                listKey={(item, index) => item.Id + index}
                          />
                  </View>
                  </View>
                                    <View style={{marginBottom:20}}>
                                      <TouchableOpacity onPress={()=>this.getConfirmSiparis(item.Id)}>
                                      <View style={{justifyContent:'center',marginRight: 10}}>
                                        <BaseIcon
                                            icon={{
                                              type: 'material-community',
                                              name: 'trash-can',
                                              color: '#D50000',
                                              size: 40,
                                              marginLeft: -3

                                            }}
                                        />
                                        <Text style={{color:'#D50000',marginLeft:20}}>Sil</Text>
                                      
                                      </View>
                        </TouchableOpacity>
                      </View>
                  </View>
                  
                  </View>
              </TouchableOpacity>

          </View>
          }
          keyExtractor={item => item.CounterId}
        />


        </View>
      );
    }
  }

  /*
  <FlatList
                              data={item.SiparisList}
                              showsVerticalScrollIndicator={false}
                              renderItem={({itemSelect}) =>
                              <View style={{flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                  <BaseIcon/>
                                  <Text style={[styles.email1]}>{itemSelect.Adet} {itemSelect.UrunName}</Text>
                                </View>
                            }
                            keyExtractor={itemSelect => itemSelect.Id}
                              />
  */
const CayciSiparisStack = createAppContainer(createStackNavigator({
    List: {
      screen: CayciSiparisListScreen
    },
    Detay: {
      screen: CayciSiparisDetayScreen
    }
  },
  {
    initialRouteName: 'List',
    defaultNavigationOptions: {
      header:null,
    },
  }));

  export default CayciSiparisStack;

const styles = StyleSheet.create({
  container: {
    backgroundColor:'#F7F7F7',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop:5
  },
  name: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'red',
    marginLeft: 19,
    marginBottom:5,
    marginTop:5,

  },
  email: {
    marginLeft: -14,
    marginTop: 1,
    fontSize: SCREEN_WIDTH < SCREEN_HEIGHT ? SCREEN_HEIGHT*0.025 : SCREEN_WIDTH*0.025,
    color: 'black'
  },
  email1: {
    width: SCREEN_WIDTH < SCREEN_HEIGHT ? SCREEN_WIDTH*0.6 : SCREEN_HEIGHT*0.6,
    marginLeft: -15,
    fontWeight: 'bold',
    color: 'black',
    fontSize: SCREEN_WIDTH < SCREEN_HEIGHT ? SCREEN_HEIGHT*0.023 : SCREEN_WIDTH*0.023,
  },
  RectangleShapeView: {
    marginTop: 13,
    width: SCREEN_WIDTH < SCREEN_HEIGHT ? SCREEN_WIDTH*0.95 : SCREEN_HEIGHT*0.95,
    height: SCREEN_WIDTH < SCREEN_HEIGHT ? SCREEN_HEIGHT*4*0.2 : SCREEN_WIDTH*4*0.2,
    backgroundColor: '#FFF',
    borderRadius:5,
    borderWidth: 1,
    borderColor: '#ddd',
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
  emailOdeme: {
    marginLeft: -15,
    fontWeight: 'bold',
    color: 'black',
    fontSize: SCREEN_WIDTH < SCREEN_HEIGHT ? SCREEN_HEIGHT*0.023 : SCREEN_WIDTH*0.023,
  },
  });
