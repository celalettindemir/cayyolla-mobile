import React, {Component, PureComponent} from 'react';
import { Text, TextInput, View, StyleSheet, Dimensions, FlatList, ActivityIndicator, TouchableOpacity, Image,Alert} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { createMaterialTopTabNavigator, createAppContainer } from 'react-navigation';
import { Container } from 'native-base';
import MyHeader from '../components/MyHeader';
import {CheckBox, Button} from 'react-native-elements';
import ShoppingIcon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { ACCESS_TOKEN, HOST, Images} from '../components/Variables';


import {createIconSetFromIcoMoon} from "react-native-vector-icons";
import ConfigHot from '../assets/fonts/selection_hot.json';
import ConfigCold from '../assets/fonts/selection_cold.json';
import ConfigFood from '../assets/fonts/selection_food.json';

const HotIcon = createIconSetFromIcoMoon(ConfigHot, "icomoon_hot", "icomoon_hot.ttf");
const ColdIcon = createIconSetFromIcoMoon(ConfigCold, "icomoon_cold", "icomoon_cold.ttf");
const FoodIcon = createIconSetFromIcoMoon(ConfigFood, "icomoon_food", "icomoon_food.ttf");


 
var SCREEN_WIDTH =Dimensions.get('window').width < Dimensions.get('window').height ?  Dimensions.get('window').width : Dimensions.get('window').height;

let HOT_DRINKS = []
let COLD_DRINKS = []
let FOODS= []

class MySectionList extends PureComponent{
  constructor(props){
    super(props);
    this.state = {
      refresh: this.props.refresh,
      isActive: this.props.data.isConfirm,
      opacityState:this.props.data.isConfirm?1:0.4,
      productPrices: this.props.data.price.toString(),
      selectedIds: [],     
       screen_height: Dimensions.get('window').height,
      screen_width: Dimensions.get('window').width,
    }
    this.onLayout = this.onLayout.bind(this);
  }

  onLayout(e){
    this.setState({screen_width: Dimensions.get('window').width});
    this.setState({screen_height: Dimensions.get('window').height});
  }

  async componentDidMount(){
    if(this.state.opacityState !== 0.4)
    this.setState({selectedIds: this.state.selectedIds.concat([this.props.data.UrunId])});
  }

  createProduct = (item, productPrices) => {
    item.price = productPrices;
  }

  isConfirm = (item) => {
    var temp = this.state.selectedIds.find((selected) => selected === item.UrunId);
    if(temp === undefined){
      this.setState({selectedIds: this.state.selectedIds.concat([item.UrunId])},() => {
        this.refs.touch.setOpacityTo(1)
        item.isConfirm = true;
      })
      this.setState({isActive: !this.state.isActive})

    }
    else{
      const index = this.state.selectedIds.findIndex(
        selected => selected === temp
      )
      this.state.selectedIds.splice(index,1)
      this.refs.touch.setOpacityTo(0.4)
      this.setState({isActive: !this.state.isActive})
      item.isConfirm = false;
    }
  }

  render(){
    return(
      <TouchableOpacity onLayout={this.onLayout}
          style={[styles.touchableOpacity,
            {opacity:this.state.opacityState,
            width: this.state.screen_width*0.34,
            maxWidth:this.state.screen_width*0.33,
            height:Dimensions.get('window').width>Dimensions.get('window').height?Dimensions.get('window').width*0.4 :Dimensions.get('window').width*0.5+35,
            maxHeight:Dimensions.get('window').width>Dimensions.get('window').height?Dimensions.get('window').width*0.2 :Dimensions.get('window').width*0.3+35,
           }]}
          ref="touch"
          onPress={() => this.isConfirm(this.props.data)}
        >
        <View style={styles.item}>
          <CheckBox
            checked={this.state.isActive}
            size={32}
            iconType="antdesign"
            checkedIcon="checkcircle"
            uncheckedIcon='closecircle'
            uncheckedColor="#c40233"
            checkedColor="#52C41A"
            containerStyle={{position: 'absolute', top: -24, right: -28}}
            badgeStyle={[styles.badgePos, {borderColor: '#52C41A',width: Dimensions.get('window').width*0.07,height: Dimensions.get('window').width*0.07,}]}
          />
          <View style={styles.containerImage}>
            <Image
              style={{width: SCREEN_WIDTH*0.17, height: SCREEN_WIDTH*0.17}}
              source={Images[this.props.data.title]}
            />
          </View>
          <View style={[styles.itemTextView,{marginTop:10,marginBottom:10}]}> 
            {this.props.data.title.length > 16 ?
            <Text style={[styles.itemTextLong,{ marginBottom:10}]}>{this.props.data.title}</Text>
            :
            <Text style={[styles.itemTextShort,{marginBottom:10}]}>{this.props.data.title}</Text>
          }
          <TextInput
            style={[styles.inputContainer, {height: Dimensions.get('window').height*0.04, width: Dimensions.get('window').width*0.13, marginTop:Dimensions.get('window').width<Dimensions.get('window').height?-10:0,marginBottom:-10}]}
            value={this.state.productPrices}
            onChangeText={(productPrices) => {this.setState({productPrices},this.createProduct(this.props.data, productPrices))}}
            selectionColor="#c40233"
            keyboardType="numeric"
            maxLength={5}
            placeholderTextColor="#000"
          />
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
      isError: true,
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
  HotDrink: { screen: HotDrinkScreen,
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
    animationEnabled: true,
    style: {
      backgroundColor: '#eee'
    }
  },
}
);

//const TabContainer = createAppContainer(TabNavigator);

export default class CategoryEditScreen extends Component{
  constructor(props){
    super(props);
    this.state = {
      token:"",
      isLoaded: false,
      isEmpty: false,
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
    await AsyncStorage.getItem(ACCESS_TOKEN)
    .then((accessToken) => {
      if(!accessToken) {
        throw "Token not set";
      } else {

          this.setState({
            token:JSON.parse(accessToken).access_token
          });
          this.getCategory(JSON.parse(accessToken).access_token);
      }
    })
    .catch((error) => {
      this.props.navigation.navigate("Logout")
      alert("Error:"+error);
    });
    }
    //If token is verified we will redirect the user to the home page
    async getCategory(token) {
      await axios.get(HOST+"/api/CayciMenu",{
          headers: {
            Authorization:'Bearer '+token
          },
        })
        .then((response) => {

          if(response.data[0]!=null){
          HOT_DRINKS=response.data[0].data;
          /*[HOT_DRINKS[3], HOT_DRINKS[15]] = [HOT_DRINKS[15], HOT_DRINKS[3]];
          [HOT_DRINKS[4], HOT_DRINKS[16]] = [HOT_DRINKS[16], HOT_DRINKS[4]];
          [HOT_DRINKS[5], HOT_DRINKS[17]] = [HOT_DRINKS[17], HOT_DRINKS[5]];*/
          COLD_DRINKS=response.data[1].data;
          FOODS=response.data[2].data;
          }
          else
          {
            this.setState({
              isEmpty:true,
            })
          }
          this.setState({
            isLoaded:true,
          });
          })
          .catch((error) => {
            alert(error);
          });
    }



    async  categoryGuncelle() {
      this.setState({
        isLoaded:false,
      });
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
        "model":order.filter(a=>{return a.isConfirm === true && a.price > 0}),
        };
        await axios.post(HOST+"/api/CayciMenu",data,{
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
          alert(error);
      });
      Alert.alert(
        'Menü',
        'Menü başarılı bir şekilde güncellendi!',
        [
          {text: 'Tamam'},
        ],
        {cancelable: false},
      )
    }

    static router = TabNavigator.router;

    render(){
        return !this.state.isLoaded ? (
          <View style={[styles.containerActivity, styles.horizontal]}>
            <ActivityIndicator size="large" color="#c40233" />
          </View>
        ):(
          <Container onLayout={this.onLayout} >
            <TabNavigator navigation={this.props.navigation}  />

          <View style={{flexDirection: 'row'}}>

          <Button
            buttonStyle={[styles.orderSaveButton,{width: this.state.screen_width ,height: this.state.screen_height*0.09,}]}
            title="ONAYLA"
            titleStyle={styles.orderButtonText}
            onPress={() => {
              var hotError = HOT_DRINKS.filter((item) => {
                return item.price !== 0
              })
              var coldError = COLD_DRINKS.filter((item) => {
                return item.price !== 0
              })
              var foodError = FOODS.filter((item) => {
                return item.price !== 0
              })
              if(hotError.length === 0&&coldError.length === 0&&foodError.length === 0){
                Alert.alert(
                  'Hata',
                  'En az 1 ürün seçiniz.',
                  [
                    {
                      text: 'Çıkış',
                      style: 'cancel',
                    },
                    {text: 'Tamam'},
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
                    {text: 'Onayla', onPress: () => this.categoryGuncelle()},
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
          </Container>
        );
    }
}




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
    justifyContent: 'space-between',
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
    textAlign: 'center',
    textAlignVertical: 'center',
    marginBottom: 10,
    color: '#c40233',
  },
  badgePos: {
    width: Dimensions.get('window').width*0.07,
    height: Dimensions.get('window').width*0.07,
  },
  containerImage: {
    flex:1,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5
  },
  inputContainer: {
    fontSize: 14,
    fontStyle: 'italic',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    borderWidth: 2,
    borderColor: '#c40233',
    height: Dimensions.get('window').height*0.04,
    width: Dimensions.get('window').width*0.13,
	margin: 0,
	padding: 0
  },
  orderSaveButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#c40233',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height*0.09,
  },
  orderButtonText: {
    color: '#fff',
    textAlign: 'center',
    paddingBottom: 3,
    marginHorizontal: 10,
  },
  text: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
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
