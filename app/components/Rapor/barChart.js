import React from 'react'
import { StyleSheet, Text, View, Dimensions, Animated } from 'react-native';

export default class BarChart extends React.Component {
  constructor(props){
      super(props)
      const data = {}
      data['demliCay'] = this.props.dataBar.demliCay
      data['acikCay'] = this.props.dataBar.acikCay
      data['kahve'] = this.props.dataBar.kahve
      data['muzluCay'] = this.props.dataBar.muzluCay
      const width = this.getWidth(data)
      this.state = {
          demliCay: new Animated.Value(width.demliCay),
          acikCay: new Animated.Value(width.acikCay),
          kahve: new Animated.Value(width.kahve),
          muzluCay: new Animated.Value(width.muzluCay),
      }
  }

  getWidth (data) {
   const deviceWidth = Dimensions.get('window').width
   const indicators = ['demliCay', 'acikCay', 'kahve', 'muzluCay']
   let width = {}
   let widthCap // Give with a max cap
   indicators.forEach(item => {
     /* React-Native bug: if width=0 at first time, the borderRadius can't be implemented in the View */
     widthCap = data[item] || 5
     width[item] = widthCap <= (deviceWidth - 50) ? widthCap : (deviceWidth - 50)
   })

   return width
}

componentDidUpdate = (nextProp, nextState) => {
  this.handleAnimation()
}

  handleAnimation = () => {
      const data = this.props.dataBar
      const timing = Animated.timing
      const width = this.getWidth(this.props.dataBar)
      const indicators = ['demliCay', 'acikCay', 'kahve', 'muzluCay']
      Animated.parallel(indicators.map(item => {
        return timing(this.state[item], {toValue: width[item]})
      })).start()
  }

  render(){
    return(
      <View>
          <View style={styles.item}>
              <Text style={styles.label}>Demli Çay</Text>
              <View style={styles.data}>
                  {this.state.demliCay &&
                  <Animated.View style={[styles.bar, styles.points, {width: this.state.demliCay}]} />
                  }
                  <Text style={styles.dataNumber}>{this.props.dataBar.demliCay}</Text>
              </View>
          </View>
          <View style={styles.item}>
              <Text style={styles.label}>Açık Çay</Text>
              <View style={styles.data}>
                  {this.state.acikCay &&
                  <Animated.View style={[styles.bar, styles.assists, {width: this.state.acikCay}]} />
                  }
                  <Text style={styles.dataNumber}>{this.props.dataBar.acikCay}</Text>
              </View>
          </View>
          <View style={styles.item}>
              <Text style={styles.label}>kahve</Text>
              <View style={styles.data}>
                  {this.state.kahve &&
                  <Animated.View style={[styles.bar, styles.rebounds, {width: this.state.kahve}]} />
                  }
                  <Text style={styles.dataNumber}>{this.props.dataBar.kahve}</Text>
              </View>
          </View>
          <View style={styles.item}>
              <Text style={styles.label}>Muz Çayı</Text>
              <View style={styles.data}>
                  {this.state.muzluCay &&
                  <Animated.View style={[styles.bar, styles.rebounds, {width: this.state.muzluCay}]} />
                  }
                  <Text style={styles.dataNumber}>{this.props.dataBar.muzluCay}</Text>
              </View>
          </View>
      </View>
    )}

}


const styles = StyleSheet.create({
  item: {
    flexDirection: 'column',
    marginBottom: 5,
    paddingHorizontal: 10
  },
  label: {
    color: '#CBCBCB',
    fontSize: 12,
    position: 'relative',
    top: 2
  },
  data: {
    flexDirection: 'row'
  },
  dataNumber: {
    color: '#CBCBCB',
    fontSize: 11
},

  bar: {
    alignSelf: 'center',
    borderRadius: 5,
    height: 8,
    marginRight: 5
  },
  points: {
    backgroundColor: '#F55443'
  },
  assists: {
    backgroundColor: '#FCBD24'
  },
  rebounds: {
    backgroundColor: '#59838B'
},
})
