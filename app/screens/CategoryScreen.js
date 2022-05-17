import React, {Component, PureComponent} from 'react';
import { KeyboardAvoidingView, Text, View,  StyleSheet,  Dimensions, FlatList,  ActivityIndicator, TouchableOpacity,Image, Alert, TextInput } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { StackActions, NavigationActions,createMaterialTopTabNavigator, createAppContainer,createStackNavigator } from 'react-navigation';
import MyHeader from '../components/MyHeader';
import KareCodeReadScreen from './KareCodeReadScreen';
import { Container } from 'native-base';

import Dialog, { DialogFooter, DialogButton, DialogContent } from 'react-native-popup-dialog';

import {createIconSetFromIcoMoon} from "react-native-vector-icons";
import ConfigHot from '../assets/fonts/selection_hot.json';
import ConfigCold from '../assets/fonts/selection_cold.json';
import ConfigFood from '../assets/fonts/selection_food.json';
const HotIcon = createIconSetFromIcoMoon(ConfigHot, "icomoon_hot", "icomoon_hot.ttf");
const ColdIcon = createIconSetFromIcoMoon(ConfigCold, "icomoon_cold", "icomoon_cold.ttf");
const FoodIcon = createIconSetFromIcoMoon(ConfigFood, "icomoon_food", "icomoon_food.ttf");

import { Badge, Button} from 'react-native-elements';
import ShoppingIcon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { HOST,ACCESS_TOKEN,Images } from "../components/Variables"
import OrderScreen from './OrderScreen';
//import { TextInput } from 'react-native-gesture-handler';

var SCREEN_WIDTH =Dimensions.get('window').width < Dimensions.get('window').height ?  Dimensions.get('window').width : Dimensions.get('window').height;

let HOT_DRINKS = []
let COLD_DRINKS = []
let FOODS= []

class MySectionList extends PureComponent{
  constructor(props){
    super(props);
    this.state = {
      refresh: this.props.refresh,
      isLoaded: false,
      token:"",
      timerId:0,
      screen_height: Dimensions.get('window').height,
      screen_width: Dimensions.get('window').width,
    }
    this.onLayout = this.onLayout.bind(this);
  }

  onLayout(e){
    this.setState({screen_width: Dimensions.get('window').width});
    this.setState({screen_height: Dimensions.get('window').height});
  }

  incrementCount = () => {
    this.props.data.count++;
    this.setState({refresh: !this.state.refresh});
  }

  decreaseCount = () => {
    if(this.props.data.count > 0){
      this.props.data.count--;
      this.setState({refresh: !this.state.refresh});
    }
  }

  render(){
    return(
      <TouchableOpacity
          onLayout={this.onLayout}
          style={[styles.touchableOpacity,
            {
              width: this.state.screen_width*0.34,
              maxWidth: this.state.screen_width*0.33,
              height:Dimensions.get('window').width>Dimensions.get('window').height?Dimensions.get('window').width*0.4 :Dimensions.get('window').width*0.5,
              maxHeight:Dimensions.get('window').width>Dimensions.get('window').height?Dimensions.get('window').width*0.2 :Dimensions.get('window').width*0.35,
            }]}
          activeOpacity={0.7}
          onPress={this.incrementCount}
        >
        <View style={styles.item}>
          <Badge
            value="-"
            status="error"
            containerStyle={{position: 'absolute', top: -3, left: -3}}
            badgeStyle={[styles.badgeNeg,{borderColor: '#c40233', backgroundColor: '#c40233'}]}
            onPress={this.decreaseCount}
          />
          <Badge
            value={this.props.data.count}
            status="success"
            containerStyle={{position: 'absolute', top: -6.5, right: -6.5}}
            badgeStyle={[styles.badgePos, {borderColor: '#52C41A'}]}
            onPress={this.incrementCount}
          />
          <View style={styles.containerImage}>
            <Image
            //'cover' | 'contain' | 'stretch' | 'repeat' | 'center'
              style={{width: SCREEN_WIDTH*0.17, height: SCREEN_WIDTH*0.17}}
              //source={{uri: this.props.data.url}}
              source={Images[this.props.data.title]}
            />
          </View>
          <View style={styles.itemTextView}>
            {this.props.data.title.length > 15 ?
            <Text style={styles.itemTextLong}>{this.props.data.title}</Text>
            :
            <Text style={styles.itemTextShort}>{this.props.data.title}</Text>
          }
          <Text style={{fontSize: 14, fontStyle: 'italic', fontWeight: 'bold'}}>{this.props.data.price}₺</Text>


          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
class HotDrinkScreen extends Component {
  constructor(props){
    super(props);
    this.state ={
      refresh: true,
    };
  }

  _keyExtractor = (item, index) => item.title

  _renderItem = ({ item }) => {
    return(
      <MySectionList data={item} refresh={true}/>
    );
  }
  render() {
    return (
      <Container>
        <FlatList
          columnWrapperStyle={styles.containerListView}
          data={HOT_DRINKS}
          extraData={this.state.refresh}
          renderItem={this._renderItem}
          numColumns={3}
          keyExtractor={this._keyExtractor}
        />
      </Container>
    );
  }
}

class ColdDrinkScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      refresh: true
    }
  }
  _keyExtractor = (item, index) => item.title

  _renderItem = ({ item }) => {
    return(
      <MySectionList data={item} refresh={true}/>
    );

  }

  render() {
    return (
      <Container>
        <FlatList
          columnWrapperStyle={styles.containerListView}
          data={COLD_DRINKS}
          extraData={this.state.refresh}
          renderItem={this._renderItem}
          numColumns={3}
          keyExtractor={this._keyExtractor}
        />
      </Container>
    );
  }
}

class FoodScreen extends Component {
  constructor(props){
    super(props);
    this.state ={
      refresh: true,
    };
  }

  _keyExtractor = (item, index) => item.title

  _renderItem = ({ item }) => {
    return(
      <MySectionList data={item} refresh={true}/>
    );

  }

  render() {
    return (
      <Container>
        <FlatList
          columnWrapperStyle={styles.containerListView}
          data={FOODS}
          extraData={this.state.refresh}
          renderItem={this._renderItem}
          numColumns={3}
          keyExtractor={this._keyExtractor}
        />
      </Container>
    );
  }
}
const TabNavigator = createMaterialTopTabNavigator({
  HotDrink: { screen: (props) => <HotDrinkScreen {...props}/>,
    navigationOptions:{
      tabBarLabel: ({tintColor}) =>(
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <HotIcon name="coffee-cup" size={24} color="#c40233"/>
          <Text style={{color: '#c40233',fontSize: 12}}>Sıcak İçecekler</Text>
        </View>

      )
    }
  },
  ColdDrink: { screen: ColdDrinkScreen,
    navigationOptions:{
      tabBarLabel: ({tintColor}) =>(
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <ColdIcon name="iconfinder_Ice_Tea" size={24} color="#c40233"/>
          <Text style={{color: '#c40233',fontSize: 12}}>Soğuk İçecekler</Text>
        </View>
      )
    }
  },
  Food: { screen: FoodScreen,
    navigationOptions:{
      tabBarLabel: ({tintColor}) =>(
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <FoodIcon name="piece-of-bread" size={24} color="#c40233"/>
          <Text style={{color: '#c40233',fontSize: 12}}>Yemekler</Text>
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

//const TabContainer = createAppContainer(TabNavigator);

export default class CategoryScreen extends Component{
  constructor(props){
    super(props);
    this.state = {
      token:"",
      timerId:0,
      isLoaded: false,
      isEmpty: false,
      modalVisible: false,
      not: '',
      screen_height: Dimensions.get('window').height,
      screen_width: Dimensions.get('window').width,
    }
    this.onLayout = this.onLayout.bind(this);
  }

  onLayout(e){
    this.setState({screen_width: Dimensions.get('window').width});
    this.setState({screen_height: Dimensions.get('window').height});
  }

  async componentDidMount()  {
    //clearTimeout(this.state.timerId);
    await AsyncStorage.getItem(ACCESS_TOKEN)
    .then((accessToken) => {
      if(!accessToken) {
        throw "Token not set";
      } else {
          this.setState({token:JSON.parse(accessToken).access_token},
            ()=>this.getSiparis()
          );
        }
    })
    .catch((error) => {
      this.setState({isLoaded: false });
      alert("Error :"+error);
    });
  }
  async getSiparis() {
    await axios.get(HOST+"/api/MusteriMenu",{
        headers: {
          Authorization:'Bearer '+this.state.token
        },
      })
      .then((response) => {
        if(response.data[0]!=null) {
          HOT_DRINKS=response.data[0].data;
          COLD_DRINKS=response.data[1].data;
          FOODS=response.data[2].data;
        }
        else {
          this.setState({
            isEmpty:true,
          })
        }
        this.setState({isLoaded: true});
      })
      .catch((error) => {
        alert(error);
      });
  }

  async siparisVer() {
    this.setState({
      isLoaded: false,
    })
    let order=[];
    for (let userObject of HOT_DRINKS) {
      order.push(userObject);
    }
    for (let userObject of COLD_DRINKS) {
      order.push(userObject);
    }
    for (let userObject of FOODS) {
      order.push(userObject);
    }
    var data = {
      "Tarih": new Date(),
      "Not":this.state.not,
      "model":order.filter(a=>{return a.count>0}),
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
        this.setState({isLoaded: false});
    });
    Alert.alert(
      'Sipariş',
      'Siparişiniz başarıyla gönderildi!',
      [
        {text: 'Tamam'},
      ],
      {cancelable: false},
    )
    this.props.navigation.dispatch(StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'MusteriMain' })
      ],
    }));
  }
    static router = TabNavigator.router;
    render(){

        const {height: screenHeight} = Dimensions.get('window');
        return !this.state.isLoaded?(
          <View style={[styles.containerActivity, styles.horizontal]}>
            <ActivityIndicator size="large" color="#c40233" />
          </View>
        )
        :(
          !this.state.isEmpty?(
          <Container onLayout={event=>this.onLayout(event)}>
              <TabNavigator navigation={this.props.navigation}/>
              <View style={{flexDirection: 'row'}}>
                <KeyboardAvoidingView
                  behavior="position"
                  keyboardVerticalOffset={this.state.screen_height*0.1}
                  contentContainerStyle={styles.formContainer}
                >
                  <Dialog
                    width={0.8}
                    visible={this.state.modalVisible}
                    footer={
                      <DialogFooter>
                        <DialogButton
                          style={{justifyContent:'center', alignItems: 'center'}}
                          text="İptal"
                          onPress={() => {
                            this.setState({ modalVisible: false })
                          }}
                        />
                        <DialogButton
                          style={{justifyContent:'center', alignItems: 'center'}}
                          text="Tamam"
                          onPress={() => {this.setState({ modalVisible: false })}}
                        />
                      </DialogFooter>
                    }
                  >
                    <DialogContent
                      style={{padding: 10}}
                    >
                      <View>
                        <Text style={{fontSize: 18, fontWeight: 'bold', color: '#000'}}>Not</Text>
                      </View>
                      <View>
                        <TextInput
                          style={styles.inputContainer}
                          value={this.state.not}
                          onChangeText={(not) => {this.setState({not})}}
                          autoCapitalize="sentences"
                          autoCorrect={false}
                          selectionColor="#c40233"
                          keyboardType="default"
                          placeholderTextColor="#000"
                        />
                      </View>
                    </DialogContent>
                  </Dialog>
                </KeyboardAvoidingView>
                <Button
                  buttonStyle={[styles.orderSaveButton,{width: this.state.screen_width*0.5,height:this.state.screen_height*0.09}]}
                  title="NOT"
                  titleStyle={styles.orderButtonText}
                  icon={<ShoppingIcon name="event-note" size={24} color="#fff"/>}
                  iconContainerStyle={{marginHorizontal: 5}}
                  onPress={() => {
                      var hotError = HOT_DRINKS.filter((item) => {
                        return item.count !== 0
                      })
                      var coldError = COLD_DRINKS.filter((item) => {
                        return item.count !== 0
                      })
                      var foodError = FOODS.filter((item) => {
                        return item.count !== 0
                      })
                      if(hotError.length === 0&&coldError.length === 0&&foodError.length === 0){
                        Alert.alert(
                          'Hata',
                          'En az 1 ürün seçiniz.',
                          [
                            {text: 'Tamam', style: 'cancel'},
                          ],
                          {cancelable: false},
                        )
                      }
                      else{
                        this.setState({modalVisible: true});
                      }
                    }
                  }
                />
                <Button
                  buttonStyle={[styles.orderSaveButton,{width: this.state.screen_width*0.5,height:this.state.screen_height*0.09}]}
                  title="SİPARİŞİ GÖNDER"
                  titleStyle={styles.orderButtonText}
                  onPress={() => {
                    var hotError = HOT_DRINKS.filter((item) => {
                      return item.count !== 0
                    })
                    var coldError = COLD_DRINKS.filter((item) => {
                      return item.count !== 0
                    })
                    var foodError = FOODS.filter((item) => {
                      return item.count !== 0
                    })
                    if(hotError.length === 0&&coldError.length === 0&&foodError.length === 0){
                      Alert.alert(
                        'Hata',
                        'En az 1 ürün seçiniz.',
                        [
                          {text: 'Tamam',style: 'cancel'},
                        ],
                        {cancelable: false},
                      )
                    }
                    else{
                      Alert.alert(
                        'Menü',
                        'Onaylıyor musunuz?',
                        [
                          {
                            text: 'İptal',
                            style: 'cancel',
                          },
                          {text: 'Onayla', onPress: () => this.siparisVer()},
                        ],
                        {cancelable: false},
                      )
                    }
                  }
                }
                  icon={<ShoppingIcon name="check-circle" size={24} color="#fff"/>}
                  iconContainerStyle={{marginHorizontal: 5}}
                />
              </View>
          </Container>):
          (
            <Container style={styles.horizontal}>
            <View style={{flex: 1, height: screenHeight, justifyContent: 'center'}}>
              <Button
                  onPress={() => this.props.navigation.navigate("BarCode")}
                  title="Karekod Okut"
                  color="#841584"
                />
            </View>

            </Container>
          )
        );
    }
}


/*function getActiveRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getActiveRouteName(route);
  }
  return route.routeName;
}

let nav;
class MusteriSiparisScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      headerHidden: false,
    };
  }
  render() {
    return (
      <Container>
      <MyHeader navigation={this.props.navigation} name="Çay Ocağı Adı" headerHidden={this.state.headerHidden}/>
      <MusteriSiparisContainer onNavigationStateChange={(prevState, currentState) => {
          const currentScreen = getActiveRouteName(currentState);
          const prevScreen = getActiveRouteName(prevState);

          if (prevScreen !== currentScreen) {
            if(currentScreen=="BarCode")
            {
              this.setState({
                headerHidden:true
              })
            }
            else
            {
              this.state.headerHidden?
              this.setState({headerHidden:false}):null
            }
          }
        }}/>
      </Container>
    );
  }
}*/


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerListView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems:'flex-start',
    backgroundColor: "#fff",
  },
  touchableOpacity: {
    flex: 1,
    width: Dimensions.get('window').width*0.34,
    maxWidth: Dimensions.get('window').width*0.33,
    height:Dimensions.get('window').width>Dimensions.get('window').height?Dimensions.get('window').width*0.4 :Dimensions.get('window').width*0.5,
    maxHeight:Dimensions.get('window').width>Dimensions.get('window').height?Dimensions.get('window').width*0.2 :Dimensions.get('window').width*0.3,
  },
  item: {
    margin: 5,
    borderColor: '#c40233',
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column'
  },
  itemTextView: {
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemTextLong: {
    fontSize: 14,
    flexWrap: 'wrap',
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#c40233',
  },
  itemTextShort: {
    fontSize: 14,
    flexWrap: 'wrap',
    textAlign: 'center',
    textAlignVertical: 'center',
    marginBottom: -(Dimensions.get('window').height/700),
    color: '#c40233',
  },
  badgeNeg: {
    width: SCREEN_WIDTH*0.09,
    height: SCREEN_WIDTH*0.09,
  },
  badgePos: {
    width: SCREEN_WIDTH*0.083,
    height: SCREEN_WIDTH*0.083,
  },
  containerImage: {
    flex:1,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10
  },
  sectionListItems:{
    padding: 5,
    color: '#737373'
  },
  orderSaveButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#c40233',
    width: Dimensions.get('window').width*0.5,
    height: Dimensions.get('window').height*0.09,
  },
  orderButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 15,
    paddingBottom: 3,
    marginHorizontal: 10,
  },
  text: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  inputContainer: {
    paddingLeft: 5,
    marginTop: 5,
    fontSize: 14,
    textAlign: 'left',
	justifyContent: 'center',
	alignItems: 'center',
    color: '#000',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#c40233',
    height: Dimensions.get('window').height*0.06,
    width: SCREEN_WIDTH*0.7,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
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
