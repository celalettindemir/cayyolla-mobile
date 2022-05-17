import React ,{Component} from 'react';
import { View,Image,StyleSheet,ActivityIndicator,Dimensions } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Button} from 'react-native-elements';
import { Footer, FooterTab, Container, Content } from 'native-base';
import MyHeader from '../components/MyHeader';
import { HOST, ACCESS_TOKEN } from "../components/Variables";
import axios from 'axios';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default class KareCodeCreateScreen extends Component {
  constructor(props){
    super(props);
    this.state={
      token:"",
      isLoaded:false,
      url:"",
      screen_height: Dimensions.get('window').height,
      screen_width: Dimensions.get('window').width,
      karekod_size: Dimensions.get('window').height<Dimensions.get('window').width? Dimensions.get('window').height:Dimensions.get('window').width
    }
    this.onLayout = this.onLayout.bind(this);
  }

  onLayout(e){
    this.setState({screen_width: Dimensions.get('window').width});
    this.setState({screen_height: Dimensions.get('window').height});
    this.setState({karekod_size: Dimensions.get('window').height<Dimensions.get('window').width? Dimensions.get('window').height:Dimensions.get('window').width});
  }
    async componentDidMount()  {
      await AsyncStorage.getItem(ACCESS_TOKEN)
      .then((accessToken) => {
        if(!accessToken) {
          throw "Token not set";
        } else {
            this.setState({
              token:JSON.parse(accessToken).access_token,
            },()=>this.getKareKod());
            //
        }
      })
      .catch((error) => {
        this.setState({isLoaded: true });
        alert("Error :"+error);
      });
    }
    async getKareKod() {

      this.setState({isLoaded: false });
      await axios.get(HOST+"/api/Karekod",{
          headers: {
            'Content-Type': 'application/json',
            'Authorization':'bearer '+this.state.token
          },
        })
        .then((response) => {
          if(response.data!=null)
          {
            this.setState({url:"data:image/png;base64,"+response.data,isLoaded:true});
          }
        })
        .catch((error) => {
          alert(error);
        });
    }

    render() {
      return !this.state.isLoaded?(
        <View style={[styles.containerActivity, styles.horizontal]}>
          <ActivityIndicator size="large" color="#c40233" />
      </View>
      ):(
        <Container onLayout={this.onLayout} style={{flex:1}}>

        <Content style={{flex:1}}>
          <Image
            style={{
              alignSelf:'center',
              height: this.state.karekod_size*0.8,
              width: this.state.karekod_size*0.8,
              flex: 1,
              margin:this.state.screen_height< this.state.screen_width?-35:100 }}
                 source={{uri: this.state.url}}
          />
        </Content>

        <Footer style={{backgroundColor:'#c40233'}}> 
          <FooterTab style={{backgroundColor:'#c40233'}}>
          <View style={{flexDirection: 'row',backgroundColor:'#c40233'}}>

            <Button
                buttonStyle={[styles.orderSaveButton,{width: this.state.screen_width, height: this.state.screen_height*0.1,}]}
                title="Yeniden Oluştur"
                titleStyle={styles.orderButtonText}
                onPress={() => this.getKareKod()}
                iconContainerStyle={{marginHorizontal: 5}}
            />
          </View>
          </FooterTab>
        </Footer>
        </Container>

      );
    }
  }

  const styles = StyleSheet.create({
    containerActivity: {
      flex: 1,
      justifyContent: 'center'
    },
    horizontal: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 10
    },
    orderSaveButton: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#c40233',
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height*0.1,
    },
    orderButtonText: {
      color: '#fff',
      textAlign: 'center',
      marginBottom: 8,
    },
  });
