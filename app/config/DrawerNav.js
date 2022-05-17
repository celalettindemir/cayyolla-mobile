import React  from 'react';
import { Text,StyleSheet,ScrollView,Image, Dimensions} from 'react-native';
import { createDrawerNavigator, createStackNavigator,DrawerItems } from 'react-navigation'; // Version can be specified in package.json
import { MusteriRaporTabNavigator } from '../screens/RaporScreen';

import CayciSiparisScreen from '../screens/CayciSiparisScreen';
import CategoryEditScreen from '../screens/CategoryEditScreen';
import CategoryScreen from '../screens/CategoryScreen';
import PaymentScreen from '../screens/PaymentScreen';
import MyAccountSettingScreen from '../screens/MyAccountSettingScreen';
import KareCodeReadScreen from '../screens/KareCodeReadScreen';
import KareCodeCreateScreen from '../screens/KareCodeCreateScreen';
import CayciGecmisSiparisScreen from '../screens/CayciGecmisSiparisScreen';
import AltMusteri from '../screens/AltMusteri';
import CayciRapor1TabNavigator from '../screens/CayciRaporScreen';
import CayciRapor2TabNavigator from '../screens/CayciRaporScreen2';
import Logout from '../screens/Logout';
import { Header , Container, Content, Body, Title, Subtitle ,Button} from 'native-base';
import {Icon} from 'react-native-elements';
import MyHeader from '../components/MyHeader';
import App_Style from '../components/App_Style'

const SCREEN_WIDTH = Dimensions.get('window').width <Dimensions.get('window').height ?  Dimensions.get('window').width: Dimensions.get('window').height;
const SCREEN_HEIGHT = Dimensions.get('window').width <Dimensions.get('window').height ?  Dimensions.get('window').height: Dimensions.get('window').width;
const logosize = SCREEN_WIDTH<SCREEN_HEIGHT? SCREEN_WIDTH:SCREEN_HEIGHT;

const CustomDrawerContentComponent = (props) => (
  <Container style={{width:SCREEN_WIDTH*0.7}}>
    <Header style={[{height:logosize*0.35,alignItems:'center'}, App_Style.bg_color]}>
      <Body style={{alignItems:'center'}}>
        <Image style={[styles.logo]} source={require('../assets/images/logo_navbar.png')} />

      </Body>

    </Header>
    <Content contentContainerStyle={
      [
        App_Style.bg_color,
        {
        flex:1,
        alignItems:'center',
      }
      ]}>
    <ScrollView>
    <DrawerItems {...props} activeTintColor='#2196f3'
    activeBackgroundColor='#f0f0f0'
    inactiveTintColor='rgba(0, 0, 0, .87)'
    inactiveBackgroundColor='transparent'
    style={{backgroundColor: '#000000'}}
    labelStyle={[App_Style.text_color,{marginLeft:-5,fontStyle:'italic',fontSize:SCREEN_WIDTH*0.055}]}
    itemStyle={{borderBottomWidth:1,borderColor:'white'}}
    />
    </ScrollView>
    </Content>
  </Container>
);

const raporStackNavigator = createStackNavigator({
  CayciRapor1: { screen: CayciRapor1TabNavigator},
  CayciRapor2: { screen: CayciRapor2TabNavigator}
},
{
  headerMode: 'none',
  navigationOptions: {
      headerVisible: false,
  }
})


export const CayciDrawMenu = createDrawerNavigator({
    Home: {
      screen: CayciSiparisScreen,
      navigationOptions: {
        drawerLabel : 'Gelen Sipariş',
        drawerIcon: ({ tintColor }) => (
          <Icon
          name= 'database'
          size = {25}
          type= 'antdesign'
          color = '#c40233'
          />
        ),
      },
    },
    CategoryEdit: {
      screen: CategoryEditScreen,
      navigationOptions: {
        drawerLabel : 'Menu Duzenle',
        drawerIcon: ({ tintColor }) => (
          <Icon
          name= 'table-edit'
          size = {25}
          type= 'material-community'
          color = '#c40233'
          />
        ),
      },
    },
    BarCodeCreate: {
      screen: KareCodeCreateScreen,
      navigationOptions: {
        drawerLabel : 'Karekod Oluştur',
        drawerIcon: ({ tintColor }) => (
          <Icon
          name= 'barcode-scan'
          size = {25}
          type= 'material-community'
          color = '#c40233'
          />
        ),
      },
    },
    AltMusteri: {
      screen: AltMusteri,
      navigationOptions: {
        drawerLabel : 'Alt Müşteriler',
        drawerIcon: ({ tintColor }) => (
          <Icon
          name= 'group'
          size = {21}
          type= 'font-awesome'
          color = '#c40233'
          />
        ),
      },
    },
    PastOrder: {
      screen: CayciGecmisSiparisScreen,
      navigationOptions: {
        drawerLabel : 'Geçmiş Siparişler',
        drawerIcon: ({ tintColor }) => (
          <Icon
          name= 'schedule'
          size = {25}
          type= 'AntDesign'
          color = '#c40233'
          />
        ),
      },
    },
    CayciRapor: {
      screen: raporStackNavigator,
      navigationOptions: {
        drawerLabel : 'Rapor',
        drawerIcon: ({ tintColor }) => (
          <Icon
          name= 'bar-chart'
          size = {25}
          type= 'font-awesome'
          color = '#c40233'
          />
        ),
      },
    },
    MyAccountSetting: {
      screen: MyAccountSettingScreen,
      navigationOptions: {
        drawerLabel : 'Hesap Ayarları',
        drawerIcon: ({ tintColor }) => (
          <Icon
          name= 'account-settings'
          size = {25}
          type= 'material-community'
          color = '#c40233'
          />
        ),
      },
    },
    Logout: {
      screen: Logout,
      navigationOptions: {
        drawerLabel : 'Çıkış',
        drawerIcon: ({ tintColor }) => (
          <Icon
          name= 'exit-to-app'
          size = {25}
          type= 'material-community'
          color = '#c40233'
          />
        ),
      },
    },


  }, {
    initialRouteName: 'Home',
    drawerType: 'push-screen',
    drawerWidth:SCREEN_WIDTH*0.7,
    contentComponent:CustomDrawerContentComponent,
    navigationOptions: ({navigation}) =>
      {
        var raporIcon = false;
        var raporIcon2 = false;
        //Eğer Rapor ekranındaysak, raporIcon gözüksün, yoksa gözükmesin

        if(navigation.state.routes[navigation.state.index].routeName == "CayciRapor")
        {
          if(navigation.state.routes[navigation.state.index].routes[navigation.state.routes[navigation.state.index].index].routeName == "CayciRapor1")
          {
            raporIcon = true;
            raporIcon2 = false;
          }
          else if(navigation.state.routes[navigation.state.index].routes[navigation.state.routes[navigation.state.index].index].routeName == "CayciRapor2")
          {
            raporIcon = false;
            raporIcon2 = true;
          }
        }

        const header = <MyHeader name="Çay Ocağı" raporIcon={raporIcon} raporIcon2={raporIcon2}/>
		const headerMode = 'none'
        return {
          headerMode,
		  header
        };
    }
});

export const MusteriDrawMenu = createDrawerNavigator({
    Home: {
      screen: CategoryScreen,
      navigationOptions: {
        drawerLabel : 'Menü',
        drawerIcon: ({ tintColor }) => (
          <Icon
          name= 'appstore-o'
          size = {25}
          type= 'antdesign'
          color = '#c40233'
          />
        ),
      },
    },
    BarCode: {
      screen: KareCodeReadScreen,
      navigationOptions: {
        drawerLabel : 'Karekod Oku',
        drawerIcon: ({ tintColor }) => (
          <Icon
          name= 'barcode-scan'
          size = {25}
          type= 'material-community'
          color = '#c40233'
          />
        ),
      },
    },
    Rapor: {
      screen: MusteriRaporTabNavigator,
      navigationOptions: {
        drawerLabel : 'Rapor',
        drawerIcon: ({ tintColor }) => (
          <Icon
          name= 'bar-chart'
          size = {25}
          type= 'font-awesome'
          color = '#c40233'
          />
        ),
      },
    },
    Payment: {
      screen: PaymentScreen,
      navigationOptions: {
        drawerLabel : 'Ödeme Bildirimi',
        drawerIcon: ({ tintColor }) => (
          <Icon
          name= 'check'
          size = {25}
          type= 'AntDesign'
          color = '#c40233'
          />
        ),
      },
    },
    MyAccountSetting: {
      screen: MyAccountSettingScreen,
      navigationOptions: {
        drawerLabel : 'Hesap Ayarları',
        drawerIcon: ({ tintColor }) => (
          <Icon
          name= 'account-settings'
          size = {25}
          type= 'material-community'
          color = '#c40233'
          />
        ),
      },
    },
    Logout: {
      screen: Logout,
      navigationOptions: {
        drawerLabel : 'Çıkış',
        drawerIcon: ({ tintColor }) => (
          <Icon
          name= 'exit-to-app'
          size = {25}
          type= 'material-community'
          color = '#c40233'
          />
        ),
      },
    }
  }, {
    initialRouteName: 'Home',
    drawerType: 'push-screen',
    drawerWidth:SCREEN_WIDTH*0.7,
    contentComponent:CustomDrawerContentComponent,
    navigationOptions: ({navigation}) =>
      {
        const header = <MyHeader name="Çay Ocağı Ad" raporIcon={false}/>
        return {
          header,
        };
    }
});

  const styles = StyleSheet.create({
    drawer: {
      flex: 1,
      backgroundColor:'#c40233'
    },
    logo: {
      width:logosize*0.32,
      height:logosize*0.32,
      borderRadius:10,
      borderColor:'transparent',
      borderWidth:0 ,
      backgroundColor:'#fff',
      alignItems:'center',
      marginTop: 0 ,
      backgroundColor:'transparent',
      marginLeft:-25,
    },
  });
