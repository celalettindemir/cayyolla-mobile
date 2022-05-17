import React,{Component} from 'react';
import { StyleSheet, Text, View, ScrollView, FlatList,ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Dimensions } from 'react-native';
import { ListItem } from 'react-native-elements';
import KareDurum from '../components/Rapor/kareDurum';
import { Container } from 'native-base';
import YuvarlakGrafik from '../components/Rapor/yuvarlakGrafik';
import { createAppContainer, createMaterialTopTabNavigator } from 'react-navigation'; // Version can be specified in package.json
import axios from 'axios';
import { HOST,ACCESS_TOKEN } from "../components/Variables";
import MyHeader from "../components/MyHeader";
//https://www.npmjs.com/package/react-native-swiper
//https://appdividend.com/2018/08/13/react-native-swipe-components-example-tutorial/
let TopUrun = [];
let TopUrunDetay = [];
let OdenecekTutar = 0;
let OdenenTutar = 0;
let ToplamTutar = 0;


class RaporScreen extends React.Component {
    static navigationOptions = {
      title: "Kategoriler",
    };

	constructor(props){
        super(props)

        this.state = {
            isLoaded: true,
            screen_height: Dimensions.get('window').height,
            screen_width: Dimensions.get('window').width         
        }
        this.onLayout = this.onLayout.bind(this);
    }

    onLayout(e){
      this.setState({screen_width: Dimensions.get('window').width});
      this.setState({screen_height: Dimensions.get('window').height});
     }

    componentWillBlur(){
      this.setState({isLoaded: false})
    }

    componentWillFocus(){
      this.setState({isLoaded: false})
    }


    componentDidFocus(){
      if(this.props.navigation.state.routeName === "Gunluk"){
        this.getRapor("Gunluk")
        this.setState({isLoaded: true})
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

      async componentDidMount()  {
        this.subs = [
          this.props.navigation.addListener('didFocus', (payload) => this.componentDidFocus(payload)),
        ];
        this._isMounted = true;
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
                  axios.get(HOST+"/api/Rapor/Musteri?aralik=''" + range + "''",{
                  headers: {
                    Authorization:'Bearer '+JSON.parse(accessToken).access_token
                  },
                })
                .then((response) => {

                  if(response.data.TopUrun !=null){
                    TopUrun=response.data.TopUrun;
                    }
                  if(response.data.TopUrunDetay !=null){
                    TopUrunDetay=response.data.TopUrunDetay;
                    }
                  if(response.data.OdenecekTutar !=null){
                    OdenecekTutar=response.data.OdenecekTutar;
                    }
                  if(response.data.OdenenTutar !=null){
                    OdenenTutar=response.data.OdenenTutar;
                    }
                  if(response.data.ToplamTutar !=null){
                    ToplamTutar=response.data.ToplamTutar;
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

    render() {
	  const productColors = [ '#B8336A', '#933DA8', '#7D8CC4', '#A0D2DB' ]
      return this.state.isLoaded ?(
        <View style={[styles.containerActivity, styles.horizontal]}>
          <ActivityIndicator size="large" color="#c40233" />
        </View>)
        :(

		<Container>
<ScrollView>
			<View style = {styles.container}>

				<View style={{flexDirection: 'row', justifyContent: 'space-evenly', paddingTop: 20, paddingBottom: 20}}>
					<KareDurum tutar={OdenecekTutar} yazi={'Ödenecek Tutar'} renk={'#03A9F4'}/>
					<KareDurum tutar={OdenenTutar} yazi={'Ödenen Tutar'} renk={'#933DA8'}/>
					<KareDurum tutar={ToplamTutar} yazi={'Toplam Tutar'} renk={'#F5C94E'}/>
				</View>

        <View style={{flexDirection: 'row',justifyContent:'space-between'}}>

        </View>
        <View style={{marginTop:-15,alignItems:'center'}}>
          <YuvarlakGrafik TopUrun={TopUrun} style={{minHeight:this.state.screen_width<this.state.screen_height?this.state.height*0.4:this.state.screen_width*0.4,minWidth:this.state.screen_width<this.state.screen_height?this.state.height*0.4:this.state.screen_width*0.4,maxHeight:this.state.screen_width<this.state.screen_height?this.state.height*0.4:this.state.screen_width*0.4,maxWidth:this.state.screen_width<this.state.screen_height?this.state.height*0.4:this.state.screen_width*0.4}}/>
        </View>
        <View style={{marginTop:5,marginHorizontal:15,shadowColor:'#ddd'}}>
                <ListItem
                leftElement={<View style={{height:20,width:'70%',borderRadius:2}}>
                  <Text style={{fontWeight:'bold',color:'#A9A9A9',fontStyle:'italic'}}>En Çok Sipariş Edilen Ürünler</Text>
                </View>}
                rightElement={

                    <View style={{height:20}}>
                      <Text style={{fontWeight:'bold',color:'#A9A9A9',fontStyle:'italic'}}> Fiyat</Text>
                    </View>

                }
                containerStyle={{height:30}}

                />
            </View>
        <ScrollView>
          <View>

          <FlatList
              data={TopUrunDetay}
              showsVerticalScrollIndicator={true}
              renderItem={({item,index}) =>

              <View style={{borderBottomWidth:2,borderRadius:2,borderColor:'#A0D2DB',marginTop:5,marginHorizontal:15,shadowColor:'#ddd'}}>
                <ListItem
                leftElement={<View style={{height:15,width:25,backgroundColor: index > 3 ? renk = 'lightgray' : renk = productColors[index],borderRadius:2,marginTop:-10}}>

                </View>}

                title={<View style={{marginLeft:8,marginTop:10}}>
                        <Text style={[styles.orders,{width:this.state.screen_width*0.4}]}>{item.UrunAdi}</Text>
                        <Text style={styles.count}>Sipariş Edilen {item.Adet} Adet</Text>
                      </View>}
                titleStyle={{fontSize:10,marginLeft:5,color:'black'}}
                rightElement={

                    <View style={{height:20}}>
                      <Text style={{fontWeight:'bold'}}> ~ {item.ToplamFiyat}  ₺</Text>
                    </View>

                }
                containerStyle={{height:40}}

                />
              </View>
              }
              keyExtractor={item => item.UrunId.toString()}
            />
          </View>
        </ScrollView>

			</View>
      </ScrollView>
		</Container>

    );
    }
  }



export const MusteriRaporTabNavigator = createMaterialTopTabNavigator({
  Gunluk: { screen: RaporScreen,
    navigationOptions:{
      tabBarLabel: ({tintColor}) =>(
        <View>
          <Text style={{fontWeight:'bold',color:'#C40233'}}>Günlük</Text>
        </View>
      ),
      initialRouteParams: {aralik: 'gun'},
    }
  },
  Aylik: { screen: RaporScreen,
    navigationOptions:{
      tabBarLabel: ({tintColor}) =>(
        <View>
          <Text style={{fontWeight:'bold',color:'#C40233'}}>Aylık</Text>

        </View>
      ),
    }
  },
  Yillik: { screen: RaporScreen,
    navigationOptions:{
      tabBarLabel: ({tintColor}) =>(
        <View>
          <Text style={{fontWeight:'bold',color:'#C40233'}}>Yıllık</Text>

        </View>
      ),
    }
  },
},
{
  swipeEnabled:true,
  tabBarOptions:{
    animationEnabled: true,
    activeBackgroundColor: '#F5F5F5',
    inactiveBackgroundColor: '#F5F5F5',
    style: {
      backgroundColor: '#fcfcfc',
    }
  }
}
);

  const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  containerActivity: {
    flex: 1,
    justifyContent: 'center'
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  }
})
