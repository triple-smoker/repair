
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
    Modal,
    ScrollView,
    TouchableHighlight, DeviceEventEmitter, BackHandler,
} from 'react-native';


import BaseComponent from '../../base/BaseComponent'
import * as Dimens from '../../value/dimens';
import SQLite from "../../polling/SQLite";
import CheckSqLite from "../../polling/CheckSqLite";
import moment from "moment";
import md5 from "md5";
import Axios from '../../../util/Axios';
import NetInfo from '@react-native-community/netinfo';
import { toastShort } from '../../util/ToastUtil';
import Loading from 'react-native-easy-loading-view';
import ImagePickers from 'react-native-image-picker';
import Video from 'react-native-video';
import Request, {RepairCommenced} from "../../http/Request";
import { ProcessingManager } from 'react-native-video-processing';

let cachedResults = {
  nextPage: 1, // 下一页
  items: [], // 
  total: 0, // 总数
  pages:0
};

var username = '';
var db;
var checkSqLite = new CheckSqLite();
var dateSourceItem =[];
/*
* 巡检三级页面
* */
export default class CheckDetail extends BaseComponent {
    static navigationOptions = {
        header: null,
    };
  constructor(props){
    super(props);
      const { navigation } = this.props;
    this.state={
      selectIndex:0,
      theme:this.props.theme,
      manCode:navigation.getParam('manCode', ''),
      jobCode:navigation.getParam('jobCode', ''),
      jobExecCode:navigation.getParam('jobExecCode', ''),
      dailyTaskCode:navigation.getParam('dailyTaskCode', ''),
      beginTime:navigation.getParam('beginTime', ''),
      endTime:navigation.getParam('endTime', ''),
      equipmentId:navigation.getParam('equipmentId', ''),
      equipmentName:navigation.getParam('equipmentName', ''),
      equipmentTypeId:navigation.getParam('equipmentTypeId', ''),
      taskId:navigation.getParam('taskId', ''),
      tableType:navigation.getParam('tableType', ''),
      modalVisible:false,
      dateSource:[],
      personText:"",
      person:0,
    }
  }



  componentDidMount() {
    this._fetchData();
      //监听物理返回键
      if (Platform.OS === 'android') {
          BackHandler.addEventListener("back", this.onBackClicked);
      }
  }
    //卸载前移除物理监听
    componentWillUnmount() {
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener("back", this.onBackClicked);
        }
    }
    //BACK物理按键监听
    onBackClicked = () => {
        Loading.dismiss();
        clearTimeout(this.timeout);
        const { navigate } = this.props.navigation;
        this.props.navigation.state.params.callback()
        this.props.navigation.goBack();
        return true;
    }
    //列表数据获取
    _fetchData(){
        if(!db){
            db = SQLite.open();
        }
        dateSourceItem = [];
        var sql = checkSqLite.selectThirdCheck(this.state.manCode);
        db.transaction((tx)=>{
            tx.executeSql(sql, [],(tx,results)=>{
                var len = results.rows.length;
                for(let i=0; i<len; i++){
                    var checkIm = results.rows.item(i);
                    checkIm.resultString=null;
                    console.log(checkIm);
                    dateSourceItem.push(checkIm);
                }
                this.setState({
                    dataSource: dateSourceItem,
                    personText:0+"/"+dateSourceItem.length,
                    person:0
                });

            });
        },(error)=>{
            console.log(error);
        });

    }

  // componentWillUnmount() {
  //
  // }

  goBack(){
      clearTimeout(this.timeout);
      Loading.dismiss();
        const { navigate } = this.props.navigation;
        this.props.navigation.state.params.callback()
        this.props.navigation.goBack();
  }

    gotoRepair(item){
        // imagePos=-1;
        var stateInfo = {
            manCode:this.state.manCode,
            jobCode:this.state.jobCode,
            jobExecCode:this.state.jobExecCode,
            dailyTaskCode:this.state.dailyTaskCode,
            beginTime:this.state.beginTime,
            endTime:this.state.endTime,
            equipmentId:this.state.equipmentId,
            equipmentName:this.state.equipmentName,
            equipmentTypeId:this.state.equipmentTypeId,
            taskId:this.state.taskId,
            tableType:this.state.tableType,
        }


        const { navigate } = this.props.navigation;
        InteractionManager.runAfterInteractions(() => {
            navigate('Repair',{
                tableType:this.state.tableType,
                repairContent:item.ITEM_NAME,
                replaceName:this.state.equipmentName,
                stateInfo:stateInfo
            })
        });
    }

  //单任务
  getItem(){
      var list = dateSourceItem;
      // console.log("___"+list);
      var listItem =  list === null ? null : list.map((item, index) =>
          <CheckItem key={index} gotoRepair={()=>this.gotoRepair(item)} pickSingleWithCamera={()=>this.pickSingleWithCamera()} num={index+1} data={item} onPressFeedback={(dataString,resultString)=>{this.onPressFeedback(dataString,resultString)}}/>
      );
      return listItem;
  }


  

  render() {

    return (
      <View style={styles.container}>
      <View style={{height:44,backgroundColor:'white',justifyContent:'center', textAlignVertical:'center', flexDirection:'row',alignItems:'center', marginBottom:5}}>
          <TouchableOpacity style={{width:50,height:44,alignItems:"center",justifyContent:"center"}} onPress={()=>this.goBack()}>
              <Image style={{width:21,height:37}} source={require("../../../image/navbar_ico_back.png")}/>
          </TouchableOpacity>
          <View style={{flex:1,justifyContent:'center',alignItems:'center',height:30,fontWeight:"600"}}>
              <Text style={{color:'#555',fontSize:18, flex:1}}>{this.state.equipmentName}</Text>
          </View>
          <View style={{width:50}}/>
      </View>

      <View style={styles.line} />
      <ScrollView horizontal={false} indicatorStyle={'white'} showsVerticalScrollIndicator={true} style={{width:Dimens.screen_width,flex:1}}>
        <View style={{flexDirection:'row',marginLeft:10,textAlignVertical:'center',}}>
            <View style={{marginLeft:15,marginTop:20,marginBottom:20,flexDirection:'row',height:3,backgroundColor:'#fff', width:Dimens.screen_width-95}}> 
                  <View style={{flexDirection:'row',height:3,backgroundColor:'#6DC5C9', width: (Dimens.screen_width-95)*(this.state.person)}}/>
            </View>
            <Text style={{color:'#333',fontSize:12, marginLeft:10,marginRight:10,marginTop:10,}}>{this.state.personText}</Text>
        </View>
          {this.getItem()}
          <View style={{height:46}}/>
      </ScrollView>
      <Loading
          ref={(view)=>{Loading.loadingDidCreate(view)}} // 必须调用
          top={86} // 如果需要在loading或者hud的时候可以点击导航上面的按钮，建议根据自己导航栏具体高度来设置。如果不需要点击可以不设置
          offsetY={-150} // 默认loading 和 hud 会在 去掉top之后高度的中间，如果觉得位置不太合适，可以通着offsetY来调整
      />
      <Text
            onPress={()=>this._onSure()}
            style={styles.button}>提交</Text>
      <Modal
            animationType={"none"}
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {this.setState({modalVisible:false})}}
        >

        <View style={styles.modelStyle}>
            <View style={[styles.popupStyle1, {marginTop:(Dimens.screen_height-130)/2,backgroundColor:'#fbfbfb',}]}>
                <View style={{width:Dimens.screen_width-80, height:40,flexDirection:'row',
          alignItems:'center', justifyContent:'center', textAlignVertical:'center',}}>
                <Image source={require('../../../res/static/ic_feedback_deng.png')} style={{width:23,height:28, marginLeft:0,marginRight:5,}}/>
                <Text style={{fontSize:16,color:'#333',marginLeft:0,marginTop:0,textAlign:'center',height:40,textAlignVertical:'center',}}>反馈</Text>
                </View>
                <View style={{backgroundColor:'#eeeeee',height:1,width:(Dimens.screen_width-80),}} />
                <Text onPress={()=>this.onChangeType(0)} style={{alignItems:'center',justifyContent:'center',textAlignVertical:'center',fontSize:14,color:'#333',marginLeft:0,textAlign:'center',marginTop:0,width:Dimens.screen_width-80, height:40}}>自报自修</Text>
                <View style={{backgroundColor:'#eeeeee',height:1,width:(Dimens.screen_width-80),}} />
                <Text onPress={()=>this.onChangeType(1)} style={{alignItems:'center',justifyContent:'center',textAlignVertical:'center',fontSize:14,color:'#333',marginLeft:0,textAlign:'center',marginTop:0,width:Dimens.screen_width-80, height:40}}>异常反馈</Text>
         
            </View>
        </View>
    </Modal> 
      </View>
      )
    }

    //任务填写
    onPressFeedback(dataString,resultString) {
        var i =0;
        dateSourceItem.forEach((item)=>{
            if(item.ID===dataString.ID){
                item.resultString = resultString;
            }
            if(item.resultString){
                i++;
            }
        })
        if(dateSourceItem.length>0){
            this.setState({
                personText:i+"/"+dateSourceItem.length,
                person:i/dateSourceItem.length
            });
        }else{
            this.setState({
                personText:i+"/"+dateSourceItem.length,
                person:0
            });
        }


    }
  //确认提交
  _onSure() {
        // console.log(dateSourceItem);
      if(this.state.person!==1){
          toastShort("请完善您的上报单！");
          return null;
      }
      var dateSourceItemTemp = [];
        dateSourceItem.forEach((item)=>{
            // console.log(item);
            var code = this.state.taskId+""+this.state.jobCode+""+this.state.jobExecCode+""+this.state.manCode+""+this.state.equipmentId+""+item.ITEM_CODE;
            code = md5(code,32);
            var itemResultSet = "正常";
            if(item.ITEM_FORMAT === "数值型"){
                let nums = item.ITEM_RESULT_SET.split("~");
                 var min = "";
                 var max = "";
                if(nums.length === 2){
                    min = nums[0];
                    max = nums[1];
                }

                if( parseFloat(item.resultString)< parseFloat(min) || parseFloat(item.resultString) > parseFloat(max)){
                    itemResultSet = "不正常";
                }
            }
            var requestN = {
                "code": code, //这个字段值用(jobCode+jobExecCode+manCode+equipmentId+itemCode)数字 形成就好，满足两个人上传同一个任务检查项时此字段一致
                "dailyTaskCode": this.state.dailyTaskCode,  //第一页的daily_task code携带
                "equipmentId": this.state.equipmentId, //第二页携带
                "equipmentTypeId": this.state.equipmentTypeId,  //第二页携带
                "execEndTime": moment(this.state.endTime).format("YYYY-MM-DD HH:mm:ss"),   //第一页携带
                "execStartTime": moment(this.state.beginTime).format("YYYY-MM-DD HH:mm:ss"),  //第一页携带
                "fillDate": moment().format("YYYY-MM-DD HH:mm:ss"),  //填报的业务时间
                "itemCode": item.ITEM_CODE,    //第三页 检查项表的itemcode
                "itemResultSet": itemResultSet,                  //正常（数值型根据参考值判断，超过范围显示‘异常’）
                "jobCode": this.state.jobCode,        //第一页的daily_task jobCode携带
                "jobExecCode": this.state.jobExecCode,     //第一页的daily_task jobExecCode携带
                "manCode": this.state.manCode,      //第二页 mancode携带
                "reportBy": global.uinfo.userName,                 //用户名
                // "reportDate": moment().format("YYYY-MM-DD HH:mm:ss"),
                "reportDate": null,
                "resultDesc": (item.resultString===null)? "":item.resultString,   //选项内容、哈哈哈哈、url、url、double
                "status": "1",
                "ITEM_FORMAT":item.ITEM_FORMAT,
            }
            console.log(requestN);
            dateSourceItemTemp.push(requestN);
        })

        // var connected = false;
        NetInfo.fetch().then(state => {
            console.log("网络监测："+state.isConnected);
            if(state.isConnected){
                console.log("上传接口");
                Loading.showHud();
                var i = 0;
                dateSourceItemTemp.forEach((item)=>{
                    console.log(item);
                    if(item.ITEM_FORMAT==="拍照型"){
                        var that = this;
                        Request.uploadFile(item.resultDesc, (result)=> {
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
                                        console.log("++++++++++++++");
                                        console.log(response);
                                        i++;
                                        if(i===dateSourceItemTemp.length){
                                            toastShort("数据已上报");
                                            clearTimeout(this.timeout);
                                            Loading.dismiss();
                                            this.goBack();
                                        }

                                    })
                            }else{
                                toastShort("图片上传不成功，请重新尝试");
                                clearTimeout(this.timeout);
                                Loading.dismiss();
                                return null;
                            }
                        });
                    }else if(item.ITEM_FORMAT==="视频型"){
                        let compressOptions = {
                            width: 720,
                            height: 1280,
                            bitrateMultiplier: 3,
                            saveToCameraRoll: true, // default is false, iOS only
                            saveWithCurrentDate: true, // default is false, iOS only
                            minimumBitrate: 300000,
                        };
                        ProcessingManager.compress(item.resultDesc, compressOptions) // like VideoPlayer compress options
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
                                                console.log("++++++++++++++");
                                                console.log(response);
                                                i++;
                                                if(i===dateSourceItemTemp.length){
                                                    clearTimeout(this.timeout);
                                                    Loading.dismiss();
                                                    toastShort("数据已上报");
                                                    this.goBack();
                                                }
                                            })
                                    }else{
                                        clearTimeout(this.timeout);
                                        Loading.dismiss();
                                        toastShort("视频上传不成功，请重新尝试");
                                        return null;
                                    }
                                });
                            });
                    }else{
                        item.ITEM_FORMAT=null;
                        Axios.PostAxiosUpPorter("http://47.102.197.221:5568/daily/report",item).then(
                            (response)=>{
                                console.log("++++++++++++++");
                                console.log(response);
                                i++;
                                if(i===dateSourceItemTemp.length){
                                    clearTimeout(this.timeout);
                                    Loading.dismiss();
                                    toastShort("数据已上报");
                                    this.goBack();
                                }
                            })
                    }

                })

                this.timeout = setTimeout(
                    ()=>
                    {
                        if(i!==dateSourceItemTemp.length){
                            Loading.dismiss();
                            toastShort('提交失败，请检查后重试！');
                            return null;
                        }
                    }, 61*1000
                )


            }else{
                SQLite.insertData(dateSourceItemTemp,"auto_up");
                if (!db) {
                    this.open();
                }
                db.transaction((tx)=>{
                        let sql = "update auto_percent set isUp ='1' where taskId="+ "'" +this.state.taskId+ "'" +" and equipmentId= "+"'"+this.state.equipmentId+"'";
                    tx.executeSql(sql,()=>{
                            },(err)=>{
                                console.log(err);
                            }
                        );
                },(error)=>{
                    console.log('transaction', error);
                },()=>{
                    console.log('transaction insert data');
                    toastShort("数据已保存");
                    this.goBack();
                });
            }

        });

  }

    onChangeType(index) {
      this.setState({modalVisible:false, });

    }
    goBack(){
        const { navigate } = this.props.navigation;
        this.props.navigation.goBack();
        this.props.navigation.state.params.callback()
    }

    /**
     * 相机拍摄图片
     * @param cropping
     * @param mediaType
     */
    pickSingleWithCamera(){
        // imagePos = 0;
        const {navigation} = this.props;
        InteractionManager.runAfterInteractions(() => {
            navigation.navigate('TakePicture',{
                theme:this.theme
            })
        });
    }



}

/*
* 每个任务项渲染
* */
// var imagePos = -1;
// var videoPos = "";
class CheckItem extends Component {
    constructor(props){
        super(props);
        this.state={
            causeChecked:"",
            stringText:(this.props.data.ITEM_FORMAT === "文本型")?this.props.data.ITEM_RESULT_SET:"",
            imagePath0:null,
            videoPos:"",
            imagePos:-1,
            // imageUrl0:null
        }
    }
    getCaues(causeNmae){
        this.setState({causeChecked:causeNmae})
    }
    componentDidMount() {
        var that = this;
        this.eventListener = DeviceEventEmitter.addListener('Event_Take_Photo', (param) => {
            console.log('componentDidMount Event_Take_Photo : ' + param + ", imagePos : "  );
            if(this.props.data.ITEM_FORMAT === "拍照型" && this.state.imagePos===0){
                that.setState({imagePath0:param,});
                this.props.onPressFeedback(this.props.data,param);
                this.eventListener.remove();
            }
            // that.uploadFile(param);
        });

    }
    componentWillUnmount() {
        // global.imageUrl0 = null;
        Loading.dismiss();
        clearTimeout(this.timeout);
        if(this.eventListener){
            this.eventListener.remove();
        }
    }
    /**
     * 拍摄视频，限时15秒
     */
    selectVideoTapped() {
        const options = {
            mediaType: 'video',
            videoQuality: 'low',
            durationLimit: 15
        };

        ImagePickers.launchCamera(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled video picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                console.log('video response : ' + response)
                let video = {
                    path : 'file://' + response.path,
                    type : 'video',
                }
                console.log('video : ' + JSON.stringify(video))
                // videoPos = video.path;
                this.setState({videoPos:video.path})
                this.props.onPressFeedback(this.props.data,video.path);
            }

        });
    }

    render(){
        var imageSource0 = this.state.imagePath0 ? {uri:this.state.imagePath0} : null;
        var listItem;
        var stringText="";
        if(this.props.data.ITEM_FORMAT === "选择型"){
            if(this.props.data.ITEM_RESULT_SET){
                var itemString = this.props.data.ITEM_RESULT_SET;
                var items = itemString.split(";");
                // this.setState({causeList:items});
                listItem =  items === null ? null : items.map((item, index) =>
                    <View key={index} style={{height:40}} >
                        <TouchableOpacity onPress={()=>{this.getCaues(item),this.props.onPressFeedback(this.props.data,item)}} style={{flexDirection:'row',textAlignVertical:'center',}}>
                            {this.state.causeChecked===item &&
                                <Image source={require('../../../res/static/ic_checked.png')} style={{width:18,height:18, marginLeft:10,marginTop:11,}}/>
                            }
                            {this.state.causeChecked!==item &&
                            <Image source={require('../../../res/login/checkbox_nor.png')} style={{width:18,height:18, marginLeft:10,marginTop:11,}}/>
                            }
                            <Text style={{color:'#333',fontSize:13, marginLeft:10,marginRight:10,marginTop:10,height:40,}}>{item}</Text>
                        </TouchableOpacity>
                    </View>
                );
            }
        }
        return (
            <View>
                <View style={{backgroundColor:'white',flexDirection:'row', height:35,
                    alignItems:'center', justifyContent:'center', textAlignVertical:'center',}}>
                    <Text style={{fontSize:13, color:'#333', marginLeft:15,flex:1, }}>{this.props.num+"、"+this.props.data.ITEM_NAME}</Text>
                    <TouchableOpacity  onPress={()=>{this.props.gotoRepair(),this.setState({imagePos:-1})}}>
                        <View style={{backgroundColor:'white',flexDirection:'row',justifyContent:'center',alignItems:'center', marginRight:10, textAlignVertical:'center',borderWidth:1, borderColor:'#6DC5C9',
                            borderBottomRightRadius:5,borderBottomLeftRadius:5,borderTopLeftRadius:5,borderTopRightRadius:5, paddingLeft:5, paddingRight:5}}>
                            <Image source={require('../../../res/static/ic_feedback_deng.png')} style={{width:18,height:22, marginLeft:5,}}/>
                            <Text style={{flexWrap:'nowrap', marginLeft:5,
                                color:'#6DC5C9',fontSize:10, textAlignVertical:'center', textAlign:'center',marginRight:5, }}>反馈</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.line} />

                {this.props.data.ITEM_FORMAT === "选择型" &&
                    <View style={{backgroundColor:'#ffffff',}} >
                        {listItem}
                    </View>
                }
                {this.props.data.ITEM_FORMAT === "文本型" &&
                    <View style={{backgroundColor:'#ffffff',height:100}} >
                        <TextInput
                            style={styles.input_style}
                            placeholder="请输入..."
                            placeholderTextColor="#aaaaaa"
                            underlineColorAndroid="transparent"
                            multiline = {true}
                            ref={'stringText'}
                            autoFocus={false}
                            onChangeText={(text) => {
                                this.props.onPressFeedback(this.props.data,text);
                                this.setState({stringText: text})
                            }}
                            value={this.state.stringText}
                        />
                    </View>
                }
                {this.props.data.ITEM_FORMAT === "拍照型"&&
                <View style={{backgroundColor:'#ffffff',height:120}} >
                    <TouchableOpacity onPress={()=>{this.props.pickSingleWithCamera(),this.setState({imagePos:0})}}>
                        {imageSource0===null &&
                        <View style={{borderRadius:4,borderWidth:1,borderColor:"#61C0C5",borderStyle:'dotted',zIndex:10,width:81,height:80,alignItems:'center', justifyContent:'center', textAlignVertical:'center',marginLeft:15,marginTop:15,}} >
                            <Image source={require('../../../res/static/ic_add.png')} style={{width:26,height:27, }}/>
                            <Text style={{fontSize:13, color:'#999', marginTop:5, }}>拍照</Text>
                        </View>
                        }
                        {imageSource0 !== null &&
                        <View style={{borderRadius:4,borderWidth:1,borderColor:"#61C0C5",borderStyle:'dotted',zIndex:10,width:81,height:80,alignItems:'center', justifyContent:'center', textAlignVertical:'center',marginLeft:15,marginTop:15,}} >
                            <Image source={imageSource0} style={{zIndex:10,width: 75, height: 70}}/>
                        </View>
                        }
                    </TouchableOpacity>
                </View>
                }
                {this.props.data.ITEM_FORMAT === "视频型"&&
                    <View style={{backgroundColor:'#ffffff',height:120}} >
                        <TouchableOpacity onPress={()=>this.selectVideoTapped()}>
                            {this.state.videoPos==="" &&
                            <View style={{borderRadius:4,borderWidth:1,borderColor:"#61C0C5",borderStyle:'dotted',zIndex:10,width:81,height:80,alignItems:'center', justifyContent:'center', textAlignVertical:'center',marginLeft:15,marginTop:15,}} >
                                <Image source={require('../../../res/static/ic_add.png')} style={{width:26,height:27, }}/>
                                <Text style={{fontSize:13, color:'#999', marginTop:5, }}>视频(15s)</Text>
                            </View>
                            }
                            {this.state.videoPos!=="" &&
                            <View style={{borderRadius:4,borderWidth:1,borderColor:"#61C0C5",borderStyle:'dotted',zIndex:10,width:81,height:80,alignItems:'center', justifyContent:'center', textAlignVertical:'center',marginLeft:15,marginTop:15,}} >
                                {/*<Image source={imageSource0} style={{zIndex:10,width: 75, height: 70}}/>*/}
                                <View  style={{zIndex:10,width: 75, height: 70}}>
                                    <Video source={{uri: this.state.videoPos}}
                                           style={{position: 'absolute',
                                               top: 0,
                                               left: 0,
                                               bottom: 0,
                                               right: 0
                                           }}
                                           rate={1}
                                           paused={true}
                                           volume={1}
                                           muted={false}
                                           resizeMode={'cover'}
                                           onError={e => console.log(e)}
                                           onLoad={load => console.log(load)}
                                           repeat={true} />
                                </View>
                            </View>
                            }

                        </TouchableOpacity>
                    </View>
                }
                {this.props.data.ITEM_FORMAT === "数值型" &&
                <View style={{backgroundColor:'#ffffff',height:40}} >
                    <TextInput
                        style={{paddingVertical: 0,marginTop:10, textAlignVertical:'top', textAlign:'left',backgroundColor: 'white',fontSize: 14,height:30, marginLeft:15,marginRight:15, paddingLeft:8,paddingRight:8,paddingTop:5,paddingBottom:5,}}
                        placeholder={"建议输入["+this.props.data.ITEM_RESULT_SET+"]"}
                        placeholderTextColor="#aaaaaa"
                        underlineColorAndroid="transparent"
                        multiline = {true}
                        value={this.state.stringText}
                        autoFocus={false}
                        rowSpan={1}
                        maxLength={20}
                        keyboardType='numeric'
                        onChangeText={(text) => {
                            var newText = text.replace(/[^(\-|\.?)\d]+/, '');
                            var newTextString = newText.replace(/[0-9][\-]/,'')
                            var newTextStringTo = newTextString.replace(/^(\.)/,'')
                            this.props.onPressFeedback(this.props.data,newTextStringTo);
                            this.setState({stringText: newTextStringTo})
                        }}
                    />
                </View>
                }

                <View style={{width:Dimens.screen_width,height:5}} />

            </View>
        );
    }
}


  const styles = StyleSheet.create({
    modelStyle:{
        flex: 1,
        width:Dimens.screen_width,
        height:Dimens.screen_height,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    popupStyle1:{
        marginLeft:40,
        width:Dimens.screen_width-80,
        height:134,
        backgroundColor: 'white',
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15,
        borderTopLeftRadius: 15,
        borderTopRightRadius:15, 
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
  input_style:{
        paddingVertical: 0,marginTop:10, textAlignVertical:'top', textAlign:'left',backgroundColor: 'white',fontSize: 14,height:80, marginLeft:15,marginRight:15, paddingLeft:8,paddingRight:8,paddingTop:5,paddingBottom:5,
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
      // position: 'absolute',
      // bottom: 0,
      // left: 0,
      // right: 0,
      alignSelf: 'center'
    },
    line:{
      backgroundColor:'#eeeeee',height:1,width:(Dimens.screen_width),marginTop:0,marginLeft:0,
    },

  });