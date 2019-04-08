import React, { Component } from 'react';
import {
    StyleSheet,
    Dimensions,
    View,
    Image
} from 'react-native';
import { Content,Row,Col,Text,List,ListItem } from 'native-base';
import * as Progress from 'react-native-progress';



let ScreenWidth = Dimensions.get('window').width;
class Person extends Component {
  render() {
    return (
        <Content style={{padding:15}}>
            <Col style={{height:55,borderBottomWidth:1,borderBottomColor:'#dedede'}}>
                <Text style={{color:'#2b2b2b'}}>维修类别:</Text>
            </Col>
            <Row>
                <Col style={{width:'20%',paddingTop:18,paddingLeft:18}}>
                    <Image
                        style={{width: 38,height:38}}
                        source={require('../../resource/assets/user_wx.png')}
                    />
                    <IconAutoItem/>
                    <IconAutoItem/>
                    <IconAutoItem/>
                    <IconAutoItem/>
                </Col>
                <Col style={{width:'80%',paddingTop:17}}>
                    <PersonItem name='马云' num={0.4}/>
                    <PersonItem name='马云' num={0.3}/>
                    <PersonItem name='马云' num={0.5}/>
                    <PersonItem name='马云' num={0.7}/>
                    <PersonItem name='马云' num={0.3}/>
                </Col>
            </Row>
        </Content>
    );
  }
}

class PersonItem extends Component {//head模块
  render() {
    return (
        <Content style={{height:70}}>
            <Row>
                <Text style={{width:100,color:'#262626'}}>{this.props.name}</Text><Text style={{color:'#262626'}}>13888888888</Text>
            </Row>
            <Row>
                <Text style={{width:100,color:'#9a9a9a'}}>维修占比</Text>
                <Progress.Bar
                  color='#3595ec'
                  borderWidth={0}
                  unfilledColor='#dedede'
                  width={170}
                  style={{marginTop:10,height:5}}
                  progress={this.props.num}//占比
                />
                <Text style={{marginLeft:15,color:'#3996ec'}}>{this.props.num*100}%</Text>
            </Row>
        </Content>
    );
  }
}class IconAutoItem extends Component {//head模块
  render() {
    return (
        <View style={{paddingLeft:9}}>
            <View style={{marginLeft:9,height:47,width:2,backgroundColor:'#a2acd8'}}></View>
            <Image
                style={{width: 20,height:20}}
                source={require('../../resource/assets/steps_xzr.png')}
            />
        </View>
    );
  }
}



module.exports=Person;