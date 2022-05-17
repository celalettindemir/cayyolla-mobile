import React ,{Component} from 'react';
import { View, Alert, Text,ActivityIndicator, StyleSheet,Dimensions,FlatList,ScrollView } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import BaseIcon from './Icon';
import { ListItem,Button } from 'react-native-elements';
import {HOST,ACCESS_TOKEN} from "../components/Variables";
import { StackActions, NavigationActions } from 'react-navigation';
import axios from 'axios';

const SCREENHEIGHT = Dimensions.get("window").height;
let order = []

export default class CayciSiparisDetayScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      screen_height: Dimensions.get('window').height,
      screen_width: Dimensions.get('window').width
    };
    this.onLayout = this.onLayout.bind(this);
  }

  onLayout(e){
    this.setState({screen_width: Dimensions.get('window').width});
    this.setState({screen_height: Dimensions.get('window').height});
  }

  async componentDidMount()  {
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
  await axios.get(HOST+"/api/SiparisCayci/"+this.props.navigation.state.params.Id+"?IsSiparis="+this.props.navigation.state.params.IsSiparis,{
      headers: {
        Authorization:'Bearer '+this.state.token
      },
    })
    .then((response) => {
      order = response.data;
      this.setState({isLoaded: true});
      control=this.props.navigation.state.params.IsSiparis;
    })
    .catch((error) => {
      this.setState({ isLoaded: false});
      alert(error);
    });

}
async getConfirmSiparis() {
  this.setState({
    isLoaded:false,
  });
  var data = { 
    "Id": this.props.navigation.state.params.Id,
    "IsSiparis": this.props.navigation.state.params.IsSiparis
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
    })
    .catch((error) => {
      this.setState({isLoaded: false});
      alert("Error: "+error);
    });
    /*
    this.props.navigation.state.params.IsSiparis ?
    Alert.alert(
      'Sipariş Onay',
      'Sipariş başarılı bir şekilde onaylandı!',
      [
        {text: 'Tamam'},
      ],
      {cancelable: false},
    )
    :
    Alert.alert(
      'Ödeme Onay',
      'Ödeme bildirimi başarılı bir şekilde onaylandı!',
      [
        {text: 'Tamam'},
      ],
      {cancelable: false},
    )*/
    this.props.navigation.dispatch(StackActions.reset({
      index: 0,
      actions: [
      NavigationActions.navigate({ routeName: 'CayciMain' })
      ],
    }));
}
      render() {
      return !this.state.isLoaded?
      (
        <View style={[styles.containerActivity, styles.horizontal]}>
          <ActivityIndicator size="large" color="#c40233" />
        </View>
      ):(
        <View style={[styles.container, {height:this.state.screen_height}]}  onLayout={this.onLayout}>
            <View style={{alignItems:'center',marginBottom:15,marginTop:15,height:this.state.screen_height*0.04}}>
              <Text style={styles.name}>{order.MusteriName}</Text>
            </View>
            <ListItem
              style={[styles.ListRectangle, {width: this.state.screen_width - 20}]}
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
              data={order.model}
              showsVerticalScrollIndicator={true}
              style={{height:this.state.screen_height*0.25}}
              renderItem={({item}) =>
                
                <ListItem
                  style={[styles.ListRectangle,{width: this.state.screen_width - 20}]}
                  title={<View style={{flex:1,flexDirection:'row',justifyContent:'space-between'}}>
                    <Text style={[styles.orders,{width:this.state.screen_width*0.4}]}>{item.UrunName}</Text>
                    <Text style={styles.orders}>{item.Adet}</Text>
                    <Text style={[styles.price,{width:this.state.screen_width*0.4,textAlign: 'right'}]}>{item.Fiyat} ₺</Text>
                  </View>}
                  bottomDivider={true}
                  
                />
              } 
              keyExtractor={item => item.Id}
              />

              <ListItem
                style={[styles.TotalPrice,{marginTop:12,marginBottom:12,height:this.state.screen_height*0.09 ,width: this.state.screen_width}]}
                leftElement={<Text style={[styles.header,{color: '#808080'}]}>Toplam Tutar</Text>}
                rightElement={<Text style={[styles.header,{marginRight:10}]}>{order.ToplamFiyat} ₺</Text>}
              />

              <View style={[styles.Aciklama,{width: this.state.screen_width - 20,minHeight: this.state.screen_height*0.1, maxHeight: this.state.screen_height*0.2,}]}>
                <ScrollView>
                  <Text style={[styles.header,{marginTop:5,marginLeft:15}]}>Açıklama</Text>
                  <Text style={[styles.orders,{marginTop:5,marginLeft:18,marginBottom:10}]}>{order.Not}</Text>
                </ScrollView>
              </View>

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
                  onPress={()=>{this.props.navigation.state.params.IsSiparis ? 
                    /*Alert.alert(
                      'Sipariş',
                      'Sipariş onaylansın mı?',
                      [
                        { 
                          text: 'Hayır',
                          style: 'cancel',
                        },
                        {text: 'Onayla', onPress: () => this.getConfirmSiparis()},
                      ],
                      {cancelable: false},
                    )*/
                    this.getConfirmSiparis()
                    :
                    Alert.alert(
                      'Ödeme Bildirim',
                      'Ödeme bildirimi onaylansın mı?',
                      [
                        { 
                          text: 'Hayır',
                          style: 'cancel',
                        },
                        {text: 'Onayla', onPress: () => this.getConfirmSiparis()},
                      ],
                      {cancelable: false},
                    )
                  }}
                  title={this.props.navigation.state.params.IsSiparis ? "Siparişi Onayla" : "Ödemeyi Onayla"}
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
    height:Dimensions.get('window').height
    
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
    width: Dimensions.get('window').width - 20,
    backgroundColor: '#FFF',
  },

  TotalPrice: {
    backgroundColor: '#FFF',
    width: Dimensions.get('window').width-20
  },

  Aciklama: {
    width: Dimensions.get('window').width - 20,
    backgroundColor: '#FFF',
    minHeight: Dimensions.get('window').height*0.1,
    maxHeight: Dimensions.get('window').height*0.2,
    
  },
  containerActivity: {
    flex: 1,
    justifyContent: 'center'
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  }
});