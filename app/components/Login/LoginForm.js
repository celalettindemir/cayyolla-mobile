import React ,{Component} from 'react';
import { LayoutAnimation, TouchableOpacity, Dimensions, Image, KeyboardAvoidingView, StyleSheet, ScrollView, Text, View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { HOST,ACCESS_TOKEN, PHONE_NUMBER, PASSWORD } from "../Variables";
import { StackActions, NavigationActions } from 'react-navigation'; // Version can be specified in package.json
import { Input, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import axios from 'axios';
import Modal from 'react-native-modal';

const LOGO = require('../../assets/images/logo.png');

export default class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
          isLoading: false,
          isModalVisible:false,
          fontLoaded: false,
          phoneNumber: '',
          email: '',
          password: '',
          phoneNumberValid: true,
          passwordValid: true,
          screen_height: Dimensions.get('window').height,
          screen_width: Dimensions.get('window').width
        };

        this.validatePhoneNumber = this.validatePhoneNumber.bind(this);
        this.validatePassword = this.validatePassword.bind(this);
        this.signup = this.signup.bind(this);
        this.onLayout = this.onLayout.bind(this);
      }

      async componentDidMount() {
        this.setState({ fontLoaded: true });
  
        // Ask notification permission and add notification listener
      }

      onLayout(e){
        this.setState({screen_width: Dimensions.get('window').width});
        this.setState({screen_height: Dimensions.get('window').height});
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

      async storePhoneNumber(data){
        await AsyncStorage.setItem(PHONE_NUMBER,JSON.stringify(data), (err)=> {
          if(err){
            alert("an error");
            throw err;
          }
        }).catch((err)=> {
          alert("error is: " + err);
      });
      }

      async storePassword(data){
        await AsyncStorage.setItem(PASSWORD,JSON.stringify(data), (err)=> {
          if(err){
            alert("an error");
            throw err;
          }
        }).catch((err)=> {
          alert("error is: " + err);
      });
      }

      //Kullanıcı Bilgileri kontrol ediliyor. Bununla beraber Token talep ediliyor.
      async signup() {
        this.setState({isLoading: true});
        LayoutAnimation.easeInEaseOut();
        const phoneNumberValid = this.validatePhoneNumber();
        const passwordValid = this.validatePassword();
        if (
          phoneNumberValid &&
          passwordValid
          ){
            await axios.post(HOST+"/api/Account/Login",{
            PhoneNumber: this.state.phoneNumber,
            password: this.state.password,
            },{headers: {
                'Content-Type': 'application/json',},
            })
            .then((response) => {
                if(response.data.enable == false)
                {
                  alert("Hesap aidatını ödemeniz gerekiyor.")
                  this.setState({isLoading: false})
                }
                else if(response.data.access_token!=null && response.data.kullaniciTur!=null)
                {
                    this.storePhoneNumber(this.state.phoneNumber);
                    this.storePassword(this.state.password);
                    this.storeToken(response.data);
                }
                else{
                    alert("Hatalı Giriş");
                    this.setState({isLoading: false});
                }
            })
            .catch((error) => {
                alert("error " + error);
                this.setState({isLoading: false});
            });
          }
        else
          this.setState({isLoading: false});
      }
      async forgotPassword()
      {
        console.log(this.state.email)
        if (
          this.state.email!=""
          ){
        this.setState({isLoading: true});
        await axios.post(HOST+"/api/Account/ForgotPassword?Email="+this.state.email,{
          },{headers: {
              'Content-Type': 'application/json',},
          })
          .then((response) => {
              if(response.data == "Successfully")
              {
                alert("İşlem Basarili.")
                this.setState({isLoading: false,email:''})
              }
              else{
                  alert("Hatalı Giriş");
                  this.setState({isLoading: false,email:''});
              }
          })
          .catch((error) => {
              alert("error " + error);
              this.setState({isLoading: false,email:''});
          });
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

      validatePassword() {
        const { password } = this.state;
        const passwordValid = password.length != 0;
        LayoutAnimation.easeInEaseOut();
        this.setState({ passwordValid });
        passwordValid || this.passwordInput.shake();
        return passwordValid;
      }

      render() {
        const {
          isLoading,
          fontLoaded,
          email,
          password,
          passwordValid,
          phoneNumber,
          phoneNumberValid,
          screen_height,
          screen_width
        } = this.state;

        return !fontLoaded ? (
          <View style={[styles.containerActivity, styles.horizontal]}>
            <ActivityIndicator size="large" color="#c40233" />
          </View>
        ) : (
          <ScrollView
            scrollEnabled={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={[styles.container, {width: screen_width, height: screen_height}]}
            onLayout={this.onLayout}
          >
            <KeyboardAvoidingView
              behavior="position"
              keyboardVerticalOffset={screen_height*0.02}
              contentContainerStyle={styles.formContainer}
            >
              <Text style={styles.signUpText}>Giriş Yap</Text>
              <Image source={LOGO} resizeMode={"center"} style={{width: screen_width*0.3, height: screen_height*0.2}}></Image>
              <View style={{ width: '100%', alignItems: 'center', color: '#fff' }}>
                <FormInput
                  width={screen_width}
                  height={screen_height}
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
                    this.passwordInput.focus();
                  }}
                />
                <FormInput
                  width={screen_width}
                  height={screen_height}
                  refInput={input => (this.passwordInput = input)}
                  icon="lock"
                  value={password}
                  onChangeText={password => this.setState({ password })}
                  placeholder="Şifre"
                  secureTextEntry
                  returnKeyType="next"
                  errorMessage={
                    passwordValid ? null : 'Şifre alanı boş bırakılamaz!'
                  }
                  onSubmitEditing={() => {
                    this.validatePassword();
                  }}
                />
				<View style={styles.loginHereContainer}>
				  <Button
					loading={isLoading}
          title="Giriş Yap"
          
					loadingProps={{color: '#c40233'}}
					containerStyle={{ flex: -1, marginTop: 5 }}
					buttonStyle={[styles.signUpButton, {width: screen_width*0.5, height: screen_height*0.07}]}
					titleStyle={styles.signUpButtonText}
					onPress={this.signup}
					disabled={isLoading}
				  />

					<Text style={styles.alreadyAccountText}>
					  Bi hesaba sahip değil misin?
					</Text>
					<Button
					  title="Kayıt Ol"
					  titleStyle={styles.loginHereText}
					  containerStyle={{ flex: -1 }}
					  buttonStyle={{ backgroundColor: 'transparent' }}
					  underlayColor="transparent"
					  onPress={() => this.props.navigation.navigate('Register')}
					/>
          <Button
          title="Şifremi unuttum ?"
          titleStyle={styles.loginHereText}
          containerStyle={{ flex: -1 }}
          buttonStyle={{ backgroundColor: 'transparent' }}
          underlayColor="transparent"
          onPress={() => {
            this.setState({isModalVisible: !this.state.isModalVisible})
          }}
        />
        
				</View>
      </View>
      <Modal style={styles.modal} isVisible={this.state.isModalVisible}>
              <View  style={styles.modalContainer}>
                <Text style={styles.title}>Şifremi Unuttum</Text>
                <View style={styles.divider}></View>
                    <Input
                      placeholder='Email'
                      ref={input => (this.email = input)}
                      value={email}
                      onChangeText={email => this.setState({ email })}
                      //inputContainerStyle={[styles.inputContainer, {width: props.width*0.7, height: props.height*0.07}]}
                      //leftIcon={<Icon name={icon} color="#fff" size={18} />}
                      inputStyle={{flex: 1,
                        marginLeft: 10,
                        fontFamily: 'Ubuntu-Light',
                        fontSize: 16,}}
                      autoFocus={false}
                      autoCapitalize="none"
                      errorStyle={styles.errorInputStyle}
                      autoCorrect={false}
                      blurOnSubmit={false}
                      
                      returnKeyType="done"
                      //placeholderTextColor="#fff"
                    />
                    <View>
                        <Button 
                        title="Kabul Et" 
                        disabled={isLoading}
                        loading={isLoading}
                        loadingProps={{color: '#c40233'}}
                        onPress={ async () => {
                          await this.forgotPassword();
                          this.setState({isModalVisible: !this.state.isModalVisible,checked: !this.state.checked});
                          
                        }
                          } />
                    </View>
                </View>
            </Modal>
         
    </KeyboardAvoidingView>
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
    const { icon, refInput, capitalize, width, height, ...otherProps } = props;
    return (
      <Input
        {...otherProps}
        ref={refInput}
        inputContainerStyle={[styles.inputContainer, {width: props.width*0.7, height: props.height*0.07}]}
        leftIcon={<Icon name={icon} color="#fff" size={18} />}
        inputStyle={styles.inputStyle}
        autoFocus={false}
        autoCapitalize="none"
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
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
      alignItems: 'center',
      //justifyContent: 'space-around',
    },
    formContainer: {
      flex: 1,
      justifyContent: 'space-evenly',
      alignItems: 'center',
    },
    signUpText: {
      color: '#fff',
      fontSize: 28,
      fontFamily: 'Ubuntu-Light',
    },
    userTypeItemContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    userTypeItemContainerSelected: {
      opacity: 1,
    },
    inputContainer: {
      paddingLeft: 8,
      borderRadius: 40,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 1)',
      height: Dimensions.get('window').height*0.07,
      width: Dimensions.get('window').width*0.7,
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
      width: Dimensions.get('window').width*0.5,
      height: Dimensions.get('window').height*0.07,
      borderRadius: 50,
      backgroundColor: '#fff'
    },
    loginHereContainer: {
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    alreadyAccountText: {
      fontFamily: 'Ubuntu-LightItalic',
      fontSize: 12,
      color: 'white',
    },
    loginHereText: {
      color: '#FF9800',
      fontFamily: 'Ubuntu-lightitalic',
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
    modal:{
      flex:1,
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    modalContainer:{
      backgroundColor:"#f9fafb",
      width:"80%",
      borderRadius:5
    },
    modalBody:{
    backgroundColor:"#fff",
    paddingVertical:20,
    paddingHorizontal:10
  },
  });
