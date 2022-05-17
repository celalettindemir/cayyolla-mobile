import React ,{Component} from 'react';
import { LayoutAnimation, TouchableOpacity, Dimensions, Image, KeyboardAvoidingView, StyleSheet, ScrollView, Text, View, ActivityIndicator, Picker, Alert} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Modal from 'react-native-modal';
import { StackActions, NavigationActions } from 'react-navigation'; // Version can be specified in package.json
import { Input, Button, CheckBox } from 'react-native-elements';
import axios from 'axios';
import qs from 'qs';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import GenderIcon from 'react-native-vector-icons/FontAwesome';
import { Dropdown } from 'react-native-material-dropdown';

import {HOST,ACCESS_TOKEN} from "../Variables";
import PolicyText from "./PolicyText"
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

// create a component
export default class RegisterForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
          isLoading: false,
          fontLoaded: false,
          checked:false,
          isModalVisible:false,
          phoneNumber: '',
          userName: '',
          userLastName: '',
          companyName: '',
          genderType: 'Erkek',
          email: '',
          password: '',
          confirmationPassword: '',
          isActiveCayci: false,
          isActiveMusteri: false,
          phoneNumberValid: true,
          userNameValid: true,
          userLastNameValid: true,
          companyNameValid: true,
          emailValid: true,
          passwordValid: true,
          confirmationPasswordValid: true,
        };

        this.validateEmail = this.validateEmail.bind(this);
        this.validatePhoneNumber = this.validatePhoneNumber.bind(this);
        this.validateCompanyName = this.validateCompanyName.bind(this);
        this.validatePassword = this.validatePassword.bind(this);
        this.validateConfirmationPassword = this.validateConfirmationPassword.bind(this);
        this.signup = this.signup.bind(this);
      }

      async componentDidMount() {
        this.setState({ fontLoaded: true });
      }

      async storeToken(data){
        await AsyncStorage.setItem(ACCESS_TOKEN,JSON.stringify(data), (err)=> {
          if(err){
            alert("an error");
            throw err;
          }
          this.props.navigation.dispatch(StackActions.reset({
            index: 0,
            actions: [
            NavigationActions.navigate({ routeName: data.kullaniciTur == "Çaycı" ? 'CayciMain' : 'MusteriMain' })
            ],
          }));
        }).catch((err)=> {
            alert("error is: " + err);
        });
      }

      async signup() {
        this.setState({isLoading: true});
        LayoutAnimation.easeInEaseOut();
        const phoneNumberValid = this.validatePhoneNumber();
        const userNameValid = this.validateUserName();
        const userLastNameValid = this.validateUserLastName();
        const companyNameValid = this.validateCompanyName();
        //const genderTypeValid = this.validateGenderType();
        const emailValid = this.validateEmail();
        const passwordValid = this.validatePassword();
        const confirmationPasswordValid = this.validateConfirmationPassword();
        if (
          phoneNumberValid &&
          userNameValid &&
          userLastNameValid &&
          companyNameValid &&
          emailValid &&
          passwordValid &&
          confirmationPasswordValid &&
          (
            this.state.isActiveCayci !== false ||
            this.state.isActiveMusteri !== false
          )
        ) {
          var data = qs.stringify({
            "Phone": this.state.phoneNumber,
            "Password": this.state.password,
            "ConfirmPassword":this.state.confirmationPassword,
            "CompanyName":this.state.companyName,
            "Email":this.state.email,
            "Name":this.state.userName,
            "Surname":this.state.userLastName,
            "Gender":this.state.genderType,
            "KullaniciTur":this.state.isActiveCayci ? 'Çaycı' : this.state.isActiveMusteri ? 'Müşteri' : null,
            });
            await axios.post(HOST+"/api/Account/Register",data,{headers: {
              'Content-Type': 'application/x-www-form-urlencoded',},
          })
          .then((response) => {
              if(response.data.access_token!=null && response.data.kullaniciTur!=null){
                this.storeToken(response.data);
              }
              else{
                Alert.alert(
                  'Bilgilendirme',
                  'Müşteri hizmetlerimiz sizinle iletişime geçecektir!',
                  [

                    {text: 'Tamam'},
                  ],
                  {cancelable: false},
                )
                this.props.navigation.dispatch(StackActions.reset({
                  index: 0,
                  actions: [
                    NavigationActions.navigate({ routeName: 'Login' })
                  ],
                }));
              }
          })
          .catch((error) => {
              if(error.response.status == "409")
              {
                alert(error.response.data);
              }
              else{
                alert(error);
              }
              this.setState({isLoading: false});
          });
        }
        else{
          if(this.state.isActiveCayci === false && this.state.isActiveMusteri === false){
            Alert.alert(
              'Hata',
              'Lütfen çaycı veya müşteri türlerinden birini seçiniz!',
              [
                {text: 'Tamam'},
              ],
              {cancelable: false},
            )
            this.setState({isLoading: false});
          }
          this.setState({isLoading: false});
        }

      }

      validatePhoneNumber() {
        const { phoneNumber } = this.state;
        const phoneNumberValid = phoneNumber.length == 10;
        LayoutAnimation.easeInEaseOut();
        this.setState({ phoneNumberValid });
        phoneNumberValid || this.phoneNumberInput.shake();
        return phoneNumberValid;
      }

      validateUserName() {
        const { userName } = this.state;
        const userNameValid = userName.length > 1;
        LayoutAnimation.easeInEaseOut();
        this.setState({ userNameValid });
        userNameValid || this.userNameInput.shake();
        return userNameValid;
      }

      validateUserLastName() {
        const { userLastName } = this.state;
        const userLastNameValid = userLastName.length > 1;
        LayoutAnimation.easeInEaseOut();
        this.setState({ userLastNameValid });
        userLastNameValid || this.userLastNameInput.shake();
        return userLastNameValid;
      }

      validateCompanyName(){
        const { companyName } = this.state;
        const companyNameValid = companyName.length > 1;
        LayoutAnimation.easeInEaseOut();
        this.setState({companyNameValid});
        companyNameValid || this.companyNameInput.shake();
        return companyNameValid;
      }

      /*validateGenderType() {
        const genderTypeValid = true;
        LayoutAnimation.easeInEaseOut();
        this.setState({ genderTypeValid });
        genderTypeValid || this.genderTypeInput.shake();
        return genderTypeValid;
      }*/

      validateEmail() {
        const { email } = this.state;
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const emailValid = re.test(email);
        LayoutAnimation.easeInEaseOut();
        this.setState({ emailValid });
        emailValid || this.emailInput.shake();
        return emailValid;
      }

      validatePassword() {
        const { password } = this.state;
        const passwordValid = password.length >= 6;
        LayoutAnimation.easeInEaseOut();
        this.setState({ passwordValid });
        passwordValid || this.passwordInput.shake();
        return passwordValid;
      }

      validateConfirmationPassword() {
        const { password, confirmationPassword } = this.state;
        const confirmationPasswordValid = password === confirmationPassword;
        LayoutAnimation.easeInEaseOut();
        this.setState({ confirmationPasswordValid });
        confirmationPasswordValid || this.confirmationPasswordInput.shake();
        return confirmationPasswordValid;
      }



      render() {
        const {
          isLoading,
          fontLoaded,
          phoneNumber,
          phoneNumberValid,
          confirmationPassword,
          email,
          emailValid,
          password,
          passwordValid,
          confirmationPasswordValid,
          userName,
          userNameValid,
          userLastName,
          userLastNameValid,
          companyName,
          companyNameValid,
          genderType,
          isActiveCayci,
          isActiveMusteri,
          //genderTypeValid
        } = this.state;

        return !fontLoaded ? (
          <View style={[styles.containerActivity, styles.horizontal]}>
            <ActivityIndicator size="large" color="#c40233" />
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
          >

            <KeyboardAvoidingView
              behavior="position"
              contentContainerStyle={styles.formContainer}
              keyboardVerticalOffset={SCREEN_HEIGHT*0.15*-1}
            >
              <Text style={styles.whoAreYouText}>ÜYELİK TİPİ SEÇİNİZ</Text>
              <View style={styles.userTypesContainer}>
                <View style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                  <Text style={styles.userTypeLabel}>ÇAYCI</Text>
                  <CheckBox
                    checked={isActiveCayci}
                    size={48}
                    iconType="material-community"
                    checkedIcon="checkbox-marked-outline"
                    uncheckedIcon='checkbox-blank-outline'
                    uncheckedColor="#fff"
                    checkedColor="#fff"
                    badgeStyle={[styles.badgePos, {borderColor: '#c40233'}]}
                    onPress={() => this.setState({isActiveCayci: !isActiveCayci,isActiveMusteri: false})}
                  />
                </View>
                <View style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                  <Text style={styles.userTypeLabel}>MÜŞTERİ</Text>
                  <CheckBox
                    checked={isActiveMusteri}
                    size={48}
                    iconType="material-community"
                    checkedIcon="checkbox-marked-outline"
                    uncheckedIcon='checkbox-blank-outline'
                    uncheckedColor="#fff"
                    checkedColor="#fff"
                    badgeStyle={[styles.badgePos, {borderColor: '#c40233'}]}
                    onPress={() => this.setState({isActiveMusteri: !isActiveMusteri,isActiveCayci: false})}
                  />
                </View>
              </View>
              <View style={{ width: '80%', alignItems: 'center', color: '#fff' }}>
                <FormInput
                  refInput={input => (this.phoneNumberInput = input)}
                  icon="phone"
                  value={phoneNumber}
                  onChangeText={phoneNumber => this.setState({ phoneNumber })}
                  placeholder="Telefon No"
                  keyboardType="phone-pad"
                  maxLength={10}
                  returnKeyType="next"
                  errorMessage={
                    phoneNumberValid ? null : "Telefon numarası alanı boş bırakılamaz!"
                  }
                  onSubmitEditing={() => {
                    this.validatePhoneNumber();
                    this.userNameInput.focus();
                  }}
                />
                <FormInput
                  refInput={input => (this.userNameInput = input)}
                  icon="user"
                  value={userName}
                  onChangeText={userName => this.setState({ userName })}
                  capitalize="words"
                  placeholder="Ad"
                  returnKeyType="next"
                  errorMessage={
                    userNameValid ? null : "Ad alanı boş bırakılamaz!"
                  }
                  onSubmitEditing={() => {
                    this.validateUserName();
                    this.userLastNameInput.focus();
                  }}
                />
                <FormInput
                  refInput={input => (this.userLastNameInput = input)}
                  icon="user"
                  value={userLastName}
                  onChangeText={userLastName => this.setState({ userLastName })}
                  capitalize="words"
                  placeholder="Soyad"
                  returnKeyType="next"
                  errorMessage={
                    userLastNameValid ? null : "Soyad alanı boş bırakılamaz!"
                  }
                  onSubmitEditing={() => {
                    this.validateUserLastName();
                    this.companyNameInput.focus();
                  }}
                />

                <FormInput
                  refInput={input => (this.companyNameInput = input)}
                  icon="user"
                  value={companyName}
                  onChangeText={companyName => this.setState({ companyName })}
                  capitalize="words"
                  placeholder="Şirket Adı"
                  returnKeyType="next"
                  errorMessage={
                    companyNameValid ? null : "Şirket adı alanı boş bırakılamaz!"
                  }
                  onSubmitEditing={() => {
                    this.validateCompanyName();

                  }}
                />

                <FormInput
                  refInput={input => (this.emailInput = input)}
                  icon="envelope"
                  value={email}
                  onChangeText={email => this.setState({ email })}
                  capitalize="none"
                  placeholder="Email"
                  keyboardType="email-address"
                  returnKeyType="next"
                  errorMessage={
                    emailValid ? null : 'Email alanı boş bırakılamaz!'
                  }
                  onSubmitEditing={() => {
                    this.validateEmail();
                    this.passwordInput.focus();
                  }}
                />
                <FormInput
                  refInput={input => (this.passwordInput = input)}
                  icon="lock"
                  value={password}
                  onChangeText={password => this.setState({ password })}
                  capitalize="none"
                  placeholder="Şifre"
                  secureTextEntry
                  returnKeyType="next"
                  errorMessage={
                    passwordValid ? null : 'En az 6 karakter giriniz!'
                  }
                  onSubmitEditing={() => {
                    this.validatePassword();
                    this.confirmationPasswordInput.focus();
                  }}
                />
                <FormInput
                  refInput={input => (this.confirmationPasswordInput = input)}
                  icon="lock"
                  value={confirmationPassword}
                  onChangeText={confirmationPassword =>
                    this.setState({ confirmationPassword })
                  }
                  capitalize="none"
                  placeholder="Şifre Doğrulama"
                  secureTextEntry
                  errorMessage={
                    confirmationPasswordValid
                      ? null
                      : 'Şifre doğrulama alanı boş bırakılamaz!'
                  }
                  returnKeyType="go"
                  onSubmitEditing={() => {
                    this.validateConfirmationPassword();
                    this.signup();
                  }}
                />
                <CheckBox
                    center
                    size={18}
                    title='Sözleşme Şartlarını Okudum ve Kabul Ediyorum.'
                    checkedIcon='dot-circle-o'
                    uncheckedIcon='circle-o'
                    checked={this.state.checked}
                    fontStyle={{color: '#c40233',fontWeight: 'normal'}}
                    textStyle={{fontSize:10}}
                    onPress={() => {
                      !this.state.checked?
                      this.setState({isModalVisible: !this.state.isModalVisible}):
                      this.setState({checked: false})

                    }}
                  />
                  <Modal isVisible={this.state.isModalVisible}>
                  <View style={{ flex: 1,backgroundColor:'white' }}>
                    <Text style={styles.title}>Kullanıcı Sözleşmesi</Text>
                    <View style={styles.divider}></View>
                    <ScrollView>
                      <PolicyText></PolicyText>
                    </ScrollView>
                    
                    <View style={styles.divider}></View>
                    <Button title="Kabul Et" onPress={() => this.setState({isModalVisible: !this.state.isModalVisible,checked: !this.state.checked})} />
                  </View>
                </Modal>
                  

              </View>
              <Button
                loading={isLoading}
                loadingProps={{color: '#c40233'}}
                title="KAYIT OL"
                containerStyle={{ flex: -1 }}
                buttonStyle={styles.signUpButton}
                titleStyle={styles.signUpButtonText}
                onPress={() => this.signup()}
                disabled={isLoading}
              />
            </KeyboardAvoidingView>
            <View style={styles.loginHereContainer}>
              <Text style={styles.alreadyAccountText}>
                Zaten bi hesaba sahipsen.
              </Text>
              <Button
                title="Giriş Yap"
                titleStyle={styles.loginHereText}
                containerStyle={{ flex: -1 }}
                buttonStyle={{ backgroundColor: 'transparent' }}
                underlayColor="transparent"
                onPress={() => this.props.navigation.dispatch(StackActions.reset({
                    index: 0,
                    actions: [
                    NavigationActions.navigate({ routeName: 'Login' })
                    ],
                }))}
              />
            </View>
          </ScrollView>
        );
    }
}

// define your styles
export const UserTypeItem = props => {
    const { image, label, labelColor, selected, ...attributes } = props;
    return (
      <TouchableOpacity {...attributes}>
        <View
          style={[
            styles.userTypeItemContainer,
            selected && styles.userTypeItemContainerSelected,
          ]}
        >
          <Text style={[styles.userTypeLabel, { color: labelColor }]}>
            {label}
          </Text>
          <Image
            source={image}
            style={[
              styles.userTypeMugshot,
              selected && styles.userTypeMugshotSelected,
            ]}
          />
        </View>
      </TouchableOpacity>
    );
  };

  export const FormInput = props => {
    const { icon, refInput, capitalize, ...otherProps } = props;
    return (
      <Input
        {...otherProps}
        ref={refInput}
        inputContainerStyle={styles.inputContainer}
        leftIcon={<Icon name={icon} color="#fff" size={18} />}
        inputStyle={styles.inputStyle}
        autoFocus={false}
        autoCapitalize={capitalize}
        errorStyle={styles.errorInputStyle}
        autoCorrect={false}
        blurOnSubmit={false}
        placeholderTextColor="#fff"
      />
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#c40233',
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
      alignItems: 'center',
      justifyContent: 'center',
    },
    formContainer: {
      flex: 1,
      justifyContent: 'space-evenly',
      alignItems: 'center',
    },
    whoAreYouText: {
      marginTop: 40,
      color: '#fff',
      fontFamily: 'Ubuntu-Bold',
      fontSize: 14,
    },
    userTypesContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      width: SCREEN_WIDTH,
      alignItems: 'center',
    },
    userTypeItemContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    userTypeItemContainerSelected: {
      opacity: 1,
    },
    userTypeMugshot: {
      margin: 4,
      width: SCREEN_WIDTH*0.15,
      height: SCREEN_HEIGHT*0.09
    },
    userTypeMugshotSelected: {
      width: SCREEN_WIDTH*0.2,
      height: SCREEN_HEIGHT*0.12
    },
    userTypeLabel: {
      color: '#fff',
      fontFamily: 'Ubuntu-Bold',
      fontSize: 12,
    },
    inputContainer: {
      marginHorizontal: 10,
      borderRadius: 40,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 1)',
      height: SCREEN_HEIGHT*0.04,
      marginVertical: 5,
    },
    inputStyle: {
      flex: 1,
      marginLeft: 10,
      color: '#fff',
      fontFamily: 'Ubuntu-Light',
      fontSize: 16,
    },
    errorInputStyle: {
      marginTop: 0,
      textAlign: 'center',
      color: '#F44336',
    },
    signUpButtonText: {
      fontFamily: 'Ubuntu-Bold',
      fontSize: 13,
      color: '#c40233'
    },
    signUpButton: {
      width: SCREEN_WIDTH*0.6,
      height: SCREEN_HEIGHT*0.08,
      borderRadius: 50,
      backgroundColor: '#fff'
    },
    loginHereContainer: {
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: 50
    },
    alreadyAccountText: {
      fontFamily: 'Ubuntu-LightItalic',
      fontSize: 12,
      color: 'white',
    },
    loginHereText: {
      color: '#FF9800',
      fontFamily: 'Ubuntu-LightItalic',
      fontSize: 12,
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
    divider:{
      width:"100%",
      height:1,
      backgroundColor:"lightgray"
    },
    title:{
      fontWeight:"bold",
      fontSize:18,
      padding:15,
      color:"#000"
    },
  });
