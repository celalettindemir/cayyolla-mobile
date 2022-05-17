import React, { Component } from 'react';
import { Dimensions, StyleSheet,View,Text} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Header , Icon } from 'native-base';
import {Button} from 'react-native-elements';
import { withNavigation, DrawerActions } from 'react-navigation';
import MatIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ACCESS_TOKEN} from "./Variables";

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

class MyHeader extends React.Component<Partial<NavigationInjectedProps>> {
    constructor(props){
        super(props);
        this.state = {
            isIconVisible: true,
            companyName:"",
        }
    }
    async componentDidMount()  {
        await AsyncStorage.getItem(ACCESS_TOKEN)
        .then((accessToken) => {
        if(!accessToken) {
            throw "Token not set";
        } else {
            this.setState({companyName:JSON.parse(accessToken).cayOcagiAdi});
        }
    })
        .catch((error) => {
        this.setState({isLoaded: false });
        alert("Error :"+error);
        });
    }

  render() {
    return this.props.headerHidden ?(null):(
        <Header style={[styles.headerCotent]} >

              <View style={styles.headerView}>
                <Button transparent onPress={() => {
                  this.props.navigation.dispatch(DrawerActions.openDrawer());
                }}
                buttonStyle={{backgroundColor: '#c40233'}}
                icon={<Icon style={styles.headerImage} size={28} name='menu' color="#c40233"/>}
                />
                <View style={{width:'80%'}}>
                    <Text style={styles.headerText}>{this.state.companyName}</Text>
                </View>

                {this.props.raporIcon ? <Button transparent onPress={() => this.props.navigation.navigate('CayciRapor2')}
                buttonStyle={{backgroundColor: '#c40233'}}
                icon={<MatIcon style={styles.headerImage} size={24} name='file-document-box-multiple-outline' color="#fff"/>}
                /> : null}

                {this.props.raporIcon2 ? <Button transparent onPress={() => this.props.navigation.navigate('CayciRapor1')}
                buttonStyle={{backgroundColor: '#c40233'}}
                icon={<MatIcon style={styles.headerImage} size={24} name='chart-pie' color="#fff"/>}
                /> : null}

            </View>

      </Header>
    );
  }
}

export default withNavigation(MyHeader)
const styles = StyleSheet.create({
    headerCotent: {
        paddingTop: SCREEN_WIDTH < SCREEN_HEIGHT ? SCREEN_HEIGHT*0.003 : SCREEN_WIDTH*0.003,
        height: SCREEN_WIDTH < SCREEN_HEIGHT ? SCREEN_HEIGHT*0.1 : SCREEN_WIDTH*0.1,
        backgroundColor: '#c40233'
    },
    headerImage:{
        color: '#fff',
        marginHorizontal: 0
    },
    headerText:{
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    headerView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',

    }
});
