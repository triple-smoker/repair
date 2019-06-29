

import React, { Component } from 'react';
import {
    View,
    Text,
    BackAndroid,
    TouchableOpacity,
    Image,
    StyleSheet,
    InteractionManager,
    TextInput,
    Platform,
    ToastAndroid,
    ListView,
    Modal,
    DeviceEventEmitter,
    Linking, Dimensions,
    ActivityIndicator
} from 'react-native';


import BaseComponent from '../../base/BaseComponent'
import * as Dimens from '../../value/dimens';
import ArrangeWork from '../repair/ArrangeWork';
import TransferOrder from '../repair/TransferOrder';
import OrderDetail from '../repair/detail/OrderDetail';
import Request, {GetRepairList, GetUserInfo, CancelPause, RepPause, DoPause} from '../../http/Request';

import RefreshListView from '../../component/RefreshListView'
import TakePhotos from '../repair/detail/TakePhotos';
import { toastShort } from '../../util/ToastUtil';
import HistoryDetail from '../repair/HistoryDetail';
import Swiper from 'react-native-swiper';
import VideoPlayer from '../../../components/VideoPlayer';
import Video from 'react-native-video';
import AsyncStorage from '@react-native-community/async-storage';
import RNFetchBlob from '../../../util/RNFetchBlob';
import {Button, Col, Textarea} from "native-base";

let cachedResults = {
  nextPage: 1, // 下一页
  items: [], // listview 数据(视频列表)
  total: 0, // 总数
  pages:0,
  tabIndex:1,
  typeIndex:0,
};

var keyword = '';
var otherDesc = '';
let ScreenWidth = Dimensions.get('window').width;
let ScreenHeight = Dimensions.get('window').height;
export default class SearchOrder extends BaseComponent {
  static navigationOptions = {
    header: null,
  };
 constructor(props){
    super(props);
    this.state={
      wordList:[],
      repairId:'',
      selectIndex:-1,
      repList:[],
      modalVisible:false,
      modalTypeVisible:false,
      modalPictureVisible:false,
      theme:this.props.theme,
      searchKey:'',
      showPause:false,
      dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2)=> {
            if (r1 !== r2) {
                //console.log("不相等=");
                //console.log(r1);
            } else {
                console.log("相等=");
                //console.log(r1);
                //console.log(r2);
            }
            return true//r1.isSelected !== r2.isSelected;
        }
      }),
      isLoadingTail: false, // loading?
      isRefreshing: false, // refresh?
      videoItemRefMap: new Map(), //存储子组件模板节点
      isScan: props.navigation.state.params.isScan,
      equipmentId: props.navigation.state.params.equipmentId,
    }
  }


  componentDidMount() {

      //this._fetchData(0);
      this.loadRep();

  }

  submit() {
      var that = this;
        if (this.state.selectIndex === -1) {
          this.setState({showPause:true});
            // toastShort('请选择暂停原因');
            return;
        }

      var causeIds = [];
      var items = this.state.repList;
        causeIds.push(items[this.state.selectIndex].causeId);
        this.setState({modalVisible:false});
        let params = {repairId:this.state.repairId, remark:otherDesc, causeIds:causeIds};
        console.log(params);
        Request.requestPost(DoPause, params, (result)=> {
            if (result && result.code === 200) {
              toastShort('工单暂停成功');
                this.setState({showPause:false})
              that._fetchData(0);
            } else {
                toastShort('暂停失败，请重新重试');
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

  _fetchData(page) {
    var that = this;

    if (page !== 0) { // 加载更多操作
      this.setState({
        isLoadingTail: true
      });

      cachedResults.nextPage = page;
    } else { // 刷新操作
      this.setState({
        isRefreshing: true
      });
      // 初始 nextPage
      cachedResults.nextPage = 1;
    }

     var params = new Map();
     params.set('page', cachedResults.nextPage);
     params.set('limit', '20');
     params.set('repairDeptId', global.uinfo.deptAddresses[0].deptId);
     params.set('status', '1,2,3,5,6,8,9,10,11,20');
     if (cachedResults.typeIndex === 0) {
        params.set('ownerName', this.state.searchKey);
     } else if (cachedResults.typeIndex === 1) {
        params.set('repairUserName', this.state.searchKey);
     } else if (cachedResults.typeIndex === 2) {
        params.set('matterName', this.state.searchKey);
     }

    if(this.state.isScan == true){
      params.set('equipmentId', this.state.equipmentId);
    }

    Request.requestGetWithKey(GetRepairList, params, (result, key)=> {
        if (key !== cachedResults.tabIndex)return;
        if (result && result.code === 200) {
          let items = cachedResults.items.slice();
          if (result.data.current !== 1) { // 加载更多操作
            // 数组拼接
            if (result.data&&result.data.records) {//&& result.data.records.length > 0
                items = items.concat(result.data.records);
                cachedResults.total = result.data.total;
                cachedResults.pages = result.data.pages;
                cachedResults.nextPage = result.data.current+1;
            } else {

            }

          } else { // 刷新操作
            if (result.data&&result.data.records) {
                items = result.data.records;
                cachedResults.total = result.data.total;
                cachedResults.pages = result.data.pages;
                cachedResults.nextPage = result.data.current+1;
            } else {

            }
          }

          cachedResults.items = items;

          if (page !== 0) { // 加载更多操作
              that.setState({
                isLoadingTail: false,
                isRefreshing: false,
                dataSource: that.state.dataSource.cloneWithRows(cachedResults.items)
              });
            } else { // 刷次操作
              that.setState({
                isLoadingTail: false,
                isRefreshing: false,
                dataSource: that.state.dataSource.cloneWithRows(cachedResults.items)
              });
            }
        } else {
          if (page !== 0) { // 上拉加载更多操作
            this.setState({
              isRefreshing: false,
              isLoadingTail: false,
            });
        } else {
            this.setState({ // 刷新操作
              isRefreshing: false,
              isLoadingTail: false,
            });
        }
        }
    }, cachedResults.tabIndex);
  }

  onBack() {

    const {navigation} = this.props;
    //.getCurrentRoutes().length)
    console.log( navigation);
    this.naviGoBack(navigation);
  }


  onPressWordItem(data, index) {


  }

  renderWordItem(data, i) {
      return (<Text key={i} onPress={()=>{this.onPressWordItem(data, i)}} style={{flexWrap:'nowrap', marginLeft:10,
              color:'#333333',fontSize:11, height:35, marginTop:10,
              textAlignVertical:'center', textAlign:'center',borderWidth:0, backgroundColor:'#f0f0f0',
                borderBottomRightRadius:17.5,borderBottomLeftRadius:17.5,borderTopLeftRadius:17.5,borderTopRightRadius:17.5, paddingLeft:10, paddingRight:10}}>{data}</Text>
    );
  }


  onClear() {
    this.setState({wordList:[], });
  }

  onPressItem(data,_fetchData){
    if (data.status === '8') {
        this.gotoHistory(data);
    } else if (data.status === '9') {
        this.gotoHistory(data);
    }  else if (data.status === '10') {
        this.gotoHistory(data);
    }  else if (data.status === '11') {
        this.gotoHistory(data);
    }  else if (data.status === '20') {
        this.gotoHistory(data);
    } else {
      this.gotoDetail(data,(page)=>_fetchData(page));
    }
  }


 gotoHistory(data) {
    const {navigation} = this.props;
        InteractionManager.runAfterInteractions(() => {
                // navigator.push({
                //     component: HistoryDetail,
                //     name: 'HistoryDetail',
                //     params:{
                //         theme:this.theme,
                //         repairId:data.repairId,
                //     }
                // });
                navigation.navigate('HistoryDetail',{
                      theme:this.theme,
                      repairId:data.repairId,
                })
        });
 }

 pauseOrder(data) {
    this.setState({modalVisible:true,repairId:data.repairId});
 }

  gotoDetail(data,_fetchData) {
    const {navigation} = this.props;
        InteractionManager.runAfterInteractions(() => {
                // navigator.push({
                //     component: OrderDetail,
                //     name: 'OrderDetail',
                //     params:{
                //         repairId:data.repairId,
                //         theme:this.theme,
                //     }
                // });
                navigation.navigate('OrderDetail',{
                        repairId:data.repairId,
                        theme:this.theme,
                        callback: (
                            () => {
                                setTimeout(function(){
                                    _fetchData(0);
                                },100)
                            }
                        ),
                })
        });
  }


  resetOrder(data) {
    var that = this;
    Request.requestGet(CancelPause+data.repairId, null, (result)=> {
        if (result && result.code === 200) {
            toastShort('工单恢复成功');
            that._fetchData(0);
        } else {

        }
    });
  }

  finishOrder(data) {
        global.from = 'SearchOrder';
        const {navigation} = this.props;
        InteractionManager.runAfterInteractions(() => {
                // navigator.push({
                //     component: TakePhotos,
                //     name: 'TakePhotos',
                //     params:{
                //         repairId:data.repairId,
                //         theme:this.theme
                //     }
                // });
                navigation.navigate('TakePhotos',{
                        repairId:data.repairId,
                        theme:this.theme
                })
        });

  }

  _renderSeparatorView(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
    return (
      <View key={`${sectionID}-${rowID}`} style={styles.separator} />
    );
  }

    //  图片预览框
    _setModalPictureVisible(data) {
        if((data.fileMap.imagesRequest && data.fileMap.imagesRequest.length > 0) || (data.fileMap.videosRequest && data.fileMap.videosRequest.length > 0 )){
            this.setState({modalPictureVisible: !this.state.modalPictureVisible,imagesRequest:data.fileMap.imagesRequest,videosRequest:data.fileMap.videosRequest})
        }else{
            this.setState({modalPictureVisible: !this.state.modalPictureVisible})
        }

    }

  renderItem(data) {
    var that = this;
    let buttons = null;
    let statusDesc = null;
    if (data.statusDesc) {
          statusDesc = <Text style={{fontSize:12,color:'#909399',marginLeft:0,marginTop:5,textAlign:'center', paddingLeft:7, paddingRight:7, paddingTop:3, paddingBottom:3,
                    borderBottomRightRadius: 5,borderBottomLeftRadius: 5,borderTopLeftRadius: 5,borderTopRightRadius:5,backgroundColor:'#f0f0f0'}}>{data.statusDesc}</Text>

    }
    if (data.status === '1') {

        buttons = <View style={{height:30, width:Dimens.screen_width, marginTop:10, backgroundColor:'white', flexDirection:'row',justifyContent:'flex-end',}}><Text style={{ fontSize:13,color:'#FBA234',marginRight:15,textAlign:'center', paddingLeft:7, paddingRight:7, paddingTop:3, paddingBottom:3,
                    borderBottomRightRadius: 5,borderBottomLeftRadius: 5,borderTopLeftRadius: 5,borderTopRightRadius:5, borderWidth:1, borderColor:'#FBA234'}}>接单</Text>
                    <Text onPress={()=>this.transferOrder(data)} style={{ fontSize:13,color:'#666666',marginRight:15,textAlign:'center', paddingLeft:7, paddingRight:7, paddingTop:3, paddingBottom:3,
                    borderBottomRightRadius: 5,borderBottomLeftRadius: 5,borderTopLeftRadius: 5,borderTopRightRadius:5, borderWidth:1, borderColor:'#666666'}}>转单</Text></View>
        if (this.state.tabIndex === 0) {
                    buttons = <View style={{height:30, width:Dimens.screen_width, marginTop:10, backgroundColor:'white', flexDirection:'row',justifyContent:'flex-end',}}>
                    <Text style={{ fontSize:13,color:'#FBA234',marginRight:15,textAlign:'center', paddingLeft:7, paddingRight:7, paddingTop:3, paddingBottom:3,
                    borderBottomRightRadius: 5,borderBottomLeftRadius: 5,borderTopLeftRadius: 5,borderTopRightRadius:5, borderWidth:1, borderColor:'#FBA234'}}>接单</Text>
                    <Text onPress={()=>this.transferOrder(data)} style={{ fontSize:13,color:'#666666',marginRight:15,textAlign:'center', paddingLeft:7, paddingRight:7, paddingTop:3, paddingBottom:3,
                    borderBottomRightRadius: 5,borderBottomLeftRadius: 5,borderTopLeftRadius: 5,borderTopRightRadius:5, borderWidth:1, borderColor:'#666666'}}>转单</Text>
                    <Text onPress={()=>this.arrangeWork(data)} style={{ fontSize:13,color:'#666666',marginRight:15,textAlign:'center', paddingLeft:7, paddingRight:7, paddingTop:3, paddingBottom:3,
                    borderBottomRightRadius: 5,borderBottomLeftRadius: 5,borderTopLeftRadius: 5,borderTopRightRadius:5, borderWidth:1, borderColor:'#666666'}}>派工</Text></View>
        }

    } else if (data.status === '2') {
      buttons = <View style={{height:30, width:Dimens.screen_width, marginTop:10, backgroundColor:'white', flexDirection:'row',justifyContent:'flex-end',}}><Text style={{ fontSize:13,color:'#FBA234',marginRight:15,textAlign:'center', paddingLeft:7, paddingRight:7, paddingTop:3, paddingBottom:3,
                    borderBottomRightRadius: 5,borderBottomLeftRadius: 5,borderTopLeftRadius: 5,borderTopRightRadius:5, borderWidth:1, borderColor:'#FBA234'}}>接单</Text>
                    <Text onPress={()=>this.transferOrder(data)} style={{ fontSize:13,color:'#666666',marginRight:15,textAlign:'center', paddingLeft:7, paddingRight:7, paddingTop:3, paddingBottom:3,
                    borderBottomRightRadius: 5,borderBottomLeftRadius: 5,borderTopLeftRadius: 5,borderTopRightRadius:5, borderWidth:1, borderColor:'#666666'}}>转单</Text></View>
    } else if (data.status === '3') {

      buttons = <View style={{height:30, width:Dimens.screen_width, marginTop:10, backgroundColor:'white', flexDirection:'row',justifyContent:'flex-end',}}>
                    <Text onPress={()=>this.gotoDetail(data)}  style={{ fontSize:13,color:'#FBA234',marginRight:15,textAlign:'center', paddingLeft:7, paddingRight:7, paddingTop:3, paddingBottom:3,
                    borderBottomRightRadius: 5,borderBottomLeftRadius: 5,borderTopLeftRadius: 5,borderTopRightRadius:5, borderWidth:1, borderColor:'#FBA234'}}>拍照开始维修</Text>
                    <Text onPress={()=>this.transferOrder(data)} style={{ fontSize:13,color:'#666666',marginRight:15,textAlign:'center', paddingLeft:7, paddingRight:7, paddingTop:3, paddingBottom:3,
                    borderBottomRightRadius: 5,borderBottomLeftRadius: 5,borderTopLeftRadius: 5,borderTopRightRadius:5, borderWidth:1, borderColor:'#666666'}}>转单</Text></View>
    } else if (data.status === '4') {

    } else if (data.status === '5') {

      buttons = <View style={{height:30, width:Dimens.screen_width, marginTop:10, backgroundColor:'white', flexDirection:'row',justifyContent:'flex-end',}}>
                    <Text onPress={()=>this.finishOrder(data)} style={{ fontSize:13,color:'#FBA234',marginRight:15,textAlign:'center', paddingLeft:7, paddingRight:7, paddingTop:3, paddingBottom:3,
                    borderBottomRightRadius: 5,borderBottomLeftRadius: 5,borderTopLeftRadius: 5,borderTopRightRadius:5, borderWidth:1, borderColor:'#FBA234'}}>完工</Text>
                    <Text onPress={()=>this.pauseOrder(data)} style={{ fontSize:13,color:'#666666',marginRight:15,textAlign:'center', paddingLeft:7, paddingRight:7, paddingTop:3, paddingBottom:3,
                    borderBottomRightRadius: 5,borderBottomLeftRadius: 5,borderTopLeftRadius: 5,borderTopRightRadius:5, borderWidth:1, borderColor:'#666666'}}>暂停</Text>
                    <Text onPress={()=>this.transferOrder(data)} style={{ fontSize:13,color:'#666666',marginRight:15,textAlign:'center', paddingLeft:7, paddingRight:7, paddingTop:3, paddingBottom:3,
                    borderBottomRightRadius: 5,borderBottomLeftRadius: 5,borderTopLeftRadius: 5,borderTopRightRadius:5, borderWidth:1, borderColor:'#666666'}}>转单</Text></View>
    } else if (data.status === '6') {

      buttons = <View style={{height:30, width:Dimens.screen_width, marginTop:10, backgroundColor:'white', flexDirection:'row',justifyContent:'flex-end',}}>
                    <Text onPress={()=>this.resetOrder(data)} style={{ fontSize:13,color:'#666666',marginRight:15,textAlign:'center', paddingLeft:7, paddingRight:7, paddingTop:3, paddingBottom:3,
                    borderBottomRightRadius: 5,borderBottomLeftRadius: 5,borderTopLeftRadius: 5,borderTopRightRadius:5, borderWidth:1, borderColor:'#666666'}}>恢复</Text>
                    <Text onPress={()=>this.transferOrder(data)} style={{ fontSize:13,color:'#666666',marginRight:15,textAlign:'center', paddingLeft:7, paddingRight:7, paddingTop:3, paddingBottom:3,
                    borderBottomRightRadius: 5,borderBottomLeftRadius: 5,borderTopLeftRadius: 5,borderTopRightRadius:5, borderWidth:1, borderColor:'#666666'}}>转单</Text></View>
    } else if (data.status === '7') {

      buttons = <View style={{height:30, width:Dimens.screen_width, marginTop:10, backgroundColor:'white', flexDirection:'row',justifyContent:'flex-end',}}>
                    <Text style={{ fontSize:13,color:'#FBA234',marginRight:15,textAlign:'center', paddingLeft:7, paddingRight:7, paddingTop:3, paddingBottom:3,
                    borderBottomRightRadius: 5,borderBottomLeftRadius: 5,borderTopLeftRadius: 5,borderTopRightRadius:5, borderWidth:1, borderColor:'#FBA234'}}>接单</Text>
                    <Text onPress={()=>this.transferOrder(data)} style={{ fontSize:13,color:'#666666',marginRight:15,textAlign:'center', paddingLeft:7, paddingRight:7, paddingTop:3, paddingBottom:3,
                    borderBottomRightRadius: 5,borderBottomLeftRadius: 5,borderTopLeftRadius: 5,borderTopRightRadius:5, borderWidth:1, borderColor:'#666666'}}>转单</Text></View>
    }

    if (this.state.tabIndex === 2) {
      //statusDesc = null;
      buttons = null;
    }

    var uriImg = null;
    var voiceView = null;
      if (data.fileMap) {
          if (data.fileMap.imagesRequest && data.fileMap.imagesRequest.length > 0) {
              if(data.fileMap.imagesRequest[0].filePath!=null){
                  uriImg = <Image source={{uri:data.fileMap.imagesRequest[0].filePath}} style={{width:70,height:70,marginLeft:0, backgroundColor:'#eeeeee'}}/>
              }
          }else if(data.fileMap.videosRequest && data.fileMap.videosRequest.length > 0){
              if(data.fileMap.videosRequest[0].filePath!=null){
                uriImg = <View style={{width: 70, height: 70, backgroundColor:'#000000'}}>
                            <Image 
                                style={{
                                    position: 'absolute',
                                    top: 18,
                                    left: 18,
                                    width: 36,
                                    height: 36,
                                }} 
                            source={require('../../../image/icon_video_play.png')}/>
                      </View>
              }
          }

          if (data.fileMap.voicesRequest && data.fileMap.voicesRequest.length > 0) {
              if(data.fileMap.voicesRequest[0].filePath!=null){
                  var filePath = data.fileMap.voicesRequest[0].filePath;
                  voiceView = <TouchableOpacity onPress={()=>{that.onPlayVoice(filePath)}} style={{backgroundColor:'white'}}>
                      <Image source={require('../../../res/repair/btn_voice.png')} style={{width:25,height:25,marginRight:5, }}/>
                  </TouchableOpacity>
              }
          }
      }

    return (
      <TouchableOpacity onPress={()=>{that.onPressItem(data,(page)=>this._fetchData(page))}} style={{flex:1, backgroundColor:'white'}}>
          <View style={{marginLeft:0,}} >
              <View style={{flexDirection:'row',}} >
                <Text style={{fontSize:14,color:'#333',marginLeft:15,marginTop:3,}}>报修内容：{data.matterName}</Text>
                {voiceView}
              </View>
              <View style={{height:1, width:Dimens.screen_width-30, marginTop:5, marginLeft:15, marginRight:15, backgroundColor:'#eeeeee'}}/>
              <View style={{marginLeft:0, marginTop:10, justifyContent:'center', textAlignVertical:'center', flexDirection:'row',alignItems:'center',}} >
              <TouchableOpacity onPress={()=>{this._setModalPictureVisible(data)}} >
                  <View style={{marginLeft:15, justifyContent:'center', textAlignVertical:'center', alignItems:'center',width:70,}} >
                    {uriImg}
                    {statusDesc}
                  </View>
              </TouchableOpacity>
                <View style={{marginLeft:15, flex:1}} >
                    <View style={{marginLeft:0, marginTop:0, flexDirection:'row',}} >
                        <Text style={{fontSize:13,color:'#999',marginLeft:0,marginTop:3,}}>报修单号：</Text>
                        <Text style={{fontSize:13,color:'#333',marginLeft:5,marginTop:3,width:'60%'}}>{data.repairNo}</Text>
                    </View>
                    <View style={{marginLeft:0, marginTop:3, flexDirection:'row',}} >
                        <Text style={{fontSize:13,color:'#999',marginLeft:0,marginTop:0,}}>报修时间：</Text>
                        <Text style={{fontSize:13,color:'#333',marginLeft:5,marginTop:0,width:'60%'}}>{new Date(data.createTime).format("yyyy-MM-dd hh:mm:ss")}</Text>
                    </View>
                    <View style={{marginLeft:0, marginTop:3, flexDirection:'row',}} >
                        <Text style={{fontSize:13,color:'#999',marginLeft:0,marginTop:0,}}>已耗时长：</Text>
                        <Text style={{fontSize:13,color:'#333',marginLeft:5,marginTop:0,width:'60%'}}>{data.hours}小时</Text>
                    </View>
                    <View style={{marginLeft:0, marginTop:3, flexDirection:'row',}} >
                        <Text style={{fontSize:13,color:'#999',marginLeft:0,marginTop:0,}}>报修位置: </Text>
                        <Text style={{fontSize:13,color:'#333',marginLeft:5,marginTop:0,width:'60%'}}>{data.detailAddress}</Text>
                    </View>
                    {
                      data.isEquipment === 1 && 
                      <View style={{marginLeft:0, marginTop:3, flexDirection:'row',}} >
                          <Text style={{fontSize:13,color:'#999',marginLeft:0,marginTop:0,}}>设备名称：</Text>
                          <Text style={{fontSize:13,color:'#333',marginLeft:5,marginTop:0,width:'60%'}}>{data.equipmentName}</Text>
                      </View>
                    }
                    <View style={{marginLeft:0, marginTop:3, flexDirection:'row',}} >
                        <Text style={{fontSize:13,color:'#999',marginLeft:0,marginTop:0,}}>报修人员：</Text>
                        <Text style={{fontSize:13,color:'#333',marginLeft:5,marginTop:0,}}>{data.ownerName}   {data.telNo}</Text>
                        <TouchableOpacity onPress={()=>{that.callPhone(data.telNo)}} style={{marginLeft:10}}>
                            <Image source={require('../../../res/repair/list_call.png')} style={{width:20,height:20,}}/>
                        </TouchableOpacity>
                    </View>
                </View>
              </View>

              {buttons}

              <View style={{height:8, width:Dimens.screen_width, marginTop:10, backgroundColor:'#f8f8f8'}}/>
          </View>

      </TouchableOpacity>
    );
  }

  onPlayVoice(filePath) {
    const s = new Sound(filePath, null, (e) => {
                if (e) {
                     toastShort('语音/视频播放失败');
                    return;
                }

                // toastShort('开始播放');
                s.play(() => s.release());
      });

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


   arrangeWork(data) {
        const {navigation} = this.props;
        InteractionManager.runAfterInteractions(() => {
            // navigator.push({
            //     component: ArrangeWork,
            //     name: 'ArrangeWork',
            //     params:{
            //         theme:this.theme,
            //         repairId:data.repairId
            //     }
            // });
            navigation.navigate('ArrangeWork',{
                    heme:this.theme,
                    repairId:data.repairId
            })
        });
    }

   transferOrder(data) {
        const {navigation} = this.props;
        InteractionManager.runAfterInteractions(() => {
            // navigator.push({
            //     component: TransferOrder,
            //     name: 'TransferOrder',
            //     params:{
            //         theme:this.theme,
            //         repairId:data.repairId
            //     }
            // });
            navigation.navigate('TransferOrder',{
              heme:this.theme,
              repairId:data.repairId
            })
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


  //获取VideoPlayer组件模板元素
  onRef = (ref) => {
    this.videoItemRef = ref
    this.appentRefMap(ref.props.num,ref);
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
        videoItemRef.setVideoCurrentTime();
    }
  }

  render() {
    var repDatas = null;
    if (this.state.modalVisible) {
        repDatas = this.state.repList.map((item, i)=>this.renderRepItem(item,i));
    }

      var i = 0;
      var j = 0;
      var listItems = [];

      if(this.state.imagesRequest != null && this.state.imagesRequest.length > 0){
          j = this.state.imagesRequest.length;
          i += this.state.imagesRequest.length;
      }
      if(this.state.videosRequest != null && this.state.videosRequest.length > 0){
          i += this.state.videosRequest.length;
      }


      if(this.state.imagesRequest && this.state.imagesRequest.length > 0){
          listItems =(  this.state.imagesRequest === null ? null : this.state.imagesRequest.map((imageItem, index) =>
              <View style={stylesImage.slide} key={index}>
                  <Image resizeMode='contain' style={stylesImage.image} num={index+1} source={{uri:imageItem.filePath}} />
                  <View style={{position: 'relative',left:ScreenWidth-70,top:-40,backgroundColor:'#545658',height:22,paddingLeft:2,width:40,borderRadius:10}}><Text style={{color:'#fff',paddingLeft:5}}>{index+1}/{i}</Text></View>
              </View>
          ))
      }

      if(this.state.videosRequest && this.state.videosRequest.length > 0){
        let videoItems =(  this.state.videosRequest === null ? null : this.state.videosRequest.map((videoItem, index) =>
          <View style={stylesImage.slide} key={index}>
              <VideoItem onRef={this.onRef} setModalVisible={()=> {this.setState({modalPictureVisible:false})}} num={index+1+j} sum={i} url={videoItem.filePath} fileName={videoItem.fileName} />
          </View>
        ))
        listItems = listItems.concat(videoItems);
      }

      if((this.state.imagesRequest == null || this.state.imagesRequest.length == 0) && (this.state.videosRequest == null || this.state.videosRequest.length == 0)){
          listItems = <View style={{width:"100%",height:"100%",backgroundColor:'#222',justifyContent:'center',alignItems:"center"}}><Text style={{color:'#666',fontSize:16}}>暂无图片</Text></View>
      }

    var typeName = '';
    if (cachedResults.typeIndex === 0) {
        typeName = '报修人';
     } else if (cachedResults.typeIndex === 1) {
        typeName = '维修人';
     } else if (cachedResults.typeIndex === 2) {
        typeName = '内容';
     }

    var contentView = null;
    if (cachedResults.items.length) {
        contentView = <RefreshListView
          style={{flex:1, width:Dimens.screen_width,height:Dimens.screen_height-44}}
          onEndReachedThreshold={10}
          dataSource={this.state.dataSource}
          renderRow={this.renderItem.bind(this)}
          renderSeparator={this._renderSeparatorView.bind(this)}
          isRefreshing={this.state.isRefreshing}
          isLoadingTail={this.state.isLoadingTail}
          fetchData={this._fetchData.bind(this)}
          cachedResults={cachedResults}
          ref={component => this._listView = component}
      />
    } else {
      var list = this.state.wordList.map((item, i)=>this.renderWordItem(item,i));
      contentView = <View style={{flex:1}}>
                      <View style={{marginTop:10,justifyContent:'space-between', width:Dimens.screen_width,flexDirection:'row', }}>
                          <Text style={{color:'#999999',fontSize:12,marginLeft:15,marginRight:10,}}>最近搜索</Text>
                          <TouchableOpacity onPress={ ()=> {this.onClear()} }>
                            <Image style={{marginRight:10, height:16,width:15}} source={require('../../../res/repair/ico_del.png')}/>
                          </TouchableOpacity>

                      </View>
                      <View style={styles.listViewStyle}>
                        {list}
                      </View>
                    </View>
    }

    return (
      <View style={styles.container}>

        <View style={{height:44,backgroundColor:'white',justifyContent:'center', textAlignVertical:'center', flexDirection:'row',alignItems:'center', marginLeft:0, marginRight:0, marginTop:0,}}>
          <TouchableOpacity onPress={ ()=> {this.onBack()} }>
                <View style={{alignItems: 'center', width: 30,}}>
                    <Image
                        style={styles.rightImage}
                        source={require('../../../res/login/navbar_ico_back.png')}/>

                </View>
            </TouchableOpacity>
          <TouchableOpacity onPress={()=>this.search()} style={{flex:1,height:30, marginLeft:10, marginRight:0,}}>
            <View style={{flex:1, height:30,backgroundColor:'#f0f0f0',justifyContent:'center', flexDirection:'row',alignItems:'center', marginLeft:0, marginRight:10,
              borderBottomRightRadius: 15,borderBottomLeftRadius: 15,borderTopLeftRadius: 15,borderTopRightRadius: 15,}}>
            <Text onPress={()=>this.popType()} style={{color:'#666',fontSize:12,marginLeft:10,marginRight:0,}}>{typeName}</Text>
            <Image source={require('../../../res/repair/ico_seh.png')} style={{width:16,height:16,marginLeft:10}}/>
            <TextInput style={{color:'#333',fontSize:14,marginLeft:5, flex:1, height:40, textAlignVertical:'center'}}
                placeholder="请输入单号或内容" placeholderTextColor="#aaaaaa" underlineColorAndroid="transparent" numberOfLines={1}
                onChangeText={(text) => {
                    keyword = text;
                    this.setState({searchKey:text});
                    console.log(text);
                }}/>

            </View>
          </TouchableOpacity>
          <Text onPress={()=>this.search()} style={{color:'#666',fontSize:14,marginLeft:5,marginRight:10,}}>搜索</Text>
        </View>
        <View style={styles.line} />

        {contentView}

      <Modal
            animationType={"none"}
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {}}
        >

        {/*<View style={styles.modelStyle}>*/}
            {/*<View style={[styles.popupStyle, {marginTop:(Dimens.screen_height-390)/2,backgroundColor:'#fbfbfb',}]}>*/}
                {/*<Text style={{fontSize:16,color:'#333',marginLeft:0,marginTop:10,textAlign:'center',width:Dimens.screen_width-80, height:40}}>暂停</Text>*/}
                {/*<View style={{backgroundColor:'#eeeeee',height:1,width:(Dimens.screen_width-80),}} />*/}
                {/*<View style={{width:Dimens.screen_width-80, height:300}} >*/}
                {/*<Text style={{color:'#999',fontSize:14, height:40, textAlignVertical:'center',paddingLeft:10,}}>请选择暂停原因</Text>*/}
                {/*{*/}
                    {/*this.state.showPause ? <Text style={{color:'red',fontSize:12, height:20, textAlignVertical:'center',paddingLeft:10,}}>暂停原因不能为空</Text> : <Text style={{height:20}}></Text>*/}
                {/*}*/}
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
    </Modal>
      <Modal
            animationType={"none"}
            transparent={true}
            visible={this.state.modalTypeVisible}
            onRequestClose={() => {}}
        >

        <View style={styles.modelStyle}>
            <View style={[styles.popupStyle1, {marginTop:(Dimens.screen_height-170)/2,backgroundColor:'#fbfbfb',}]}>
                <Text style={{fontSize:16,color:'#333',marginLeft:0,marginTop:10,textAlign:'center',width:Dimens.screen_width-80, height:40}}>请选择搜索条件</Text>
                <View style={{backgroundColor:'#eeeeee',height:1,width:(Dimens.screen_width-80),}} />
                <Text onPress={()=>this.onChangeType(0)} style={{alignItems:'center',justifyContent:'center',textAlignVertical:'center',fontSize:14,color:'#333',marginLeft:0,textAlign:'center',marginTop:0,width:Dimens.screen_width-80, height:40}}>报修人姓名</Text>
                <View style={{backgroundColor:'#eeeeee',height:1,width:(Dimens.screen_width-80),}} />
                <Text onPress={()=>this.onChangeType(1)} style={{alignItems:'center',justifyContent:'center',textAlignVertical:'center',fontSize:14,color:'#333',marginLeft:0,textAlign:'center',marginTop:0,width:Dimens.screen_width-80, height:40}}>维修人姓名</Text>
                <View style={{backgroundColor:'#eeeeee',height:1,width:(Dimens.screen_width-80),}} />
                <Text onPress={()=>this.onChangeType(2)} style={{alignItems:'center',justifyContent:'center',textAlignVertical:'center',fontSize:14,color:'#333',marginLeft:0,textAlign:'center',marginTop:0,width:Dimens.screen_width-80, height:40}}>报修内容</Text>

            </View>
        </View>
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

popType() {
  this.setState({modalTypeVisible:true, });
}

onChangeType(index) {
  this.setState({modalTypeVisible:false, });
  cachedResults.typeIndex = index;
}

    cancel() {
      this.setState({modalVisible:false,showPause:false});
    }

    search() {

        var word = this.state.searchKey;
        if (word === '') {
          toastShort('请输入关键字');
          return;
        }

        var pos = -1;
        var wordList = this.state.wordList;
        for (var i = 0; i < wordList.length; i++) {
          if (word === wordList[i]) {
            pos = i;
            break;
          }
        }

        if (pos === -1) {
          wordList.push(word);
        }

        //keyword = '';
        //this.setState({searchKey:''});
        this.setState({wordList:wordList});

        this._fetchData(0);

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
        width:Dimens.screen_width-20,
    },
    popupStyle:{
        marginLeft:40,
        width:Dimens.screen_width-80,
        height:390,
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15,
        borderTopLeftRadius: 15,
        borderTopRightRadius:15,
        backgroundColor: 'white',
    },
    popupStyle1:{
        marginLeft:40,
        width:Dimens.screen_width-80,
        height:174,
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15,
        borderTopLeftRadius: 15,
        borderTopRightRadius:15,
        backgroundColor: 'white',
    },
    container: {
      flex: 1,
      backgroundColor: '#f8f8f8',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    },

    buttonTop:{
      width:35,
      height:35,
      alignItems:'center',
      justifyContent:'center',
      textAlignVertical:'center',
      position: 'absolute',
      bottom: 70+49,
      right: 30,
      alignSelf: 'center'
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
    line:{
      backgroundColor:'#eeeeee',height:1,width:(Dimens.screen_width),marginTop:0,marginLeft:0,
    },
    separator: {
       height: 1,
       backgroundColor: '#f6f6f6'
    },
    input_style:{
        paddingVertical: 0,marginTop:10, textAlignVertical:'top', textAlign:'left',backgroundColor: 'white',fontSize: 14,height:80, marginLeft:15,marginRight:15, paddingLeft:8,paddingRight:8,paddingTop:5,paddingBottom:5,
    },
    rightImage: {
        width: 9,
        height: 20,
    },
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