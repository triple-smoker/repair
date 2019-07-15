
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
    Modal, TouchableHighlight, Dimensions,
} from 'react-native';


import BaseComponent from '../../base/BaseComponent'
import * as Dimens from '../../value/dimens';
import RefreshListView from '../../component/RefreshListView'
import SQLite from '../../polling/SQLite';
import CheckSqLite from "../../polling/CheckSqLite";
import moment from "moment";
import NetInfo from '@react-native-community/netinfo';
import Axios from "../../../util/Axios";
import {Loading} from "../../component/Loading";
import Request from "../../http/Request";
import {toastShort} from "../../util/ToastUtil";
import {ProcessingManager} from "react-native-video-processing";

/*
* 每日任务列表
*
* */
let cachedResults = {
  nextPage: 1, // 下一页
  items: [], // 
  total: 0, // 总数
  pages:0,
    tabIndex:0,
};
let ScreenWidth = Dimensions.get('window').width;
var db;
var checkSqLite = new CheckSqLite();
export default class TodayTask extends BaseComponent {
  constructor(props){
    super(props);
    this.state={
      tabIndex:0,
      theme:this.props.theme,
      isLoadingTail: false, // loading?
      isRefreshing: false, // refresh?
      checkType: this.props.checkType, //checkType
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

    };
      // 每60000毫秒对状态做一次操作
      // this.getdata = setInterval(() => {
      //     this._fetchData(0);
      // }, 60000);
      // 每10分钟检测一遍是否有报表需要上传
      // this.pushData = setInterval(() => {
      //     this._pushData();
      // }, 600000);

  }


  componentDidMount() {
      cachedResults.tabIndex = 0;
      this._fetchData(0);

  }
    componentWillUnmount() {
        // this.getdata && clearInterval(this.getdata);
        // this.pushData && clearInterval(this.pushData);
    }
    // componentWillReceiveProps(){
    //     cachedResults.tabIndex = 0;
    //     this._fetchData(0);
    // }
  //获取auto_up表中的信息进行网络添加
    _pushData(){
        NetInfo.fetch().then(state => {
            console.log("当前网络连接："+state.isConnected);
            if(state.isConnected){
                if(!db){
                    db = SQLite.open();
                }
                let sql = "select * from auto_up";
                var itemList = [];
                db.transaction((tx)=>{
                    tx.executeSql(sql, [],(tx,results)=>{
                        let len = results.rows.length;
                        console.log("需要上传的报表数量："+len);
                        if(len>0){
                            for(let i=0; i<len; i++){
                                let checkIm = results.rows.item(i);
                                console.log(checkIm);
                                // checkIm.ITEM_FORMAT=null;
                                itemList.push(checkIm);
                            }
                            this.pushNetowrk(itemList);
                        }
                    });
                },(error)=>{
                    console.log(error);
                });


            }
        });
    }
    pushNetowrk(itemList){
        itemList.forEach((checkIm)=>{
            let chenk = checkIm;

            if(chenk.ITEM_FORMAT==="拍照型"){
                Request.uploadFile(chenk.resultDesc, (result)=> {
                    console.log('path');
                    console.log("chenk+++++"+chenk.resultDesc);
                    console.log('result');
                    console.log(result);
                    if (result && result.code === 200) {
                        // console.log(result);
                        chenk.ITEM_FORMAT=null;
                        chenk.resultDesc = result.data.fileDownloadUri;
                        Axios.PostAxiosUpPorter("http://47.102.197.221:5568/daily/report",chenk).then(
                            (response)=>{
                                console.log(response);
                                this.deleteLocal(response,chenk);
                            })
                    }
                });
            }else if(chenk.ITEM_FORMAT==="视频型"){
                let compressOptions = {
                    width: 720,
                    height: 1280,
                    bitrateMultiplier: 3,
                    saveToCameraRoll: true, // default is false, iOS only
                    saveWithCurrentDate: true, // default is false, iOS only
                    minimumBitrate: 300000,
                };
                ProcessingManager.compress(chenk.resultDesc, compressOptions) // like VideoPlayer compress options
                    .then((data) => {
                        Request.uploadFile(data.source, (result)=> {
                            console.log('path')
                            console.log(item.resultDesc)
                            console.log('result')
                            console.log(result)
                            if (result && result.code === 200) {
                                // console.log(result);
                                item.ITEM_FORMAT=null;
                                item.resultDesc = result.data.fileDownloadUri;
                                Axios.PostAxiosUpPorter("http://47.102.197.221:5568/daily/report",item).then(
                                    (response)=>{
                                        console.log(response);
                                        this.deleteLocal(response,chenk);
                                    })
                            }
                        });
                    });
            }else{
                chenk.ITEM_FORMAT=null;
                Axios.PostAxiosUpPorter("http://47.102.197.221:5568/daily/report",chenk).then(
                    (response)=>{
                        console.log(response);
                        this.deleteLocal(response,chenk);
                    })
            }
        })

    }
    deleteLocal(response,chenk){
        if(response && response.id){
            if(!db){
                db = SQLite.open();
            }
            let sql = "delete from auto_up where code="+"'"+chenk.code+"'";
            db.transaction((tx)=>{
                tx.executeSql(sql,()=>{
                        console.log("本地删除成功");
                    },(err)=>{
                        console.log(err);
                    }
                );
            },(error)=>{
                console.log(error);
            },()=>{
                console.log("本地删除成功");
            });
        }
    }


  _renderSeparatorView(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
    return (
      <View key={`${sectionID}-${rowID}`} style={styles.separator} />
    );
  }
  //跳转到二级页面
  onPressItem(data){
        const {navigation} = this.props;
        InteractionManager.runAfterInteractions(() => {
            navigation.navigate('CheckList',{
                theme:this.theme,
                taskId:data.ID,
                beginTime:data.EXEC_START_TIME,
                endTime:data.EXEC_END_TIME,
                jobCode:data.JOB_CODE,
                jobExecCode:data.JOB_EXEC_CODE,
                dailyTaskCode:data.CODE,
                checkType:this.state.checkType,
                callback: (
                    () => {
                        this._fetchData(0);
                    })
            });
        });

  }

  renderItem(data,i) {
      NetInfo.fetch().then(state => {
          if(state.isConnected) {
              this.getNetworkData(data.ID);
          }
      });
      return <CheckItem data={data} key={i} onPressItem = {(data)=>this.onPressItem(data)}/>

  }
    //在线获取任务进度
    getNetworkData(taskId){
        Axios.GetAxiosUpPorter("http://47.102.197.221:8081/api/dailyTask/getReportListByTaskId?taskId="+taskId).then(
            (response)=>{
                console.log("http://47.102.197.221:8081/api/dailyTask/getReportListByTaskId?taskId="+taskId)
                var dataList = [];
                if(Array.isArray(response) && response.length>0){
                    var sum = 0;
                    response.forEach((item)=>{
                        // console.log(item);
                        if(item.completion === "已完成"){
                            sum++;
                        }
                        var data = {rqCode:taskId+""+item.equipmentId,
                            taskId:taskId,
                            equipmentId:item.equipmentId,
                            percentF:"",
                            percentZ:item.completed,
                            isUp:"",
                            reportBy:item.reportBy,
                        }
                        dataList.push(data);
                    })
                    dataList.forEach((item)=>{
                        item.percentF = parseInt((sum/dataList.length)*100);
                        item.percentF = item.percentF===0 ? 0:item.percentF
                        // percent =  parseInt((sum/dataList.length)*ScreenWidth);
                        // console.log("************"+sum+"/"+dataList.length);
                    })
                    SQLite.insertData(dataList,"auto_percent");
                }
            })
    }



    //当前巡检、历史巡检数据切换
    onPressTabItem(index){
        cachedResults.items = [];
        cachedResults.tabIndex = index;
        cachedResults.total = 0;
        cachedResults.pages = 0;
        cachedResults.nextPage = 1;
        this.setState({tabIndex:index, dataSource: this.state.dataSource.cloneWithRows(cachedResults.items)});
        this._fetchData(0);
    }
    //请求数据
    _fetchData(page) {
        this._pushData();
        if(!db){
            db = SQLite.open();
        }
        cachedResults.items = [];
       if(cachedResults.tabIndex === 0){
           var timeStamp = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
           var sql = "";
           if(this.state.checkType===1){
               sql = checkSqLite.selectFirstCheck(global.deptId,timeStamp);
           }
           if(this.state.checkType===2){
               sql = checkSqLite.selectFirstCheckKeep(global.deptId,timeStamp);
           }

           db.transaction((tx)=>{
               tx.executeSql(sql, [],(tx,results)=>{
                   var len = results.rows.length;
                   // console.log(len);
                   for(let i=0; i<len; i++){
                       var checkIm = results.rows.item(i);
                       // console.log(checkIm);
                       cachedResults.items.push(checkIm);
                   }
                   this.setState({
                       isLoadingTail: false,
                       isRefreshing: false,
                       dataSource: this.state.dataSource.cloneWithRows(cachedResults.items)
                   });
               });
           },(error)=>{
               console.log(error);
           });
       }else if(cachedResults.tabIndex === 1){
           var sql = checkSqLite.selectFirstCheck(global.deptId);
           db.transaction((tx)=>{
               tx.executeSql(sql, [],(tx,results)=>{
                   var len = results.rows.length;
                   // console.log(len)
                   for(let i=0; i<len; i++){
                       var checkIm = results.rows.item(i);
                       // console.log(checkIm);
                       cachedResults.items.push(checkIm);
                   }
                   this.setState({
                       isLoadingTail: false,
                       isRefreshing: false,
                       dataSource: this.state.dataSource.cloneWithRows(cachedResults.items)
                   });
               });
           },(error)=>{
               console.log(error);
           });
       }
    }

  render() {
      var tabBar = <View style={{backgroundColor:'white', height:49, justifyContent:'center', flexDirection:'row', bottom:0}}>
          <TouchableOpacity onPress={()=>{this.onPressTabItem(0)}} style={{alignItems:'center',textAlignVertical:'center', height:49, justifyContent:'center',flex:1}}>
              <View style={{alignItems:'center',textAlignVertical:'center', height:49, justifyContent:'center',flex:1}}>
                  <Text style={{color:this.state.tabIndex===0 ?'#5ec4c8':'#999',fontSize:14, textAlign:'center', textAlignVertical:'center'}}>
                      {this.state.checkType===1 &&
                      "当前巡检"}
                      {this.state.checkType===2 &&
                      "当前保养"}
                  </Text>
              </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{this.onPressTabItem(1)}} style={{alignItems:'center',textAlignVertical:'center', height:49, justifyContent:'center',flex:1}}>
              <View style={{alignItems:'center',textAlignVertical:'center', height:49, justifyContent:'center',flex:1}}>
                  <Text style={{color:this.state.tabIndex===1 ?'#5ec4c8':'#999',fontSize:14, textAlign:'center', textAlignVertical:'center'}}>
                      {this.state.checkType===1 &&
                      "历史巡检"}
                      {this.state.checkType===2 &&
                      "历史保养"}
                  </Text>
              </View>
          </TouchableOpacity>
      </View>
      var sechBar = null;
      if(this.state.tabIndex===1){
          sechBar =
              <View style={{height:44,backgroundColor:'white',justifyContent:'center', textAlignVertical:'center', flexDirection:'row',alignItems:'center', marginLeft:0, marginRight:0, marginTop:0,}}>
                  <TouchableOpacity style={{flex:1,height:30, marginLeft:10, marginRight:0,}}>
                      <View style={{flex:1, height:30,backgroundColor:'#f0f0f0',justifyContent:'center', flexDirection:'row',alignItems:'center', marginLeft:10, marginRight:10,
                          borderBottomRightRadius: 15,borderBottomLeftRadius: 15,borderTopLeftRadius: 15,borderTopRightRadius: 15,}}>
                          <Image source={require('../../../res/repair/ico_seh.png')}
                                 style={{width:16,height:16,marginLeft:10}}/>
                          <Text style={{color:'#999',fontSize:14,marginLeft:5, flex:1}}>请输入设备号/时间/任务名称或类型名称</Text>
                      </View>
                  </TouchableOpacity>
              </View>
      }
    return (
      <View style={styles.container}>
          {sechBar}
      <Text style={{backgroundColor:'#f6f6f6', color:'#999',fontSize:12,height:40, textAlignVertical:'center', textAlign:'center'}}>——  共 {cachedResults.items.length} 条巡检工单  ——</Text>
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
          {tabBar}
      </View>
      )
    }
  }
// const newDate = new Date().format("YYYY-MM-dd 00:00:00");
// const newDateString = new Date(newDate).getTime();
/*
* 任务项组件封装
* */

class CheckItem extends Component {
    constructor(props){
        super(props);
        this.state = {
            percent:0
        }
    }



    render(){
        var processTypeText = "";
        var processType = "0";


        var currentDate = new Date().getTime();
        if(currentDate < this.props.data.EXEC_START_TIME){
            processTypeText = "";
            processType = "0";
            var dateTemp = this.props.data.EXEC_START_TIME - currentDate;
            var timeLengthHours = <Text style={{color:"#6DC5C9",fontSize:14}}>{Math.floor(dateTemp/(1000*60*60))+""}</Text>;
            var timeLengthMinutes = <Text style={{color:"#6DC5C9",fontSize:14}}>{Math.floor((dateTemp%(1000*60*60))/(60*1000))+""}</Text>;
            // processTypeText = processTypeText + timeLengthHours + timeLengthMinutes;
        }else if(this.props.data.EXEC_START_TIME <= currentDate && currentDate <= this.props.data.EXEC_END_TIME){
            processTypeText = <Text style={{color:"#6DC5C9",fontSize:14}}>进行中</Text>;
            processType = "1";
            var dateTemp = this.props.data.EXEC_END_TIME - currentDate ;
            var timeLengthHours = <Text style={{color:"#6DC5C9",fontSize:14}}>{Math.floor(dateTemp/(1000*60*60))+""}</Text>;
            var timeLengthMinutes = <Text style={{color:"#6DC5C9",fontSize:14}}>{Math.floor((dateTemp%(1000*60*60))/(60*1000))+""}</Text>;
            // processTypeText = processTypeText + timeLengthHours + timeLengthMinutes;
        }else if(currentDate > this.props.data.EXEC_END_TIME){
            processTypeText = <Text style={{color:"#FF6265",fontSize:14}}>超时</Text>;
            processType = "2";
            var dateTemp = currentDate - this.props.data.EXEC_END_TIME;
            var timeLengthHours = <Text style={{color:"#FF6265",fontSize:14}}>{Math.floor(dateTemp/(1000*60*60))+""}</Text>;
            var timeLengthMinutes = <Text style={{color:"#FF6265",fontSize:14}}>{Math.floor((dateTemp%(1000*60*60))/(60*1000))+""}</Text>;
            // processTypeText = processTypeText + timeLengthHours + "时" + timeLengthMinutes + "分";
        }

        let percent = 0;
        if(!db){
            db = SQLite.open();
        }
        let sql = "select * from auto_percent where taskId="+this.props.data.ID +" group by taskId";
        db.transaction((tx)=>{
            tx.executeSql(sql, [],(tx,results)=>{
                var len = results.rows.length;
                if(len===0){
                    percent = 0;
                    if(this.state.percent != percent){
                        this.setState({percent:percent})
                    }
                }else{
                    for(let i=0; i<len; i++){
                        var checkIm = results.rows.item(i);
                        if(checkIm && checkIm.percentF){
                            percent = parseInt(checkIm.percentF);
                            if(this.state.percent != percent) {
                                this.setState({percent: percent})
                            }
                        }
                    }
                }

            });
        },(error)=>{
            console.log(error);
        });
        return (
            <TouchableOpacity onPress={()=>{this.props.onPressItem(this.props.data)}} >
                <View style={{flex:1, backgroundColor:'white',flexDirection:'row',height:80,
                    alignItems:'center', justifyContent:'center', textAlignVertical:'center',}}>
                {/*{cachedResults.tabIndex === 0 &&*/}
                {/*<View style={{*/}
                    {/*backgroundColor:'rgba(239,249,249,0.6)',*/}
                    {/*position:"absolute",*/}
                    {/*width:(this.state.percent===1)?1:this.state.percent,*/}
                    {/*height:80,*/}
                    {/*left:0*/}
                    {/*}}*/}
                {/*/>}*/}
                <View style={{flex:3,paddingLeft:10}}>
                    <View style={{flexDirection:"row",justifyContent:"flex-start",alignItems:"center"}}>
                        {this.props.data.TABLE_TYPE === "0" &&
                        <Text style={{fontSize:10,borderWidth:1,borderColor:"#47AAFA",width:28,height:15,textAlign:"center",color:"#068AFA",
                            borderBottomRightRadius: 2,borderBottomLeftRadius: 2,borderTopLeftRadius: 2,borderTopRightRadius: 2}}
                        >设备
                        </Text>
                        }
                        {this.props.data.TABLE_TYPE === "1" &&
                        <Text style={{fontSize:10,borderWidth:1,borderColor:"#47AAFA",width:28,height:15,textAlign:"center",color:"#068AFA",
                            borderBottomRightRadius: 4,borderBottomLeftRadius: 4,borderTopLeftRadius: 2,borderTopRightRadius: 2}}
                        >制度
                        </Text>
                        }
                        {this.props.data.TABLE_TYPE === "2" &&
                        <Text style={{fontSize:10,borderWidth:1,borderColor:"#47AAFA",width:28,height:15,textAlign:"center",color:"#068AFA",
                            borderBottomRightRadius: 2,borderBottomLeftRadius: 4,borderTopLeftRadius: 2,borderTopRightRadius: 2}}
                        >场所
                        </Text>
                        }
                        <Text style={{fontSize:17, color:'#404040', marginLeft:10, }}>{this.props.data.JOB_NAME}</Text>
                    </View>
                    <Text style={{fontSize:13, color:'#aaa', marginLeft:0, marginTop:10,}}>{moment(this.props.data.EXEC_START_TIME).format("MM\/DD HH:mm")+"—"+moment(this.props.data.EXEC_END_TIME).format("MM\/DD HH:mm")}</Text>
                </View>
                {cachedResults.tabIndex === 0 &&
                    <View style={{flex:2, flexDirection:'column',justifyContent:'flex-end',alignItems:'flex-end',  textAlignVertical:'center',paddingRight:10}}>
                        {processType==="0" &&
                            <Text style={{fontSize:13, color:'#6DC5C9', marginLeft:0, marginRight:0,textAlign:'center',}}>待处理</Text>
                        }
                        {processType==="1" &&
                            <Text style={{fontSize:13, color:'#6DC5C9', marginLeft:0, marginRight:0,textAlign:'center',}}><Text style={{fontSize:17, color:'#6DC5C9'}}>{this.state.percent}%</Text>完成</Text>
                        }
                        {processType==="2" &&
                            <Text style={{fontSize:13, color:'#FF6265', marginLeft:0, marginRight:0,textAlign:'center',}}><Text style={{fontSize:17, color:'#FF6265'}}>{this.state.percent}%</Text>完成</Text>
                        }
                        {processType==="2" &&
                        <Text style={{fontSize:13, color:'#999', marginLeft:0, marginRight:0,textAlign:'right',}}>{processTypeText}{timeLengthHours}时{timeLengthMinutes}分</Text>
                        }
                        {processType!=="2" &&
                        <Text style={{fontSize:13, color:'#999', marginLeft:0, marginRight:0,textAlign:'right',}}>{processTypeText}剩{timeLengthHours}时{timeLengthMinutes}分</Text>
                        }
                        <Text style={{fontSize:12,borderWidth:1,borderColor:"#6DC5C9",width:36,height:16,textAlign:"center",color:"#6DC5C9",
                            borderBottomRightRadius: 2,borderBottomLeftRadius: 2,borderTopLeftRadius: 2,borderTopRightRadius: 2,marginTop:2}}
                        >+关注
                        </Text>
                    </View>
                }
                {cachedResults.tabIndex === 1 &&
                    <View style={{flex:2,flexDirection:'column',justifyContent:'flex-end',alignItems:'flex-end',  textAlignVertical:'center',paddingRight:10}}>
                        <Text style={{fontSize:16, color:'#999', marginLeft:0, marginRight:8,textAlign:'center',}}>已完成</Text>
                    </View>
                }
                </View>

            </TouchableOpacity>
        );
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
      backgroundColor:'#e9e9e9',height:1,width:(Dimens.screen_width),marginTop:0,marginLeft:0,
    },
    separator: {
       height: 5,
       backgroundColor: '#f6f6f6'
    }
  });