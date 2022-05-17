import React ,{Component} from 'react';
import { View, Text,ActivityIndicator,StyleSheet,Dimensions,FlatList } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import BaseIcon from './Icon';
import { ListItem,Button } from 'react-native-elements';
import {HOST,ACCESS_TOKEN} from "../components/Variables";

const SCREENWIDTH = Dimensions.get("window").width;
const SCREENHEIGHT = Dimensions.get("window").height;

import axios from 'axios';

export default class CayciSiparisDetayScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      token:"",
      "order": [
      ],
    };
  }
  async componentDidMount()  {

    await AsyncStorage.getItem(ACCESS_TOKEN)
    .then((accessToken) => {
      if(!accessToken) {
        throw "Token not set";
      } else {
        this.setState({
          token:JSON.parse(accessToken).access_token,
        });
          this.getSiparis(JSON.parse(accessToken).access_token);
      }
    })
    .catch((error) => {
      this.setState({isLoaded: true });
      alert("Error :"+error);
    });
  }
async getSiparis(token) {

  await axios.get(HOST+"/api/SiparisCayci/"+this.props.navigation.state.params.Id,{
      headers: {
        Authorization:'Bearer '+token
      },
    })
    .then((response) => {
      this.setState({order:response.data,isLoaded: true});
    })
    .catch((error) => {
      this.setState({ isLoaded: true});
      alert(error);
    });
}
async getConfirmSiparis() {
  var data = { 
    "Id": this.props.navigation.state.params.Id,
    };
  await axios.post(HOST+"/api/SiparisCayci",data,{
      headers: {
        'Content-Type': 'application/json',
        Authorization:'Bearer '+this.state.token
      },
    })
    .then((response) => {
    })
    .catch((error) => {
      alert(error);
    });
    this.navigation.goback();
}
      render() {
      return !this.state.isLoaded?
      (
        <View style={[styles.containerActivity, styles.horizontal]}>
          <ActivityIndicator size="large" color="#c40233" />
        </View>
      ):(
        <View style={styles.container}>
            <View style={{alignItems:'center',marginBottom:15,marginTop:15,height:SCREENHEIGHT*0.04}}>
              <Text style={styles.name}>{this.state.order.MusteriName}</Text>
            </View>
            <ListItem
              style={[styles.ListRectangle]}
              contentContainerStyle={{height: 20}}
              bottomDivider={true}
              title={<View style={{flex:1,flexDirection:'row',justifyContent:'space-between'}}>
                <Text style={[styles.header]}>Ürün Adı</Text>
                <Text style={[styles.header,{marginLeft:-25}]}>Adet</Text>
                <Text style={[styles.header]}>Fiyat</Text>
              </View>
              }
            />
              <FlatList
              data={this.state.order.model}
              showsVerticalScrollIndicator={true}
              style={{height:SCREENHEIGHT*0.25}}
              renderItem={({item}) =>
                <ListItem
                  style={styles.ListRectangle}
                  title={<View style={{flex:1,flexDirection:'row',justifyContent:'space-between'}}>
                    <Text style={[styles.orders,{width:SCREENWIDTH*0.4}]}>{item.UrunName}</Text>
                    <Text style={styles.orders}>{item.Adet}</Text>
                    <Text style={[styles.price,{width:SCREENWIDTH*0.4,textAlign: 'right'}]}>{item.Fiyat}</Text>
                  </View>}
                  bottomDivider={true}
                />
              } 
              keyExtractor={item => item.Id}
              />
          <ListItem
                style={[styles.TotalPrice,{marginTop:12,marginBottom:12,height:SCREENHEIGHT*0.09}]}
                leftElement={<Text style={[styles.header,{color: '#808080'}]}>Toplam Tutar</Text>}
                rightElement={<Text style={[styles.header,{marginRight:10}]}>{this.state.order.ToplamFiyat}₺</Text>}
              />

              <View style={{marginVertical:10}}>
                <Button
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
                  onPress={()=>this.getConfirmSiparis()}
                  title="Ödemeyi Onayla"
                  titleStyle={{color:'green',marginLeft:-25,fontSize:13,marginTop:-4}}
                />
              </View>
                
        </View>
      );
    }  
  }


const styles = StyleSheet.create({
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
  },
  TotalPrice: {
    width: '100%',
  },
});