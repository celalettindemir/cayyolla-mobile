import React ,{Component} from 'react';
import { View, Text,Image,StyleSheet,Dimensions,FlatList,ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Container } from 'native-base';
import { ListItem } from 'react-native-elements';
import MyHeader from '../components/MyHeader'; //Version can be specified in package.json
import { createAppContainer, createMaterialTopTabNavigator } from 'react-navigation'; // Version can be specified in package.json
import axios from 'axios';
import { HOST, ACCESS_TOKEN, Images } from "../components/Variables";

const SCREENWIDTH = Dimensions.get("window").width;
const SCREENHEIGHT = Dimensions.get("window").height;
let TopUrunDetay = [];

export class MyAccountScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      isLoaded: false
    };
  }
async componentDidMount()  {
    this.subs = [
      this.props.navigation.addListener('didFocus', (payload) => this.componentDidFocus(payload)),
	    this.props.navigation.addListener('willBlur', (payload) => this.componentWillBlur(payload))
    ];
  }

async getRapor(range) {
  await AsyncStorage.getItem(ACCESS_TOKEN)
  .then((accessToken) => {
    if(!accessToken) {
      throw "Token not set";
    } else {

        this.setState({
          token:JSON.parse(accessToken).access_token
        });
        //this.getRapor(JSON.parse(accessToken).access_token);
          axios.get(HOST+"/api/SatilanUrunler?aralik=''" + range + "''",{
          headers: {
            Authorization:'Bearer '+JSON.parse(accessToken).access_token
          },
        })
        .then((response) => {

          if(response.data !=null){
            TopUrunDetay=response.data;
            }
          this.setState({
            isLoaded:false,
          });
          })
          .catch((error) => {
            alert(error);
          });
    }
  })
  .catch((error) => {
    this.props.navigation.navigate("Logout")
    alert("Error :"+error);
  });

}

	componentWillBlur(){
      this.setState({isLoaded: false})
  }

  componentDidFocus(){
    if(this.props.navigation.state.routeName === "Gunluk"){
		      this.getRapor("Gunluk");
      this.setState({isLoaded: true});

    }
    else if(this.props.navigation.state.routeName === "Aylik"){
		      this.getRapor("Aylık")
      this.setState({isLoaded: true})
    }
    else if(this.props.navigation.state.routeName === "Yillik"){
		      this.getRapor("Yıllık")
      this.setState({isLoaded: true})
    }
  }
  componentWillUnmount() {
    this.subs.forEach(sub => sub.remove());
  }

    render() {
            return this.state.isLoaded ?(
        <View style={[styles.containerActivity, styles.horizontal]}>
          <ActivityIndicator size="large" color="#c40233" />
        </View>)
        :(

        <Container>
          <View style={styles.container}>

            <View style={{flexDirection:'row', width:'100%',backgroundColor:'#fff',justifyContent:'center',height:SCREENHEIGHT*0.25,alignItems:'center'}}>
              <Image
                style={{width: SCREENHEIGHT*0.1,height: SCREENHEIGHT*0.1,alignItems:'center'}}
                source={require('../assets/images/piechart2.png')}
              />
              <Image
                style={{width: SCREENHEIGHT*0.25,height: SCREENHEIGHT*0.20,alignItems:'center',marginLeft:12}}
                source={require('../assets/images/chart1.png')}
              />
              <Image
                style={{width: SCREENHEIGHT*0.1,height: SCREENHEIGHT*0.1,alignItems:'center'}}
                source={require('../assets/images/piechart2.png')}
              />
            </View>


            <ListItem
              style={[styles.ListRectangle]}
              contentContainerStyle={{height: 20,marginTop:-20}}
              title={<View style={{flex:1,flexDirection:'row',justifyContent:'space-between'}}>
                <Text style={[styles.header]}>Ürün Adı</Text>
                <Text style={[styles.header]}>Fiyat</Text>
              </View>

              }

            />

              <FlatList
              data={TopUrunDetay}
              showsVerticalScrollIndicator={true}
              style={{height:SCREENHEIGHT*0.1,marginTop:-10}}
              renderItem={({item}) =>
                <ListItem
                  style={styles.ListRectangle}
                  title={<View style={{flex:1,flexDirection:'row',justifyContent:'space-between'}}>
                    <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>

                      <View style={{width: 40,height:40,backgroundColor:'#F5F5F5',borderRadius:15}}>
                        <Image
                          style={{width: 35,height:35,marginLeft:3}}
                          source={Images[item.UrunId]}
                        />
                      </View>

                      <View style={{marginLeft:8}}>
                        <Text style={[styles.orders,{width:SCREENWIDTH*0.4}]}>{item.UrunAdi}</Text>
                        <Text style={styles.count}>Sipariş Edilen {item.Adet} Adet</Text>
                      </View>

                    </View>
                    <Text style={[styles.price,{width:SCREENWIDTH*0.4,textAlign: 'right'}]}>~ {item.ToplamFiyat} ₺</Text>
                  </View>}


                />
              }
              keyExtractor={item => item.UrunId.toString()}
              />

          </View>


        </Container>
      );
    }
  }
  export const CayciRapor2TabNavigator = createMaterialTopTabNavigator({
    Gunluk: { screen: MyAccountScreen,
      navigationOptions:{
        tabBarLabel: ({tintColor}) =>(
          <View>
            <Text style={{fontWeight:'bold',color:'#C40233'}}>Günlük</Text>


          </View>
        ),
        initialRouteParams: {aralik: 'gun'}
      }
    },
    Aylik: { screen: MyAccountScreen,
      navigationOptions:{
        tabBarLabel: ({tintColor}) =>(
          <View>
            <Text style={{fontWeight:'bold',color:'#C40233'}}>Aylık</Text>

          </View>
        )
      }
    },
    Yillik: { screen: MyAccountScreen,
      navigationOptions:{
        tabBarLabel: ({tintColor}) =>(
          <View>
            <Text style={{fontWeight:'bold',color:'#C40233'}}>Yıllık</Text>

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

  export default CayciRapor2TabNavigator;


const styles = StyleSheet.create({
  //adetler ortalanıcak , scroll eklenecek , tarih kaldırılacak.
  container: {
    backgroundColor:'#FFF',
    flex:1,
    alignItems: 'center',
    height:SCREENHEIGHT

  },
  orders: {
    fontSize: 14,
    color: 'black',
    fontWeight:'bold'

  },
  count: {
    fontSize: 11,
    color: '#808080',
    fontStyle:"italic"

  },

  price: {
    fontSize: 14,
    color: 'black',
    fontWeight:'bold'
  },

  header: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#D3D3D3',
    fontStyle:'italic'

  },
  ListRectangle: {
    width: SCREENWIDTH - 20,
    backgroundColor: '#FFF',
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
