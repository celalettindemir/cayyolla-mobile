import React ,{Component} from 'react';
import BarCodeRead from '../components/StackBarCodeRead'; // Version can be specified in package.json

export default class KareCodeReadScreen extends Component {
    render() {
      return (
        <BarCodeRead navigation={this.props.navigation}/>
      );
    }  
  }