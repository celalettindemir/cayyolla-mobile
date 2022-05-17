import React ,{Component} from 'react';
import { Alert, View, Text,ActivityIndicator,StyleSheet,Dimensions,FlatList} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import BaseIcon from './Icon';
import { ListItem,Button } from 'react-native-elements';
import {HOST,ACCESS_TOKEN} from "../components/Variables";
import { StackActions, NavigationActions } from 'react-navigation';
import axios from 'axios';

const SCREENWIDTH = Dimensions.get("window").width;
const SCREENHEIGHT = Dimensions.get("window").height;

export default class AltMusteriDetayScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      token:"",
      "order": [
      ],
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
        this.setState({
          token:JSON.parse(accessToken).access_token,
        });
          this.getMusteri(JSON.parse(accessToken).access_token);
      }
    })
    .catch((error) => {
      this.setState({isLoaded: true });
      alert("Error :"+error);
    });
  }

//If token is verified we will redirect the user to the home page
async getMusteri(token) {
  await axios.get(HOST+"/api/AltMusteri/"+this.props.navigation.state.params.Id,{
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

async getConfirmHesap() {
  this.setState({
    isLoaded:false,
  });
  var data = {
    "Id": this.props.navigation.state.params.Id,
    };
  await axios.post(HOST+"/api/AltMusteri",data,{
      headers: {
        'Content-Type': 'application/json',
        Authorization:'Bearer '+this.state.token
      },
    })
    .then((response) => {
      this.setState({
        isLoaded:true,
      });
      Alert.alert(
        'Hesap Kesim',
        'Hesap kesimi başarı bir şekilde yapıldı!',
        [
          {text: 'Tamam'},
        ],
        {cancelable: false},
      )
      this.props.navigation.dispatch(StackActions.reset({
        index: 0,
        key: this.props.navigation.dangerouslyGetParent().state.key,
        actions: [
          NavigationActions.navigate({ routeName: 'BorcluAltMusteriler' })
        ],
      }));
    })
    .catch((error) => {
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
        <View style={[styles.container,{height:this.state.height}]} onLayout={this.onLayout}>
            <View style={{alignItems:'center',marginBottom:15,marginTop:15,height:this.state.screen_height*0.04}}>
              <Text style={styles.name}>{this.state.order.CompanyName}</Text>
            </View>
            <ListItem
              style={[styles.ListRectangle,{width: this.state.screen_width - 20,}]}
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
              data={this.state.order.siparisler}
              showsVerticalScrollIndicator={true}
              style={{height:this.state.screen_height*0.25}}
              renderItem={({item}) =>
                <ListItem
                  style={[styles.ListRectangle,{width: this.state.screen_width - 20,}]}
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
              <ListItem style={{width: this.state.screen_width - 20,}}
                style={[styles.TotalPrice,{marginTop:12,marginBottom:12,height:this.state.screen_height*0.09}]}
                leftElement={<Text style={[styles.header,{color: '#808080',/* width: this.state.screen_width - 20,*/}]}>Toplam Tutar</Text>}
                rightElement={<Text style={[styles.header,{marginRight:10}]}>{this.state.order.ToplamFiyat} ₺</Text>}
              />

              <View style={{marginVertical:10}}>
                <Button
                  buttonStyle={{ backgroundColor: 'white',borderRadius:10,borderWidth: 2,borderColor: '#C42233',width:140,height:40}}
                  icon={
                    <BaseIcon
                      icon={{
                        type: 'font-awesome',
                        name: 'check-square-o',
                        color: '#C42233',
                        size: 15,
                        marginLeft:-25
                      }}
                    />
                  }
                  onPress={()=>
                    Alert.alert(
                      'Hesap Kesim',
                      'Hesap kesimi yapılacak onaylıyor musunuz?',
                      [
                        {
                          text: 'İptal',
                          style: 'cancel',
                        },
                        {text: 'Onayla', onPress: () =>this.getConfirmHesap()},
                      ],
                      {cancelable: false},
                    )
                  }
                  title="Hesap Ödendi"
                  titleStyle={{color:'#C42233',marginLeft:-25,fontSize:13,marginTop:-4}}
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
    height:Dimensions.get("window").height,

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
    width: Dimensions.get("window").width - 20,
    backgroundColor: '#FFF',
  },

  TotalPrice: {
    backgroundColor: '#FFF',
    width: '100%'
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
