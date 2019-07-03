
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
      setInterval(() => {
          this._fetchData(0);
      }, 60000);
      // 每10分钟检测一遍是否有报表需要上传
      // setInterval(() => {
      //     this._pushData();
      // }, 600000);

  }


  componentDidMount() {
      cachedResults.tabIndex = 0;
      this._fetchData(0);

  }
    // componentWillReceiveProps(){
    //     cachedResults.tabIndex = 0;
    //     this._fetchData(0);
    // }
  //获取auto_up表中的信息进行网络添加
    _pushData(){
        NetInfo.fetch().then(state => {
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
            Axios.PostAxiosUpPorter(checkIm).then(
                (response)=>{
                    if(response && response.id){
                        if(!db){
                            db = SQLite.open();
                        }
                        let sql = "delete from auto_up where code="+"'"+checkIm.code+"'";
                        db.transaction((tx)=>{
                            tx.executeSql(sql,()=>{
                                        console.log("本地删除成功");
                                },(err)=>{
                                    console.log(err);
                                }
                            );
                        },(error)=>{
                            console.log(error);
                        });
                    }
                })
        })

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
                callback: (
                    () => {
                        this._fetchData(0);
                    })
            });
        });

  }

  renderItem(data,i) {

    return (
        <CheckItem data={data} key={i} onPressItem = {(data)=>this.onPressItem(data)}/>
    );
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
        if(!db){
            db = SQLite.open();
        }
        cachedResults.items = [];
       if(cachedResults.tabIndex === 0){
           var timeStamp = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
           var sql = checkSqLite.selectFirstCheck(global.deptId,timeStamp);
           db.transaction((tx)=>{
               tx.executeSql(sql, [],(tx,results)=>{
                   var len = results.rows.length;
                   console.log(len);
                   for(let i=0; i<len; i++){
                       var checkIm = results.rows.item(i);
                       console.log(checkIm);
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
                  <Text style={{color:this.state.tabIndex===0 ?'#5ec4c8':'#999',fontSize:14, textAlign:'center', textAlignVertical:'center'}}>当前巡检</Text>
              </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{this.onPressTabItem(1)}} style={{alignItems:'center',textAlignVertical:'center', height:49, justifyContent:'center',flex:1}}>
              <View style={{alignItems:'center',textAlignVertical:'center', height:49, justifyContent:'center',flex:1}}>
                  <Text style={{color:this.state.tabIndex===1 ?'#5ec4c8':'#999',fontSize:14, textAlign:'center', textAlignVertical:'center'}}>历史巡检</Text>
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
let percent = 1;
class CheckItem extends Component {
    constructor(props){
        super(props);
        this.state = {
            percent:1
        }
        this.getNetworkData(this.props.data.ID);
    }
    getNetworkData(taskId){
        Axios.GetAxiosUpPorter("http://47.102.197.221:8081/api/dailyTask/getReportListByTaskId?taskId="+taskId).then(
            (response)=>{
                var dataList = [];
                if(Array.isArray(response) && response.length>0){
                    var sum = 0;
                    response.forEach((item)=>{
                        console.log(item);
                        if(item.completion === "已完成"){
                            sum++;
                        }
                        var data = {rqCode:moment().format("YYYYMMDD")+""+taskId,
                            taskId:taskId,
                            equipmentId:item.equipmentId,
                            percentF:"",
                            percentZ:item.completed,
                            isUp:""}
                        dataList.push(data);
                    })
                    dataList.forEach((item)=>{
                        item.percentF = parseInt((sum/dataList.length)*ScreenWidth);
                        item.percentF = item.percentF===0 ? 1:item.percentF
                        // percent =  parseInt((sum/dataList.length)*ScreenWidth);
                        // console.log("************"+sum+"/"+dataList.length);
                    })
                    SQLite.insertData(dataList,"auto_percent");
                }
            })
    }

    render(){
        var processTypeText = "";
        var processType = "0";

        var currentDate = new Date().getTime();
        if(currentDate < this.props.data.EXEC_START_TIME){
            processTypeText = "距离开始还剩";
            processType = "0";
            var dateTemp = this.props.data.EXEC_START_TIME - currentDate;
            var timeLengthHours = Math.floor(dateTemp/(1000*60*60))+"小时";
            var timeLengthMinutes = Math.floor((dateTemp%(1000*60*60))/(60*1000))+"分钟";
            processTypeText = processTypeText + timeLengthHours + timeLengthMinutes;
        }else if(this.props.data.EXEC_START_TIME <= currentDate && currentDate <= this.props.data.EXEC_END_TIME){
            processTypeText = "距离结束还剩";
            processType = "1";
            var dateTemp = this.props.data.EXEC_END_TIME - currentDate ;
            var timeLengthHours = Math.floor(dateTemp/(1000*60*60))+"小时";
            var timeLengthMinutes = Math.floor((dateTemp%(1000*60*60))/(60*1000))+"分钟";
            processTypeText = processTypeText + timeLengthHours + timeLengthMinutes;
        }else if(currentDate > this.props.data.EXEC_END_TIME){
            processTypeText = "已超时";
            processType = "2";
            var dateTemp = currentDate - this.props.data.EXEC_END_TIME;
            var timeLengthHours = Math.floor(dateTemp/(1000*60*60));
            var timeLengthMinutes = Math.floor((dateTemp%(1000*60*60))/(60*1000));
            processTypeText = processTypeText + timeLengthHours + "小时" + timeLengthMinutes + "分钟";
        }

        if(!db){
            db = SQLite.open();
        }
        let sql = "select * from auto_percent where rqCode="+moment().format("YYYYMMDD") + "" +this.props.data.ID;
        db.transaction((tx)=>{
            tx.executeSql(sql, [],(tx,results)=>{
                var len = results.rows.length;
                console.log(len);
                if(len===0){
                    percent = 1;
                    if(percent!=this.state.percent){
                        this.setState({percent:percent})
                    }
                    // console.log("========="+percent);
                }else{
                    for(let i=0; i<len; i++){
                        var checkIm = results.rows.item(i);
                        if(checkIm && checkIm.percentF){
                            percent = parseInt(checkIm.percentF);
                        }
                        // console.log("========="+percent);
                        if(percent!=this.state.percent){
                            this.setState({percent:percent})
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
                {cachedResults.tabIndex === 0 &&
                <View style={{
                    backgroundColor:'rgba(239,249,249,0.6)',
                    position:"absolute",
                    width:(percent===0)?1:percent,
                    height:80,
                    left:0
                    }}
                />}
                <View style={{flex:3,}}>
                    <Text style={{fontSize:17, color:'#404040', marginLeft:10, }}>{this.props.data.JOB_NAME}</Text>
                    <Text style={{fontSize:13, color:'#aaa', marginLeft:10, marginTop:10,}}>{moment(this.props.data.EXEC_START_TIME).format("MM\/DD HH:mm")+"—"+moment(this.props.data.EXEC_END_TIME).format("MM\/DD HH:mm")}</Text>
                </View>
                <View style={{flex:1,height:80,  textAlignVertical:'center',justifyContent:"center"}}>
                        {this.props.data.TABLE_TYPE === "0" &&
                            <Text style={{fontSize:16,borderWidth:1,borderColor:"#aaa",width:40,height:22,textAlign:"center",
                                borderBottomRightRadius: 4,borderBottomLeftRadius: 4,borderTopLeftRadius: 4,borderTopRightRadius: 4}}
                            >设备
                            </Text>
                        }
                        {this.props.data.TABLE_TYPE === "1" &&
                            <Text style={{fontSize:16,borderWidth:1,borderColor:"#aaa",width:40,height:22,textAlign:"center",
                                borderBottomRightRadius: 4,borderBottomLeftRadius: 4,borderTopLeftRadius: 4,borderTopRightRadius: 4}}
                            >制度
                            </Text>
                        }
                        {this.props.data.TABLE_TYPE === "2" &&
                            <Text style={{fontSize:16,borderWidth:1,borderColor:"#aaa",width:40,height:22,textAlign:"center",
                                borderBottomRightRadius: 4,borderBottomLeftRadius: 4,borderTopLeftRadius: 4,borderTopRightRadius: 4}}
                            >场所
                            </Text>
                        }


                </View>
                {cachedResults.tabIndex === 0 &&
                    <View style={{flex:2, flexDirection:'column',justifyContent:'flex-end',alignItems:'flex-end',  textAlignVertical:'center',paddingRight:10}}>
                        {processType==="0" &&
                            <Text style={{fontSize:16, color:'#FE8900', marginLeft:0, marginRight:5,textAlign:'center',}}>待开始</Text>
                        }
                        {processType==="1" &&
                            <Text style={{fontSize:16, color:'#61C0C5', marginLeft:0, marginRight:5,textAlign:'center',}}>进行中</Text>
                        }
                        {processType==="2" &&
                            <Text style={{fontSize:16, color:'#FE0000', marginLeft:0, marginRight:5,textAlign:'center',}}>已超时</Text>
                        }
                        <Text style={{fontSize:13, color:'#999', marginLeft:0, marginRight:5,textAlign:'right',}}>{processTypeText}</Text>
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