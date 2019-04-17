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
    Linking
} from 'react-native';
import {  Item,Input,Button,Icon,ScrollableTab, Tabs, Tab , Col, Row, Container, Content, Header, Left, Body, Right, Text, List, ListItem, Thumbnail} from 'native-base';
import Swiper from 'react-native-swiper';


let ScreenWidth = Dimensions.get('window').width;
let dialogWidth = ScreenWidth-80;
class Adds extends Component {//报修单共用组件
    constructor(props) {
       super(props);
       this.state = { modalVisible: false};
    }
    onClose() {
       this.setState({modalVisible: false});
    }
    _setModalVisible() {
      this.setState({modalVisible: !this.state.modalVisible});
    }
  render() {
    return (
            <Content style={{backgroundColor:'#fff',marginBottom:8,paddingBottom:10,paddingLeft:16,paddingRight:16}}>
                <View  style={{borderBottomWidth:1,borderColor:'#dfdfdf',paddingBottom:10}}>
                    <Text style={{marginTop:13,fontSize:14}}>报修内容：<Text style={stylesBody.orderContext}>F201机器内网网络不通。</Text></Text>
                </View>
                <Content style={{paddingTop:12}}>
                    <Row style={{height:120}}>
                        {this.props.type!=0 &&
                        <Col style={{width:70,marginRight:17}}>
                             <Image
                              style={{width: 70, height: 70}}
                              onPress= {this._setModalVisible}
                              source={{uri: 'http://ckimg.baidu.com/course/2016-10/21/808aa8fc57ab3684ab75bec1489473e2.jpg'}}
                            />
                            <Button transparent style={{position: 'absolute',width:70,height:70}} onPress= {()=>this._setModalVisible()}/>
                            <View style={{position: 'absolute',left:40,top:5,backgroundColor:'#545658',height:20,paddingLeft:8,width:25,borderRadius:10}}><Text style={{color:'#fff'}}>3</Text></View>
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
                            <Text style={stylesBody.orderContextTip}>维修人员:</Text><Text style={stylesBody.orderContextAut}>周良</Text><Text style={{fontSize:14,color:'#737373',paddingLeft:40}}>18088888888</Text>
                            <TouchableHighlight
                                style={{width:20,height:20,backgroundColor:'#fff',marginLeft:20}}
                                onPress={() => Linking.openURL(`tel:${`18088888888`}`)}>
                                <Image source={require("../../image/list_call.png")}/>
                            </TouchableHighlight>
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
                            {this.props.type==3 &&
                                <Button
                                bordered
                                style={{borderColor:'#fcb155',height:30,width:90,marginRight:10}}
                                >
                                  <Text style={{color:'#fcb155',fontSize:12}}>查看详情</Text>
                                </Button>
                            }
                        </Row>
                        <Modal
                            animationType={"slide"}
                            transparent={true}
                            visible={this.state.modalVisible}
                            onRequestClose={() => {
                                       alert("Modal has been closed.");
                                     }}
                        >
                        <PictureMd Closer = {() => this._setModalVisible()} />
                        </Modal>

                    </Content>
                </Content>
            </Content>

    );
  }
}

class PictureMd extends Component {
        render(){
            return (
                <View style={modalStyles.container}>
                    <View style={modalStyles.innerContainer}>
                        <View style={{width:ScreenWidth,height:210,backgroundColor:'#fff'}}>
                         <Swiper
                           onMomentumScrollEnd={(e, state, context) => console.log('index:', state.index)}
                           dot={<View style={{backgroundColor: 'rgba(0,0,0,.2)', width: 5, height: 5, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3}} />}
                           activeDot={<View style={{backgroundColor: '#000', width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3}} />}
                           paginationStyle={{
                             bottom: -23, left: null, right: 10
                           }} loop>
                                <ImageItem num='1' sum='2'  imageurl='https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1554368276452&di=dfa6ac0f1342c8ec5e443861ad6f60c7&imgtype=0&src=http%3A%2F%2Fstatic.open-open.com%2Fnews%2FuploadImg%2F20160113%2F20160113102614_405.png'/>
                                <ImageItem num='2' sum='2'  imageurl='https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1554368276452&di=dfa6ac0f1342c8ec5e443861ad6f60c7&imgtype=0&src=http%3A%2F%2Fstatic.open-open.com%2Fnews%2FuploadImg%2F20160113%2F20160113102614_405.png'/>
                         </Swiper>
                         </View>
                        <Button full  style={modalStyles.btnContainer}
                        onPress={this.props.Closer}>
                            <Text  style={{color:'#000'}}>OK</Text>
                        </Button>
                    </View>
                </View>
            );
        }
}
class ImageItem extends Component{
    render(){
        return (
            <View style={stylesImage.slide}>
                <Image resizeMode='stretch' style={stylesImage.image} source={{uri:this.props.imageurl}} />
                <View style={{position: 'absolute',left:ScreenWidth-50,top:180,backgroundColor:'#545658',height:22,paddingLeft:2,width:40,borderRadius:10}}><Text style={{color:'#fff',paddingLeft:5}}>{this.props.num}/{this.props.sum}</Text></View>
            </View>
        )
    }
}

const stylesImage =StyleSheet.create({
  container: {
    flex: 1
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  image: {
    width:ScreenWidth,
    flex: 1,
    height:210
  }
})
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
const modalStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 40,
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    innerContainer: {
        borderRadius: 10,
        alignItems:'center',
        backgroundColor: '#fff',
    },
    btnContainer:{
        width:ScreenWidth,
        height:46,
        borderRadius: 5,
        backgroundColor:'#eff0f2',
        alignItems:'center',
        paddingTop:8
    },

});




module.exports=Adds;
