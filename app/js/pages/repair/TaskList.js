
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
    DeviceEventEmitter
} from 'react-native';


import BaseComponent from '../../base/BaseComponent'
import * as Dimens from '../../value/dimens';
import ArrangeWork from './ArrangeWork';
import TransferOrder from './TransferOrder';
import OrderDetail from './detail/OrderDetail';
import Request, {GetRepairList, GetUserInfo, CancelPause, RepPause, DoPause} from '../../http/Request';

import RefreshListView from '../../component/RefreshListView'
import TakePhotos from './detail/TakePhotos';
import { toastShort } from '../../util/ToastUtil';
import HistoryDetail from './HistoryDetail';


let cachedResults = {
  nextPage: 1, // 下一页
  items: [], // listview 数据(视频列表)
  total: 0, // 总数
  pages:0,
  tabIndex:0,
};

var otherDesc = '';

export default class TaskList extends BaseComponent {
  constructor(props){
    super(props);
    this.state={
      repairId:'',
      selectIndex:-1,
      repList:[],
      modalVisible:false,
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
      this._fetchData(0);
      this.loadRep();
      //DeviceEventEmitter.emit('ACTION_BASE_', "_onLogin_", null);

      //DeviceEventEmitter.emit('Event_Home', 'Event_Home');
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
              toastShort('暂停成功');
              that._fetchData(0);
            } else {
                toastShort('失败，请重试');
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
      // 初始哈 nextPage
      cachedResults.nextPage = 1;
    }

    var params = new Map();
     params.set('page', cachedResults.nextPage);
     params.set('limit', '20');
     if (cachedResults.tabIndex === 1) {
        params.set('status', '1,2,3,5,6');
        params.set('repairUserId', global.uinfo.userId);
     } else if (cachedResults.tabIndex === 0) {
        params.set('repairDeptId', global.uinfo.deptAddresses[0].deptId);
        params.set('status', '1,2,3,5,6');
    } else if (cachedResults.tabIndex === 2) {
        params.set('repairDeptId', global.uinfo.deptAddresses[0].deptId);
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

  onPressItem(data){
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
                  repairId:data.repairId,
                })
        });

      } else if (this.state.tabIndex === 1) {
        this.gotoDetail(data);
      } else if (this.state.tabIndex === 0) {
        this.gotoDetail(data);
      }
  }


  gotoDetail(data) {
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
                        theme:this.theme,})
        });
  }


  resetOrder(data) {
    var that = this;
    Request.requestGet(CancelPause+data.repairId, null, (result)=> {
        if (result && result.code === 200) {
            toastShort('恢复成功');
            that._fetchData(0);
        } else {

        }
    });
  }

  finishOrder(data) {
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

  renderItem(data) {
    var that = this;
    let buttons = null;
    let statusDesc = null;
    if (data.status === '1') {
        if (data.statusDesc) {
          statusDesc = <Text style={{fontSize:12,color:'#909399',marginLeft:0,marginTop:5,textAlign:'center', paddingLeft:7, paddingRight:7, paddingTop:3, paddingBottom:3,
                    borderBottomRightRadius: 5,borderBottomLeftRadius: 5,borderTopLeftRadius: 5,borderTopRightRadius:5,backgroundColor:'#f0f0f0'}}>{data.statusDesc}</Text>

        }

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
      if (data.statusDesc) {
          statusDesc = <Text style={{fontSize:12,color:'#909399',marginLeft:0,marginTop:5,textAlign:'center', paddingLeft:7, paddingRight:7, paddingTop:3, paddingBottom:3,
                    borderBottomRightRadius: 5,borderBottomLeftRadius: 5,borderTopLeftRadius: 5,borderTopRightRadius:5,backgroundColor:'#f0f0f0'}}>{data.statusDesc}</Text>

      }
      buttons = <View style={{height:30, width:Dimens.screen_width, marginTop:10, backgroundColor:'white', flexDirection:'row',justifyContent:'flex-end',}}><Text style={{ fontSize:13,color:'#FBA234',marginRight:15,textAlign:'center', paddingLeft:7, paddingRight:7, paddingTop:3, paddingBottom:3,
                    borderBottomRightRadius: 5,borderBottomLeftRadius: 5,borderTopLeftRadius: 5,borderTopRightRadius:5, borderWidth:1, borderColor:'#FBA234'}}>接单</Text>
                    <Text onPress={()=>this.transferOrder(data)} style={{ fontSize:13,color:'#666666',marginRight:15,textAlign:'center', paddingLeft:7, paddingRight:7, paddingTop:3, paddingBottom:3,
                    borderBottomRightRadius: 5,borderBottomLeftRadius: 5,borderTopLeftRadius: 5,borderTopRightRadius:5, borderWidth:1, borderColor:'#666666'}}>转单</Text></View>
    } else if (data.status === '3') {
      if (data.statusDesc) {
          statusDesc = <Text style={{fontSize:12,color:'#909399',marginLeft:0,marginTop:5,textAlign:'center', paddingLeft:7, paddingRight:7, paddingTop:3, paddingBottom:3,
                    borderBottomRightRadius: 5,borderBottomLeftRadius: 5,borderTopLeftRadius: 5,borderTopRightRadius:5,backgroundColor:'#f0f0f0'}}>{data.statusDesc}</Text>

      }
      buttons = <View style={{height:30, width:Dimens.screen_width, marginTop:10, backgroundColor:'white', flexDirection:'row',justifyContent:'flex-end',}}>
                    <Text onPress={()=>this.gotoDetail(data)}  style={{ fontSize:13,color:'#FBA234',marginRight:15,textAlign:'center', paddingLeft:7, paddingRight:7, paddingTop:3, paddingBottom:3,
                    borderBottomRightRadius: 5,borderBottomLeftRadius: 5,borderTopLeftRadius: 5,borderTopRightRadius:5, borderWidth:1, borderColor:'#FBA234'}}>拍照开始维修</Text>
                    <Text onPress={()=>this.transferOrder(data)} style={{ fontSize:13,color:'#666666',marginRight:15,textAlign:'center', paddingLeft:7, paddingRight:7, paddingTop:3, paddingBottom:3,
                    borderBottomRightRadius: 5,borderBottomLeftRadius: 5,borderTopLeftRadius: 5,borderTopRightRadius:5, borderWidth:1, borderColor:'#666666'}}>转单</Text></View>
    } else if (data.status === '4') {
      if (data.statusDesc) {
          statusDesc = <Text style={{fontSize:12,color:'#909399',marginLeft:0,marginTop:5,textAlign:'center', paddingLeft:7, paddingRight:7, paddingTop:3, paddingBottom:3,
                    borderBottomRightRadius: 5,borderBottomLeftRadius: 5,borderTopLeftRadius: 5,borderTopRightRadius:5,backgroundColor:'#f0f0f0'}}>{data.statusDesc}</Text>

      }
    } else if (data.status === '5') {
      if (data.statusDesc) {
          statusDesc = <Text style={{fontSize:12,color:'#909399',marginLeft:0,marginTop:5,textAlign:'center', paddingLeft:7, paddingRight:7, paddingTop:3, paddingBottom:3,
                    borderBottomRightRadius: 5,borderBottomLeftRadius: 5,borderTopLeftRadius: 5,borderTopRightRadius:5,backgroundColor:'#f0f0f0'}}>{data.statusDesc}</Text>

      }
      buttons = <View style={{height:30, width:Dimens.screen_width, marginTop:10, backgroundColor:'white', flexDirection:'row',justifyContent:'flex-end',}}>
                    <Text onPress={()=>this.finishOrder(data)} style={{ fontSize:13,color:'#FBA234',marginRight:15,textAlign:'center', paddingLeft:7, paddingRight:7, paddingTop:3, paddingBottom:3,
                    borderBottomRightRadius: 5,borderBottomLeftRadius: 5,borderTopLeftRadius: 5,borderTopRightRadius:5, borderWidth:1, borderColor:'#FBA234'}}>完工</Text>
                    <Text onPress={()=>this.pauseOrder(data)} style={{ fontSize:13,color:'#666666',marginRight:15,textAlign:'center', paddingLeft:7, paddingRight:7, paddingTop:3, paddingBottom:3,
                    borderBottomRightRadius: 5,borderBottomLeftRadius: 5,borderTopLeftRadius: 5,borderTopRightRadius:5, borderWidth:1, borderColor:'#666666'}}>暂停</Text>
                    <Text onPress={()=>this.transferOrder(data)} style={{ fontSize:13,color:'#666666',marginRight:15,textAlign:'center', paddingLeft:7, paddingRight:7, paddingTop:3, paddingBottom:3,
                    borderBottomRightRadius: 5,borderBottomLeftRadius: 5,borderTopLeftRadius: 5,borderTopRightRadius:5, borderWidth:1, borderColor:'#666666'}}>转单</Text></View>
    } else if (data.status === '6') {
      if (data.statusDesc) {
          statusDesc = <Text style={{fontSize:12,color:'#909399',marginLeft:0,marginTop:5,textAlign:'center', paddingLeft:7, paddingRight:7, paddingTop:3, paddingBottom:3,
                    borderBottomRightRadius: 5,borderBottomLeftRadius: 5,borderTopLeftRadius: 5,borderTopRightRadius:5,backgroundColor:'#f0f0f0'}}>{data.statusDesc}</Text>

      }
      buttons = <View style={{height:30, width:Dimens.screen_width, marginTop:10, backgroundColor:'white', flexDirection:'row',justifyContent:'flex-end',}}>
                    <Text onPress={()=>this.resetOrder(data)} style={{ fontSize:13,color:'#666666',marginRight:15,textAlign:'center', paddingLeft:7, paddingRight:7, paddingTop:3, paddingBottom:3,
                    borderBottomRightRadius: 5,borderBottomLeftRadius: 5,borderTopLeftRadius: 5,borderTopRightRadius:5, borderWidth:1, borderColor:'#666666'}}>恢复</Text>
                    <Text onPress={()=>this.transferOrder(data)} style={{ fontSize:13,color:'#666666',marginRight:15,textAlign:'center', paddingLeft:7, paddingRight:7, paddingTop:3, paddingBottom:3,
                    borderBottomRightRadius: 5,borderBottomLeftRadius: 5,borderTopLeftRadius: 5,borderTopRightRadius:5, borderWidth:1, borderColor:'#666666'}}>转单</Text></View>
    } else if (data.status === '7') {
      if (data.statusDesc) {
          statusDesc = <Text style={{fontSize:12,color:'#909399',marginLeft:0,marginTop:5,textAlign:'center', paddingLeft:7, paddingRight:7, paddingTop:3, paddingBottom:3,
                    borderBottomRightRadius: 5,borderBottomLeftRadius: 5,borderTopLeftRadius: 5,borderTopRightRadius:5,backgroundColor:'#f0f0f0'}}>{data.statusDesc}</Text>

      }
      buttons = <View style={{height:30, width:Dimens.screen_width, marginTop:10, backgroundColor:'white', flexDirection:'row',justifyContent:'flex-end',}}>
                    <Text style={{ fontSize:13,color:'#FBA234',marginRight:15,textAlign:'center', paddingLeft:7, paddingRight:7, paddingTop:3, paddingBottom:3,
                    borderBottomRightRadius: 5,borderBottomLeftRadius: 5,borderTopLeftRadius: 5,borderTopRightRadius:5, borderWidth:1, borderColor:'#FBA234'}}>接单</Text>
                    <Text onPress={()=>this.transferOrder(data)} style={{ fontSize:13,color:'#666666',marginRight:15,textAlign:'center', paddingLeft:7, paddingRight:7, paddingTop:3, paddingBottom:3,
                    borderBottomRightRadius: 5,borderBottomLeftRadius: 5,borderTopLeftRadius: 5,borderTopRightRadius:5, borderWidth:1, borderColor:'#666666'}}>转单</Text></View>
    }

    if (this.state.tabIndex === 2) {
      statusDesc = null;
      buttons = null;
    }

    return (
      <TouchableOpacity onPress={()=>{that.onPressItem(data)}} style={{flex:1, backgroundColor:'white'}}>
          <View style={{marginLeft:0,}} >
              <Text style={{fontSize:14,color:'#333',marginLeft:15,marginTop:8,}}>报修位置：11111111111111111111111111{data.repairDeptName}</Text>
              <Text style={{fontSize:14,color:'#333',marginLeft:15,marginTop:3,}}>报修内容：{data.matterName}</Text>
              <View style={{height:1, width:Dimens.screen_width-30, marginTop:5, marginLeft:15, marginRight:15, backgroundColor:'#eeeeee'}}/>
              <View style={{marginLeft:0, marginTop:10, justifyContent:'center', textAlignVertical:'center', flexDirection:'row',alignItems:'center',}} >
                <View style={{marginLeft:15, justifyContent:'center', textAlignVertical:'center', alignItems:'center',width:70,}} >
                    <Image source={require('../../../res/repair/user_wx.png')} style={{width:70,height:70,marginLeft:0}}/>
                    {statusDesc}

                </View>
                <View style={{marginLeft:15, flex:1}} >
                    <View style={{marginLeft:0, marginTop:0, flexDirection:'row',}} >
                        <Text style={{fontSize:13,color:'#999',marginLeft:0,marginTop:3,}}>报修单号：</Text>
                        <Text style={{fontSize:13,color:'#333',marginLeft:5,marginTop:3,}}>{data.repairNo}</Text>
                    </View>
                    <View style={{marginLeft:0, marginTop:3, flexDirection:'row',}} >
                        <Text style={{fontSize:13,color:'#999',marginLeft:0,marginTop:0,}}>报修时间：</Text>
                        <Text style={{fontSize:13,color:'#333',marginLeft:5,marginTop:0,}}>{new Date(data.createTime).format("yyyy-MM-dd hh:mm:ss")}</Text>
                    </View>
                    <View style={{marginLeft:0, marginTop:3, flexDirection:'row',}} >
                        <Text style={{fontSize:13,color:'#999',marginLeft:0,marginTop:0,}}>已耗时长：</Text>
                        <Text style={{fontSize:13,color:'#333',marginLeft:5,marginTop:0,}}>{data.hours}小时</Text>
                    </View>
                    <View style={{marginLeft:0, marginTop:3, flexDirection:'row',}} >
                        <Text style={{fontSize:13,color:'#999',marginLeft:0,marginTop:0,}}>报修人员：</Text>
                        <Text style={{fontSize:13,color:'#333',marginLeft:5,marginTop:0,}}>{data.ownerName}   {data.telNo}</Text>
                        <Image source={require('../../../res/repair/list_call.png')} style={{width:20,height:20,marginLeft:10}}/>
                    </View>
                </View>
              </View>

              {buttons}

              <View style={{height:1, width:Dimens.screen_width, marginTop:10, backgroundColor:'white'}}/>
          </View>

      </TouchableOpacity>
    );
  }

  search() {

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
                    theme:this.theme,
                    repairId:data.repairId,})
        });
    }

   transferOrder(data) {
        const {navigation} = this.props;
        InteractionManager.runAfterInteractions(() => {
            // navigator.push({
            //     component: TransferOrder,
            //     name: 'TransferOrder',
            //     params:{
            //         theme:this.theme
            //     }
            // });
            navigation.navigate('TransferOrder',{
              theme:this.theme,})
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

    this.setState({selectIndex:index, repList:items, });
  }

  renderRepItem(data,i) {
      return (<Text onPress={()=>{this.onPressRepItem(data, i)}} style={{width:(Dimens.screen_width-130)/3,flexWrap:'nowrap', marginLeft:10,
              color:(this.state.selectIndex===i?'#369CED':'#333333'),fontSize:11, height:35, marginTop:10,
              textAlignVertical:'center', textAlign:'center',borderWidth:1, borderColor:(this.state.selectIndex===i?'#369CED':'#aaaaaa'),
                borderBottomRightRadius:5,borderBottomLeftRadius:5,borderTopLeftRadius:5,borderTopRightRadius:5, paddingLeft:5, paddingRight:5}}>{data.causeCtn}</Text>
    );
  }

  render() {
    var repDatas = null;
    if (this.state.modalVisible) {
        repDatas = this.state.repList.map((item, i)=>this.renderRepItem(item,i));
    }

    var actionBar = null;
    var tabBar = <View style={{backgroundColor:'white', height:49, justifyContent:'center', flexDirection:'row',}}>
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
    } else {
        actionBar = <View style={{backgroundColor:'white', height:40, justifyContent:'flex-end', flexDirection:'row',}}>

            <View style={{alignItems:'center',textAlignVertical:'center', height:40, justifyContent:'center', flexDirection:'row',marginLeft:10, marginRight:5}}>
                <Image source={require('../../../res/repair/ico_sc.png')} style={{width:20,height:20,marginLeft:0}}/>
                <Text style={{color:'#999',fontSize:11,marginLeft:5, marginRight:10}}>收藏</Text>
            </View>
            <View style={{alignItems:'center',textAlignVertical:'center', height:40, justifyContent:'center', flexDirection:'row',marginLeft:10, marginRight:5}}>
                <Image source={require('../../../res/repair/ico_tx.png')} style={{width:20,height:20,marginLeft:0}}/>
                <Text style={{color:'#999',fontSize:11,marginLeft:5, marginRight:10}}>提醒</Text>
            </View>
            <View style={{alignItems:'center',textAlignVertical:'center',height:40, justifyContent:'center', flexDirection:'row',marginLeft:10, marginRight:10}}>
                <Image source={require('../../../res/repair/ico_kswc.png')} style={{width:20,height:20}}/>
                <Text style={{color:'#999',fontSize:11,marginLeft:5}}>快速完工</Text>
            </View>
      </View>
    }

    return (
      <View style={styles.container}>

      <View style={{height:44,backgroundColor:'white',justifyContent:'center', textAlignVertical:'center', flexDirection:'row',alignItems:'center', marginLeft:0, marginRight:0, marginTop:0,}}>
      <TouchableOpacity onPress={()=>this.naviGoBack(this.props.navigation)}>
      <Image source={require('../../../res/login/navbar_ico_back.png')}
      style={{width:9,height:20,marginLeft:15}}/>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>this.search()} style={{flex:1,height:30, marginLeft:10, marginRight:0,}}>
      <View style={{flex:1, height:30,backgroundColor:'#f0f0f0',justifyContent:'center', flexDirection:'row',alignItems:'center', marginLeft:10, marginRight:10,
      borderBottomRightRadius: 15,borderBottomLeftRadius: 15,borderTopLeftRadius: 15,borderTopRightRadius: 15,}}>

      <Image source={require('../../../res/repair/ico_seh.png')}
      style={{width:16,height:16,marginLeft:10}}/>
      <Text style={{color:'#999',fontSize:14,marginLeft:5, flex:1}}>请输入单号或内容</Text>

      </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>this.transferOrder()}>
            <Image style={{width:16,height:20,marginLeft:5,marginRight:10}} source={require('../../../res/repair/navbar_ico_sys.png')} />
      </TouchableOpacity>
      </View>

      {actionBar}
      <Text style={{backgroundColor:'#f6f6f6', color:'#999',fontSize:12,height:40, textAlignVertical:'center', textAlign:'center'}}>——  共 {cachedResults.total} 条报修工单  ——</Text>
      <RefreshListView
          style={{flex:1, width:Dimens.screen_width,height:Dimens.screen_height-44}}
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

        <View style={styles.modelStyle}>
            <View style={[styles.popupStyle, {marginTop:(Dimens.screen_height-390)/2,backgroundColor:'#fbfbfb',}]}>
                <Text style={{fontSize:16,color:'#333',marginLeft:0,marginTop:10,textAlign:'center',width:Dimens.screen_width-80, height:40}}>暂停</Text>
                <View style={{backgroundColor:'#eeeeee',height:1,width:(Dimens.screen_width-80),}} />
                <View style={{width:Dimens.screen_width-80, height:300}} >
                <Text style={{color:'#999',fontSize:14, height:40, textAlignVertical:'center',paddingLeft:10,}}>请选择暂停原因</Text>
                {
                    this.state.showPause ? <Text style={{color:'red',fontSize:12, height:20, textAlignVertical:'center',paddingLeft:10,}}>暂停原因不能为空</Text> : <Text style={{height:20}}></Text>
                }
                <View style={styles.listViewStyle}>
                  {repDatas}

                </View>
                <TextInput
                  style={styles.input_style}
                  placeholder="原因描述…"
                  placeholderTextColor="#aaaaaa"
                  underlineColorAndroid="transparent"
                  multiline = {true}
                  ref={'otherDesc'}
                  onChangeText={(text) => {
                    otherDesc = text;
                  }}
                />
                </View>
                <View style={{backgroundColor:'transparent', flexDirection:'row',textAlignVertical:'center',alignItems:'center',}}>
                    <Text onPress={()=>this.cancel()} style={{borderBottomLeftRadius: 15,textAlignVertical:'center',backgroundColor:'#EFF0F1', color:'#333',fontSize:16, height:40, textAlign:'center', flex:1}}>取消</Text>
                    <Text onPress={()=>this.submit()} style={{borderBottomRightRadius: 15,textAlignVertical:'center',backgroundColor:'#E1E4E8', color:'#333',fontSize:16, height:40, textAlign:'center', flex:1}}>确定</Text>
                </View>
            </View>
        </View>
    </Modal>
      </View>
      )
    }

  cancel() {
        this.setState({modalVisible:false,showPause:false});
    }



    pauseOrder(data) {
        this.setState({modalVisible:true,repairId:data.repairId});
    }


    onPressTabItem(index){
      cachedResults.items = [];
      cachedResults.tabIndex = index;
      cachedResults.total = 0;
      cachedResults.pages = 0;
      cachedResults.nextPage = 1;
      this.setState({tabIndex:index, dataSource: this.state.dataSource.cloneWithRows(cachedResults.items)});
      this._fetchData(0);
    }

    onPressTimeItem(index){
      this.setState({timeIndex:index});
    }
    gotoTop() {
        this._listView.scrollTop();
    }
  }


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
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15,
        borderTopLeftRadius: 15,
        borderTopRightRadius:15,
        backgroundColor: 'white',
    },
    container: {
      flex: 1,
      backgroundColor: '#f6f6f6',
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
      bottom: 70,
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
