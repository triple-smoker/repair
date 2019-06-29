

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    DeviceEventEmitter,
    Dimensions,
    InteractionManager,
    TouchableOpacity,
    ScrollView,
    Modal,
    TextInput,
    Linking,
    ActivityIndicator
} from 'react-native';

import TitleBar from '../../../component/TitleBar';
import * as Dimens from '../../../value/dimens';
import Request, {GetRepairList, RepairDetail, RepPause, DoPause, RepairCommenced} from '../../../http/Request';
import { toastShort } from '../../../util/ToastUtil';
import BaseComponent from '../../../base/BaseComponent'
import Sound from "react-native-sound";
import {getVoicePlayer} from '../../../../components/VoicePlayer'
import Swiper from 'react-native-swiper';
import VideoPlayer from '../../../../components/VideoPlayer';
import Video from 'react-native-video';
import {Content, Accordion, Col, Textarea, Button,} from "native-base";
import AsyncStorage from '@react-native-community/async-storage';
import RNFetchBlob from '../../../../util/RNFetchBlob';

let ScreenWidth = Dimensions.get('window').width;
let ScreenHeight = Dimensions.get('window').height;
let orderStatus = "";
var otherDesc = '';
export default class OrderDetail extends BaseComponent {
    static navigationOptions = {
        header: null,
    };
    constructor(props){
        super(props);
        orderStatus = props.navigation.state.params.status;
        this.state={
            detaiData:null,
            repairId:props.navigation.state.params.repairId,
            repList:[],
            selectIndex:-1,
            modalVisible:false,
            modalPictureVisible:false,
            status:null,
            videoItemRefMap: new Map(), //存储子组件模板节点
            showPause:false
        }
    }

    componentDidMount() {
        var that = this;
        this.eventListener = DeviceEventEmitter.addListener('Event_Refresh_Detail', (param) => {
            console.log('componentDidMount OrderDetail : ' + param);
            that.loadDetail();
        });

        this.loadDetail();
        this.loadRep();
    }


    complete() {
        var that = this;
        console.log('跳到拍照')
        global.from = 'OrderDetail';
        const {navigation} = this.props;
        InteractionManager.runAfterInteractions(() => {
            navigation.navigate('TakePhotos',{
                theme:this.theme,
                title:'完工开始拍照',
                step:2,
                repairId:this.state.repairId})
        });
    }


    takePhotos() {
        global.from = 'OrderDetail';
        const {navigation} = this.props;
        InteractionManager.runAfterInteractions(() => {
            navigation.navigate('TakePhotos',{
                theme:this.theme,
                repairId:this.state.repairId})
        });
    }


    loadDetail() {
        var that = this;
        Request.requestGet(RepairDetail+this.state.repairId, null, (result)=> {
            if (result && result.code === 200) {
                console.log(result)
                that.setState({
                    detaiData:result.data,
                    status:result.data.status
                });
            } else {

            }
        });
    }

    _onSure() {

    }

    addOption() {
        const {navigation} = this.props;
        InteractionManager.runAfterInteractions(() => {
            navigation.navigate('AddOption',{
                theme:this.theme,
                repairId: this.state.repairId})
        });
    }

    materielList() {
        const {navigation} = this.props;
        InteractionManager.runAfterInteractions(() => {
            navigation.navigate('MaterielList',{
                theme:this.theme,
                repairId: this.state.repairId})
        });
    }



    onPressRepItem(data, index) {

        var items = this.state.repList;
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (item.causeId === data.causeId) {
                item.selected = item.selected===0?1:0;
            } else {
                //item.selected = 0;
            }
        }

        this.setState({selectIndex:index, repList:items, showPause:false });
    }

    renderRepItem(data,i) {
        return (
            <Button onPress={()=>{this.onPressRepItem(data, i)}}  style={{borderColor:(this.state.selectIndex===i)?'#7db4dd':'#efefef',backgroundColor:(this.state.selectIndex===i)?'#ddeaf3':'#fff',borderWidth:1,marginRight:15,paddingLeft:15,paddingRight:15,height:30,marginTop:10}}>
                <Text style={{color:(this.state.selectIndex===i)?'#70a1ca':'#a1a1a3'}}>{data.causeCtn}</Text>
            </Button>
        );
    }


    renderMaterialItem(data, i) {
        var that = this;
        return (
            <View key={i}>
                <View style={{backgroundColor:'white', paddingTop:10, paddingBottom:10,flexDirection:'row',textAlignVertical:'center',alignItems:'center',}}>
                    <View style={{marginLeft:15,}}>
                        <Text style={{color:'#333',fontSize:14,}}>{data.materialName}</Text>
                        <Text style={{color:'#999',fontSize:12,}}>规格：{data.spec}；品牌：{data.brand}</Text>
                    </View>
                    <View style={{justifyContent:'flex-end',flexDirection:'row',alignItems:'center', flex:1}}>
                        <Text style={{color:'#333',fontSize:13, width:70, marginLeft:0,marginRight:10,textAlignVertical:'center', textAlign:'center'}}>x{data.qty}</Text>
                        <Text style={{color:'#333',fontSize:13, width:70, marginLeft:0,marginRight:10,textAlignVertical:'center', textAlign:'center'}}>¥{data.unitPrice}</Text>
                    </View>
                </View>
                <View style={{backgroundColor:'#eeeeee',height:1,width:(Dimens.screen_width),}} />
            </View>
        );
    }

    renderPersonItem(data,i) {
        var withSel = Math.round(data.itemPercentage*150/100);
        return (
            <View key={i} style={{backgroundColor:'white', height:60, textAlignVertical:'center',marginLeft:0, marginRight:0, marginTop:6,}}>
                <View style={{flexDirection:'row',justifyContent : 'flex-start',marginLeft:10,marginTop:5, }}>
                    <Text style={{color:'#000',fontSize:14, marginLeft:10,textAlignVertical:'center', width:55}}>{data.assistantName}</Text>
                    <Text style={{color:'#000',fontSize:13, textAlignVertical:'center', width: 140,}}>{data.assistantMobile}</Text>
                    {
                        data.personType == 1 ? <Text style={{color:'#000',fontSize:13, textAlignVertical:'center',}}>主修人</Text> :
                            <Text style={{color:'#000',fontSize:13, textAlignVertical:'center', marginLeft:5,}}> </Text>
                    }

                </View>
                <View style={{flexDirection:'row',marginLeft:10,height:25,textAlignVertical:'center',}}>
                    <Text style={{color:'#999',fontSize:12, }}>维修占比</Text>
                    <View style={{marginLeft:10,marginTop:8,flexDirection:'row',height:3,backgroundColor:'#f0f0f0', width: 150}}>
                        <View style={{flexDirection:'row',height:3,backgroundColor:'#3F9AED', width: withSel}}/>
                    </View>
                    <Text style={{color:'#3F9AED',fontSize:12, marginLeft:10,}}>%{data.itemPercentage}</Text>
                </View>
            </View>

        );
    }

    onPlayVoice(filePath) {

        let voicePlayer = getVoicePlayer();
        voicePlayer.voice(filePath,(result)=>{
            if(result){
                // toastShort('开始播放');
            }else {
                toastShort('语音/视频播放失败');
            }
        })

        // const s = new Sound(filePath, null, (e) => {
        //     if (e) {
        //         toastShort('播放失败');
        //         return;
        //     }
        //
        //     toastShort('开始播放');
        //     s.play(() => s.release());
        // });

    }

    renderIconItem(data,i) {
        if (i === 0) {
            return (<View key={i} style={{backgroundColor:'white',}}>
                    <Image source={require('../../../../res/repair/user_wx.png')} style={{width:30,height:30,marginLeft:15,marginTop:10,}}/>
                </View>
            );
        } else {
            return (<View key={i} style={{backgroundColor:'white',}}>
                    <Image source={require('../../../../res/repair/line_wg.png')} style={{width:2,height:50,marginLeft:29,marginTop:0,}}/>
                    <Image source={require('../../../../res/repair/steps_xzr.png')} style={{width:18,height:18,marginLeft:21,marginTop:0,}}/>
                </View>
            );
        }
    }

    //  图片预览框
    _setModalPictureVisible(){
        this.setState({modalPictureVisible: !this.state.modalPictureVisible})
    }

    //获取VideoPlayer组件模板元素
    onRef = (ref) => {
        this.videoItemRef = ref
        this.appentRefMap(ref.props.num,ref);
        console.info(this.state.videoItemRefMap)
    }

    appentRefMap(index,ref){
        let map = this.state.videoItemRefMap;
        map.set(index,ref);
        this.setState({
            videoItemRefMap: map
        });
    }

    setVideoCurrentTime = (index) => {

        let videoItemRef = this.state.videoItemRefMap.get(index + 1);
        if(videoItemRef){
            videoItemRef.setVideoCurrentTime()
        }
    }

    _renderHeaderShiXiang(item, expanded) {
        var that = this;
        var buttons = null;
        var add = '添加';
        var detaiData = that.state.detaiData;
        if (detaiData && detaiData.itemPersonList && detaiData.itemPersonList.length > 0) {
            add = '重设'
        }
        if(orderStatus === '5'){
            buttons = <TouchableOpacity onPress={()=>this.addOption()}>
                <View style={{backgroundColor:'white',alignItems:'center', flexDirection:"row", marginRight:10,textAlign:'center', paddingLeft:3, paddingRight:3, paddingTop:3, paddingBottom:3,
                    borderBottomRightRadius: 15,borderBottomLeftRadius: 15,borderTopLeftRadius: 15,borderTopRightRadius:15, borderWidth:1, borderColor:'#eee'}}>
                    <Image source={require('../../../../res/repair/btn_ico_tj.png')} style={{width:12,height:12,marginLeft:10, marginRight:10,}}/>
                    <Text style={{color:'#666',fontSize:12,  marginLeft:0,marginRight:10,textAlignVertical:'center'}}>{add}</Text>
                </View>
            </TouchableOpacity>
        }


        return (
            <View style={{
                borderTopWidth:1,
                borderColor:'#fff',
                flexDirection: "row",
                justifyContent:"space-between",
                padding: 10,
                alignItems: "center" ,
                backgroundColor: "#f8f8f8" }}>
                <View style={{flexDirection:"row"}}>
                    {expanded
                        ? <Image style={{ width: 18,height:18 }} source={require('../../../../image/collapse_02.png')} />
                        : <Image style={{ width: 18,height:18 }} source={require('../../../../image/collapse_01.png')} />}
                    <Text style={{color:'#6b6b6b'}}>
                        {" "}{item.title}
                    </Text>
                </View>
                {buttons}
            </View>
        );
    }

    _renderHeaderWuLiao(item, expanded) {
        var that = this;
        var buttons = null;
        var detaiData = that.state.detaiData;
        var add = '添加';
        if (detaiData && detaiData.materialList && detaiData.materialList.length > 0) {
            add = '重设'
        }
        if(orderStatus === '5'){
            buttons = <TouchableOpacity onPress={()=>this.materielList()}>
                <View style={{backgroundColor:'white',alignItems:'center', flexDirection:"row", marginRight:10,textAlign:'center', paddingLeft:3, paddingRight:3, paddingTop:3, paddingBottom:3,
                    borderBottomRightRadius: 15,borderBottomLeftRadius: 15,borderTopLeftRadius: 15,borderTopRightRadius:15, borderWidth:1, borderColor:'#eee'}}>
                    <Image source={require('../../../../res/repair/btn_ico_tj.png')} style={{width:12,height:12,marginLeft:10, marginRight:10,}}/>
                    <Text style={{color:'#666',fontSize:12,  marginLeft:0,marginRight:10,textAlignVertical:'center'}}>{add}</Text>
                </View>
            </TouchableOpacity>
        }
        return (
            <View style={{
                borderTopWidth:1,
                borderColor:'#fff',
                flexDirection: "row",
                justifyContent:"space-between",
                padding: 10,
                alignItems: "center" ,
                backgroundColor: "#f8f8f8" }}>
                <View style={{flexDirection:"row"}}>
                    {expanded
                        ? <Image style={{ width: 18,height:18 }} source={require('../../../../image/collapse_02.png')} />
                        : <Image style={{ width: 18,height:18 }} source={require('../../../../image/collapse_01.png')} />}
                    <Text style={{color:'#6b6b6b'}}>
                        {" "}{item.title}
                    </Text>
                </View>
                {buttons}
            </View>
        );
    }
    _renderHeaderGaiKuang(item, expanded) {
        return (
            <View style={{
                borderTopWidth:1,
                borderColor:'#fff',
                flexDirection: "row",
                justifyContent:"space-between",
                padding: 10,
                alignItems: "center" ,
                backgroundColor: "#f8f8f8" }}>
                <View style={{flexDirection:"row"}}>
                    {expanded
                        ? <Image style={{ width: 18,height:18 }} source={require('../../../../image/collapse_02.png')} />
                        : <Image style={{ width: 18,height:18 }} source={require('../../../../image/collapse_01.png')} />}
                    <Text style={{color:'#6b6b6b'}}>
                        {" "}{item.title}
                    </Text>
                </View>
            </View>
        );
    }

    _renderContent(item) {
        return (
            <Content>
                {item.content}
            </Content>
        );
    }
    arrangeWork(data) {
        console.log("<<<<<")
        console.log(data)
           const {navigation} = this.props;
           InteractionManager.runAfterInteractions(() => {
               navigation.navigate('ArrangeWork',{
                         theme:this.theme,
                         repairId:data.repairId,
                         })
           });
       }
    //接单
    pullOrder(data){
        var responseInfo = {
            repair_id: data.repairId,
            userId: global.userId,
        };
        Axios.PostAxios("/api/repair/service/taken",responseInfo).then(
            (response) => {
                console.log("接单接口:"+response)
                if (response && response.code === 200) {
                    toastShort('接单成功');
                    this.loadDetail();
                }else{
                    toastShort('接单失败');
                }
            }
        );
    } 
    transferOrder(data,typeCode) {
        const {navigation} = this.props;
        InteractionManager.runAfterInteractions(() => {
            navigation.navigate('TransferOrder',{
                     theme:this.theme,
                     typeCode:typeCode,
                     repairId:data.repairId,
            })
        });
    }

    resetOrder(data) {
        var that = this;
        Request.requestGet(CancelPause+data.repairId, null, (result)=> {
            if (result && result.code === 200) {
                toastShort('工单恢复成功');
                that.loadDetail();
            } else {
    
            }
        });
      }
      gotoCommenced(data){
        const {navigation} = this.props;
            InteractionManager.runAfterInteractions(() => {
                    navigation.navigate('TakePhotos',{
                              repairId:data.repairId,
                              title:'维修开始拍照',
                              step:1,
                              theme:this.theme,
                              
                            })
            });
      }  

    render() {
        var detaiData = this.state.detaiData;
        var detailAddress = null;
        var matterName = null;
        var repairNo = null;
        var createTime = null;
        var repairHours = null;
        var repairUserName = null;
        var parentTypeName = null;
        var equipmentName = null;
        var isEquipment = null;
        var telNo = null;
        var statusDesc = null;
        //语音和图片
        var uriImg = null;
        var voiceView = null;
        var i = 0;
        var j = 0;
        var listItems = [];
        var FooterTabItem = null;
        var materialList = <Text style={{textAlignVertical:'center',backgroundColor:'white', color:'#999',fontSize:14, height:50, textAlign:'center',}}>暂无内容</Text>;
        var processList = <Text style={{textAlignVertical:'center',backgroundColor:'white', color:'#999',fontSize:14, height:50, textAlign:'center',}}>暂无内容</Text>;
        if (detaiData) {
            detailAddress = detaiData.detailAddress;
            matterName = detaiData.matterName;
            repairNo = detaiData.repairNo;
            createTime = new Date(detaiData.createTime).format("yyyy-MM-dd hh:mm:ss");

            // if (detaiData.hours.hoursService) {
            //     // maio / 60 /60
            //     var desc = detaiData.hours.hoursService
            //     var hours = null;
            //     hours  = (desc/3600).toFixed(1)
            //     repairHours = hours+'小时';
            // }
            repairHours = detaiData.hours.hoursServiceDesc
            repairUserName = detaiData.ownerName;
            telNo = detaiData.telNo;
            parentTypeName = detaiData.parentTypeName;
            equipmentName = detaiData.equipmentName;
            isEquipment = detaiData.isEquipment;

            if(detaiData.fileMap.imagesRequest && detaiData.fileMap.imagesRequest.length > 0){
                j = detaiData.fileMap.imagesRequest.length;
                i += detaiData.fileMap.imagesRequest.length;
            }
            if(detaiData.fileMap.videosRequest && detaiData.fileMap.videosRequest.length > 0){
                i += detaiData.fileMap.videosRequest.length;
            }



            if(detaiData.fileMap.imagesRequest && detaiData.fileMap.imagesRequest.length > 0){
                listItems =(  detaiData.fileMap.imagesRequest === null ? null : detaiData.fileMap.imagesRequest.map((imageItem, index) =>
                    <View style={stylesImage.slide} key={index}>
                        <Image resizeMode='contain' style={stylesImage.image} source={{uri:imageItem.filePath}} />
                        <View style={{position: 'relative',left:ScreenWidth-70,top:-40,backgroundColor:'#545658',height:22,paddingLeft:2,width:40,borderRadius:10}}><Text style={{color:'#fff',paddingLeft:5}}>{index+1}/{i}</Text></View>
                    </View>
                ))
            }

            if(detaiData.fileMap.videosRequest && detaiData.fileMap.videosRequest.length > 0){
                let videoItems =(  detaiData.fileMap.videosRequest === null ? null : detaiData.fileMap.videosRequest.map((videoItem, index) =>
                    <View style={stylesImage.slide} key={index}>
                        {/* <VideoPlayer  onRef={this.onRef} num={index+1+j} closeVideoPlayer={()=> {this._setModalPictureVisible()}} uri={videoItem.filePath}></VideoPlayer>
                        <View style={{position: 'relative',left:ScreenWidth-70,top:-40,backgroundColor:'#545658',height:22,paddingLeft:2,width:40,borderRadius:10}}><Text style={{color:'#fff',paddingLeft:5}}>{index+1+j}/{i}</Text></View> */}
                        <VideoItem onRef={this.onRef} setModalVisible={()=> {this._setModalPictureVisible()}} num={index+1+j} sum={i} url={videoItem.filePath} fileName={videoItem.fileName} />
                    </View>
                ))
                listItems = listItems.concat(videoItems);
            }

            if((detaiData.fileMap.imagesRequest == null || detaiData.fileMap.imagesRequest.length == 0) && (detaiData.fileMap.videosRequest == null || detaiData.fileMap.videosRequest.length == 0)){
                listItems = <View style={{width:"100%",height:"100%",backgroundColor:'#222',justifyContent:'center',alignItems:"center"}}><Text style={{color:'#666',fontSize:16}}>暂无图片</Text></View>
            }

            if (detaiData.materialList && detaiData.materialList.length > 0) {
                var total = 0;
                for (var i = 0; i < detaiData.materialList.length; i++) {
                    var item = detaiData.materialList[i];
                    total = total + item.unitPrice*item.qty;
                }

                var list = detaiData.materialList.map((item, i)=>this.renderMaterialItem(item, i));
                materialList = <View>
                    <View style={{backgroundColor:'white', flexDirection:'row',textAlignVertical:'center',alignItems:'center',}}>
                        <Text style={{color:'#333',fontSize:14, height:35, textAlignVertical:'center',marginLeft:15,}}>名称</Text>
                        <View style={{justifyContent:'flex-end',flexDirection:'row',alignItems:'center', flex:1}}>
                            <Text style={{color:'#333',fontSize:13, width:80, height:35, marginLeft:0,marginRight:10,textAlignVertical:'center', textAlign:'center'}}>数量</Text>
                            <Text style={{color:'#333',fontSize:13, width:80, height:35, marginLeft:0,marginRight:10,textAlignVertical:'center', textAlign:'center'}}>价格</Text>
                        </View>
                    </View>
                    <View style={{backgroundColor:'#eeeeee',height:1,width:(Dimens.screen_width),}} />
                    {list}
                    <View style={{backgroundColor:'white', paddingTop:5, paddingBottom:5,flexDirection:'row',textAlignVertical:'center',alignItems:'center',}}>
                        <Text style={{color:'#333',fontSize:16,marginLeft:15,}}>合计</Text>
                        <View style={{justifyContent:'flex-end',flexDirection:'row',alignItems:'center', flex:1}}>
                            <Text style={{color:'#EA6060',fontSize:16, width:70, marginLeft:0,marginRight:10,textAlignVertical:'center', textAlign:'center'}}>¥{total}</Text>
                        </View>
                    </View>
                </View>;
            }
           
            if (detaiData.itemPersonList && detaiData.itemPersonList.length > 0) {
               
                var viewList = detaiData.itemPersonList.map((item, i)=>{
                    if(item.assistantId != null){}
                    return this.renderPersonItem(item, i)

                });
                var iconList = detaiData.itemPersonList.map((item, i)=>{
                    if(item.assistantId != null){}
                    return this.renderIconItem(item, i)

                });
                
                processList = <View style={{backgroundColor:'white', paddingTop:10, paddingBottom:10,}}>
                    <Text style={{fontSize:13,color:'#333',marginLeft:10,textAlign:'left', }}>维修类别：{detaiData.parentTypeName}</Text>
                    <Text style={{fontSize:13,color:'#333',marginLeft:10,textAlign:'left', marginBottom:10, }}>维修事项：{detaiData.matterName}</Text>
                    <View style={styles.line} />
                    <View style={{flexDirection:'row',}}>
                        <View style={{backgroundColor:'white',}}>
                            {iconList}
                        </View>
                        <View style={{backgroundColor:'white',}}>
                            {viewList}
                        </View>
                    </View>
                </View>
            }

            var repDatas = null;
            if (this.state.modalVisible) {
                repDatas = this.state.repList.map((item, i)=>this.renderRepItem(item,i));
            }
            //语音和图片
            if (detaiData.fileMap) {
                if (detaiData.fileMap.imagesRequest && detaiData.fileMap.imagesRequest.length > 0) {
                    if(detaiData.fileMap.imagesRequest[0].filePath!=null) {
                        uriImg = <Image source={{uri:detaiData.fileMap.imagesRequest[0].filePath}} style={{width:70,height:70,marginLeft:0, backgroundColor:'#eeeeee'}}/>
                    }
                }else if(detaiData.fileMap.videosRequest && detaiData.fileMap.videosRequest.length > 0){
                    if(detaiData.fileMap.videosRequest[0].filePath!=null){
                        uriImg = <View style={{width: 70, height: 70, backgroundColor:'#000000'}}>
                                    <Image
                                        style={{
                                            position: 'absolute',
                                            top: 18,
                                            left: 18,
                                            width: 36,
                                            height: 36,
                                        }}
                                    source={require('../../../../image/icon_video_play.png')}/>
                               </View>
                   }
                }

                if (detaiData.fileMap.voicesRequest && detaiData.fileMap.voicesRequest.length > 0) {
                    if(detaiData.fileMap.voicesRequest[0].filePath!=null) {
                        var filePath = detaiData.fileMap.voicesRequest[0].filePath;
                        voiceView = <TouchableOpacity onPress={() => {
                            this.onPlayVoice(filePath)
                        }} style={{backgroundColor: 'white'}}>
                            <Image source={require('../../../../image/voice_bf.png')}
                                   style={{width: 25, height: 25, marginRight: 5,}}/>
                        </TouchableOpacity>
                    }
                }
            }
            if(this.state.status){
                var status = this.state.status;
                
                 if(status === '5'){
                    FooterTabItem =  <View style={{backgroundColor:'transparent', flexDirection:'row',textAlignVertical:'center',alignItems:'center',}}>
                        <Text onPress={()=>this.pauseOrder()} style={{textAlignVertical:'center',backgroundColor:'#EFF0F1', color:'#333',fontSize:16, height:49, textAlign:'center', flex:1}}>暂停</Text>
                        <Text onPress={()=>this.complete()} style={{textAlignVertical:'center',backgroundColor:'#98C3C5', color:'#fff',fontSize:16, height:49, textAlign:'center', flex:1}}>完工</Text>
                    </View>
                 }else if(status === '13'){
                    FooterTabItem =  <View style={{backgroundColor:'transparent', flexDirection:'row',textAlignVertical:'center',alignItems:'center',}}>
                        {/* <Text onPress={()=>this.pauseOrder()} style={{textAlignVertical:'center',backgroundColor:'#EFF0F1', color:'#333',fontSize:16, height:49, textAlign:'center', flex:1}}>暂停</Text> */}
                        <Text onPress={()=>this.complete()} style={{textAlignVertical:'center',backgroundColor:'#98C3C5', color:'#fff',fontSize:16, height:49, textAlign:'center', flex:1}}>完工</Text>
                    </View>
                 }else if(status ==='20'){
                    if(global.permissions){
                        FooterTabItem =  <View style={{backgroundColor:'transparent', flexDirection:'row',textAlignVertical:'center',alignItems:'center',}}>
                            <Text onPress={()=>this.arrangeWork(detaiData)} style={{textAlignVertical:'center',backgroundColor:'#EFF0F1', color:'#333',fontSize:16, height:49, textAlign:'center', flex:1}}>派工</Text>
                            <Text onPress={()=>this.pullOrder(detaiData)} style={{textAlignVertical:'center',backgroundColor:'#98C3C5', color:'#fff',fontSize:16, height:49, textAlign:'center', flex:1}}>接单</Text>
                        </View>
                    }else{
                        FooterTabItem =  <View style={{backgroundColor:'transparent', flexDirection:'row',textAlignVertical:'center',alignItems:'center',}}>    
                            <Text onPress={()=>this.pullOrder(detaiData)} style={{textAlignVertical:'center',backgroundColor:'#98C3C5', color:'#fff',fontSize:16, height:49, textAlign:'center', flex:1}}>抢单</Text>
                        </View>
                    }
                 }else if(status === '1'){
                    FooterTabItem =  <View style={{backgroundColor:'transparent', flexDirection:'row',textAlignVertical:'center',alignItems:'center',}}>
                        <Text onPress={()=>this.transferOrder(detaiData,1)} style={{textAlignVertical:'center',backgroundColor:'#EFF0F1', color:'#333',fontSize:16, height:49, textAlign:'center', flex:1}}>拒绝</Text>
                        <Text onPress={()=>this.pullOrder(detaiData)} style={{textAlignVertical:'center',backgroundColor:'#98C3C5', color:'#fff',fontSize:16, height:49, textAlign:'center', flex:1}}>接单</Text>
                    </View>
                 }else if(status === '2' || status === '3'){
                        FooterTabItem =  <View style={{backgroundColor:'transparent', flexDirection:'row',textAlignVertical:'center',alignItems:'center',}}>
                            <Text onPress={()=>this.transferOrder(detaiData,0)} style={{textAlignVertical:'center',backgroundColor:'#EFF0F1', color:'#333',fontSize:16, height:49, textAlign:'center', flex:1}}>转单</Text>
                            <Text onPress={()=>this.gotoCommenced(detaiData)} style={{textAlignVertical:'center',backgroundColor:'#98C3C5', color:'#fff',fontSize:16, height:49, textAlign:'center', flex:1}}>拍照开始维修</Text>
                        </View>
                 }else if(status === '6'){
                        FooterTabItem =  <View style={{backgroundColor:'transparent', flexDirection:'row',textAlignVertical:'center',alignItems:'center',}}>
                            <Text onPress={()=>this.resetOrder(detaiData)} style={{textAlignVertical:'center',backgroundColor:'#EFF0F1', color:'#333',fontSize:16, height:49, textAlign:'center', flex:1}}>恢复</Text>
                            <Text onPress={()=>this.transferOrder(detaiData,0)} style={{textAlignVertical:'center',backgroundColor:'#98C3C5', color:'#fff',fontSize:16, height:49, textAlign:'center', flex:1}}>转单</Text>
                        </View>
                 }
                 
            }
        }



        return (
            <View style={styles.container}>
                <TitleBar
                    centerText={'维修单详情'}
                    isShowLeftBackIcon={true}
                    navigation={this.props.navigation}
                />
                <ScrollView horizontal={false} indicatorStyle={'white'} showsVerticalScrollIndicator={true} style={{height:Dimens.screen_height-40-64, width:Dimens.screen_width,flex:1}}>
                    <Accordion
                        dataArray={[{ title: "概况", content:
                            <View style={{marginLeft:0,backgroundColor:'white',}} >
                                <View style={{flexDirection:'row',paddingLeft:10}} >
                                    {voiceView}
                                    <Text style={{fontSize:14,color:'#333',marginTop:3,}}>报修内容：{matterName}</Text>
                                </View>
                                <View style={{height:1, width:Dimens.screen_width-30, marginTop:5, marginLeft:10, marginRight:10, backgroundColor:'#eeeeee'}}/>
                                <View style={{marginLeft:0, marginTop:10, justifyContent:'center', textAlignVertical:'center', flexDirection:'row',}} >
                                    <TouchableOpacity onPress={()=>{this._setModalPictureVisible()}} >
                                        <View style={{marginLeft:15, textAlignVertical:'center', alignItems:'center',width:70,marginTop:4}} >
                                            {uriImg}
                                        </View>
                                    </TouchableOpacity>
                                    <View style={{marginLeft:10, flex:1}} >
                                        <View style={{marginLeft:0, marginTop:0, flexDirection:'row',}} >
                                            <Text style={{fontSize:12,color:'#999',marginLeft:0,marginTop:3,}}>报修单号：</Text>
                                            <Text style={{fontSize:12,color:'#333',marginLeft:5,marginTop:3,}}>{repairNo}</Text>
                                        </View>
                                        <View style={{marginLeft:0, marginTop:3, flexDirection:'row',}} >
                                            <Text style={{fontSize:12,color:'#999',marginLeft:0,marginTop:0,}}>报修时间：</Text>
                                            <Text style={{fontSize:12,color:'#333',marginLeft:5,marginTop:0,}}>{createTime}</Text>
                                        </View>
                                        <View style={{marginLeft:0, marginTop:3, flexDirection:'row',}} >
                                            <Text style={{fontSize:12,color:'#999',marginLeft:0,marginTop:0,}}>维修时长：</Text>
                                            <Text style={{fontSize:12,color:'#333',marginLeft:5,marginTop:0,}}>{repairHours}</Text>
                                        </View>
                                        <View style={{marginLeft:0, marginTop:3, flexDirection:'row',}} >
                                            <Text style={{fontSize:12,color:'#999',marginLeft:0,marginTop:0,}}>报修位置：</Text>
                                            <Text style={{fontSize:12,color:'#333',marginLeft:5,marginTop:0,}}>{detailAddress}</Text>
                                        </View>
                                        {
                                            isEquipment === 1 && 
                                            <View style={{marginLeft:0, marginTop:3, flexDirection:'row',}} >
                                                <Text style={{fontSize:12,color:'#999',marginLeft:0,marginTop:0,}}>设备名称：</Text>
                                                <Text style={{fontSize:12,color:'#333',marginLeft:5,marginTop:0,}}>{equipmentName}</Text>
                                            </View>
                                        }
                                        <View style={{marginLeft:0, marginTop:3, flexDirection:'row',}} >
                                            <Text style={{fontSize:12,color:'#999',marginLeft:0,marginTop:0,}}>报修人员：</Text>
                                            <Text style={{fontSize:12,color:'#333',marginLeft:5,marginTop:0,}}>{repairUserName}</Text>
                                            <TouchableOpacity onPress={()=>{this.callPhone(telNo)}} style={{marginLeft:5}}>
                                                <Image source={require('../../../../res/repair/list_call.png')} style={{width:20,height:20,}}/>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                                <View style={{height:1, width:Dimens.screen_width, marginTop:10, backgroundColor:'white'}}/>
                            </View>
                        }]}
                        animation={true}
                        expanded={true}
                        renderHeader={this._renderHeaderGaiKuang.bind(this)}
                        renderContent={this._renderContent.bind(this)}
                        expanded={0}
                    />
                    <Accordion
                        dataArray={[{ title: "维修事项", content:processList}]}
                        animation={true}
                        expanded={true}
                        renderHeader={this._renderHeaderShiXiang.bind(this)}
                        renderContent={this._renderContent.bind(this)}
                        expanded={0}
                    />



                    <Accordion
                        dataArray={[{ title: "物料", content:materialList}]}
                        animation={true}
                        expanded={true}
                        renderHeader={this._renderHeaderWuLiao.bind(this)}
                        renderContent={this._renderContent.bind(this)}
                        expanded={0}
                    />

                </ScrollView>
               
                  {FooterTabItem}
                     
                <Modal
                    animationType={"none"}
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {}}
                >
                    <View style={modalStyles.container}>
                        <TouchableOpacity  style={{height:ScreenHeight/2}} onPress={()=>this.cancel()}>
                        </TouchableOpacity>
                        <View style={modalStyles.innerContainer}>
                            <Col style={{width:ScreenWidth-60,borderRadius:10,backgroundColor:'#f8f8f8',padding:10}}>
                                {/*<View  style={{height:35,marginTop:5}}>*/}
                                <Text style={{color:'#a1a1a3'}}>请选择暂停原因</Text>
                                {
                                    this.state.showPause ? <Text style={{color:'red',fontSize:12, height:17, textAlignVertical:'center'}}>暂停原因不能为空</Text> : null
                                }
                                {/*</View>*/}
                                <View style={{flexDirection:'row',flexWrap:'wrap'}}>
                                    {repDatas}
                                </View>
                                <Textarea bordered rowSpan={5} maxLength={150} onChangeText={(text)=>{otherDesc = text}}  placeholder="亲，请输入您暂停的原因..."  style={{width:ScreenWidth-80,height:110,borderRadius:5,backgroundColor:'#fff',marginTop:20}}>
                                {otherDesc}
                            </Textarea>
                                <Button style={{width:60,marginLeft:ScreenWidth-140,alignItems:'center',justifyContent:"center",backgroundColor:'#fff',marginTop:12}}
                                        onPress={()=>this.submit()}>
                                    <Text>确认</Text>
                                </Button>
                            </Col>
                        </View>
                        <TouchableOpacity  style={{height:ScreenHeight/2}} onPress={()=>this.cancel()}>
                        </TouchableOpacity>
                    </View>

                    {/*<View style={styles.modelStyle}>*/}
                        {/*<View style={[styles.popupStyle, {marginTop:(Dimens.screen_height-390)/2,backgroundColor:'#fbfbfb',}]}>*/}
                            {/*<Text style={{fontSize:16,color:'#333',marginLeft:0,marginTop:10,textAlign:'center',width:Dimens.screen_width-80, height:40}}>暂停</Text>*/}
                            {/*<View style={{backgroundColor:'#eeeeee',height:1,width:(Dimens.screen_width-80),}} />*/}
                            {/*<View style={{width:Dimens.screen_width-80, height:300}} >*/}
                                {/*<View  style={{height:35,marginTop:5}}>*/}
                                    {/*<Text style={{color:'#999',fontSize:14, height:17, textAlignVertical:'center',marginLeft:10,}}>请选择暂停原因</Text>*/}
                                    {/*{*/}
                                        {/*this.state.showPause ? <Text style={{color:'red',fontSize:12, height:17, textAlignVertical:'center',paddingLeft:10,}}>暂停原因不能为空</Text> : null*/}
                                    {/*}*/}
                                {/*</View>*/}
                                {/**/}
                                {/*<View style={styles.listViewStyle}>*/}
                                    {/*{repDatas}*/}

                                {/*</View>*/}
                                {/*<TextInput*/}
                                    {/*style={styles.input_style}*/}
                                    {/*placeholder="原因描述…"*/}
                                    {/*placeholderTextColor="#aaaaaa"*/}
                                    {/*underlineColorAndroid="transparent"*/}
                                    {/*multiline = {true}*/}
                                    {/*ref={'otherDesc'}*/}
                                    {/*onChangeText={(text) => {*/}
                                        {/*otherDesc = text;*/}
                                    {/*}}*/}
                                {/*/>*/}
                            {/*</View>*/}
                            {/*<View style={{backgroundColor:'transparent', flexDirection:'row',textAlignVertical:'center',alignItems:'center',}}>*/}
                                {/*<Text onPress={()=>this.cancel()} style={{borderBottomLeftRadius: 15,textAlignVertical:'center',backgroundColor:'#EFF0F1', color:'#333',fontSize:16, height:40, textAlign:'center', flex:1}}>取消</Text>*/}
                                {/*<Text onPress={()=>this.submit()} style={{borderBottomRightRadius: 15,textAlignVertical:'center',backgroundColor:'#E1E4E8', color:'#333',fontSize:16, height:40, textAlign:'center', flex:1}}>确定</Text>*/}
                            {/*</View>*/}
                        {/*</View>*/}
                    {/*</View>*/}
                </Modal>
                <Modal
                    animationType={"slide"}
                    transparent={true}
                    visible={this.state.modalPictureVisible}
                    onRequestClose={() =>this.setState({modalPictureVisible:false})}
                >
                    <View style={stylesImage.container}>
                        <TouchableOpacity  style={{height:ScreenHeight/2}} onPress={() => this.setState({modalPictureVisible:false})}>
                        </TouchableOpacity>
                        <View style={{width:ScreenWidth,height:ScreenHeight,alignItems:'center',backgroundColor:'rgba(0, 0, 0, 0.5)',justifyContent:'center'}}>
                            <Swiper
                                style={{width:ScreenWidth,height:ScreenHeight}}
                                onMomentumScrollEnd={(e, state, context) => (console.log('index:', state.index),this.setVideoCurrentTime(state.index))}
                                dot={<View style={{backgroundColor: 'rgba(0,0,0,0.2)', width: 5, height: 5, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3}} />}
                                activeDot={<View style={{backgroundColor: '#000', width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3}} />}
                                paginationStyle={{
                                    bottom: -23, left: null, right: 10
                                }} loop>
                                {listItems}
                            </Swiper>
                        </View>
                        <TouchableOpacity  style={{height:ScreenHeight/2}} onPress={() => this.setState({modalPictureVisible:false})}>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </View>
        )
    }

    callPhone(num) {
        let url = 'tel: ' + num;
        Linking.canOpenURL(url).then(supported => {
            if (!supported) {
                console.log('Can\'t handle url: ' + url);
            } else {
                return Linking.openURL(url);
            }
        }).catch(err => console.error('An error occurred', err));
    }

    cancel() {
        this.setState({modalVisible:false,showPause:false});
    }



    pauseOrder() {
        this.setState({modalVisible:true});

    }

    submit() {
       
        if (this.state.selectIndex === -1) {
            this.setState({showPause:true});
            // toastShort('请选择暂停原因');
            return;
        }
        this.setState({modalVisible:false});
        var causeIds = [];
        var items = this.state.repList;
        // for (var i = 0; i < items.length; i++) {
        //   var item = items[i];
        //   if (item.selected === 1) {
        //       causeIds.push(item.causeId);
        //   }
        // }

        causeIds.push(items[this.state.selectIndex].causeId);
       
        // var params = new Map();
        // params.set('repairId', this.state.repairId);
        // params.set('remark', otherDesc);
        // params.set('causeIds', causeIds);
        let params = {repairId:this.state.repairId, remark:otherDesc, causeIds:causeIds};
        console.log(params);
        Request.requestPost(DoPause, params, (result)=> {
            if (result && result.code === 200) {
                toastShort('暂停成功');
                this.setState({showPause:false});
                this.props.navigation.state.params.callback();
                this.naviGoBack(this.props.navigation)
            } else {
                toastShort('工单暂停失败，请重新尝试');
            }
        });
    }


    loadRep() {
        var that = this;
        Request.requestGet(RepPause, null, (result)=> {
            if (result && result.code === 200) {
                this.setState({repList: result.data});
            } else {

            }
        });
    }
}

class VideoItem extends Component{

    //获取VideoPlayer组件模板元素
    onRef = (ref) => {
        this.videoPlayerRef = ref;
    }

    componentDidMount(){
        this.props.onRef(this);
    }

    setVideoCurrentTime = (e) =>{
        if(this.videoPlayerRef){
            this.videoPlayerRef.setVideoCurrentTime(0);
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            videoPath: null,
            animating: true
        };
        this.getVideoFilePath(this.props.url,this.props.fileName);
    }

    getVideoFilePath(path,fileName){
        AsyncStorage.getItem('fileVideoCache', function (error,result) {
                if (error) {
                    console.log('读取失败')
                }else {
                    console.log('读取完成')
                    let fileVideo = JSON.parse(result) || {};
                    console.info(fileVideo)
                    if(fileVideo != null && fileVideo[fileName]){
                        this.setState({
                            videoPath : fileVideo[fileName],
                            animating: false
                        })
                    }else{
                        RNFetchBlob.fileVideoCache(path,fileName).then((res) => {
                            fileVideo[fileName] = res.path()
                            //json转成字符串
                            let jsonStr = JSON.stringify(fileVideo);
                            AsyncStorage.setItem('fileVideoCache', jsonStr, function (error) {
                                if (error) {
                                    console.log('存储失败')
                                }else {
                                    console.log('存储完成')
                                }
                            })
                            this.setState({
                                videoPath : res.path(),
                                animating: false
                            })
                        }).catch((error) => {
                            console.info("存储失败" + error)
                        });
                    }
                }
            }.bind(this)
        )
    }

    render(){
        return (
            <View style={stylesImage.slide}>
                {
                    this.state.videoPath == null ? <View style={stylesImage.image}><Loading animating={this.state.animating}/></View>
                    : <VideoPlayer onRef={this.onRef} closeVideoPlayer={()=> {this.props.setModalVisible()}} uri={this.state.videoPath}></VideoPlayer>
                }
                <View style={{position: 'relative',left:ScreenWidth-70,top:-40,backgroundColor:'#545658',height:22,paddingLeft:2,width:40,borderRadius:10}}><Text style={{color:'#fff',paddingLeft:5}}>{this.props.num}/{this.props.sum}</Text></View>
            </View>
        )
    }
}


const Loading = (loading) =>{

  return(
      <View style={loadStyles.wrapper}>
        <View style={loadStyles.box}>
          <ActivityIndicator
            animating={loading.animating}
            color='white'
            size='large'
          />
        </View>
      </View>
  )
}


const loadStyles=StyleSheet.create({
  wrapper:{
    justifyContent:'center',
    alignItems:'center',
    position:'absolute',
    height:Dimensions.get('window').height,
    width:Dimensions.get('window').width,
    zIndex:10,
  },
  box:{
    paddingVertical:12,
    paddingHorizontal:20,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    borderRadius:6
  },
})


const stylesImage =StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    innerContainer: {
        borderRadius: 10,
        alignItems:'center',
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
    image: {
        width:ScreenWidth,
        flex: 1,
    }
})

const styles = StyleSheet.create({
    modelStyle:{
        flex: 1,
        width:Dimens.screen_width,
        height:Dimens.screen_height,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    listViewStyle:{
        // 主轴方向
        flexDirection:'row',
        // 一行显示不下,换一行
        flexWrap:'wrap',
        // 侧轴方向
        alignItems:'center', // 必须设置,否则换行不起作用
        width:Dimens.screen_width-100,
    },
    popupStyle:{
        marginLeft:40,
        width:Dimens.screen_width-80,
        height:390,
        backgroundColor: 'white',
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15,
        borderTopLeftRadius: 15,
        borderTopRightRadius:15,
    },
    input_style:{
        paddingVertical: 0,marginTop:10, textAlignVertical:'top', textAlign:'left',backgroundColor: 'white',fontSize: 14,height:80, marginLeft:15,marginRight:15, paddingLeft:8,paddingRight:8,paddingTop:5,paddingBottom:5,
    },
    container: {
        flex: 1,
        backgroundColor: '#f6f6f6',
    },

    welcome:{
        color:'#123456',

    },
    line:{
        backgroundColor:'#eeeeee',height:1,width:(Dimens.screen_width-15),marginTop:0,marginLeft:15,
    },
    button:{
        width:Dimens.screen_width,
        height:46,
        color:'#ffffff',
        fontSize:18,
        textAlign:'center',
        backgroundColor: '#5ec4c8',
        alignItems:'center',
        justifyContent:'center',
        textAlignVertical:'center',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        alignSelf: 'center'
    },
    images:{
        height:160,
        width: Dimens.screen_width,
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
