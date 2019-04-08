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
        <Content style={{borderTopWidth: 1}}>
            <Row style={{height:40}}>
                <Text style={{width:ScreenWidth,textAlign:'center',color:'#a7a7a7',marginTop:14,fontSize:12}}>-------共N条维修工单-------</Text>
            </Row>
            <Content>

                <OrderItem   type={this.props.type} ShowModal = {this.props.ShowModal}/>
                <OrderItem   type={this.props.type} ShowModal = {this.props.ShowModal}/>

            </Content>
        </Content>

      </Container>
    );
  }
}



module.exports=OrderOne;