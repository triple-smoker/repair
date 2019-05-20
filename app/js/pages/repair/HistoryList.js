
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
} from 'react-native';


import BaseComponent from '../../base/BaseComponent'
import * as Dimens from '../../value/dimens';
import ArrangeWork from './ArrangeWork';
import TransferOrder from './TransferOrder';
import OrderDetail from './detail/OrderDetail';
import Request, {GetRepairList, GetUserInfo} from '../../http/Request';

import RefreshListView from '../../component/RefreshListView'

let cachedResults = {
  nextPage: 1, // 下一页
  items: [], // listview 数据(视频列表)
  total: 0, // 总数
  pages:0
};

export default class HistoryList extends BaseComponent {
  constructor(props){
    super(props);
    this.state={
      tabIndex: 0,
      theme:this.props.theme,
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
      this._fetchData(0);
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
     //params.set('status', '8');
     params.set('repairDeptId', global.uinfo.deptAddresses[0].deptId);
    Request.requestGet(GetRepairList, params, (result)=> {
        if (result && result.code === 200) {
          let items = cachedResults.items.slice();
          if (page !== 0) { // 加载更多操作
            // 数组拼接
            if (result.data&&result.data.records) {//&& result.data.records.length > 0
                items = items.concat(result.data.records);
                cachedResults.total = result.data.total;
                cachedResults.pages = result.data.pages;
            }

            cachedResults.nextPage += 1;
          } else { // 刷新操作
            if (result.data&&result.data.records) {
                items = result.data.records;
                cachedResults.total = result.data.total;
                cachedResults.pages = result.data.pages;
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
    });
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

        const {navigator} = this.props;
        InteractionManager.runAfterInteractions(() => {
                navigator.push({
                    component: OrderDetail,
                    name: 'OrderDetail',
                    params:{
                        theme:this.theme
                    }
                });
        });

  }

  renderItem(data) {

    return (
      <TouchableOpacity onPress={()=>{that.onPressItem(data)}} style={{flex:1, backgroundColor:'white'}}>
          <View style={{marginLeft:0,}} >
              <Text style={{fontSize:14,color:'#333',marginLeft:15,marginTop:8,}}>报修位置：{data.repairDeptName}</Text>
              <Text style={{fontSize:14,color:'#333',marginLeft:15,marginTop:3,}}>报修内容：{data.matterName}</Text>
              <View style={{height:1, width:Dimens.screen_width-30, marginTop:5, marginLeft:15, marginRight:15, backgroundColor:'#eeeeee'}}/>
              <View style={{marginLeft:0, marginTop:10, justifyContent:'center', textAlignVertical:'center', flexDirection:'row',alignItems:'center',}} >
                <View style={{marginLeft:15, justifyContent:'center', textAlignVertical:'center', alignItems:'center',width:70,}} >
                    <Image source={require('../../../res/repair/user_wx.png')} style={{width:70,height:70,marginLeft:0}}/>

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

              <View style={{height:1, width:Dimens.screen_width, marginTop:10, backgroundColor:'white'}}/>
          </View>

      </TouchableOpacity>
    );
  }

   arrangeWork() {
        const {navigator} = this.props;
        InteractionManager.runAfterInteractions(() => {
            navigator.push({
                component: ArrangeWork,
                name: 'ArrangeWork',
                params:{
                    theme:this.theme
                }
            });
        });
    }

   transferOrder(data) {
        const {navigator} = this.props;
        InteractionManager.runAfterInteractions(() => {
            navigator.push({
                component: TransferOrder,
                name: 'TransferOrder',
                params:{
                    theme:this.theme
                }
            });
        });
    }


  render() {

    return (
      <View style={styles.container}>

      <View style={{height:44,backgroundColor:'white',justifyContent:'center', textAlignVertical:'center', flexDirection:'row',alignItems:'center', marginLeft:0, marginRight:0, marginTop:0,}}>
      <TouchableOpacity onPress={()=>this.naviGoBack(this.props.navigator)}>
      <Image source={require('../../../res/login/navbar_ico_back.png')}
      style={{width:9,height:20,marginLeft:15}}/>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>this.arrangeWork()} style={{flex:1,height:30, marginLeft:10, marginRight:0,}}>
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

      <View style={{backgroundColor:'white', height:40, justifyContent:'center', flexDirection:'row',}}>
            <TouchableOpacity onPress={()=>{this.onPressTabItem(0)}} style={{alignItems:'center',textAlignVertical:'center', height:40, justifyContent:'center',flex:1}}>
            <View style = {styles.itemStyle}>
            <Text style={{color:this.state.tabIndex===0 ?'#6DC5C9':'#999',fontSize:14, textAlign:'center', textAlignVertical:'center', flex:1, width:60}}>今天</Text>
            <View style={{backgroundColor: this.state.tabIndex===0?'#6DC5C9':'#fff', height:this.state.tabIndex===0?2:0, width:35}}/>
            </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{this.onPressTabItem(1)}} style={{alignItems:'center',textAlignVertical:'center', height:40, justifyContent:'center',flex:1}}>
            <View style = {styles.itemStyle}>
            <Text style={{color:this.state.tabIndex===1 ?'#6DC5C9':'#999',fontSize:14, textAlign:'center', textAlignVertical:'center', flex:1, width:60}}>本周</Text>
            <View style={{backgroundColor: this.state.tabIndex===1?'#6DC5C9':'#fff', height:this.state.tabIndex===1?2:0, width:35}}/>
            </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{this.onPressTabItem(2)}} style={{alignItems:'center',textAlignVertical:'center', height:40, justifyContent:'center',flex:1}}>
            <View style = {styles.itemStyle}>
            <Text style={{color:this.state.tabIndex===2 ?'#6DC5C9':'#999',fontSize:14, textAlign:'center', textAlignVertical:'center', flex:1, width:60}}>本月</Text>
            <View style={{backgroundColor: this.state.tabIndex===2?'#6DC5C9':'#fff', height:this.state.tabIndex===2?2:0, width:35}}/>
            </View>
            </TouchableOpacity>
      </View>
      <View style={styles.line} />
      <Text style={{backgroundColor:'#f6f6f6', color:'#999',fontSize:12,height:40, textAlignVertical:'center', textAlign:'center'}}>——  共 {cachedResults.total} 条报修工单  ——</Text>
      <RefreshListView
          style={{flex:1, width:Dimens.screen_width,height:Dimens.screen_height-44}}
          onEndReachedThreshold={10}
          dataSource={this.state.dataSource}
          // 渲染item(子组件)
          renderRow={this.renderItem.bind(this)}
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
      </View>
      )
    }


  onPressTabItem(index){
    this.setState({tabIndex:index});
  }

    gotoTop() {
        this._listView.scrollTop();
    }


  }


  const styles = StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor: '#f6f6f6',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    },
    itemStyle:{
        backgroundColor: '#fff',
        height:40,
        width:60,
        alignItems:'center',
      justifyContent:'center',
      textAlignVertical:'center',
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
      backgroundColor:'#eeeeee',height:1,width:(Dimens.screen_width),marginTop:0,
    },
    separator: {
       height: 8,
       backgroundColor: '#f6f6f6'
    }
  });
