

import React, { Component } from 'react';
import {
    View,
    Text,
    BackAndroid,
    TouchableOpacity,
    Image,
    StyleSheet,
    InteractionManager,
    Platform,
    ListView,
    Modal,
    DeviceEventEmitter,
    Linking,
    Alert, Dimensions,
} from 'react-native';


import BaseComponent from '../../base/BaseComponent'
import * as Dimens from '../../value/dimens';
// import OrderDetail from '../repair/detail/OrderDetail';
import Request, {GetRepairList, GetUserInfo, CancelPause, RepPause, DoPause} from '../../http/Request';

import RefreshListView from '../../component/RefreshListView'
import TakePhotos from '../repair/detail/TakePhotos';
import { toastShort } from '../../util/ToastUtil';
import {getVoicePlayer} from '../../../components/VoicePlayer'
import Axios from "../../../util/Axios";
import Swiper from 'react-native-swiper';
import VideoPreview from '../../../components/VideoPreview';
import {Button, Col, Row, Content, Textarea} from 'native-base';

let cachedResults = {
  nextPage: 1, // 下一页
  items: [], // listview 数据(视频列表)
  total: 0, // 总数
  pages:0,
  tabIndex:0,
  timeIndex: 0,
};

var otherDesc = '';
let ScreenWidth = Dimensions.get('window').width;
let ScreenHeight = Dimensions.get('window').height;
export default class WorkPage extends BaseComponent {
 constructor(props){
    super(props);
    this.state={
      repairId:'',
      selectIndex:-1,
      repList:[],
      modalVisible:false,
      modalPictureVisible:false,
      imagesRequest:[],
      videosRequest:[],
      videoItemRefMap: new Map(), //存储子组件模板节点
      timeIndex: 0,
      tabIndex: 0,
      theme:this.props.theme,
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
      isRefreshing: false // refresh?
    }
  }


  componentDidMount() {
      console.log('OrderList  componentDidMount');
      cachedResults.tabIndex = 0;
      this.setState({tabIndex:0});
      this._fetchData(0);
      this.loadRep();
      DeviceEventEmitter.emit('NAVIGATOR_ACTION', false);
      //DeviceEventEmitter.emit('ACTION_BASE_', "_onLogin_", null);

      //DeviceEventEmitter.emit('Event_Home', 'Event_Home');
  }
  componentWillReceiveProps(){
    // console.log(nextProps)
    // if(nextProps.navigation.state != this.props.navigation.state){
      this.setState({tabIndex:0});
      cachedResults.tabIndex = 0;
        this._fetchData(0);
    // }
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
      // for (var i = 0; i < items.length; i++) {
      //   var item = items[i];
      //   if (item.selected === 1) {
      //       causeIds.push(item.causeId);
      //   }
      // }

        causeIds.push(items[this.state.selectIndex].causeId);
        this.setState({modalVisible:false});
        // var params = new Map();
        // params.set('repairId', this.state.repairId);
        // params.set('remark', otherDesc);
        // params.set('causeIds', causeIds);
        let params = {repairId:this.state.repairId, remark:otherDesc, causeIds:causeIds};
        console.log(params);
        Request.requestPost(DoPause, params, (result)=> {
            if (result && result.code === 200) {
              toastShort('工单暂停成功');
                this.setState({showPause:false})
              that._fetchData(0);
            } else {
                toastShort('暂停失败，请重试');
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


// formatDate(date) {
//     var myyear = date.getFullYear();
//     var mymonth = date.getMonth() + 1;
//     var myweekday = date.getDate();
//     if (mymonth < 10) {
//         mymonth = "0" + mymonth;
//     }

//     if (myweekday < 10) {
//         myweekday = "0" + myweekday;
//     }

//     return (''+myyear + mymonth + myweekday);
// }

  _fetchData(page) {
     if(global.permissions === "3"){
         return ;
     }
     console.log('WP : _fetchData')
     console.log(this.state)
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
      // 初始哈 nextPage
      cachedResults.nextPage = 1;
    }

    var params = new Map();
     params.set('page', cachedResults.nextPage);
     params.set('limit', '20');
     //let params = null;
     if (cachedResults.tabIndex === 1) {
        //params = {page:cachedResults.nextPage, limit:'20', status:'1,2,3,5,6', repairUserId: global.uinfo.userId};
        params.set('status', '1,2,3,5,6,13');
        params.set('repairUserId', global.uinfo.userId);
     } else if (cachedResults.tabIndex === 0) {
        //params = {page:cachedResults.nextPage, limit:'20', status:'1,2,3,5,6', repairDeptId: global.uinfo.deptAddresses[0].deptId};
        params.set('repairDeptId', global.uinfo.deptAddresses[0].deptId);
        params.set('status', '13,20');
    } else if (cachedResults.tabIndex === 2) {
        params.set('repairDeptId', global.uinfo.deptAddresses[0].deptId);
        params.set('status', '8,9,10,11');
        var now = new Date();
        var year  = now.getFullYear();       //年
        var month = now.getMonth() + 1;     //月
        var day   = now.getDate();            //日
        var nowDayOfWeek = now.getDay(); //今天本周的第几天

        //params = {page:cachedResults.nextPage, limit:'20', repairDeptId: global.uinfo.deptAddresses[0].deptId};
        var strMonth = ''+month;
        if (month<10) {
          strMonth = '0'+month;
        }

        var strDay = ''+day;
        if (day<10) {
          strDay = '0'+day;
        }

        var today = '' + year + strMonth + strDay;
        if (cachedResults.timeIndex === 0) {
          //params = {page:cachedResults.nextPage, limit:'20', repairDeptId: global.uinfo.deptAddresses[0].deptId, beginCreate:today, endCreate:today, };
           params.set('beginCreate', today);
           params.set('endCreate', today);
        } else if (cachedResults.timeIndex === 1) {
          var weekStartDate = new Date(year, month, day - nowDayOfWeek);
          //var beginDay = this.formatDate(weekStartDate);

          var myyear = weekStartDate.getFullYear();
          var mymonth = weekStartDate.getMonth();
          var myweekday = weekStartDate.getDate();
          if (mymonth < 10) {
              mymonth = '0' + mymonth;
          }

          if (myweekday < 10) {
              myweekday = '0' + myweekday;
          }

          var beginDay = ''+myyear + mymonth + myweekday;
          //params = {page:cachedResults.nextPage, limit:'20', repairDeptId: global.uinfo.deptAddresses[0].deptId, beginCreate:beginDay, endCreate:today, };

           params.set('beginCreate', beginDay);
           params.set('endCreate', today);
        } else if (cachedResults.timeIndex === 2) {
          var beginDay = '' + year + strMonth + '01';

          //params = {page:cachedResults.nextPage, limit:'20', repairDeptId: global.uinfo.deptAddresses[0].deptId, beginCreate:beginDay, endCreate:today, };
          params.set('beginCreate', beginDay);
           params.set('endCreate', today);
        }
    }

    if(this.props.isScan == true){
      params.set('equipmentId', this.props.equipmentId);
    }
    console.log(params);

    Request.requestGetWithKey(GetRepairList, params, (result, key)=> {
        if (key !== cachedResults.tabIndex)return;
        if (result && result.code === 200) {
          var items = [];
          cachedResults.total = 0;
          if (result.data.current&&result.data.current !== 1) { // 加载更多操作
            items = cachedResults.items.slice();
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

          cachedResults.items = items; // 视频列表数据

          //this.setState({dataSource:this.state.dataSource.cloneWithRows(result.data.records), dataList:result.data.records});
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

  _onSure() {
    alert('确定');
  }



  _renderSeparatorView(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
    return (
      <View key={`${sectionID}-${rowID}`} style={styles.separator} />
    );
  }

  onPressItem(data,_fetchData){
    //ok
      if (this.state.tabIndex === 2) {
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
                                    repairId:data.repairId,})
        });

      } else if (this.state.tabIndex === 1) {
        this.gotoDetail(data,(page)=>_fetchData(page));
      } else if (this.state.tabIndex === 0) {
        this.gotoDetail(data,(page)=>_fetchData(page));
      }
  }
  gotoCommenced(data){
    const {navigation} = this.props;
        InteractionManager.runAfterInteractions(() => {
                navigation.navigate('TakePhotos',{
                          repairId:data.repairId,
                          title:'维修开始拍照',
                          step:1,
                          theme:this.theme,
                          callback:(()=>{
                            this._fetchData(0)
                          })
                        })
        });
  }

  gotoDetail(data,_fetchData) {
    const {navigation} = this.props;
        InteractionManager.runAfterInteractions(() => {
                navigation.navigate('OrderDetail',{
                          repairId:data.repairId,
                          status:data.status,
                          theme:this.theme,
                          isScan: this.props.isScan,
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
        global.from = 'MainPage';
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
                          theme:this.theme,})
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
                    this._fetchData(0);
                }else{
                    toastShort('接单失败');
                }
            }
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
   
    if (data.status === '1') {

        buttons = <View style={{height:30, width:Dimens.screen_width, marginTop:10, backgroundColor:'white', flexDirection:'row',justifyContent:'flex-end',}}>
                    <Text onPress={()=>this.pullOrder(data)} style={{ fontSize:13,color:'#FBA234',marginRight:15,textAlign:'center',textAlignVertical:"center", paddingLeft:7, paddingRight:7, paddingTop:3, paddingBottom:3,
                    borderBottomRightRadius: 5,borderBottomLeftRadius: 5,borderTopLeftRadius: 5,borderTopRightRadius:5, borderWidth:1, borderColor:'#FBA234'}}>接单</Text>
                    <Text onPress={()=>this.transferOrder(data,0,(num)=>this._fetchData(num))} style={{ fontSize:13,color:'#666666',marginRight:15,textAlign:'center',textAlignVertical:"center", paddingLeft:7, paddingRight:7, paddingTop:3, paddingBottom:3,
                    borderBottomRightRadius: 5,borderBottomLeftRadius: 5,borderTopLeftRadius: 5,borderTopRightRadius:5, borderWidth:1, borderColor:'#666666'}}>转单</Text>
                    <Text onPress={()=>this.transferOrder(data,1,(num)=>this._fetchData(num))} style={{ fontSize:13,color:'#666666',marginRight:15,textAlign:'center',textAlignVertical:"center", paddingLeft:7, paddingRight:7, paddingTop:3, paddingBottom:3,
                    borderBottomRightRadius: 5,borderBottomLeftRadius: 5,borderTopLeftRadius: 5,borderTopRightRadius:5, borderWidth:1, borderColor:'#666666'}}>不接单</Text>
        </View>
    } else if (data.status === '2') {

      buttons = <View style={{height:30, width:Dimens.screen_width, marginTop:10, backgroundColor:'white', flexDirection:'row',justifyContent:'flex-end',}}>
                    <Text onPress={()=>this.gotoCommenced(data)}  style={{ fontSize:13,color:'#FBA234',marginRight:15,textAlign:'center',textAlignVertical:"center", paddingLeft:7, paddingRight:7, paddingTop:3, paddingBottom:3,
                    borderBottomRightRadius: 5,borderBottomLeftRadius: 5,borderTopLeftRadius: 5,borderTopRightRadius:5, borderWidth:1, borderColor:'#FBA234'}}>拍照开始维修</Text>
                    <Text onPress={()=>this.transferOrder(data,0,(num)=>this._fetchData(num))} style={{ fontSize:13,color:'#666666',marginRight:15,textAlign:'center',textAlignVertical:"center", paddingLeft:7, paddingRight:7, paddingTop:3, paddingBottom:3,
                    borderBottomRightRadius: 5,borderBottomLeftRadius: 5,borderTopLeftRadius: 5,borderTopRightRadius:5, borderWidth:1, borderColor:'#666666'}}>转单</Text></View>
    } else if (data.status === '3') {

      buttons = <View style={{height:30, width:Dimens.screen_width, marginTop:10, backgroundColor:'white', flexDirection:'row',justifyContent:'flex-end',}}>
                    <Text onPress={()=>this.gotoCommenced(data)}  style={{ fontSize:13,color:'#FBA234',marginRight:15,textAlign:'center',textAlignVertical:"center", paddingLeft:7, paddingRight:7, paddingTop:3, paddingBottom:3,
                    borderBottomRightRadius: 5,borderBottomLeftRadius: 5,borderTopLeftRadius: 5,borderTopRightRadius:5, borderWidth:1, borderColor:'#FBA234'}}>拍照开始维修</Text>
                    <Text onPress={()=>this.transferOrder(data,0,(num)=>this._fetchData(num))} style={{ fontSize:13,color:'#666666',marginRight:15,textAlign:'center',textAlignVertical:"center", paddingLeft:7, paddingRight:7, paddingTop:3, paddingBottom:3,
                    borderBottomRightRadius: 5,borderBottomLeftRadius: 5,borderTopLeftRadius: 5,borderTopRightRadius:5, borderWidth:1, borderColor:'#666666'}}>转单</Text></View>
    } else if (data.status === '4') {

    } else if (data.status === '5') {

      buttons = <View style={{height:30, width:Dimens.screen_width, marginTop:10, backgroundColor:'white', flexDirection:'row',justifyContent:'flex-end',}}>
                    <Text onPress={()=>this.onPressItem(data,(page)=>this._fetchData(page))} style={{ fontSize:13,color:'#FBA234',marginRight:15,textAlign:'center',textAlignVertical:"center", paddingLeft:7, paddingRight:7, paddingTop:3, paddingBottom:3,
                    borderBottomRightRadius: 5,borderBottomLeftRadius: 5,borderTopLeftRadius: 5,borderTopRightRadius:5, borderWidth:1, borderColor:'#FBA234'}}>完工</Text>
                    <Text onPress={()=>this.pauseOrder(data)} style={{ fontSize:13,color:'#666666',marginRight:15,textAlign:'center',textAlignVertical:"center", paddingLeft:7, paddingRight:7, paddingTop:3, paddingBottom:3,
                    borderBottomRightRadius: 5,borderBottomLeftRadius: 5,borderTopLeftRadius: 5,borderTopRightRadius:5, borderWidth:1, borderColor:'#666666'}}>暂停</Text>
                    <Text onPress={()=>this.transferOrder(data,0,(num)=>this._fetchData(num))} style={{ fontSize:13,color:'#666666',marginRight:15,textAlign:'center',textAlignVertical:"center", paddingLeft:7, paddingRight:7, paddingTop:3, paddingBottom:3,
                    borderBottomRightRadius: 5,borderBottomLeftRadius: 5,borderTopLeftRadius: 5,borderTopRightRadius:5, borderWidth:1, borderColor:'#666666'}}>转单</Text></View>
    } else if (data.status === '6') {

      buttons = <View style={{height:30, width:Dimens.screen_width, marginTop:10, backgroundColor:'white', flexDirection:'row',justifyContent:'flex-end',}}>
                    <Text onPress={()=>this.resetOrder(data)} style={{ fontSize:13,color:'#666666',marginRight:15,textAlign:'center',textAlignVertical:"center", paddingLeft:7, paddingRight:7, paddingTop:3, paddingBottom:3,
                    borderBottomRightRadius: 5,borderBottomLeftRadius: 5,borderTopLeftRadius: 5,borderTopRightRadius:5, borderWidth:1, borderColor:'#666666'}}>恢复</Text>
                    <Text onPress={()=>this.transferOrder(data,0,(num)=>this._fetchData(num))} style={{ fontSize:13,color:'#666666',marginRight:15,textAlign:'center',textAlignVertical:"center", paddingLeft:7, paddingRight:7, paddingTop:3, paddingBottom:3,
                    borderBottomRightRadius: 5,borderBottomLeftRadius: 5,borderTopLeftRadius: 5,borderTopRightRadius:5, borderWidth:1, borderColor:'#666666'}}>转单</Text></View>
    } else if (data.status === '13' && global.permissions==="1") {

      buttons = <View style={{height:30, width:Dimens.screen_width, marginTop:10, backgroundColor:'white', flexDirection:'row',justifyContent:'flex-end',}}>
                    <Text onPress={()=>this.onPressItem(data,(page)=>this._fetchData(page))} style={{ fontSize:13,color:'#FBA234',marginRight:15,textAlign:'center',textAlignVertical:"center", paddingLeft:7, paddingRight:7, paddingTop:3, paddingBottom:3,
                    borderBottomRightRadius: 5,borderBottomLeftRadius: 5,borderTopLeftRadius: 5,borderTopRightRadius:5, borderWidth:1, borderColor:'#FBA234'}}>完工</Text>
                </View>
    }
     else if (data.status === '20') {
        if(global.permissions==="1"){
            buttons = <View style={{height:30, width:Dimens.screen_width, marginTop:10, backgroundColor:'white', flexDirection:'row',justifyContent:'flex-end',}}>
                <Text onPress={()=>this.pullOrder(data)} style={{ fontSize:13,color:'#FBA234',marginRight:15,textAlign:'center',textAlignVertical:"center", paddingLeft:7, paddingRight:7, paddingTop:3, paddingBottom:3,
                    borderBottomRightRadius: 5,borderBottomLeftRadius: 5,borderTopLeftRadius: 5,borderTopRightRadius:5, borderWidth:1, borderColor:'#FBA234'}}>接单</Text>
                <Text onPress={()=>this.transferOrder(data,0,(num)=>this._fetchData(num))} style={{ fontSize:13,color:'#666666',marginRight:15,textAlign:'center',textAlignVertical:"center", paddingLeft:7, paddingRight:7, paddingTop:3, paddingBottom:3,
                    borderBottomRightRadius: 5,borderBottomLeftRadius: 5,borderTopLeftRadius: 5,borderTopRightRadius:5, borderWidth:1, borderColor:'#666666'}}>转单</Text>
                <Text onPress={()=>this.arrangeWork(data,(num)=>this._fetchData(num))} style={{ fontSize:13,color:'#666666',marginRight:15,textAlign:'center',textAlignVertical:"center", paddingLeft:7, paddingRight:7, paddingTop:3, paddingBottom:3,
                    borderBottomRightRadius: 5,borderBottomLeftRadius: 5,borderTopLeftRadius: 5,borderTopRightRadius:5, borderWidth:1, borderColor:'#666666'}}>派工</Text></View>
        }else{
            buttons = <View style={{height:30, width:Dimens.screen_width, marginTop:10, backgroundColor:'white', flexDirection:'row',justifyContent:'flex-end',}}>
                <Text onPress={()=>this.pullOrder(data)} style={{ fontSize:13,color:'#FBA234',marginRight:15,textAlign:'center',textAlignVertical:"center", paddingLeft:7, paddingRight:7, paddingTop:3, paddingBottom:3,
                    borderBottomRightRadius: 5,borderBottomLeftRadius: 5,borderTopLeftRadius: 5,borderTopRightRadius:5, borderWidth:1, borderColor:'#FBA234'}}>抢单</Text></View>
        }

    }

    if (data.statusDesc) {
          statusDesc = <Text style={{fontSize:12,color:'#909399',marginLeft:0,marginTop:5,textAlign:'center', paddingLeft:7, paddingRight:7, paddingTop:3, paddingBottom:3,
                    borderBottomRightRadius: 5,borderBottomLeftRadius: 5,borderTopLeftRadius: 5,borderTopRightRadius:5,backgroundColor:'#f0f0f0'}}>{data.statusDesc}</Text>
    }

    if(data.status === '13'){
      statusDesc = <Text style={{fontSize:12,color:'#909399',marginLeft:0,marginTop:5,textAlign:'center', paddingLeft:7, paddingRight:7, paddingTop:3, paddingBottom:3,
                    borderBottomRightRadius: 5,borderBottomLeftRadius: 5,borderTopLeftRadius: 5,borderTopRightRadius:5,backgroundColor:'#f0f0f0'}}>委外中</Text>
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
                   <Image source={require('../../../image/voice_bf.png')} style={{width:25,height:25,marginRight:5, }}/>
               </TouchableOpacity>
           }
       }
    }



    return (
      <TouchableOpacity onPress={()=>{this.onPressItem(data,(page)=>this._fetchData(page))}} style={{flex:1, backgroundColor:'white'}}>
          <View style={{marginLeft:0,}} >
              <View style={{flexDirection:'row',paddingLeft:15}} >
                {voiceView}
                <Text style={{fontSize:14,color:'#333',marginTop:3,}}>报修内容：{data.matterName}</Text>
              </View>
              <View style={{height:1, width:Dimens.screen_width-30, marginTop:5, marginLeft:15, marginRight:15, backgroundColor:'#eeeeee'}}/>
              <View style={{marginLeft:0, marginTop:10, justifyContent:'center', textAlignVertical:'center', flexDirection:'row',alignItems:'center',}} >
                <TouchableOpacity onPress={()=>{this._setModalPictureVisible(data)}} >
                   <View style={{marginLeft:15,paddingTop:3, justifyContent:'center', textAlignVertical:'center', alignItems:'center',width:70,}} >
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
                        <Text style={{fontSize:13,color:'#999',marginLeft:0,marginTop:0,}}>报修位置：</Text>
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
                        <Text style={{fontSize:13,color:'#333',marginLeft:5,marginTop:0,}}>{data.ownerName}</Text>
                        <TouchableOpacity onPress={()=>{that.callPhone(data.telNo)}} style={{marginLeft:30}}>
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

    let voicePlayer = getVoicePlayer();
    voicePlayer.voice(filePath,(result)=>{
        if(result){
            // toastShort('开始播放');
        }else {
            toastShort('语音/视频播放失败');
        }
    })

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

search() {
  console.log('search')
      const {navigation} = this.props;
      InteractionManager.runAfterInteractions(() => {
          // navigator.push({
          //     component: SearchOrder,
          //     name: 'SearchOrder',
          //     params:{
          //         theme:this.theme,

          //     }
          // });
          navigation.navigate('SearchOrder',{
            theme:this.theme,
            isScan: this.props.isScan,
            equipmentId: this.props.equipmentId,
          })
      });
}

   arrangeWork(data,_fetchData) {
     console.log("<<<<<")
     console.log(data)
        const {navigation} = this.props;
        InteractionManager.runAfterInteractions(() => {
            navigation.navigate('ArrangeWork',{
                      theme:this.theme,
                      repairId:data.repairId,
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

   transferOrder(data,typeCode,_fetchData) {
        const {navigation} = this.props;
        InteractionManager.runAfterInteractions(() => {
            navigation.navigate('TransferOrder',{
                     theme:this.theme,
                     typeCode:typeCode,
                     repairId:data.repairId,
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

    this.setState({selectIndex:index, repList:items, showPause:false});
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
              {/*<TouchableOpacity style={{zIndex:1,position: 'absolute',top: 0,right: 0}} onPress={()=> this.setState({modalPictureVisible:false})}>*/}
              <TouchableOpacity activeOpacity={1} style={{zIndex:1,flex:1}} onPress={()=> this.setState({modalPictureVisible:false})}>
                  {/*<Image source={require('../../../res/repair/ic_photo_close.png')} style={{width:20,height:25,marginRight:10,marginTop:18, }}/>*/}
              {/*</TouchableOpacity>*/}
                  <Image resizeMode='contain' style={stylesImage.image} num={index+1} source={{uri:imageItem.filePath}} />
                  <View style={{position: 'relative',left:ScreenWidth-70,top:-40,backgroundColor:'#545658',height:22,paddingLeft:2,width:40,borderRadius:10}}><Text style={{color:'#fff',paddingLeft:5}}>{index+1}/{i}</Text></View>
              </TouchableOpacity>
          </View>
      ))
    }


    if(this.state.videosRequest && this.state.videosRequest.length > 0){
      let videoItems =(  this.state.videosRequest === null ? null : this.state.videosRequest.map((videoItem, index) =>
        <View style={stylesImage.slide} key={index}>
            <VideoPreview onRef={this.onRef} setModalVisible={()=> {this.setState({modalPictureVisible:false})}} num={index+1+j} sum={i} url={videoItem.filePath} fileName={videoItem.fileName} />
        </View>
      ))
      listItems = listItems.concat(videoItems);
    }

    if((this.state.imagesRequest == null || this.state.imagesRequest.length == 0) && (this.state.videosRequest == null || this.state.videosRequest.length == 0)){
        listItems = <View style={{width:"100%",height:"100%",backgroundColor:'#222',justifyContent:'center',alignItems:"center"}}><Text style={{color:'#666',fontSize:16}}>暂无图片</Text></View>
    }




    var actionBar = null;
    var tabBar = <View style={{backgroundColor:'white', height:49, justifyContent:'center', flexDirection:'row', bottom:0}}>
            <TouchableOpacity onPress={()=>{this.onPressTabItem(0)}} style={{alignItems:'center',textAlignVertical:'center', height:49, justifyContent:'center',flex:1}}>
            <View style={{alignItems:'center',textAlignVertical:'center', height:49, justifyContent:'center',flex:1}}>
            <Image source={this.state.tabIndex===0?require('../../../res/repair/tab_ico_bmrw_pre.png'):require('../../../res/repair/tab_ico_bmrw_nor.png')} style={{width:20,height:20}}/>
            <Text style={{color:this.state.tabIndex===0 ?'#5ec4c8':'#999',fontSize:10, textAlign:'center', textAlignVertical:'center'}}>部门任务</Text>
            </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{this.onPressTabItem(1)}} style={{alignItems:'center',textAlignVertical:'center', height:49, justifyContent:'center',flex:1}}>
            <View style={{alignItems:'center',textAlignVertical:'center', height:49, justifyContent:'center',flex:1}}>
            <Image source={this.state.tabIndex===1?require('../../../res/repair/tab_ico_wdrw_pre.png'):require('../../../res/repair/tab_ico_wdrw_nor.png')} style={{width:20,height:20}}/>
            <Text style={{color:this.state.tabIndex===1 ?'#5ec4c8':'#999',fontSize:10, textAlign:'center', textAlignVertical:'center'}}>我的任务</Text>
            </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{this.onPressTabItem(2)}} style={{alignItems:'center',textAlignVertical:'center', height:49, justifyContent:'center',flex:1}}>
            <View style={{alignItems:'center',textAlignVertical:'center', height:49, justifyContent:'center',flex:1}}>
            <Image source={this.state.tabIndex===2?require('../../../res/repair/tab_ico_lswx_pre.png'):require('../../../res/repair/tab_ico_lswx_nor.png')} style={{width:20,height:20}}/>
            <Text style={{color:this.state.tabIndex===2 ?'#5ec4c8':'#999',fontSize:10, textAlign:'center', textAlignVertical:'center'}}>历史任务</Text>
            </View>
            </TouchableOpacity>
      </View>

    if (this.state.tabIndex === 2) {
        actionBar = <View style={{backgroundColor:'white', height:40, justifyContent:'center', flexDirection:'row',}}>
            <TouchableOpacity onPress={()=>{this.onPressTimeItem(0)}} style={{alignItems:'center',textAlignVertical:'center', height:40, justifyContent:'center',flex:1}}>
            <View style = {styles.itemStyle}>
            <Text style={{color:this.state.timeIndex===0 ?'#6DC5C9':'#999',fontSize:14, textAlign:'center', textAlignVertical:'center', flex:1, width:45}}>今天</Text>
            <View style={{backgroundColor: this.state.timeIndex===0?'#6DC5C9':'#fff', height:this.state.timeIndex===0?2:0, width:45}}/>
            </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{this.onPressTimeItem(1)}} style={{alignItems:'center',textAlignVertical:'center', height:40, justifyContent:'center',flex:1}}>
            <View style = {styles.itemStyle}>
            <Text style={{color:this.state.timeIndex===1 ?'#6DC5C9':'#999',fontSize:14, textAlign:'center', textAlignVertical:'center', flex:1, width:45}}>本周</Text>
            <View style={{backgroundColor: this.state.timeIndex===1?'#6DC5C9':'#fff', height:this.state.timeIndex===1?2:0, width:45}}/>
            </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{this.onPressTimeItem(2)}} style={{alignItems:'center',textAlignVertical:'center', height:40, justifyContent:'center',flex:1}}>
            <View style = {styles.itemStyle}>
            <Text style={{color:this.state.timeIndex===2 ?'#6DC5C9':'#999',fontSize:14, textAlign:'center', textAlignVertical:'center', flex:1, width:45}}>本月</Text>
            <View style={{backgroundColor: this.state.timeIndex===2?'#6DC5C9':'#fff', height:this.state.timeIndex===2?2:0, width:45}}/>
            </View>
            </TouchableOpacity>
      </View>
    }
    // else {
    //     actionBar = <View style={{backgroundColor:'white', height:40, justifyContent:'flex-end', flexDirection:'row',}}>
    //
    //         <View style={{alignItems:'center',textAlignVertical:'center', height:40, justifyContent:'center', flexDirection:'row',marginLeft:10, marginRight:5}}>
    //             <Image source={require('../../../res/repair/ico_sc.png')} style={{width:20,height:20,marginLeft:0}}/>
    //             <Text style={{color:'#999',fontSize:11,marginLeft:5, marginRight:10}}>收藏</Text>
    //         </View>
    //         <View style={{alignItems:'center',textAlignVertical:'center', height:40, justifyContent:'center', flexDirection:'row',marginLeft:10, marginRight:5}}>
    //             <Image source={require('../../../res/repair/ico_tx.png')} style={{width:20,height:20,marginLeft:0}}/>
    //             <Text style={{color:'#999',fontSize:11,marginLeft:5, marginRight:10}}>提醒</Text>
    //         </View>
    //         <View style={{alignItems:'center',textAlignVertical:'center',height:40, justifyContent:'center', flexDirection:'row',marginLeft:10, marginRight:10}}>
    //             <Image source={require('../../../res/repair/ico_kswc.png')} style={{width:20,height:20}}/>
    //             <Text style={{color:'#999',fontSize:11,marginLeft:5}}>快速完工</Text>
    //         </View>
    //   </View>
    // }

    return (
      <View style={styles.container}>

      <View style={{height:44,backgroundColor:'white',justifyContent:'center', textAlignVertical:'center', flexDirection:'row',alignItems:'center', marginLeft:0, marginRight:0, marginTop:0,}}>

      <TouchableOpacity onPress={()=>this.search()} style={{flex:1,height:30, marginLeft:10, marginRight:0,}}>
        <View style={{flex:1, height:30,backgroundColor:'#f0f0f0',justifyContent:'center', flexDirection:'row',alignItems:'center', marginLeft:10, marginRight:10,
        borderBottomRightRadius: 15,borderBottomLeftRadius: 15,borderTopLeftRadius: 15,borderTopRightRadius: 15,}}>

        <Image source={require('../../../res/repair/ico_seh.png')}
        style={{width:16,height:16,marginLeft:10}}/>
        <Text style={{color:'#999',fontSize:14,marginLeft:5, flex:1}}>请输入单号或内容</Text>

        </View>
      </TouchableOpacity>

      </View>

      {actionBar}
      <Text style={{backgroundColor:'#f6f6f6', color:'#999',fontSize:12,height:40, textAlignVertical:'center', textAlign:'center'}}>——  共 {cachedResults.total} 条报修工单  ——</Text>
      <RefreshListView
          style={{flex:1, width:Dimens.screen_width,height:Dimens.screen_height-44*2-49}}
          onEndReachedThreshold={10}
          dataSource={this.state.dataSource}
          // 渲染item(子组件)
          renderRow={this.renderItem.bind(this)}
          renderSeparator={this._renderSeparatorView.bind(this)}
          // 是否可以刷新
          isRefreshing={this.state.isRefreshing}
          // 是否可以加载更多
          isLoadingTail={this.state.isLoadingTail}
          // 请求数据
          fetchData={this._fetchData.bind(this)}
          // 缓存列表数据
          cachedResults={cachedResults}
          ref={component => this._listView = component}
      />

      <TouchableOpacity onPress={()=>this.gotoTop()} style={styles.buttonTop}>
        <Image style={{width:35,height:35,}} source={require('../../../res/repair/ic_backtop.png')} />
      </TouchableOpacity>
      {tabBar}


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
    </Modal>
          <Modal
              animationType={"slide"}
              transparent={true}
              visible={this.state.modalPictureVisible}
              onRequestClose={() =>this.setState({modalPictureVisible:false})}
          >
              <View style={stylesImage.container}>
                  <TouchableOpacity style={{height:ScreenHeight/2}} onPress={() => this.setState({modalPictureVisible:false})}>
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
                  <TouchableOpacity style={{height:ScreenHeight/2}} onPress={() => this.setState({modalPictureVisible:false})}>
                  </TouchableOpacity>
              </View>
          </Modal>
      </View>
      )
    }

  cancel() {
      this.setState({modalVisible:false,showPause:false});
    }



    pauseOrder(data) {

      // this.gotoCommenced(data)
      // return
        this.setState({modalVisible:true,repairId:data.repairId});
    }


    onPressTabItem(index){
      cachedResults.items = [];
      cachedResults.tabIndex = index;
      cachedResults.total = 0;
      cachedResults.pages = 0;
      cachedResults.nextPage = 1;
      cachedResults.timeIndex = 0;
      this.setState({tabIndex:index, dataSource: this.state.dataSource.cloneWithRows(cachedResults.items)});
      this._fetchData(0);
    }

    onPressTimeItem(index){
      this.setState({timeIndex:index});
      cachedResults.timeIndex = index;
      this._fetchData(0);
    }
    gotoTop() {
        this._listView.scrollTop();
    }
  }

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
        padding: 40,
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
      backgroundColor:'#eeeeee',height:1,width:(Dimens.screen_width-20),marginTop:0,marginLeft:20,
    },
    separator: {
       height: 1,
       backgroundColor: '#f6f6f6'
    },
    input_style:{
        paddingVertical: 0,marginTop:10, textAlignVertical:'top', textAlign:'left',backgroundColor: 'white',fontSize: 14,height:80, marginLeft:15,marginRight:15, paddingLeft:8,paddingRight:8,paddingTop:5,paddingBottom:5,
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