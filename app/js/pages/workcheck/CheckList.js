
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
    ScrollView, TouchableHighlight, Dimensions
} from 'react-native';


import BaseComponent from '../../base/BaseComponent'
import * as Dimens from '../../value/dimens';
import RefreshListView from '../../component/RefreshListView'
import SQLite from "../../polling/SQLite";
import CheckSqLite from "../../polling/CheckSqLite";
import moment from "moment";
import Axios from "../../../util/Axios";

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
/*
* 巡检二级页面
* */
export default class CheckList extends BaseComponent {
    static navigationOptions = {
        header: null,
    };
  constructor(props){
    super(props);
    const { navigation } = this.props;

    this.state={
        tabIndex:0,
        theme:this.props.theme,
        beginTime:navigation.getParam('beginTime', ''),
        endTime:navigation.getParam('endTime', ''),
        jobCode:navigation.getParam('jobCode', ''),
        jobExecCode:navigation.getParam('jobExecCode', ''),
        dailyTaskCode:navigation.getParam('dailyTaskCode', ''),
        taskId:navigation.getParam('taskId', ''),
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
    }
  }


    componentDidMount() {
        cachedResults.tabIndex = 0;
        this._fetchData(0);
    }
    // componentWillReceiveProps(){
    //     cachedResults.tabIndex = 0;
    //     this._fetchData(0);
    // }

  _renderSeparatorView(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
    return (
      <View key={`${sectionID}-${rowID}`} style={styles.separator} />
    );
  }
  //跳转巡检三级页面
  onPressItem(data){

        const {navigation} = this.props;
        InteractionManager.runAfterInteractions(() => {
            navigation.navigate('CheckDetail',{
                theme:this.theme,
                manCode:data.MAN_CODE,
                equipmentId:data.equipment_id,
                equipmentName:data.equipment_name,
                equipmentTypeId:data.equipment_type_id,
                jobExecCode:this.state.jobExecCode,
                jobCode:this.state.jobCode,
                dailyTaskCode:this.state.dailyTaskCode,
                beginTime:this.state.beginTime,
                endTime:this.state.endTime,
                taskId:this.state.taskId,
                callback: (
                    () => {
                        this._fetchData(0);
                    })
            });
        });

  }

  renderItem(data, i) {
      this.getProcess(data, i);
  }
    //获取当前设备进度
    getProcess(data, i){
        let percent = 0;
        if(!db){
            db = SQLite.open();
        }
        let sql = "select * from auto_percent where taskId="+ "'"+this.props.taskId+"'" +" and equipmentId= "+"'"+this.props.data.equipment_id+"'";
        db.transaction((tx)=>{
            tx.executeSql(sql, [],(tx,results)=>{
                var len = results.rows.length;
                let isUp = "0";
                if(len===0){
                    percent = 0;
                    // this.setState({percent:percent})
                }else{
                    // console.log(len);
                    for(let i=0; i<len; i++){
                        var checkIm = results.rows.item(i);
                        console.log(checkIm);
                        if(checkIm && checkIm.percentZ){
                            percent = parseInt(parseFloat(checkIm.percentZ)*ScreenWidth);
                            isUp = checkIm.isUp;
                            // if(percent!=this.state.percent){
                            // this.setState({percent:percent})
                            // }
                            // if(checkIm.isUp){
                            //     this.setState({isUp:"1"})
                            // }
                        }
                    }
                }
                return <CheckItem data={data} percent={percent} isUp={isUp} taskId={this.state.taskId} beginTime={this.state.beginTime} endTime={this.state.endTime} key={i} onPressItem = {(data)=>this.onPressItem(data)}/>
            });
        },(error)=>{
            console.log(error);
        });
    }



    //请求数据
    _fetchData(page) {
        if(!db){
            db = SQLite.open();
        }
        cachedResults.items = [];
        if(cachedResults.tabIndex === 0){
            var itemTemp = [];
            var itemSpecial = [];
            //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.
            var sql = checkSqLite.selectSecondCheckZero(this.state.jobCode);
            db.transaction((tx)=>{
                tx.executeSql(sql, [],(tx,results)=>{
                    var len = results.rows.length;
                    for(let i=0; i<len; i++){
                        var checkIm = results.rows.item(i);
                        itemTemp.push(checkIm);
                    }
                });
                sql = checkSqLite.selectSecondCheckOne(this.state.jobCode);
                tx.executeSql(sql, [],(tx,results)=>{
                    var len = results.rows.length;
                    // console.log(len)
                    if(len>0){
                        for(let i=0; i<len; i++){
                            var checkIm = results.rows.item(i);
                            // console.log(checkIm);
                            var equipmentIdList = checkIm.OBJ_ID.split(",");
                            var lenE = equipmentIdList.length;
                            for (let j=1;j<lenE;j++){
                                var tempSql = checkSqLite.selectSecondCheckEquipment(equipmentIdList[j]);
                                tx.executeSql(tempSql, [],(tx,results)=>{
                                    var lenTemp = results.rows.length;
                                    // console.log(lenTemp);
                                    for(let z=0; z<lenTemp; z++){
                                        var checkIm = results.rows.item(z);
                                        // console.log(checkIm);
                                        checkIm.showSpecial = 1;
                                        itemSpecial.push(checkIm);
                                        // cachedResults.items.push(checkIm);
                                        if(i===len-1 && j===lenE-1 && z===lenTemp-1){
                                            var listTemp = [];

                                            itemSpecial.forEach((itmN)=>{
                                                var flag = 0
                                                itemTemp.forEach((itm)=>{
                                                    if(itm.equipment_id === itmN.equipment_id){
                                                        itm.showSpecial = 1;
                                                        flag = 1;
                                                    }
                                                })
                                                if(flag===0){
                                                    listTemp.push(itmN);
                                                }
                                            })

                                            listTemp.forEach((im)=>{
                                                itemTemp.push(im);
                                            })
                                            itemTemp.forEach((itm)=>{
                                                cachedResults.items.push(itm);
                                            })
                                            this.setState({
                                                isLoadingTail: false,
                                                isRefreshing: false,
                                                dataSource: this.state.dataSource.cloneWithRows(cachedResults.items)
                                            });

                                        }
                                    }

                                })
                            }
                        }
                    }else{
                        itemTemp.forEach((itm)=>{
                            cachedResults.items.push(itm);
                        })
                        this.setState({
                            isLoadingTail: false,
                            isRefreshing: false,
                            dataSource: this.state.dataSource.cloneWithRows(cachedResults.items)
                        });

                    }
                });
            },(error)=>{
                console.log(error);
            });
            //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

        }else if(cachedResults.tabIndex === 1){
            var sql = checkSqLite.selectSecondCheck(this.state.jobCode);
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
        }else if(cachedResults.tabIndex === 2){
            var sql = checkSqLite.selectSecondCheck(this.state.jobCode);
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

  // onPressTabItem(data, i) {
  //   cachedResults.items = [];
  //   cachedResults.items.push({});
  //   cachedResults.items.push({});
  //   cachedResults.items.push({});
  //   cachedResults.items.push({});
  //   cachedResults.items.push({});
  //
  //   cachedResults.huoItems = [];
  //   cachedResults.huoItems.push({});
  //   cachedResults.huoItems.push({});
  //   cachedResults.huoItems.push({});
  //   this.setState({selectIndex:i, });
  // }
  //
  // renderTabItem(item, i) {
  //   var color = this.state.selectIndex===i?'#6DC5C9':'#333';
  //   var text = '全部';
  //   if (i === 1) {
  //     text = '未完成(8)';
  //   } else if (i === 2) {
  //     text = '紧急(8)';
  //   }
  //   return (
  //     <TouchableOpacity onPress={()=>{this.onPressTabItem(item, i)}} style={{flex:1, backgroundColor:'white',
  //        height:40, alignItems:'center', justifyContent:'center', textAlignVertical:'center',}}>
  //       <Text style={{fontSize:13, color:color, marginLeft:0, marginRight:0,textAlign:'center',flex:1, alignItems:'center', justifyContent:'center', textAlignVertical:'center',}}>{text}</Text>
  //       <View style={{backgroundColor: color, height:this.state.selectIndex===i?2:0, width:70}}/>
  //     </TouchableOpacity>
  //   );
  // }

    goBack(){
        const { navigate } = this.props.navigation;
        this.props.navigation.goBack();
        this.props.navigation.state.params.callback()
    }
    captrue() {

    }
    //未完成、紧急、全部数据切换
    onPressTabItem(index){
        cachedResults.items = [];
        cachedResults.tabIndex = index;
        cachedResults.total = 0;
        cachedResults.pages = 0;
        cachedResults.nextPage = 1;
        this.setState({tabIndex:index, dataSource: this.state.dataSource.cloneWithRows(cachedResults.items)});
        this._fetchData(0);
    }

  render() {
      var tabBar = <View style={{backgroundColor:'white', height:49, justifyContent:'center', flexDirection:'row', bottom:0}}>
          <TouchableOpacity onPress={()=>{this.onPressTabItem(0)}} style={{alignItems:'center',textAlignVertical:'center', height:49, justifyContent:'center',flex:1}}>
              <View style={{alignItems:'center',textAlignVertical:'center', height:49, justifyContent:'center',flex:1}}>
                  <Text style={{color:this.state.tabIndex===0 ?'#5ec4c8':'#999',fontSize:14, textAlign:'center', textAlignVertical:'center'}}>未完成</Text>
              </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{this.onPressTabItem(0)}} style={{alignItems:'center',textAlignVertical:'center', height:49, justifyContent:'center',flex:1}}>
              <View style={{alignItems:'center',textAlignVertical:'center', height:49, justifyContent:'center',flex:1}}>
                  <Text style={{color:this.state.tabIndex===1 ?'#5ec4c8':'#999',fontSize:14, textAlign:'center', textAlignVertical:'center'}}>紧急</Text>
              </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{this.onPressTabItem(0)}} style={{alignItems:'center',textAlignVertical:'center', height:49, justifyContent:'center',flex:1}}>
              <View style={{alignItems:'center',textAlignVertical:'center', height:49, justifyContent:'center',flex:1}}>
                  <Text style={{color:this.state.tabIndex===2 ?'#5ec4c8':'#999',fontSize:14, textAlign:'center', textAlignVertical:'center'}}>全部</Text>
              </View>
          </TouchableOpacity>
      </View>
    // var itemView = cachedResults.items.map((item, i)=>this.renderItem(item, i));
    return (
      <View style={styles.container}>
      <View style={{height:44,backgroundColor:'white',justifyContent:'center', textAlignVertical:'center', flexDirection:'row',alignItems:'center', marginBottom:5}}>
          <TouchableHighlight style={{width:50,height:44,alignItems:"center",justifyContent:"center"}} onPress={()=>this.goBack()}>
              <Image style={{width:21,height:37}} source={require("../../../image/navbar_ico_back.png")}/>
          </TouchableHighlight>
          <View style={{flex:1,justifyContent:'center',alignItems:'center',height:30,fontWeight:"600"}}>
              <Text style={{color:'#555',fontSize:18,marginLeft:5, flex:1}}>巡检</Text>
          </View>
          <TouchableOpacity onPress={()=>this.captrue()}>
              <Image style={{width:16,height:20,marginLeft:5,marginRight:10}} source={require('../../../res/repair/navbar_ico_sys.png')} />
          </TouchableOpacity>
      </View>
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


class CheckItem extends Component {
    constructor(props){
        super(props);
        this.state = {
            percent:0,
            isUp:"0",
        }
    }
    // componentDidMount() {
    //     this.getProcess();
    // }

    // getProcess(){
    //     let percent = 0;
    //     if(!db){
    //         db = SQLite.open();
    //     }
    //     let sql = "select * from auto_percent where taskId="+ "'"+this.props.taskId+"'" +" and equipmentId= "+"'"+this.props.data.equipment_id+"'";
    //     db.transaction((tx)=>{
    //         tx.executeSql(sql, [],(tx,results)=>{
    //             var len = results.rows.length;
    //             if(len===0){
    //                 percent = 0;
    //                     this.setState({percent:percent})
    //             }else{
    //                 // console.log(len);
    //                 for(let i=0; i<len; i++){
    //                     var checkIm = results.rows.item(i);
    //                     console.log(checkIm);
    //                     if(checkIm && checkIm.percentZ){
    //                         percent = parseInt(parseFloat(checkIm.percentZ)*ScreenWidth);
    //                         // if(percent!=this.state.percent){
    //                             this.setState({percent:percent})
    //                         // }
    //                         if(checkIm.isUp){
    //                             this.setState({isUp:"1"})
    //                         }
    //                     }
    //                 }
    //             }
    //
    //         });
    //     },(error)=>{
    //         console.log(error);
    //     });
    // }

    render(){
        var processType = "0";
        var currentDate = new Date().getTime();


        if(currentDate < this.props.beginTime){
            processType = "0";
        }else if(this.props.beginTime <= currentDate && currentDate <= this.props.endTime){
            processType = "1";
        }else if(currentDate > this.props.endTime){
            processType = "2";
        }





        return (
            <TouchableOpacity onPress={()=>{this.props.onPressItem(this.props.data)}} style={{flex:1, backgroundColor:'#f6f6f6',width:Dimens.screen_width,}}>
                <View style={{flex:1, flexDirection:'row',height:80, width:Dimens.screen_width,
                    alignItems:'center', justifyContent:'center', textAlignVertical:'center',backgroundColor:"white"}}>
                    <View style={{
                        backgroundColor:'rgba(239,249,249,0.6)',
                        position:"absolute",
                        width:(this.props.percent===0)?0:this.props.percent,
                        height:80,
                        left:0
                    }}
                    />
                    <View style={{flex:3,}}>
                        <View style={{flexDirection:'row',alignItems:"center"}}>
                            <Text style={{fontSize:17, color:'#666', marginLeft:15,marginTop:0, textDecorationLine:'underline'}}>{this.props.data.equipment_name}</Text>
                            {this.props.data.showSpecial && this.props.data.showSpecial===1 &&
                            <Text style={{marginLeft:4,fontSize:12,textAlign:"center",color:"#666",borderRadius:4,borderWidth:1,borderColor:"#bbb",width:28,height:16}}>
                                特例
                            </Text>
                            }
                        </View>
                        <Text style={{fontSize:13, color:'#aaa', marginLeft:15, marginTop:3, }}>{this.props.data.install_location}</Text>
                        <Text style={{fontSize:13, color:'#aaa', marginLeft:15, marginTop:3,}}>{moment(this.props.beginTime).format("MM\/DD HH:mm")+"—"+moment(this.props.endTime).format("MM\/DD HH:mm")}</Text>

                    </View>
                    <View style={{flex:1,height:80,  textAlignVertical:'center',justifyContent:"center"}}>
                        <Text style={{fontSize:16,textAlign:"center"}}>
                            {/*Tiffany*/}
                        </Text>
                    </View>
                    <View style={{flex:1, justifyContent:'flex-end',paddingRight:10}}>

                            <View style={{flex:1, justifyContent:'flex-end', flexDirection:'column',alignItems:"center"}}>
                                {processType === "0" &&
                                    <Text style={{fontSize:16, color:'#FE8900', marginLeft:0, marginRight:12,}}>待开始</Text>
                                }
                                {processType === "1" &&
                                    <Text style={{fontSize:16, color:'#61C0C5', marginLeft:0, marginRight:12,}}>进行中</Text>
                                }
                                {processType === "2" &&
                                    <Text style={{fontSize:16, color:'#FE0000', marginLeft:0, marginRight:12,}}>已超时</Text>
                                }
                                {this.props.isUp === "1" &&
                                    <Text style={{fontSize:12, color:'#aaa', marginLeft:0, marginRight:12,}}>待上传</Text>
                                }
                            </View>

                    </View>
                </View>
                {/*<View style={{backgroundColor: '#f2f2f2', height:5, width:Dimens.screen_width, marginTop:5, }}/>*/}
            </TouchableOpacity>
        );
    }
}


  const styles = StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor: '#f2f2f2',
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
      backgroundColor:'#eeeeee',height:1,width:(Dimens.screen_width),marginTop:0,marginLeft:0,
    },
    separator: {
       height: 5,
       backgroundColor: '#f6f6f6'
    }
  });