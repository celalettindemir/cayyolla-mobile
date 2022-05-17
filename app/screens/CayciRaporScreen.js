import React,{Component} from 'react';
import { StyleSheet, Text, View, ScrollView, FlatList,ActivityIndicator  } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Dimensions } from 'react-native';
import KareDurum from '../components/Rapor/kareDurum';
import { Container } from 'native-base';
import MyHeader from '../components/MyHeader';
import YuvarlakGrafik from '../components/Rapor/yuvarlakGrafik';
import { createAppContainer, createMaterialTopTabNavigator } from 'react-navigation'; // Version can be specified in package.json
import axios from 'axios';
import {HOST,ACCESS_TOKEN,Images} from "../components/Variables";

//https://www.npmjs.com/package/react-native-swiper
//https://appdividend.com/2018/08/13/react-native-swipe-components-example-tutorial/

let width=Dimensions.get('window').width<Dimensions.get('window').height?Dimensions.get('window').width:Dimensions.get('window').height;
let height=Dimensions.get('window').width<Dimensions.get('window').height?Dimensions.get('window').height:Dimensions.get('window').width;
let TopUrun = [];
let TopMusteri = [];
let AlacakTutar = 0;
let TahsilatTutar = 0;
let ToplamTutar = 0;

class RaporScreen extends React.Component {
    static navigationOptions = {
      title: "Kategoriler",
    };
	constructor(props){
        super(props)
        this.state = {
            isLoaded: false,
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
      this.subs = [
        this.props.navigation.addListener('didFocus', (payload) => this.componentDidFocus(payload)),
        this.props.navigation.addListener('willBlur', (payload) => this.componentWillBlur(payload))
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
              //this.getRapor(JSON.parse(accessToken).access_token);
                axios.get(HOST+"/api/Rapor/Cayci?aralik=''" + range + "''",{
                headers: {
                  Authorization:'Bearer '+JSON.parse(accessToken).access_token
                },
              })
              .then((response) => {

                if(response.data.TopUrun !=null){
                  TopUrun=response.data.TopUrun;
                  }
                if(response.data.TopMusteri !=null){
                  TopMusteri=response.data.TopMusteri;
                  }
                if(response.data.AlacakTutar !=null){
                  AlacakTutar=response.data.AlacakTutar;
                  }
                if(response.data.TahsilatTutar !=null){
                  TahsilatTutar=response.data.TahsilatTutar;
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

    componentWillBlur(){
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

    render() {
      const redColors = [ '#B8336A', '#7D8CC4', '#933DA8', '#A0D2DB','#C490D1']
      const productColors = [ '#B8336A', '#933DA8', '#7D8CC4', '#A0D2DB' ]
      const productWidth = [ 0.18, 0.135, 0.09, 0.045 ]
      return this.state.isLoaded ?(
      <View style={[styles.containerActivity, styles.horizontal]}>
        <ActivityIndicator size="large" color="#c40233" />
      </View>)
      :(
		<Container onLayout={this.onLayout} >

			<ScrollView>
      <View style = {styles.container}>
				<View style={{flexDirection: 'row', justifyContent: 'space-evenly', paddingTop: 20, paddingBottom: 20}}>
					<KareDurum tutar={ToplamTutar} yazi={'Toplam Tutar'} renk={'#03A9F4'}/>
					<KareDurum tutar={TahsilatTutar} yazi={'Tahsilat Tutarı'} renk={'#933DA8'}/>
					<KareDurum tutar={AlacakTutar} yazi={'Alacak Tutar'} renk={'#F5C94E'}/>
				</View>

        <View style={{justifyContent:'center',alignItems:'center'}}>
          <Text style={{fontWeight:'bold',fontSize:13}}>En Çok Sipariş Verilen Ürünler</Text>
        </View>

        <View style={{flexDirection:'row',justifyContent:'flex-start',width:Dimensions.get('window').width,alignSelf:'center'}}>
              <FlatList
              style={{minWidth:this.state.screen_width*0.45,maxWidth:this.state.screen_width*0.45}}
                data={TopUrun}
                showsVerticalScrollIndicator={true}
                renderItem={({item, index}) =>

                <View style={{flexDirection:'column',justifyContent:'space-between',marginTop:10}}>
                    <Text style={{fontSize:width*0.035,color:'#808080'}}>{item.UrunAdi}</Text>
                    <View style={{height:height*0.025,width:height*productWidth[index],backgroundColor:productColors[index],borderRadius:2}}></View>
                </View>
                }
                keyExtractor={item => item.UrunId.toString()}
                contentContainerStyle={{marginLeft:20,marginTop:10,width:'120%'}}
              />
              <View style={{marginTop:10, minWidth:this.state.screen_width*0.5,maxWidth:this.state.screen_width*0.5,marginLeft:-this.state.screen_width*0.1,minHeight:this.state.screen_width*0.5,maxHeight:this.state.screen_width*0.5}}>
              <YuvarlakGrafik TopUrun={TopUrun}/>
              </View>

          </View>

          <View style={{justifyContent:'center',alignItems:'center'}}>
            <Text style={{fontWeight:'bold',fontSize:13,marginTop:10}}>En Çok Sipariş Veren Müşteriler</Text>
          </View>

          <View style={[styles.container,{width:Dimensions.get('window').width}]} >

          <FlatList
          style={{width:Dimensions.get('window').width}}
            data={TopMusteri}
            showsVerticalScrollIndicator={false}
            renderItem={({item, index}) =>
            <View style={[styles.RectangleShapeView,{width:Dimensions.get('window').width}]}>
              <View style={{flex: 1, flexDirection: 'row', alignItems: 'center',}}>
                <View style={[styles.yuvarlak, {backgroundColor: redColors[index], marginLeft: 10,}]}>
                  <Text style={styles.basHarf}>{item.CompanyName.charAt(0)}</Text>
                </View>
                <View style={{flex: 1, flexDirection: 'column', marginLeft: 10}}>
                  <Text style={{fontWeight: 'bold'}}>{item.CompanyName}</Text>
                </View>
                <View style={{marginTop: 1, marginRight: 15}}>
                  <Text style={{color:'#808080'}}>({item.Adet} Adet)</Text>
                </View>
              </View>
            </View>

           }
            keyExtractor={item => item.ID}
          />
        </View>

			</View>
      </ScrollView>

		</Container>

    );
    }
  }



const CayciRapor1TabNavigator = createMaterialTopTabNavigator({
  Gunluk: { screen: RaporScreen,
    navigationOptions:{
      tabBarLabel: ({tintColor}) =>(
        <View>
          <Text style={{fontWeight:'bold',color:'#C40233'}}>Günlük</Text>
        </View>
      ),
      initialRouteParams: {aralik: 'gun'}
    }
  },
  Aylik: { screen: RaporScreen,
    navigationOptions:{
      tabBarLabel: ({tintColor}) =>(
        <View>
          <Text style={{fontWeight:'bold',color:'#C40233'}}>Aylık</Text>

        </View>
      )
    }
  },
  Yillik: { screen: RaporScreen,
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

export default CayciRapor1TabNavigator;

  const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  count: {
    fontSize: 11,
    color: '#808080',
    fontStyle:"italic"
  },
  RectangleShapeView: {
    width: Dimensions.get('window').width - 10,
    height: 60,
    backgroundColor: '#FFF',
    borderRadius:5,
    borderBottomWidth: 1,
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
    yuvarlak: {
      width: width/9,
      height: height/16,
      borderRadius: width/9/2,
      justifyContent: 'center',
      alignItems: 'center',
    },
    basHarf: {
      textAlign: 'center',
      color: 'white',
      fontWeight : 'bold'
    },

})
