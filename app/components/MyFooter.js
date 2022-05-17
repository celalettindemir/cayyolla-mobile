import React, { Component } from 'react';
import { Dimensions, StyleSheet, View} from 'react-native';
import { Footer, FooterTab } from 'native-base';
import {Button} from 'react-native-elements';
import ShoppingIcon from 'react-native-vector-icons/MaterialIcons';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default class MyHeader extends Component {
    constructor(props){
        super(props);
        this.state = {
            isIconVisible: true,
        }
    }
  render() {
    return (
        
        <Footer>
          <FooterTab>
          <View style={{flexDirection: 'row'}}>
          
            <Button
                buttonStyle={styles.orderSaveButton}
                title="SEPETE GİT"
                titleStyle={styles.orderButtonText}
                onPress={() => this.props.navigation.navigate("Order",{HOT_DRINKS:this.props.HOT_DRINKS,COLD_DRINKS:this.props.COLD_DRINKS,FOODS:this.props.FOODS})}
                icon={<ShoppingIcon name="shopping-cart" size={24} color="#fff"/>}
                iconContainerStyle={{marginHorizontal: 5}}
            />
          </View>
          </FooterTab>
        </Footer>
    );
  }
}
// define your styles
const styles = StyleSheet.create({
    
  orderSaveButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#c40233',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT*0.09,
  },
  orderButtonText: {
    color: '#fff',
    textAlign: 'center',
    paddingBottom: 3,
    marginHorizontal: 10,
  },
});