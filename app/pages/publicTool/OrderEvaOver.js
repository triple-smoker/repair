import React, { Component } from 'react';
import {
    StyleSheet,
    Dimensions,
    Image,
    Alert,
    View,
    TouchableHighlight
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Content,Row,Col,Text,List,ListItem,Button,Item,Textarea } from 'native-base';
import axios from 'axios';


let ScreenWidth = Dimensions.get('window').width;
class OrderEvaOver extends Component {

    getCause(causes){
        var causeList = [];
        if(causes!=''){
            causeList = causes.causeList;
        }
        let listItems =(  causeList === null ? null : causeList.map((cause, index) =>
            <Text key={index} style={{backgroundColor:'#f8f8f8',borderWidth:1,borderColor:"#ddd",marginLeft:10,padding:3,color:'#555'}}>{cause.causeCtn}</Text>
        ))
        return listItems;
    }


  render() {
    return (
        <Content>
            <Row style={{padding:15,borderBottomWidth:1,borderColor:'#e4e4e4'}}>
                <Col style={{width:'70%',height:60}}>
                    <Row>
                        <Image
                            style={{width: 60,height:60}}
                            source={require('../../image/user_wx.png')}
                        />
                        <Col style={{paddingLeft:12,paddingTop:5}}>
                            <Text style={{color:'#252525'}}>
                                {this.props.record.repairUserName}
                            </Text>
                            <Text style={{color:'#a1a1a1',paddingTop:5}}>
                                {this.props.record.deptName}
                            </Text>
                        </Col>
                    </Row>
                </Col>
                <Col style={{width:'30%',height:60}}>

                        {this.props.evaluate.satisfactionLevel==='1' &&
                        <LinearGradient
                                                    colors= {[ '#e9c11a','#f1a611','#fb8306']}
                                                    start={ {x: 0.3, y:0} }
                                                    end={ {x: 0.7, y:1} }
                                                    style={{height:35,flexDirection: 'row',alignItems: 'center',
                                                        justifyContent: 'center',borderRadius : 50,borderWidth:1,borderColor:'#c2c2c2'}}
                                                >
                            <Image style={{width:20,height:20, marginRight: 10}}
                                   source={require('../../image/ico_bmy_nor.png')}/>
                            <Text style={{color:'#999'}}>不满意</Text>
                        </LinearGradient>
                        }
                        {this.props.evaluate.satisfactionLevel==='2' &&
                        <LinearGradient
                                                    colors= {[ '#e9c11a','#f1a611','#fb8306']}
                                                    start={ {x: 0.3, y:0} }
                                                    end={ {x: 0.7, y:1} }
                                                    style={{height:35,flexDirection: 'row',alignItems: 'center',
                                                        justifyContent: 'center',borderRadius : 50,borderWidth:1,borderColor:'#c2c2c2'}}
                                                >
                            <Image style={{width:20,height:20, marginRight: 10}}
                                   source={require('../../image/ico_yb_nor.png')}/>
                            <Text style={{color:'#999'}}>一般</Text>
                        </LinearGradient>
                        }
                        {this.props.evaluate.satisfactionLevel==='3' &&
                        <LinearGradient
                                                    colors= {[ '#e9c11a','#f1a611','#fb8306']}
                                                    start={ {x: 0.3, y:0} }
                                                    end={ {x: 0.7, y:1} }
                                                    style={{height:35,flexDirection: 'row',alignItems: 'center',
                                                        justifyContent: 'center',borderRadius : 50,borderWidth:1,borderColor:'#c2c2c2'}}
                                                >
                            <Image style={{width:20,height:20, marginRight: 10}}
                                   source={require('../../image/ico_my_nor.png')}/>
                            <Text style={{color:'#999'}}>满意</Text>
                        </LinearGradient>
                        }
                </Col>
            </Row>
            <Col style={{justifyContent: "center"}}>
                    <Text style={{width:ScreenWidth,borderRadius:10,padding:10}}>
                        {this.props.evaluate.satisfactionDesc}
                    </Text>
                    <View style={{flexDirection:'row',flexWrap:'wrap',paddingBottom:10}}>
                        {this.getCause(this.props.evaluate)}
                    </View>

            </Col>
        </Content>
    );
  }
}


module.exports=OrderEvaOver;