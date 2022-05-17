import React ,{Component} from 'react';
import { Alert, View, Text, Image,StyleSheet,Dimensions,FlatList,ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Container} from 'native-base';
import BaseIcon from './Icon';
import { ListItem,Button } from 'react-native-elements';
import MyHeader from '../components/MyHeader'; //Version can be specified in package.json
import {
  LineChart,
} from 'react-native-chart-kit';
import axios from 'axios';
import {HOST,ACCESS_TOKEN,Images} from "../components/Variables";
import { StackActions, NavigationActions } from 'react-navigation';

let UrunList = [];
let ToplamTutar = 0;
let GunlukHarcama = [];

export default class PaymentScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      isLoaded: false,
      token:"",
      timerId: 0,
      screen_height: Dimensions.get('window').height,
      screen_width: Dimensions.get('window').width   
    }
    this.onLayout = this.onLayout.bind(this);     
  }
  
  onLayout(e){
    this.setState({screen_width: Dimensions.get('window').width});
    this.setState({screen_height: Dimensions.get('window').height});
  }


  async componentDidMount()  {
    //clearTimeout(this.state.timerId);
    this.subs = [
      this.props.navigation.addListener('willFocus', (payload) => this.getToken(payload)),
    ];
  }

  async getToken(){
    this.setState({isLoaded: false});
    await AsyncStorage.getItem(ACCESS_TOKEN)
    .then((accessToken) => {
      if(!accessToken) {
        throw "Token not set";
      } else {

          this.setState({token:JSON.parse(accessToken).access_token}, () => this.getProduct());
      }
    })
    .catch((error) => {
      this.props.navigation.navigate("Logout")
      alert("Error :"+error);
    });
  }

  async getProduct() {
    await axios.get(HOST+"/api/OdemeBildirim/OdemeList",{
        headers: {
          Authorization:'Bearer '+this.state.token
        },
      })
      .then((response) => {
        if(response.data.ToplamTutar !==null){
          ToplamTutar=response.data.ToplamTutar;
        }
        if(response.data.UrunList !==null){
          UrunList=response.data.UrunList;
        }
        if(response.data.GunlukHarcama !==null){
          GunlukHarcama=response.data.GunlukHarcama;
        }
        this.setState({
          isLoaded:true,
        });
        })
        .catch((error) => {
          alert(error);
        });
  }

  async getConfirmOdeme() {
    this.setState({
      isLoaded:false,
    });
    await axios.get(HOST+"/api/OdemeBildirim/OdemeBildir",{
        headers: {
          'Content-Type': 'application/json',
          Authorization:'Bearer '+this.state.token
        },
      })
      .then((response) => {
        this.setState({
          isLoaded:true,
        });
        this.props.navigation.goBack();
      })
      .catch((error) => {
        this.setState({isLoaded: false});
        alert(error);
      });
      Alert.alert(
        'Ödeme Bildirim',
        'Ödeme bildirimi başarılı bir şekilde gönderildi!',
        [
          {text: 'Tamam'},
        ],
        {cancelable: false},
      )
      this.props.navigation.navigate('Payment');
  }

    render() {
      return !this.state.isLoaded?(
        <View style={[styles.containerActivity, styles.horizontal]}>
          <ActivityIndicator size="large" color="#c40233" />
        </View>
      ):(

        <Container>
          <View style={styles.container} onLayout={this.onLayout}>

            <View style={{width:'100%',backgroundColor:'#c40233',alignItems:'center',height:this.state.screen_height*0.12}}>
              <Image
                style={{width: this.state.screen_height*0.24,height: this.state.screen_height*0.12}}
                source={require('../assets/images/money.png')}
              />
            </View>
            <View style={{alignItems:'center',width:'100%',backgroundColor:'#c40233',marginTop:-3}}>
              <Text style={{fontSize:this.state.screen_height*0.05,color:'white',backgroundColor:'#c40233'}}>₺ {ToplamTutar}</Text>
            </View>
            <View style={{alignItems:'center',width:'100%',backgroundColor:'#c40233',height:this.state.screen_width<this.state.screen_height? this.state.screen_height*0.15:this.state.screen_height*0.23}}>
              <Text style={{fontSize:15,color:'white',backgroundColor:'#c40233',fontStyle:'italic'}}>Toplam Tutar</Text>
            </View>

            <View>
              <View>
                <LineChart
                  data={{
                    labels: ['1', '2', '3', '4', '5', '6'],
                    datasets: [{
                      data: GunlukHarcama
                    }]
                  }}
                  width={Dimensions.get('window').width} // from react-native
                  height={ this.state.screen_width<this.state.screen_height? 130:80}
                  chartConfig={{
                    marginLeft:0,
                    backgroundColor: '#fff',
                    backgroundGradientFrom: '#fff',
                    backgroundGradientTo: '#fff',
                    decimalPlaces: 2, // optional, defaults to 2dp
                    color: (opacity = 1) => `rgba(178, 34, 34, ${opacity})`,
                    style: {
                      borderRadius: 16,
                      marginRight:50
                    }
                  }}
                  bezier
                  style={{
                    marginVertical: 8,
                    marginTop:-60
                  }}
                />
              </View>

            </View>

            <ListItem
              style={[styles.ListRectangle,{width: this.state.screen_width - 20,}]}
              contentContainerStyle={{height: 20}}
              title={<View style={{flex:1,flexDirection:'row',justifyContent:'space-between'}}>
                <Text style={[styles.header]}>Ürün Adı</Text>
                <Text style={[styles.header]}>Fiyat</Text>
              </View>
              }
            />
              <FlatList
              data={UrunList}
              showsVerticalScrollIndicator={true}
              style={{height:this.state.screen_height*0.1,marginTop:-10}}
              renderItem={({item}) =>
                <ListItem
                style={[styles.ListRectangle,{width: this.state.screen_width - 20,}]}
                  title={<View style={{flex:1,flexDirection:'row',justifyContent:'space-between'}}>
                    <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>

                      <View style={{width: 40,height:40,backgroundColor:'#F5F5F5',borderRadius:15}}>
                        <Image
                          style={{width: 35,height:35,marginLeft:3}}
                          source={Images[item.UrunId]}
                        />
                      </View>

                      <View style={{marginLeft:8}}>
                        <Text style={[styles.orders,{width: this.state.screen_width*0.4}]}>{item.UrunAdi}</Text>
                        <Text style={styles.count}>Sipariş Edilen {item.Adet} Adet</Text>
                      </View>

                    </View>
                    <Text style={[styles.price,{width:this.state.screen_width*0.4,textAlign: 'right'}]}>-₺ {item.ToplamFiyat}</Text>
                  </View>}
                />
              }
              keyExtractor={item => item.UrunId.toString()}
              />

              <View style={{marginVertical:10}}>
                <Button
                  buttonStyle={{ backgroundColor: 'white',borderRadius:10,borderWidth: 2,borderColor: 'green',width:300,height:40}}
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
                  onPress={()=>Alert.alert(
                    'Ödeme Bildirim',
                    'Ödeme bildirimi gönderilecek onaylıyor musunuz?',
                    [
                      {
                        text: 'Hayır',
                        style: 'cancel',
                      },
                      {text: 'Onayla', onPress: () => this.getConfirmOdeme()},
                    ],
                    {cancelable: false},
                  ) }
                  title="Ödeme Bildirimi"
                  titleStyle={{color:'green',marginLeft:-25,fontSize:13,marginTop:-4}}
                />
              </View>
          </View>
        </Container>
      );
    }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor:'#FFF',
    flex:1,
    alignItems: 'center',
    height:Dimensions.get("window").height

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
    width: Dimensions.get("window").width - 20,
    backgroundColor: '#FFF',
    marginTop:-15
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
