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
    Linking,
    Text,
} from 'react-native';
import {  Item,Input,Button,Icon,ScrollableTab, Tabs, Tab , Col, Row, Container, Content, Header, Left, Body, Right,  List, ListItem, Thumbnail,Textarea} from 'native-base';
import Swiper from 'react-native-swiper';
import axios from 'axios';


let ScreenWidth = Dimensions.get('window').width;
let ScreenHeight = Dimensions.get('window').height;
let dialogWidth = ScreenWidth-80;
class Adds extends Component {//报修单共用组件
    constructor(props) {
       super(props);
       this.state = { modalVisible: false,
              showText: false,
              cancelVisible: false,
              };
    }
    onClose() {
       this.setState({modalVisible: false});
    }
    _setModalVisible() {
      this.setState({modalVisible: !this.state.modalVisible});
    }
    _setCancelVisible() {
      this.setState({cancelVisible: !this.state.cancelVisible});
    }
    _cancelOrder(){
        Alert.alert("取消订单")
    }
    _showText(){
        this.setState({showText: !this.state.showText});
    }
    getLength(imagesRequest){
        if(imagesRequest!=null){
        return imagesRequest.length;
        }else{
        return 0;
        }
    }
    getFirstImage(imagesRequest){
        if(imagesRequest!=null){
        var path = '';
        var i=1;
            imagesRequest.forEach(function(imageItem){
               if(i===1){
               path = imageItem.filePath;
               i=i+1;
               }
            });
        return <Image resizeMode='stretch' style={{width: 70, height: 70}} source={{uri:path}} />;
        }else{
        return <View style={{width: 70, height: 70, backgroundColor:'#c8c8c8'}}/>
        }
    }
  render() {
    return (
            <Content style={{backgroundColor:'#fff',marginBottom:10,paddingBottom:10,paddingLeft:16,paddingRight:16,borderRadius:10}}>
                <View  style={{borderBottomWidth:1,borderColor:'#dfdfdf',paddingBottom:10}}>
                    <Row>
                        <TouchableOpacity style={{width:25}}>
                            <Image style={{marginTop:13,width:20,height:20,paddingRight:5}} source={require("../../image/btn_yy.png")}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={{width:ScreenWidth-55}} onPress={()=>this._showText()}>
                            {this.state.showText==false &&
                            <Text numberOfLines={1}  style={{marginTop:13,fontSize:14,fontWeight:('bold'),color:'#313131'}}>报修内容：<Text style={stylesBody.orderContext}>{this.props.record.matterName}</Text></Text>
                            }
                            {this.state.showText==true &&
                            <Text  style={{marginTop:13,fontSize:14,fontWeight:('bold'),color:'#313131'}}>报修内容：<Text style={stylesBody.orderContext}>{this.props.record.matterName}</Text></Text>
                            }
                        </TouchableOpacity>
                    </Row>
                </View>
                <Content style={{paddingTop:12}}>
                <TouchableOpacity onPress={() => this.props.getEvaluate()}>
                    <Row>
                        {this.props.type!=0 &&
                        <Col style={{width:70,marginRight:17}}>
                            {this.getFirstImage(this.props.record.fileMap.imagesRequest)}
                            <Button transparent style={{position: 'absolute',width:70,height:70}} onPress= {()=>this._setModalVisible()}/>
                            <View style={{position: 'absolute',left:40,top:5,backgroundColor:'#545658',height:20,paddingLeft:8,width:25,borderRadius:10}}><Text style={{color:'#fff'}}>{this.getLength(this.props.record.fileMap.imagesRequest)}</Text></View>
                                {this.props.record.status==='6' &&
                                  <Text style={{color:'#e74949',alignItems:'center',marginLeft:10}}>暂停中</Text>
                                }
                                {this.props.record.status==='11' &&
                                  <Text style={{color:'#e74949',alignItems:'center',marginLeft:10}}>已取消</Text>
                                }
                                {this.props.record.status==='10' &&
                                  <Text style={{color:'#e74949',alignItems:'center',marginLeft:10}}>误报</Text>
                                }
                                {this.props.record.status==='9' &&
                                  <Text style={{color:'#6de37e',alignItems:'center',marginLeft:10}}>已评价</Text>
                                }
                                {this.props.record.status==='13' &&
                                  <Text style={{color:'#f0e292',alignItems:'center',marginLeft:10}}>委外</Text>
                                }
                        </Col>}
                        <Col>
                            <Row>
                            <Text style={stylesBody.orderContextTip}>报修单号:</Text><Text style={stylesBody.orderContextAut}>{this.props.record.repairNo}</Text>
                            </Row>
                            <Row>
                            <Text style={stylesBody.orderContextTip}>报修时间:</Text><Text style={stylesBody.orderContextAut}>{this.props.record.createTime}</Text>
                            </Row>
                            <Row>
                            <Text style={stylesBody.orderContextTip}>已耗时长:</Text><Text style={stylesBody.orderContextAut}>{this.props.record.hours+'小时'}</Text>
                            </Row>
                            <Row>
                            <Text style={stylesBody.orderContextTip}>报修位置:</Text><Text style={stylesBody.orderContextAut}>{this.props.record.detailAddress}</Text>
                            </Row>
                            <Row>
                            <Text style={stylesBody.orderContextTip}>维修人员:</Text><Text style={stylesBody.orderContextAut}>{this.props.record.repairUserName}</Text><Text style={{fontSize:14,color:'#737373',paddingLeft:30}}>{this.props.record.repairUserMobile}</Text>
                            {(this.props.record.repairUserMobile != '' && this.props.record.repairUserMobile!=null) &&
                                <TouchableHighlight
                                    style={{width:20,height:20,backgroundColor:'#fff',marginLeft:20}}
                                    onPress={() => Linking.openURL(`tel:${this.props.record.repairUserMobile}`)}>
                                    <Image style={{width:20,height:20}} source={require("../../image/list_call.png")}/>
                                </TouchableHighlight>
                            }
                            </Row>
                        </Col>
                    </Row>
                </TouchableOpacity>
                    <Content>
                        <Row style={{justifyContent:'flex-end',paddingBottom:1,paddingTop:10}}>
                            {this.props.type!='4' &&(this.props.type===1 || this.props.record.status==='0' || this.props.record.status==='1' || this.props.record.status==='2' || this.props.record.status==='3' || this.props.record.status==='5' || this.props.record.status==='6' || this.props.record.status==='7' || this.props.record.status==='12' || this.props.record.status==='13' )&&
                                <Button
                                bordered
                                style={{borderColor:'#fcb155',height:30,width:60,marginRight:10,justifyContent:'center',alignItems:'center'}}
                                onPress= {()=>this.props.ShowModal(this.props.record.repairId,this.props.record.sendDeptId,this.props.record.sendUserId)}
                                >
                                  <Text style={{color:'#fcb155',fontSize:12}}>催单</Text>
                                </Button>
                            }
                            {this.props.type!='4' &&(this.props.type===1 || this.props.record.status==='0' || this.props.record.status==='1' || this.props.record.status==='2' || this.props.record.status==='3' || this.props.record.status==='5' || this.props.record.status==='6' || this.props.record.status==='7' || this.props.record.status==='12' || this.props.record.status==='13' )&&
                                <Button bordered
                                    onPress= {()=>this._setCancelVisible()}
                                    style={{borderColor:'#ededed',height:30,width:60,marginRight:10,justifyContent:'center',alignItems:'center'}}>
                                  <Text style={{color:'#6b6b6b',fontSize:12}}>取消</Text>
                                </Button>
                            }
                            {this.props.type!='4' &&(this.props.type===2 || this.props.record.status==='8' )&&
                                <Button
                                bordered
                                onPress={() => this.props.getEvaluate()}
                                style={{borderColor:'#fcb155',height:30,width:60,marginRight:10,justifyContent:'center',alignItems:'center'}}
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
                        <PictureMd Closer = {() => this._setModalVisible()} imagesRequest={this.props.record.fileMap.imagesRequest} />
                        </Modal>
                        <Modal
                            animationType={"slide"}
                            transparent={true}
                            visible={this.state.cancelVisible}
                            onRequestClose={() => {
                                       alert("Modal has been closed.");
                                     }}
                        >
                        <CancelMd Closer = {() => this._setCancelVisible()} record={this.props.record}/>
                        </Modal>

                    </Content>
                </Content>
            </Content>

    );
  }
}

class PictureMd extends Component {

    getImageItem(imagesRequest){
        var i = imagesRequest.length;
        let listItems =(  imagesRequest === null ? null : imagesRequest.map((imageItem, index) =>
            <ImageItem num={index+1} sum={i}  imageurl={imageItem.filePath} key={index}/>
        ))
        return listItems;
    }

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
                           {this.getImageItem(this.props.imagesRequest)}
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

class CancelMd extends Component {

    constructor(props) {
       super(props);
       this.state = {
              causeList:[],
              reMark:'',
              };
       var   url="http://47.102.197.221:8188/api/admin/sysCause/list/REP_CANCEL";
           axios({
               method: 'GET',
               url: url,
               data: null,
               headers:{
                    'x-tenant-key':'Uf2k7ooB77T16lMO4eEkRg==',
                    'rcId':'1055390940066893827',
                    'Authorization':'5583be92-9de4-42cd-86c0-e704cba0fed6',
               }
           }).then(
               (response) => {
                    var causeList = response.data.data;
                    var causeListTemp = [];
                    causeList.forEach(function(cause){
                    let newCause = {causeCtn:cause.causeCtn,causeId:cause.causeId,showType:false};
                    causeListTemp.push(newCause);
                   });
                    this.setState({causeList:causeListTemp})
               }
           ).catch((error)=> {
               console.log(error)
           });
    }
    changeCause(visible){
        var causeList = [];
        causeList = this.state.causeList;
        causeList.forEach(function(cause){
            if(cause.causeId == visible.causeId){
                cause.showType=!cause.showType;
            }
        });
        this.setState({causeList:causeList});
    }

    _getCauseItem(){
        var causeList = [];
        causeList = this.state.causeList;
        let listItems =(  causeList === null ? null : causeList.map((cause, index) =>
            <Button key={index} onPress={()=>this.changeCause(cause)}  style={{borderColor:(cause.showType===false)?'#efefef':'#7db4dd',backgroundColor:(cause.showType===false)?'#fff':'#ddeaf3',borderWidth:1,marginRight:15,paddingLeft:15,paddingRight:15,height:30,marginTop:12}}>
                <Text style={{color:(cause.showType===false)?'#a1a1a3':'#70a1ca'}}>{cause.causeCtn}</Text>
            </Button>
        ))
        return listItems;
    }
    _setRemark(remark){
        this.setState({reMark:remark});
    }
    pushCancel(record){
       var   url="https://dev.jxing.com.cn/api/repair/request/misinform";
       var causeList = this.state.causeList;
       var causeIds = [];
        causeList.forEach(function(cause){
            if(cause.showType===true){
            causeIds.push(cause.causeId);
            }
        })
        console.log("取消ID：");
        console.log(record.repairId);
       var data ={
                 repairId: record.repairId,
                 userId : "1601500545875394402",
                 remark:this.state.reMark,
                 causeIds:causeIds,
                 }
           axios({
               method: 'POST',
               url: url,
               data: data,
               headers:{
                    'Content-type':'application/json',
                    'x-tenant-key':'Uf2k7ooB77T16lMO4eEkRg==',
                    'hospitalId':'1055390940066893827',
                    'Authorization':'5583be92-9de4-42cd-86c0-e704cba0fed6',
               }
           }).then(
               (response) => {
               console.log(response);
                    Alert.alert("取消成功");
               }
           ).catch((error)=> {
               console.log(error)
           });
    }

        render(){
            return (
                <View style={modalStyles.container}>
                    <TouchableOpacity  style={{height:ScreenHeight/2}} onPress={this.props.Closer}>
                    </TouchableOpacity>
                    <View style={modalStyles.innerContainer}>
                        <Col style={{width:ScreenWidth-60,borderRadius:10,backgroundColor:'#f8f8f8',padding:10}}>
                            <Text style={{color:'#a1a1a3'}}>请选择取消原因</Text>
                            <View style={{flexDirection:'row',flexWrap:'wrap'}}>
                                {this._getCauseItem()}
                            </View>
                            <Textarea bordered rowSpan={5} maxLength={150} onChangeText={(remark)=>{this.setState({reMark:remark})}}  placeholder="亲，请输入您取消的原因..."  style={{width:ScreenWidth-80,height:110,borderRadius:5,backgroundColor:'#fff',marginTop:20}}>
                                {this.state.reMark}
                            </Textarea>
                            <Button style={{width:60,marginLeft:ScreenWidth-140,alignItems:'center',justifyContent:"center",backgroundColor:'#fff',marginTop:12}}
                                onPress={()=>{this.props.Closer(),this.pushCancel(this.props.record)}}>
                                <Text>确认</Text>
                            </Button>
                         </Col>
                    </View>
                    <TouchableOpacity  style={{height:ScreenHeight/2}} onPress={this.props.Closer}>
                    </TouchableOpacity>
                </View>
            );
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
        color:'#737373',
        fontWeight:('normal')
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

const causeStyle =StyleSheet.create({
  causeBtn: {
    width:'30%',
    height:35,
    borderRadius:10,
    backgroundColor:'#fff',
    borderColor: '#c2c2c2',
    marginRight:"3.33%",
    marginTop:13
  },
  causeBtnPro: {
    width:'30%',
    height:35,
    borderRadius:10,
    backgroundColor:'#e1f0fd',
    borderColor:'#50a9ef',
    marginRight:"3.33%",
    marginTop:13
  },
})




module.exports=Adds;
