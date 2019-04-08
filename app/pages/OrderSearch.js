import React, { Component } from 'react';
import {
    Dimensions,
} from 'react-native';
import {Row, Container, Content, Text} from 'native-base';
import OrderItem from './publicTool/OrderItem';



let ScreenWidth = Dimensions.get('window').width;
class OrderOne extends Component {
  render() {
    return (
      <Container style={{backgroundColor:'#f8f8f8'}}>

      </Container>
    );
  }
}



module.exports=OrderOne;