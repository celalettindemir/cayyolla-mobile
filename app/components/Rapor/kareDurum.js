import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Dimensions } from 'react-native'

let {width, height} = Dimensions.get('window')

const scale = size => Math.round(width / guidelineBaseWidth * size);
const moderateScale = (size, factor = 0.5) =>
  Math.round(size + (scale(size) - size) * factor);

const calcValueSize = value => {
  const length = value.toString().length;
  if (length > 8) return  moderateScale(12) - 2;
  if (length === 8) return moderateScale(12);
  if (length === 7) return moderateScale(14);
  if (length === 6) return moderateScale(16);
  if (length === 5) return moderateScale(19);
  if (length === 4) return moderateScale(20);
  return moderateScale(22);
};

const KareDurum = props => (
    
      <View style={[styles.accountContainer, {backgroundColor: props.renk}]}>
        <View>
          <Text style={[styles.value, {fontSize: calcValueSize(props.tutar)}]}>₺{props.tutar}</Text>
          <View style={styles.subtitleContainer}>
            <Text style={styles.subtitle}>{props.yazi}</Text>
          </View>
        </View>
      </View>
)

export default KareDurum

const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

const indent = moderateScale(16);
const halfIndent = moderateScale(indent / 2);
const doubleIndent = moderateScale(indent * 2);
const borderRadius = 4;
const length = (width / 3) - (indent + moderateScale(halfIndent / 1.5));
const verticalScale = size => Math.round(height / guidelineBaseHeight * size);

const fontWeights = {
    thin: Platform.select({ ios: '100', android: '100' }),
    extraLight: Platform.select({ ios: '200', android: '100' }),
    light: Platform.select({ ios: '300', android: '200' }),
    normal: Platform.select({ ios: '400', android: '300' }),
    medium: Platform.select({ ios: '500', android: '400' }),
    semiBold: Platform.select({ ios: '600', android: '500' }),
    bold: Platform.select({ ios: '700', android: '600' }),
    extraBold: Platform.select({ ios: '800', android: '700' }),
    heavy: Platform.select({ ios: '900', android: '800' }),
  };


const styles = StyleSheet.create({
  container: {
    margin: halfIndent,
  },
  accountContainer: {
    width: length,
    height: length,
    borderRadius: borderRadius,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: fontWeights.heavy,
  },
  subtitle: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: fontWeights.bold,
  },
  subtitleContainer: {
    bottom: verticalScale(-25),
  },

});