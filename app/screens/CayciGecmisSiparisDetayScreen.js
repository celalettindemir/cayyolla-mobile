import React ,{Component} from 'react';
import { View, Text,ActivityIndicator,StyleSheet,Dimensions,FlatList,ScrollView } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { ListItem } from 'react-native-elements';
import {HOST,ACCESS_TOKEN} from "../components/Variables";
import axios from 'axios';

const SCREENWIDTH = Dimensions.get("window").width;
const SCREENHEIGHT = Dimensions.get("window").height;
let pastOrder = []

export default class CayciGecmisSiparisDetayScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      token:"",    
      screen_height: Dimensions.get('window').height,
      screen_width: Dimensions.get('window').width,
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
  await axios.get(HOST+"/api/GecmisSiparisCayci/"+this.props.navigation.state.params.Id,{
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
      render() {
      return !this.state.isLoaded?
      (
        <View style={[styles.containerActivity, styles.horizontal]}>
          <ActivityIndicator size="large" color="#c40233" />
        </View>
      ):(
        <View style={styles.container} onLayout={this.onLayout}>
            <View style={{alignItems:'center',marginBottom:15,marginTop:15,height:SCREENHEIGHT*0.04}}>
              <Text style={styles.name}>{pastOrder.MusteriName}</Text>
            </View>
            <ListItem
              style={[styles.ListRectangle,{ width: this.state.screen_width - 20,}]}
              contentContainerStyle={{height: 20}}
              bottomDivider={true}
              title={<View style={{flex:1,flexDirection:'row',justifyContent:'space-between'}}>
                <Text style={[styles.header]}>??r??n Ad??</Text>
                <Text style={[styles.header,{marginLeft:-25}]}>Adet</Text>
                <Text style={[styles.header]}>Fiyat</Text>
              </View>
              }
            />
              <FlatList
              data={pastOrder.model}
              showsVerticalScrollIndicator={true}
              style={{height:SCREENHEIGHT*0.25}}
              renderItem={({item}) =>
                <ListItem
                style={[styles.ListRectangle,{ width: this.state.screen_width - 20,}]}
                  title={<View style={{flex:1,flexDirection:'row',justifyContent:'space-between'}}>
                    <Text style={[styles.orders,{width:SCREENWIDTH*0.4}]}>{item.UrunName}</Text>
                    <Text style={styles.orders}>{item.Adet}</Text>
                    <Text style={[styles.price,{width:SCREENWIDTH*0.4,textAlign: 'right'}]}>{item.Fiyat} ???</Text>
                  </View>}
                  bottomDivider={true}
                  
                />
              } 
              keyExtractor={item => item.Id}
              />

              <ListItem
                style={[styles.TotalPrice,{marginTop:12,marginBottom:20,height:this.state.screen_height*0.09,width: this.state.screen_width-40}]}
                leftElement={<Text style={[styles.header,{color: '#808080'}]}>Toplam Tutar</Text>}
                rightElement={<Text style={[styles.header,{marginRight:10}]}>{pastOrder.ToplamFiyat} ???</Text>}
              />

              <View style={[styles.Aciklama,{width: this.state.screen_width- 20, minHeight:this.state.screen_height*0.1, maxHeight:this.state.screen_height*0.2}]}>
                <ScrollView>
                  <Text style={[styles.header,{marginTop:5,marginLeft:15}]}>A????klama</Text>
                  <Text style={[styles.orders,{marginTop:5,marginLeft:18,marginBottom:10}]}>{pastOrder.Not}</Text>
                </ScrollView>
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
    height: Dimensions.get('window').height,
    
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
    width: Dimensions.get('window').width-20,
  },
  Aciklama: {
    width: Dimensions.get('window').width- 20,
    backgroundColor: '#FFF',
    minHeight:Dimensions.get('window').height*0.1,
    maxHeight:Dimensions.get('window').height*0.2,
    marginBottom: 10
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