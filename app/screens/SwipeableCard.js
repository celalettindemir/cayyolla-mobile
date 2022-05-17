import React ,{Component} from 'react';
import { Image, ImageBackground, View, Text, TouchableOpacity,StyleSheet,ActivityIndicator,Dimensions,FlatList } from 'react-native';


export class SwipeableCard extends Component {
    translateX = new Animated.Value(0);
    _panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderMove: Animated.event([null, {dx: this.translateX}]),
      onPanResponderRelease: (e, {vx, dx}) => {
        const screenWidth = Dimensions.get("window").width;
        if (Math.abs(vx) >= 0.5 || Math.abs(dx) >= 0.5 * screenWidth) {
          Animated.timing(this.translateX, {
            toValue: dx > 0 ? screenWidth : -screenWidth,
            duration: 200
          }).start(this.props.onDismiss);
        } else {
          Animated.spring(this.translateX, {
            toValue: 0,
            bounciness: 10
          }).start();
        }
      }
    });
  
    render() {
      return (
        <View>
          <Animated.View
            style={{transform: [{translateX: this.translateX}], height: 75}} {...this._panResponder.panHandlers}>
            <Card>
              <CardItem>
                <Body>
                <Text>
                  {this.props.title}
                </Text>
                </Body>
              </CardItem>
            </Card>
          </Animated.View>
        </View>
  
      );
    }
  }