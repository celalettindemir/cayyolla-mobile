import React ,{Component} from 'react';
import { StyleSheet,View, Text, Button } from 'react-native';
import Swiper from 'react-native-swiper';
//https://www.npmjs.com/package/react-native-swiper
//https://appdividend.com/2018/08/13/react-native-swipe-components-example-tutorial/

export default class DetailsScreen extends Component {
    static navigationOptions = {
      title: "Kategoriler",
    };
    render() {
      return (
        <Swiper style={styles.wrapper} showsPagination={false}>
        <View style={styles.slide1}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Details Screen</Text>
            <Button title="Go to Home" onPress={() => {
              this.props.navigation.navigate('Home')
                }}></Button>
            </View>
        </View>
        <View style={styles.slide2}>
          <Text style={styles.text}>Beautiful</Text>
        </View>
        <View style={styles.slide3}>
          <Text style={styles.text}>And simple</Text>
        </View>
      </Swiper>
        
      );
    }
  }
  const styles = StyleSheet.create({
    wrapper: {
    },
    slide1: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'red',
    },
    slide2: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#97CAE5',
    },
    slide3: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#92BB',
    },
    text: {
      color: '#fff',
      fontSize: 30,
      fontWeight: 'bold',
    }
  })