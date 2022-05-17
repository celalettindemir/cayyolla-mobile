import React, { Component } from 'react'
import { Alert ,ScrollView, StyleSheet, Text, View,TextInput,KeyboardAvoidingView,Dimensions,Picker,LayoutAnimation,ActivityIndicator } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import { Avatar, ListItem } from 'react-native-elements'
import PropTypes from 'prop-types'
import BaseIcon from './Icon'
import InfoText from './InfoText'
import axios from 'axios';
import {Button} from 'react-native-elements';
import { Footer, FooterTab } from 'native-base';
import { Container } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {HOST,ACCESS_TOKEN} from "../Variables"
import { Dropdown } from 'react-native-material-dropdown';

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: 'white',
  },
  userRow: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: 8,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 6,
  },
  userImage: {
    marginRight: 12,
  },
  listItemContainer: {
    height: 55,
    borderWidth: 0.5,
    borderColor: '#ECECEC',
  },
  usTextInputStyle: {
    height: 40,
    width: 600*0.45
  },
  usTextStyle: {
    marginLeft:-20,
    fontStyle:'italic'
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
    paddingBottom: 3,
    marginHorizontal: 10,
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

class SettingsScreen extends Component {
  static propTypes = {
    avatar: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    navigation: PropTypes.object.isRequired,
    email: PropTypes.string.isRequired,
  }
  constructor(props) {
    super(props);

    this.state = {
      token:"",
      isLoading: false,
      phoneNumber: '',
      userName: '',
      userLastName: '',
      genderType: 'Erkek',
      email: '',
      password: '',
      newPassword: '',
      companyName: '',
      confirmationNewPassword: '',
      phoneNumberValid: true,
      userNameValid: true,
      userLastNameValid: true,
      genderTypeValid: true,
      emailValid: true,
      passwordValid: true,
      confirmationPasswordValid: true,
      screen_height: Dimensions.get('window').height,
      screen_width: Dimensions.get('window').width
    };

    this.validateEmail = this.validateEmail.bind(this);
    this.validatePhoneNumber = this.validatePhoneNumber.bind(this);
    this.validatePassword = this.validatePassword.bind(this);
    this.validateConfirmationPassword = this.validateConfirmationPassword.bind(this);
    this.guncelle = this.guncelle.bind(this);
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
        this.setState({token:JSON.parse(accessToken).access_token},()=>this.getUser());
      }
    })
    .catch((error) => {
      this.setState({isLoading: false });
      alert("Error :"+error);
    });
}
  async getUser()
  {
    axios.get(HOST+"/api/Users",{
      headers: {
        Authorization:'Bearer '+this.state.token
      },
    })
    .then((response) => {
      if(response.data!=null)
      {
        this.setState({
          userName:response.data.Name,
          userLastName:response.data.SurName,
          genderType:response.data.Gender,
          phoneNumber:response.data.PhoneNumber,
          email:response.data.Email,
          companyName:response.data.CompanyName,
          password:"",
          newPassword:"",
          confirmationNewPassword:"",
          isLoading:true,
        });
      }
    })
  }
  async guncelle() {
    this.setState({isLoading: false});
    LayoutAnimation.easeInEaseOut();
    const phoneNumberValid = this.validatePhoneNumber();
    const userNameValid = this.validateUserName();
    const userLastNameValid = this.validateUserLastName();
    const genderTypeValid = this.validateGenderType();
    const emailValid = this.validateEmail();
    const confirmPasswordValid = this.validateConfirmationPassword();
    if (
      phoneNumberValid &&
      userNameValid &&
      userLastNameValid &&
      genderTypeValid &&
      emailValid &&
      confirmPasswordValid &&
      this.state.password!=""?this.validatePassword():true
    ) {
      var data = {
        "Phone": this.state.phoneNumber,
        "Password": this.state.password,
        "NewPassword":this.state.newPassword,
        "CompanyName":this.state.companyName,
        "Email":this.state.email,
        "Name":this.state.userName,
        "Surname":this.state.userLastName,
        "Gender":this.state.genderType,
        };
      await axios.post(HOST+"/api/users",data,{
        headers: {
        'Content-Type': 'application/json',
        Authorization:'Bearer '+this.state.token
      },
      })
      .then((response) => {
        this.getUser();
      })
      .catch((error) => {
          alert("Eski Sifrenizi Kontrol Ediniz.");
          this.setState({isLoading: true});
      });
      Alert.alert(
        'Kayıt',
        'Bilgileriniz başarılı bir şekilde güncellendi!',
        [
          {text: 'Tamam'},
        ],
        {cancelable: false},
      )
    }
    else
      alert("Validation Error")
  }

  validatePhoneNumber() {
    const { phoneNumber } = this.state;
    const phoneNumberValid = phoneNumber.length == 10;
    LayoutAnimation.easeInEaseOut();
    this.setState({ phoneNumberValid });
    phoneNumberValid ;
    return phoneNumberValid;
  }

  validateUserName() {
    const { userName } = this.state;
    const userNameValid = userName.length > 1;
    LayoutAnimation.easeInEaseOut();
    this.setState({ userNameValid });
    userNameValid ;
    return userNameValid;
  }

  validateUserLastName() {
    const { userLastName } = this.state;
    const userLastNameValid = userLastName.length > 1;
    LayoutAnimation.easeInEaseOut();
    this.setState({ userLastNameValid });
    userLastNameValid ;
    return userLastNameValid;
  }

  validateGenderType() {
    const { genderType } = this.state;
    const genderTypeValid = genderType.length > 0;
    LayoutAnimation.easeInEaseOut();
    this.setState({ genderTypeValid });
    genderTypeValid ;
    return genderTypeValid;
  }

  validateEmail() {
    const { email } = this.state;
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const emailValid = re.test(email);
    LayoutAnimation.easeInEaseOut();
    this.setState({ emailValid });
    emailValid ;
    return emailValid;
  }

  validatePassword() {
    const { newPassword } = this.state;
    const passwordValid = newPassword.length >= 4;
    LayoutAnimation.easeInEaseOut();
    this.setState({ passwordValid });
    passwordValid ;
    return passwordValid;
  }

  validateConfirmationPassword() {
    const { newPassword, confirmationNewPassword } = this.state;
    const confirmationPasswordValid = newPassword === confirmationNewPassword;
    LayoutAnimation.easeInEaseOut();
    this.setState({ confirmationPasswordValid });
    confirmationPasswordValid ;
    return confirmationPasswordValid;
  }


  render() {
    const { avatar, name } = this.props
    const {
      isLoading,
      phoneNumber,
      companyName,
      password,
      confirmationNewPassword,
      email,
      newPassword,
      userName,
      userLastName,
      genderType,
    } = this.state;
    return !isLoading ? (
      <View style={[styles.containerActivity, styles.horizontal]}>
        <ActivityIndicator size="large" color="#c40233" />
      </View>
    ) : (
      <Container onLayout={this.onLayout}>
      <ScrollView style={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <KeyboardAvoidingView behavior="position" style={{ flex: -1 ,justifyContent: 'space-between'}}
        keyboardVerticalOffset={this.state.screen_height*0.32*-1}
        >
          <View style={styles.userRow}>
              <View style={styles.userImage}>
                <Avatar
                  rounded
                  size="large"
                  source={{
                    uri: avatar,
                  }}
                />
              </View>
              <View>
                <Text style={{ fontSize: 16 }}>{userName}</Text>
                <Text
                  style={{
                    color: 'gray',
                    fontSize: 16,
                  }}
                >
                  {email}
                </Text>
              </View>
            </View>
            <InfoText text="Hesap Ayarları" />
            <View >
              <ListItem
                title="Phone"
                titleStyle={styles.usTextStyle}
                containerStyle={styles.listItemContainer}
                rightElement={
                  <View>
                    <TextInput
                      style={{height: 40,width: this.state.screen_width*0.30,color: 'gray'}}
                      value={phoneNumber}
                      onChangeText={phoneNumber => this.setState({ phoneNumber })}
                      keyboardType="number-pad"
                      maxLenght={10}
                      placeholder="Telefon No"
                      underlineColorAndroid='transparent'
                      editable={false}
                      selectTextOnFocus={false}
                      onSubmitEditing={() => {
                        this.validatePhoneNumber();
                      }}
                    />
                  </View>
                }
                leftIcon={
                  <BaseIcon
                    containerStyle={{
                      backgroundColor: '#FEA8A1',
                    }}
                    icon={{
                      type: 'font-awesome',
                      name: 'phone',
                    }}
                  />
                }
              />

              <ListItem
                title="Mail"
                titleStyle={styles.usTextStyle}
                containerStyle={styles.listItemContainer}
                rightElement={
                  <View>
                    <TextInput
                      style={[styles.usTextInputStyle,{color: 'gray',width: this.state.screen_width*0.30}]}
                      icon="envelope"
                      value={email}
                      onChangeText={email => this.setState({ email })}
                      placeholder="Email"
                      keyboardType="email-address"
                      underlineColorAndroid='transparent'
                      editable={false}
                      selectTextOnFocus={false}
                      onSubmitEditing={() => {
                        this.validateEmail();
                      }}
                    />
                  </View>
                }

                leftIcon={
                  <View>
                    <BaseIcon
                      containerStyle={{ backgroundColor: '#57DCE7'}}
                      icon={{
                        type: 'font-awesome',
                        name: 'envelope',
                      }}
                    />
                  </View>
                }

              />
              <ListItem
                title="Ad"
                titleStyle={styles.usTextStyle}
                containerStyle={styles.listItemContainer}
                rightElement={
                  <View>
                    <TextInput
                      style={[styles.usTextInputStyle,{width: this.state.screen_width*0.30}]}
                      value={userName}
                      onChangeText={userName => this.setState({ userName })}
                      placeholder="Ad"
                      onSubmitEditing={() => {
                        this.validateUserName();
                      }}
                      underlineColorAndroid='transparent'
                    />
                  </View>
                }
                leftIcon={
                  <BaseIcon
                    containerStyle={{ backgroundColor: '#FAD291' }}
                    icon={{
                      type: 'font-awesome',
                      name: 'user',
                    }}
                  />
                }

              />
              <ListItem
                title="Soyad"
                titleStyle={styles.usTextStyle}
                containerStyle={styles.listItemContainer}
                rightElement={
                  <View>
                    <TextInput
                      style={[styles.usTextInputStyle,{width: this.state.screen_width*0.30}]}
                      value={userLastName}
                      onChangeText={userLastName => this.setState({ userLastName })}
                      placeholder="Soyad"
                      onSubmitEditing={() => {
                        this.validateUserLastName();
                      }}
                      underlineColorAndroid='transparent'
                    />
                  </View>
                }
                rightTitleStyle={{ fontSize: 15 }}
                containerStyle={styles.listItemContainer}
                leftIcon={
                  <BaseIcon
                    containerStyle={{ backgroundColor: '#FFADF2' }}
                    icon={{
                      type: 'font-awesome',
                      name: 'user',
                    }}
                  />
                }

              />
              <ListItem
                title="Şirket Adı"
                titleStyle={styles.usTextStyle}
                containerStyle={styles.listItemContainer}
                rightElement={
                  <View>
                    <TextInput
                      style={[styles.usTextInputStyle,{width: this.state.screen_width*0.30,color:'gray'}]}
                      value={companyName}
                      onChangeText={companyName => this.setState({ companyName })}
                      placeholder="Şirket Adı"
                      underlineColorAndroid='transparent'
                      editable={false}
                      selectTextOnFocus={false}
                    />
                  </View>
                }
                rightTitleStyle={{ fontSize: 15 }}
                containerStyle={styles.listItemContainer}
                leftIcon={
                  <BaseIcon
                    containerStyle={{ backgroundColor: '#FFADF2' }}
                    icon={{
                      type: 'font-awesome',
                      name: 'user',
                    }}
                  />
                }

              />
          </View>
          <InfoText text="Şifre Ayarları" />
          <View>

            <ListItem
              title="Eski Şifre"
              titleStyle={styles.usTextStyle}
              containerStyle={styles.listItemContainer}
              rightElement={
                <View>
                  <TextInput
                  secureTextEntry={true}
                  value={password}
                  onChangeText={password => this.setState({ password })}
                    style={[styles.usTextInputStyle,{width: this.state.screen_width*0.30}]}
                    placeholder="Eski şifrenizi giriniz"
                    underlineColorAndroid='transparent'
                  />
                </View>
              }
              rightTitleStyle={{ fontSize: 15 }}
              containerStyle={styles.listItemContainer}
              leftIcon={
                <BaseIcon
                  containerStyle={{ backgroundColor: '#A4C8F0' }}
                  icon={{
                    type: 'font-awesome',
                    name: 'unlock-alt',
                  }}
                />
              }

            />

            <ListItem
              title="Yeni Şifre"
              titleStyle={styles.usTextStyle}
              containerStyle={styles.listItemContainer}
              rightElement={
                <View>
                  <TextInput
                  secureTextEntry={true}
                  value={newPassword}
                  onChangeText={newPassword => this.setState({ newPassword })}

                  onSubmitEditing={() => {
                    this.validatePassword();
                  }}
                    style={[styles.usTextInputStyle,{width: this.state.screen_width*0.30}]}
                    placeholder="Yeni şifrenizi giriniz"
                    underlineColorAndroid='transparent'
                  />
                </View>
              }
              rightTitleStyle={{ fontSize: 15 }}
              containerStyle={styles.listItemContainer}
              leftIcon={
                <BaseIcon
                  containerStyle={{ backgroundColor: '#C6C7C6' }}
                  icon={{
                    type: 'font-awesome',
                    name: 'unlock',
                  }}
                />
              }

            />

            <ListItem
              title="Yeni Şifre Tekrar"
              titleStyle={styles.usTextStyle}
              containerStyle={styles.listItemContainer}
              rightElement={
                <View>
                  <TextInput
                  secureTextEntry={true}
                  value={confirmationNewPassword}
                  onChangeText={confirmationNewPassword => this.setState({ confirmationNewPassword })}

                  onSubmitEditing={() => {
                    this.validateConfirmationPassword();
                  }}
                    style={[styles.usTextInputStyle,{width: this.state.screen_width*0.30}]}
                    placeholder="Tekrar giriniz"
                    underlineColorAndroid='transparent'
                  />
                </View>
              }
              rightTitleStyle={{ fontSize: 15 }}
              containerStyle={styles.listItemContainer}
              leftIcon={
                <BaseIcon
                  containerStyle={{ backgroundColor: '#C47EFF' }}
                  icon={{
                    type: 'font-awesome',
                    name: 'repeat',
                  }}
                />
              }

            />

          </View>
          </KeyboardAvoidingView>
        </ScrollView>
        <Footer style={{backgroundColor:'#c40233'}}> 
          <FooterTab style={{backgroundColor:'#c40233'}}> 
          <View style={{flexDirection: 'row',alignSelf:'center',backgroundColor:'#c40233'}}>

            <Button
                buttonStyle={[styles.orderSaveButton,{width: this.state.screen_width,height: this.state.screen_height*0.1,alignSelf:'center'}]}
                title="Kaydet"
                titleStyle={styles.orderButtonText}
                onPress={() => this.guncelle()}
                icon={<Icon name="save" size={24} color="#fff"/>}
                iconContainerStyle={{alignSelf:'center'}}
            />
          </View>
          </FooterTab>
        </Footer>
      </Container>
    )
  }
}

export default SettingsScreen
