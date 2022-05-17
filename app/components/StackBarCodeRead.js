import React, { Component } from 'react';
import { Alert, Linking, Dimensions, LayoutAnimation, Text, View, StyleSheet, TouchableOpacity,ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Platform, PermissionsAndroid } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { StackActions, NavigationActions } from 'react-navigation';
import { HOST,ACCESS_TOKEN } from "./Variables"
import axios from 'axios';

export default class BarCodeRead extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    hasCameraPermission: null,
    lastScannedUrl: null,
    token:"",
    isLoaded:true,
  };
  async componentDidMount() {
    this._requestCameraPermission();
    await AsyncStorage.getItem(ACCESS_TOKEN)
    .then((accessToken) => {
      if(!accessToken) {
        throw "Token not set";
      } else {
          this.setState({
            token:JSON.parse(accessToken).access_token,
          })
      }
    })
    .catch((error) => {
      //console.log("Error :"+error);
    });
  }

  _requestCameraPermission = async () => {
    if(Platform.OS === 'android')
    {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Kamerayı kullanma izni',
          message:
            'Çaycınızın karekodunu okutabilmeniz için ' +
            'kamerayı açmamıza izin veriyor musunuz?.',
          buttonNeutral: 'Sonra Sor',
          buttonNegative: 'Hayır',
          buttonPositive: 'Evet',
        },
      );
      this.setState({
        hasCameraPermission: granted === PermissionsAndroid.RESULTS.GRANTED,
      });
    }
    else {
      this.setState({
        hasCameraPermission: true
      });
    }

  };

  _handleBarCodeRead = async result => {
    this.setState({
      isLoaded:false
    });
    if (result.data !== this.state.lastScannedUrl) {
      LayoutAnimation.spring();

      this.setState({ lastScannedUrl: result.data },async ()=>
      {
        await axios.post(HOST+"/api/Karekod",{
          KarekodDeger: result.data,
          },{
            headers: {
              'Content-Type': 'application/json',
              Authorization:'Bearer '+this.state.token
            },
          })
          .then((response) => {
            this.setState({
              isLoaded:true
            },()=>this.props.navigation.dispatch(StackActions.reset({
              index: 0,
              actions: [
                NavigationActions.navigate({ routeName: 'MusteriMain' })
              ],
            })));

          })
          .catch((error) => {
              alert("error " + error);
          });
      });
    }
  };

  render() {
    return !this.state.isLoaded ? (
      <View style={[styles.containerActivity, styles.horizontal]}>
        <ActivityIndicator size="large" color="#c40233" />
      </View>
    ) : (
      <View style={styles.container}>

        {this.state.hasCameraPermission === null
          ? <Text>Requesting for camera permission</Text>
          : this.state.hasCameraPermission === false
              ? <Text style={{ color: '#fff' }}>
                  Camera permission is not granted
                </Text>
              : <RNCamera
                  onBarCodeRead={this._handleBarCodeRead}
                  captureAudio={false}
                  style={{
                    height: Dimensions.get('window').height,
                    width: Dimensions.get('window').width,
                  }}
                />}
        {this._maybeRenderUrl()}
      </View>
    );
  }

  _handlePressUrl = () => {
    Alert.alert(
      'Open this URL?',
      this.state.lastScannedUrl,
      [
        {
          text: 'Yes',
          onPress: () => Linking.openURL(this.state.lastScannedUrl),
        },
        { text: 'No', onPress: () => {} },
      ],
      { cancellable: false }
    );
  };

  _handlePressCancel = () => {
    this.setState({ lastScannedUrl: null });
  };

  _maybeRenderUrl = () => {
    if (!this.state.lastScannedUrl) {
      return;
    }

    return (
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.url} onPress={this._handlePressUrl}>
          <Text numberOfLines={1} style={styles.urlText}>
            {this.state.lastScannedUrl}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={this._handlePressCancel}>
          <Text style={styles.cancelButtonText}>
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 15,
    flexDirection: 'row',
  },
  url: {
    flex: 1,
  },
  urlText: {
    color: '#fff',
    fontSize: 20,
  },
  cancelButton: {
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 18,
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
