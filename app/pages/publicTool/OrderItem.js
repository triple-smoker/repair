import React, { Component } from 'react';
import {
    Image,
    Alert,
    Dimensions,
    StyleSheet,
    Modal,
    TouchableHighlight,
    TouchableOpacity,
    View,
    TextInput,
} from 'react-native';
import {  Item,Input,Button,Icon,ScrollableTab, Tabs, Tab , Col, Row, Container, Content, Header, Left, Body, Right, Text, List, ListItem, Thumbnail} from 'native-base';




class Adds extends Component {//报修单共用组件
  render() {
    return (
            <Content style={{backgroundColor:'#fff',marginBottom:8,paddingBottom:10,paddingLeft:16,paddingRight:16}}>
                <Row  style={{height:60,borderBottomWidth:1,borderColor:'#dfdfdf'}}>
                    <Text style={{marginTop:13,fontSize:14}}>报修内容：<Text style={stylesBody.orderContext}>F201机器内网网络不通。</Text></Text>
                </Row>
                <Content style={{paddingTop:12}}>
                    <Row style={{height:120}}>
                        {this.props.type!=0 &&
                        <Col style={{width:70,marginRight:17}}>
                            <Image
                              style={{width: 70, height: 70}}
                              source={{uri: 'http://ckimg.baidu.com/course/2016-10/21/808aa8fc57ab3684ab75bec1489473e2.jpg'}}
                            />
                        </Col>}
                        <Col>
                            <Row>
                            <Text style={stylesBody.orderContextTip}>报修单号:</Text><Text style={stylesBody.orderContextAut}>15002930001</Text>
                            </Row>
                            <Row>
                            <Text style={stylesBody.orderContextTip}>报修时间:</Text><Text style={stylesBody.orderContextAut}>2019-03-29 09:56:31</Text>
                            </Row>
                            <Row>
                            <Text style={stylesBody.orderContextTip}>已耗时长:</Text><Text style={stylesBody.orderContextAut}>1天</Text>
                            </Row>
                            <Row>
                            <Text style={stylesBody.orderContextTip}>报修位置:</Text><Text style={stylesBody.orderContextAut}>A机房C机架B群组-F203</Text>
                            </Row>
                            <Row>
                            <Text style={stylesBody.orderContextTip}>维修人员:</Text><Text style={stylesBody.orderContextAut}>周良</Text><Text style={{fontSize:14,color:'#737373',paddingLeft:40}}>12388888888</Text>
                            </Row>
                        </Col>
                    </Row>
                    <Content>
                        <Row style={{justifyContent:'flex-end'}}>
                            {this.props.type==1 &&
                                <Button
                                bordered
                                style={{borderColor:'#fcb155',height:30,width:60,marginRight:10}}
                                onPress= {this.props.ShowModal}
                                >
                                  <Text style={{color:'#fcb155',fontSize:12}}>催单</Text>
                                </Button>
                            }
                            {this.props.type==1 &&
                                <Button bordered style={{borderColor:'#ededed',height:30,width:60}}>
                                  <Text style={{color:'#6b6b6b',fontSize:12}}>取消</Text>
                                </Button>
                            }
                            {this.props.type==2 &&
                                <Button
                                bordered
                                style={{borderColor:'#fcb155',height:30,width:60,marginRight:10}}
                                >
                                  <Text style={{color:'#fcb155',fontSize:12}}>评价</Text>
                                </Button>
                            }
                        </Row>

                    </Content>
                </Content>
            </Content>
    );
  }
}

const stylesBody=StyleSheet.create({
    orderContext:{
        fontSize:14,
        color:'#737373'
    },
    orderContextTip:{
        fontSize:14,
        color:'#a9a9a9',
    },
    orderContextAut:{
        fontSize:14,
        color:'#737373',
        marginLeft:10
    }
});

module.exports=Adds;