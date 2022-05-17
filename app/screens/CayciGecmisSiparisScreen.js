import React ,{Component,PureComponent} from 'react';
import { View, Text,  TouchableOpacity,StyleSheet,ActivityIndicator,Dimensions,FlatList } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import MyHeader from '../components/MyHeader';
import BaseIcon from './Icon';
import CayciGecmisSiparisDetayScreen from './CayciGecmisSiparisDetayScreen';
import CayciGecmisOdemeDetayScreen from './CayciGecmisOdemeDetayScreen';
import { createAppContainer, createStackNavigator, createMaterialTopTabNavigator } from 'react-navigation'; // Version can be specified in package.json
import { HOST, ACCESS_TOKEN } from "../components/Variables";
import axios from 'axios';
import { Container } from 'native-base';

const SCREEN_WIDTH = Dimensions.get("window").width<Dimensions.get("window").height?Dimensions.get("window").width:Dimensions.get("window").height;
const SCREEN_HEIGHT = Dimensions.get("window").width<Dimensions.get("window").height?Dimensions.get("window").height:Dimensions.get("window").width;
let pastOrder = []
let pastOrderNotification = []

class CayciGecmisSiparisFlatList extends PureComponent{
  render(){
    return(
      <TouchableOpacity onPress={()=>{
          this.props.navigation.navigate('GecmisSiparisDetay', { Id: this.props.data.Id}, {visible: false, animate: false});
        }
      }>
    <View style={styles.RectangleShapeView}>
          <View >
            <Text style={styles.name}>{this.props.data.MusteriName}</Text>
          </View>
          <View style={{ flex: 1,flexDirection: 'row',justifyContent: 'space-between'}}>

            <View>
              <View style={{flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <BaseIcon

                    icon={{
                      type: 'font-awesome',
                      name: 'shopping-basket',
                      color: 'orange',
                      size : 21,
                      marginLeft: 5
                    }}
                />
                <Text numberOfLines={1} style={styles.email1}>{this.props.data.SepetUrun}</Text>
              </View>
              <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <BaseIcon
                    containerStyle={{ backgroundColor: '#FFF' }}
                    icon={{
                      type: 'font-awesome',
                      name: 'calendar-check-o',
                      color: 'darkblue',
                      size : 20,
                      marginLeft: 5
                    }}
                />
                <Text style={styles.email}>{this.props.data.SiparisZaman}</Text>
              </View>

              <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                <BaseIcon

                    icon={{
                      type: 'material-community',
                      name: 'cash',
                      color: 'green',
                      size : 24,
                      marginLeft: 5
                    }}
                />
                <Text style={styles.email}>{this.props.data.ToplamFiyat+' ₺'}</Text>
              </View>


            </View>
            <View style={{marginBottom:50}}>
              <View style={{justifyContent:'center',marginRight: 10}}>
                <BaseIcon
                    icon={{
                      type: 'material-community',
                      name: 'file-document-box-outline',
                      color: 'lightskyblue',
                      size: 40,
                      marginLeft: -3

                    }}
                />
                <Text style={{color:'lightskyblue',marginLeft:10}}>Detay</Text>

              </View>
            </View>
          </View>
    </View>
    </TouchableOpacity>
    );
  }
}
////////Cayci Siparis List - Cayci Order List//////////
class CayciGecmisSiparisListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refresh: false,
      isLoaded: false,
      token:"",
      timerId:0,
    };
  }

  async componentDidMount()  {
    //clearTimeout(this.state.timerId);
    await AsyncStorage.getItem(ACCESS_TOKEN)
    .then((accessToken) => {
      if(!accessToken) {
        throw "Token not set";
      } else {
          this.setState({token:JSON.parse(accessToken).access_token},() => this.getSiparis());
      }
    })
    .catch((error) => {
      this.setState({isLoaded: false });
      alert("Error :"+error);
    });
  }
//If token is verified we will redirect the user to the home page
  async getSiparis() {
    await axios.get(HOST+"/api/GecmisSiparisCayci",{
        headers: {
          Authorization:'Bearer '+this.state.token
        },
      })
      .then((response) => {
        pastOrder = response.data;
        this.setState({isLoaded: true});
      })
      .catch((error) => {
        this.setState({ isLoaded: false});
        alert(error);
      });
  }

  _keyExtractor = (item) => item.Id

  _renderItem = ({item}) => {
    return(
      <CayciGecmisSiparisFlatList data={item} navigation={this.props.navigation}/>
    );
  }

    render() {
      return !this.state.isLoaded ? (
        <View style={[styles.containerActivity, styles.horizontal]}>
          <ActivityIndicator size="large" color="#c40233" />
        </View>
      ):(
        <View style={styles.container}>

          <FlatList
            data={pastOrder}
            showsVerticalScrollIndicator={false}
            initialNumToRender={30}
            maxToRenderPerBatch={30}
            renderItem={this._renderItem}
            keyExtractor={this._keyExtractor}
          />
        </View>
      );
    }
  }

const CayciGecmisSiparisStack = createAppContainer(createStackNavigator({
    GecmisList: {
      screen: CayciGecmisSiparisListScreen
    },
    GecmisSiparisDetay: {
      screen: CayciGecmisSiparisDetayScreen
    },
    GecmisOdemeDetay: {
      screen: CayciGecmisOdemeDetayScreen
    }
  },
  {
    initialRouteName: 'GecmisList',
    defaultNavigationOptions: {
      header:null,
    },
  }));


  class CayciGecmisOdemeFlatList extends PureComponent{
    render(){
      return(
        <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('GecmisOdemeDetay', { Id: this.props.data.Id}, {visible: false, animate: false});
              }}
            >
            <View style={styles.RectangleShapeView}>
                <View >
                <Text style={styles.name}>{this.props.data.CompanyName}</Text>
              </View>
              <View style={{ flex: 1,flexDirection: 'row',justifyContent: 'space-between'}}>

                <View>
                  <View style={{flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <BaseIcon

                        icon={{
                          type: 'material-community',
                          name: 'check-all',
                          color: 'orange',
                          size : 21,
                          marginLeft: 5
                        }}
                    />
                    <Text style={styles.emailOdeme}>Ödeme Bildiriminde Bulundu.</Text>
                  </View>
                  <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                    <BaseIcon
                        icon={{
                          type: 'material-community',
                          name: 'calendar-multiple',
                          color: 'darkblue',
                          size : 21,
                          marginLeft: 5
                        }}
                    />
                    <Text style={styles.email}>{this.props.data.Tarih.substring(0,10)}</Text>
                  </View>

                  <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                    <BaseIcon

                        icon={{
                          type: 'material-community',
                          name: 'cash-multiple',
                          color: 'green',
                          size : 21,
                          marginLeft: 5,

                        }}
                    />
                    <Text style={styles.email}>{this.props.data.ToplamFiyat} ₺</Text>
                  </View>
                </View>
                <View style={{alignItems: 'center'}}>
                  <View style={{justifyContent:'center',marginRight: 10}}>
                    <BaseIcon
                        icon={{
                          type: 'material-community',
                          name: 'file-document-box-outline',
                          color: '#90EE90',
                          size: 40,
                          marginLeft: -3

                        }}
                    />
                    <Text style={{color:'#90EE90',marginLeft:10}}>Detay</Text>

                  </View>
                </View>
              </View>
            </View>
            </TouchableOpacity>
      );
    }
  }

  ///////Odeme Bildirimi List////////////////////////
  class CayciGecmisOdemeScreen extends Component {
    constructor(props) {
      super(props);
      this.state = {
        refresh: false,
        isLoaded: false,
        token:"",
        timerId:0,
      };
    }

  async componentDidMount()  {
    //clearTimeout(this.state.timerId);
    await AsyncStorage.getItem(ACCESS_TOKEN)
    .then((accessToken) => {
      if(!accessToken) {
        throw "Token not set";
      } else {
          this.setState({token:JSON.parse(accessToken).access_token}, () => this.getSiparis());
      }
    })
    .catch((error) => {
      this.setState({isLoaded: false });
      alert("Error :"+error);
    });
  }
  //If token is verified we will redirect the user to the home page
  async getSiparis() {
    await axios.get(HOST+"/api/GecmisOdemeBildirim",{
        headers: {
          Authorization:'Bearer '+this.state.token
        },
      })
      .then((response) => {
        pastOrderNotification = response.data;
        this.setState({isLoaded: true});
      })
      .catch((error) => {
        this.setState({ isLoaded: false});
        alert(error);
      });
  }

  _keyExtractor = (item) => item.Id

  _renderItem = ({item}) => {
    return(
      <CayciGecmisOdemeFlatList data={item} navigation={this.props.navigation}/>
    );
  }

  render() {
    return (
    <Container>
      <View style={styles.containerOdeme} >
        <FlatList
          data={pastOrderNotification}
          showsVerticalScrollIndicator={false}
          initialNumToRender={30}
          maxToRenderPerBatch={30}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
        />
      </View>
  </Container>
    );
  }
}
  CayciGecmisSiparisStack.navigationOptions = ({navigation}) => {
    let tabBarVisible = true;
    let swipeEnabled = true;
    if(navigation.state.index > 0){
      tabBarVisible = false;
      swipeEnabled = false;
    }
    return{
      tabBarVisible,
      swipeEnabled
    }
  }
  const TabNavigator = createMaterialTopTabNavigator({
    GecmisSiparisList: { screen: CayciGecmisSiparisStack,
      navigationOptions:{
        tabBarLabel: ({tintColor}) =>(
          <View>
            <Text style={{fontWeight:'bold',color:'#C40233'}}>Geçmiş Siparişler</Text>
          </View>

        )
      }
    },
    GecmisOdemeList: { screen: CayciGecmisOdemeScreen,
      navigationOptions:{
        tabBarLabel: ({tintColor}) =>(
          <View>
            <Text style={{fontWeight:'bold',color:'#C40233'}}>Geçmiş Ödeme B.</Text>
          </View>
        )
      }
    },
  },{
    swipeEnabled:true,
    tabBarOptions:{
      style: {
        backgroundColor: '#fcfcfc',
      },
    }
  },
  {
    tabBarOptions:{
      animationEnabled: true,
      activeBackgroundColor: '#F5F5F5',
      inactiveBackgroundColor: '#F5F5F5',
    },
  }
  );

  export default TabNavigator;

  const styles = StyleSheet.create({
  container: {
    backgroundColor:'#F7F7F7',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: SCREEN_HEIGHT*0.025,
    color: 'black'
  },
  email1: {
    width: SCREEN_WIDTH*0.6,
    marginLeft: -15,
    fontWeight: 'bold',
    color: 'black',
    fontSize: SCREEN_HEIGHT*0.023,
  },
  RectangleShapeView: {
    marginTop: 13,
    width: SCREEN_WIDTH*0.95,
    height: SCREEN_HEIGHT*0.2,
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
    containerOdeme: {
      backgroundColor:'#F7F7F7',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emailOdeme: {
      marginLeft: -15,
      fontWeight: 'bold',
      color: 'black',
      fontSize: SCREEN_HEIGHT*0.023,
    }
});
