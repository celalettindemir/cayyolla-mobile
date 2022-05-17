import React ,{Component} from 'react';
import { View, Text, TouchableOpacity,StyleSheet,Dimensions,FlatList } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import MyHeader from '../components/MyHeader';
import AltMusteriDetayScreen from './AltMusteriDetayScreen';
import { Container } from 'native-base';
import { HOST,ACCESS_TOKEN } from "../components/Variables";
import { createAppContainer, createStackNavigator,createMaterialTopTabNavigator } from 'react-navigation'; // Version can be specified in package.json
import axios from 'axios';
//https://www.npmjs.com/package/react-native-swiper
//https://appdividend.com/2018/08/13/react-native-swipe-components-example-tutorial/

let BorcluAltMusteri = [];
let HepsiAltMusteri = [];

let {width, height} = Dimensions.get('window')
class BorcluAltMusteriScreen extends React.Component {
	constructor(props){
        super(props)
    }
    async componentDidMount()  {
      const borcluMusteriListener = this.props.navigation.addListener('willFocus', (payload) => this.getToken(payload));
    }

    async getToken(){
      await AsyncStorage.getItem(ACCESS_TOKEN)
      .then((accessToken) => {
        if(!accessToken) {
          throw "Token not set";
        } else {
            this.setState({
              token:JSON.parse(accessToken).access_token
            });
            this.getMusteri(JSON.parse(accessToken).access_token);
        }
      })
      .catch((error) => {
        this.props.navigation.navigate("Logout")
        alert("Error :"+error);
      });
    }

      async getMusteri(token) {
        await axios.get(HOST+"/api/AltMusteri/Borclu",{
            headers: {
              Authorization:'Bearer '+token
            },
          })
          .then((response) => {
            if(response.data !=null){
              BorcluAltMusteri=response.data;
            }

            this.setState({
              isLoaded:false,
            });
            })
            .catch((error) => {
              alert(error);
            });
      }

    render() {
      const redColors = ['#ff0000', '#e8e247', '#4286f4', 'crimson', '#41ebf4', '#44dd65', '#ddc344', '#e60000', '#ff1a1a']
      return (
		<Container>
			<View style={styles.container} >
          <FlatList
            data={BorcluAltMusteri}
            showsVerticalScrollIndicator={false}
            renderItem={({item, index}) =>
            <TouchableOpacity onPress={()=>
            {
              this.props.navigation.navigate('Details', { Id: item.Id,item:item});
            }
            }>
            <View style={styles.RectangleShapeView}>
              <View style={{flex: 1, flexDirection: 'row', alignItems: 'center',}}>
                <View style={[styles.yuvarlak, {backgroundColor: index > 8 ? renk = 'lightgray' : renk = redColors[index], marginLeft: 10,}]}>
                  <Text style={styles.basHarf}>{item.CompanyName.charAt(0)}</Text>
                </View>
                <View style={{flex: 1, flexDirection: 'column', marginLeft: 10}}>
                  <Text style={{fontWeight: 'bold'}}>{item.CompanyName}</Text>
                  <Text style={{color: '#808080', fontStyle: 'italic'}}>{item.MusteriName}</Text>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={{color: '#808080', fontStyle: 'italic'}}>Son sipariş: </Text>
                    <Text style={{color: '#808080', fontStyle: 'italic'}}>{item.sonSiparis.substring(0,10)+ " " +item.sonSiparis.substring(11,19)}</Text>
                  </View>
                </View>
                <View style={{marginTop: -20, marginRight: 15}}>
                  <Text style={{fontWeight: 'bold'}}>₺{item.ToplamFiyat}</Text>
                </View>
              </View>
            </View>
            </TouchableOpacity>
           }
            keyExtractor={item => item.Id.toString()}
          />
        </View>
		</Container>
    );
    }
  }

  class TumAltMusteri extends Component {

    constructor(props){
      super(props)
  }
  async componentDidMount()  {
    const tumAltMusteri = this.props.navigation.addListener('willFocus', (payload) => this.getToken(payload));
  }
  async getToken(){
    await AsyncStorage.getItem(ACCESS_TOKEN)
    .then((accessToken) => {
      if(!accessToken) {
        throw "Token not set";
      } else {

          this.setState({
            token:JSON.parse(accessToken).access_token
          });
          this.getTumMusteri(JSON.parse(accessToken).access_token);
      }
    })
    .catch((error) => {
      this.props.navigation.navigate("Logout")
      alert("Error :"+error);
    });
  }
  async getTumMusteri(token) {
    await axios.get(HOST+"/api/AltMusteri/Hepsi",{
      headers: {
        Authorization:'Bearer '+token
      },
    })
    .then((response) => {
      if(response.data !=null){
        HepsiAltMusteri=response.data;
      }

      this.setState({
        isLoaded:false,
      });
    })
    .catch((error) => {
        alert(error);
    });
  }
    render() {
      const redColors = ['#ff0000', '#e8e247', '#4286f4', 'crimson', '#41ebf4', '#44dd65', '#ddc344', '#e60000', '#ff1a1a']
      return (
		<Container>
			<View style={styles.container} >
          <FlatList
            data={HepsiAltMusteri}
            showsVerticalScrollIndicator={false}
            renderItem={({item, index}) =>
            <TouchableOpacity onPress={()=>
            {
            }
            }>
            <View style={styles.RectangleShapeView}>
              <View style={{flex: 1, flexDirection: 'row', alignItems: 'center',}}>
                <View style={[styles.yuvarlak, {backgroundColor: index > 8 ? renk = 'lightgray' : renk = redColors[index], marginLeft: 10,}]}>
                  <Text style={styles.basHarf}>{item.CompanyName.charAt(0)}</Text>
                </View>
                <View style={{flex: 1, flexDirection: 'column', marginLeft: 10}}>
                  <Text style={{fontWeight: 'bold'}}>{item.CompanyName}</Text>
                  <Text style={{color: '#808080', fontStyle: 'italic'}}>{item.MusteriName}</Text>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={{color: '#808080', fontStyle: 'italic'}}>Son sipariş: </Text>
                    <Text style={{color: '#808080', fontStyle: 'italic'}}>{item.sonSiparis.substring(0,10)+ " " +item.sonSiparis.substring(11,19)}</Text>
                  </View>
                </View>
                <View style={{marginTop: -20, marginRight: 15}}>
                  <Text style={{fontWeight: 'bold'}}>₺{item.ToplamFiyat}</Text>
                </View>
              </View>
            </View>
            </TouchableOpacity>
           }
            keyExtractor={item => item.Id.toString()}
          />
        </View>
		</Container>
      );
    }
  }

  const StackNavigator = createStackNavigator({
    BorcluAltMusteriler: BorcluAltMusteriScreen,
    Details: AltMusteriDetayScreen,
  },

  {
    initialRouteName: 'BorcluAltMusteriler',
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    }
   });

  StackNavigator.navigationOptions = ({ navigation }) => {
    let tabBarVisible = true;
    let swipeEnabled = true;
    if (navigation.state.index > 0) {
      tabBarVisible = false;
      swipeEnabled = false;
    }

    return {
      tabBarVisible,
      swipeEnabled,
    };
  };

  const TabNavigator = createMaterialTopTabNavigator({
    AltMusteriList: { screen: StackNavigator,
      navigationOptions:{
        tabBarLabel: ({tintColor}) =>(
          <View>
            <Text style={{fontWeight:'bold',color:'#C40233'}}>Borçlu Alt Müşteriler</Text>
          </View>
        )
      }
    },
    BorcsuzAltMusteri: { screen: TumAltMusteri,
      navigationOptions:{
        tabBarLabel: ({tintColor}) =>(
          <View>
            <Text style={{fontWeight:'bold',color:'#C40233'}}>Tüm Alt Müşteriler</Text>
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
    yuvarlak: {
      width: height/16,
      height: height/16,
      borderRadius: height/16/2,
      justifyContent: 'center',
      alignItems: 'center',
    },
    basHarf: {
      textAlign: 'center',
      color: 'white',
      fontWeight:'bold'
    },
    RectangleShapeView: {
    width: Dimensions.get('window').width - 10,
    height: 80,
    backgroundColor: '#FFF',
    borderRadius:5,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    },
    horizontal: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 10
    }
  });
