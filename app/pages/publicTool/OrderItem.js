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
let ScreenHeight = Dimensions.get('window').height;
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
    _details(){
        Alert.alert("查看详情")
    }
    _cancelOrder(){
        Alert.alert("取消订单")
    }
  render() {
    return (
            <Content style={{backgroundColor:'#fff',marginBottom:8,paddingBottom:10,paddingLeft:16,paddingRight:16}}>
                <View  style={{borderBottomWidth:1,borderColor:'#dfdfdf',paddingBottom:10}}>
                    <Text style={{marginTop:13,fontSize:14}}>报修内容：<Text style={stylesBody.orderContext}>{this.props.record.matterName}</Text></Text>
                </View>
                <Content style={{paddingTop:12}}>
                <TouchableOpacity onPress={()=>this._details()}>
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
                            <Text style={{color:'#e74949',alignItems:'center',marginLeft:10}}>{this.props.record.status===6 ? '暂停中':''}</Text>
                            <Text style={{color:'#e74949',alignItems:'center',marginLeft:10}}>{this.props.record.status===11 ? '已取消':''}</Text>
                            <Text style={{color:'#e74949',alignItems:'center',marginLeft:10}}>{this.props.record.status===10 ? '误报':''}</Text>
                            <Text style={{color:'#6de37e',alignItems:'center',marginLeft:10}}>{this.props.record.status===9 ? '已评价':''}</Text>
                            <Text style={{color:'#f0e292',alignItems:'center',marginLeft:10}}>{this.props.record.status===13 ? '委外':''}</Text>
                        </Col>}
                        <Col>
                            <Row>
                            <Text style={stylesBody.orderContextTip}>报修单号:</Text><Text style={stylesBody.orderContextAut}>{this.props.record.repairNo}</Text>
                            </Row>
                            <Row>
                            <Text style={stylesBody.orderContextTip}>报修时间:</Text><Text style={stylesBody.orderContextAut}>{this.props.record.createTime}</Text>
                            </Row>
                            <Row>
                            <Text style={stylesBody.orderContextTip}>已耗时长:</Text><Text style={stylesBody.orderContextAut}>{this.props.record.hours}</Text>
                            </Row>
                            <Row>
                            <Text style={stylesBody.orderContextTip}>报修位置:</Text><Text style={stylesBody.orderContextAut}>{this.props.record.matterName}</Text>
                            </Row>
                            <Row>
                            <Text style={stylesBody.orderContextTip}>维修人员:</Text><Text style={stylesBody.orderContextAut}>{this.props.record.repairUserName}</Text><Text style={{fontSize:14,color:'#737373',paddingLeft:40}}>{this.props.record.repairUserMobile}</Text>
                            <TouchableHighlight
                                style={{width:20,height:20,backgroundColor:'#fff',marginLeft:20}}
                                onPress={() => Linking.openURL(`tel:${this.props.record.repairUserMobile}`)}>
                                <Image style={{width:20,height:20}} source={require("../../image/list_call.png")}/>
                            </TouchableHighlight>
                            </Row>
                        </Col>
                    </Row>
                </TouchableOpacity>
                    <Content>
                        <Row style={{justifyContent:'flex-end'}}>
                            {(this.props.type===1 || this.props.record.status==='0' || this.props.record.status==='1' || this.props.record.status==='2' || this.props.record.status==='3' || this.props.record.status==='5' || this.props.record.status==='6' || this.props.record.status==='7' || this.props.record.status==='12' || this.props.record.status==='13' )&&
                                <Button
                                bordered
                                style={{borderColor:'#fcb155',height:30,width:60,marginRight:10}}
                                onPress= {()=>this.props.ShowModal(this.props.record.repairId,this.props.record.sendDeptId,this.props.record.sendUserId)}
                                >
                                  <Text style={{color:'#fcb155',fontSize:12}}>催单</Text>
                                </Button>
                            }
                            {(this.props.type===1 || this.props.record.status==='0' || this.props.record.status==='1' || this.props.record.status==='2' || this.props.record.status==='3' || this.props.record.status==='5' || this.props.record.status==='6' || this.props.record.status==='7' || this.props.record.status==='12' || this.props.record.status==='13' )&&
                                <Button bordered
                                    onPress= {()=>this._cancelOrder()}
                                    style={{borderColor:'#ededed',height:30,width:60,marginRight:10}}>
                                  <Text style={{color:'#6b6b6b',fontSize:12}}>取消</Text>
                                </Button>
                            }
                            {(this.props.type===2 || this.props.record.status==='8' )&&
                                <Button
                                bordered
                                style={{borderColor:'#fcb155',height:30,width:60,marginRight:10}}
                                >
                                  <Text style={{color:'#fcb155',fontSize:12}}>评价</Text>
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
                    <TouchableOpacity  style={{height:ScreenHeight/2}} onPress={this.props.Closer}>
                    </TouchableOpacity>
                    <View style={modalStyles.innerContainer}>
                        <View style={{width:ScreenWidth,height:220,backgroundColor:'#fff'}}>
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
                    </View>
                    <TouchableOpacity  style={{height:ScreenHeight/2}} onPress={this.props.Closer}>
                    </TouchableOpacity>
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
