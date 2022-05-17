import React ,{Component} from 'react';
import { View, Text,  TouchableOpacity,Image,StyleSheet,Dimensions,FlatList,ImageBackground,ScrollView } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import { StackActions, NavigationActions } from 'react-navigation';
import {Container} from 'native-base';
import BaseIcon from './Icon';
import { ListItem,Button } from 'react-native-elements';


import {HOST,ACCESS_TOKEN} from "../components/Variables"

const SCREENWIDTH = Dimensions.get("window").width;
const SCREENHEIGHT = Dimensions.get("window").height;


import axios from 'axios';


export default class OrderScreen extends Component {
  constructor(props){
    super(props);
    this.state=
    {
      order:[],
      token:"",
      isLoaded:false,
      refresh:false,
      sumPrice:0
    }
  }
  async componentDidMount()  {
    await AsyncStorage.getItem(ACCESS_TOKEN)
    .then((accessToken) => {
      if(!accessToken) {
        throw "Token not set";
      } else {
          this.setState({
            token:JSON.parse(accessToken).access_token,
          })
      }
    })
    .catch((error) => {
      this.setState({isLoaded: true });
      alert("Error :"+error);
    });

    this.setState({
      order:[],
    },()=>this.getData());
  }
  getData()
  {
    let sumPrice=0;
    for (let userObject of this.props.navigation.getParam('HOT_DRINKS')) {
      for (let usersip of userObject.data) {
          this.state.order.push(usersip)
          sumPrice+=(usersip.count*usersip.price);
      }
    }
    for (let userObject of this.props.navigation.getParam("COLD_DRINKS")) {
      for (let usersip of userObject.data) {
          this.state.order.push(usersip);
          sumPrice+=(usersip.count*usersip.price);
      }
    }
    for (let userObject of this.props.navigation.getParam("FOODS")) {
      for (let usersip of userObject.data) {
          this.state.order.push(usersip);
          sumPrice+=(usersip.count*usersip.price);
      }
    }
    this.setState({
      isLoaded:true,
      sumPrice:sumPrice,
    });
  }
//If token is verified we will redirect the user to the home page
async siparisVer() {
  var data = { 
    "Tarih": "2019-01-31T13:43:00.0+03:00",
    "Not":"saddsa ",
    "model":this.state.order.filter(a=>{return a.count>0}),
    };
    await axios.post(HOST+"/api/SiparisMusteri",data,{headers: {
      'Content-Type': 'application/json',
        Authorization:'Bearer '+this.state.token
    },
  })
  .then((response) => {
  })
  .catch((error) => {
      alert(error);
      this.setState({isLoading: false});
  });
  this.props.navigation.dispatch(StackActions.reset({
    index: 0,
    actions: [
      NavigationActions.navigate({ routeName: 'Home' })
    ],
  }));
  //this.props.navigation.goBack();
}
    render() {
      return !this.state.isLoaded?
      (
        <Text>Loading.....</Text>
      )
      :(
        <Container>
          
          <View style={styles.container}>
              <View style={{alignItems:'center',marginBottom:15,marginTop:15,height:SCREENHEIGHT*0.04}}>
                <Text style={styles.name}>X Müşteri</Text>
              </View>
              <ListItem
                style={[styles.ListRectangle]}
                contentContainerStyle={{height: 20}}
                topDivider={true}
                bottomDivider={true}
                title={<View style={{flex:1,flexDirection:'row',justifyContent:'space-between'}}>
                  <Text style={[styles.header]}>Ürün Adı</Text>
                  <Text style={[styles.header,{marginLeft:-25}]}>Adet</Text>
                  <Text style={[styles.header]}>Fiyat</Text>
                </View>
                
                }
              />
                <FlatList
                data={this.state.order.filter(a=>{return a.count>0})}
                showsVerticalScrollIndicator={true}
                style={{height:SCREENHEIGHT*0.25}}
                renderItem={({item}) =>
                  <ListItem
                    style={styles.ListRectangle}
                    title={<View style={{flex:1,flexDirection:'row',justifyContent:'space-between'}}>
                      <Text style={[styles.orders,{width:SCREENWIDTH*0.4}]}>{item.title}</Text>
                      <Text style={styles.orders}>{item.count}</Text>
                      <Text style={[styles.price,{width:SCREENWIDTH*0.4,textAlign: 'right'}]}>{item.price}</Text>
                    </View>}
                    bottomDivider={true}
                    
                  />
                } 
                keyExtractor={(item) => item.ID.toString()}
                />

                <ListItem
                  style={[styles.TotalPrice,{marginTop:12,marginBottom:12,height:SCREENHEIGHT*0.09}]}
                  leftElement={<Text style={[styles.header,{color: '#808080'}]}>Toplam Tutar</Text>}
                  rightElement={<Text style={[styles.header,{marginRight:10}]}>{this.state.sumPrice} ₺</Text>}
                />

                <View style={styles.Aciklama}>
                  <ScrollView>
                    <Text style={[styles.header,{marginTop:5,marginLeft:15}]}>Açıklama</Text>
                    <Text style={[styles.orders,{marginTop:5,marginLeft:18,marginBottom:10}]}>Şeker Göndermeyin.</Text>
                  </ScrollView>
                </View>

                <View style={{marginVertical:10}}>
                  <Button
                  onPress={()=>this.siparisVer()}
                    buttonStyle={{ backgroundColor: 'white',borderRadius:10,borderWidth: 2,borderColor: 'green',width:140,height:40}}
                    icon={
                      <BaseIcon
                        icon={{
                          type: 'font-awesome',
                          name: 'check-square-o',
                          color: 'green',
                          size: 15,
                          marginLeft:-25
                        }}
                      />
                    }
                    title="Siparişi Gönder"
                    titleStyle={{color:'green',marginLeft:-25,fontSize:13,marginTop:-4}}
                  />
                </View>  
          </View>
        </Container>
      );
    }  
  }

const styles = StyleSheet.create({
  //adetler ortalanıcak , scroll eklenecek , tarih kaldırılacak.
  container: {
    backgroundColor:'#F7F7F7',
    flex:1,
    alignItems: 'center',
    height:SCREENHEIGHT
    
  },
  name: {
    fontWeight: 'bold',
    fontSize: 14,
    color: 'red',
    
  },
  orders: {
    fontSize: 14,
    color: '#808080',
    
  },

  price: {
    fontSize: 14,
    color: '#808080',
  },

  header: {
    fontWeight: 'bold',
    fontSize: 14,
    color: 'red',
    
  },
  ListRectangle: {
    width: SCREENWIDTH - 20,
    backgroundColor: '#FFF',
    height: 'auto'
  },

  TotalPrice: {
    backgroundColor: '#FFF',
    width: '100%'
  },

  Aciklama: {
    width: SCREENWIDTH - 20,
    backgroundColor: '#FFF',
    minHeight:SCREENHEIGHT*0.1,
    maxHeight:SCREENHEIGHT*0.2,
    
  },
});