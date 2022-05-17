import React from 'react';
import { Text, View, Dimensions } from 'react-native';
import { PieChart } from 'react-native-svg-charts'

export default class YuvarlakGrafik extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      selectedSlice: {
        label: '',
        value: '0'
      },
      labelWidth: 0
    }
  }

  hasValue = (obj, key, value) => {
    return obj.hasOwnProperty(key) && obj[key] === value;
}

  componentDidUpdate = (nextProp, nextState) => {
    if(this.props !== nextProp){
      if(nextProp.TopUrun.some(() => { return this.hasValue(nextProp.TopUrun, "UrunAdi",this.state.selectedSlice.label) }))
      {
          this.setState({selectedSlice: {label: this.state.selectedSlice.label, value: this.props.values[this.props.keys.indexOf(this.state.selectedSlice.label)]}})
      }
      else
          this.setState({selectedSlice: {label: '', value: ''}})
    }
}

  render() {
    const { labelWidth, selectedSlice } = this.state;
    const { label, value } = selectedSlice;
    const { TopUrun } = this.props;
    const colors = ['#B8336A', '#933DA8', '#7D8CC4', '#A0D2DB']
    const valuesToplam = TopUrun.reduce((a, b) => a + b["Adet"], 0)

    const data = TopUrun.map((urun, index) => {
      return {
        key: urun.UrunAdi,
        value: urun.Adet,
        svg: { fill: colors[index] },
        arc: { outerRadius: (70 + (urun.Adet  / valuesToplam * 100) < 120 ? 70 + (urun.Adet  / valuesToplam * 100) : 120) + '%', padAngle: label === urun.UrunAdi ? 0.1 : 0 },
        onPress: () => this.setState({ selectedSlice: { label: urun.UrunAdi, value: urun.Adet } })
      }

    });
    const deviceWidth = Dimensions.get('window').width;
    const deviceHeight = Dimensions.get('window').height;

    return (
      <View style={{ justifyContent: 'center'}}>
        <PieChart
          style={{ height: deviceHeight*0.32,width:deviceWidth*0.60 }}
          outerRadius={'80%'}
          innerRadius={'45%'}
          data={data}
        />
        <Text
          onLayout={({ nativeEvent: { layout: { width } } }) => {
            this.setState({ labelWidth: width });
          }}
          style={{
            width:deviceWidth*0.2,
            position: 'absolute',
            left: deviceWidth / 3.4 - labelWidth / 2,
            textAlign: 'center',
            fontWeight:'bold',


          }}>
          {`${label} \n ${value}`}
        </Text>
      </View>
    )
  }
}
