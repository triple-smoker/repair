import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    DeviceEventEmitter,
    InteractionManager,
    TouchableOpacity,
    ScrollView,
    Modal,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import Swiper from 'react-native-swiper';
import TitleBar from '../../component/TitleBar';
import * as Dimens from '../../value/dimens';
import Request, {AuthToken, GetRepairType, ScanMsg} from '../../http/Request';
import Permissions from 'react-native-permissions';

import NfcManager, {Ndef} from 'react-native-nfc-manager';
import {FLAG_TAB} from "../entry/MainPage";
import SQLite from "../../polling/SQLite";
import Axios from "../../../util/Axios";
import { toastShort } from '../../util/ToastUtil';
import {Loading} from "../../component/Loading";
import {aesEncrypt} from "../../util/CipherUtils";

const bannerImgs=[
require('../../../res/default/banner_01.jpg'),
require('../../../res/default/banner_02.jpg'),
require('../../../res/default/banner_03.jpg')
]

/*
* 首页菜单
* */
var db;
export default class HomePage extends Component {
    static navigationOptions = {
        header: null,
    };
    constructor(props){
        super(props);
        this.state={
            customThemeVisible:false,
            theme:this.props.theme,
            modalVisible:false,
            tag:null,
            // typeVisible:false,
        }
    }
    componentDidMount() {
        this.eventListener = DeviceEventEmitter.addListener('Event_Home', (param) => {
            console.log('componentDidMount Home : ' + param);
        });
        // this.loadUserInfo();
        // this.loadRepairTypes();
        Permissions.request('storage', { type: 'always' }).then(response => {

        });
        this._startDetection();
        this.getSqlite();
    }
    componentWillReceiveProps(){
        this.getSqlite();
    }
    componentWillUnmount() {
        db=null;
        this.timer &&  (this.timer);
        if(this.eventListener){
            this.eventListener.remove();
        }
        NfcManager.unregisterTagEvent();
    }

    getSqlite(){
        var sqLiteTimeTemp = "0"
        //开启数据库
        if(!db){
            db = SQLite.open();
        }
        //建表
        // sqLite.createTable();
        AsyncStorage.getItem("hospitalInfo", function (error, result) {
            if (error) {
                console.log("读取失败");
            } else {
                if (result) {
                    var hospitalInfo = JSON.parse(result);
                    if (hospitalInfo && hospitalInfo.selectZuHuData && hospitalInfo.selectYuanQuData) {
                        var tenantKey = hospitalInfo.selectZuHuData.tenantKey;
                        var tenantKeyAes = aesEncrypt(tenantKey);
                        AsyncStorage.getItem('sqLiteTimeTemp'+tenantKeyAes,function (error, result) {

                            if (error) {
                                // alert('读取失败')
                            }else {
                                var sqlTime = JSON.parse(result);
                                if(sqlTime != null && sqlTime != ""){
                                    sqLiteTimeTemp = sqlTime;
                                }
                                console.log(">>>>>>>>>>>>")
                                console.log(sqLiteTimeTemp)
                                //数据同步接口条用
                                let url = "/api/generaloperation/portal/batchSynchronization/ModulesName?time="+sqLiteTimeTemp+"&modulesName=xunjian";
                                Axios.GetAxios(url,{}).then(
                                    (response)=>{
                                        // console.log(response);
                                        if(Array.isArray(response.data)&&response.data.length>1){
                                            let key = 'sqLiteTimeTemp'+tenantKeyAes;
                                            //json转成字符串
                                            let jsonStr = JSON.stringify(response.data[0]);
                                            //存储
                                            AsyncStorage.setItem(key, jsonStr, function (error) {

                                                if (error) {
                                                    console.log('存储失败')
                                                }else {
                                                    console.log('存储完成')
                                                }
                                            })
                                            var dates = response.data[1];
                                            for(var tableName in dates){
                                                if(dates[tableName]!=null&&dates[tableName].length>0){
                                                    SQLite.insertData(dates[tableName],tableName);
                                                }

                                            }
                                        }
                                        // toastShort("本地数据同步成功");
                                    }
                                );
                            }
                        }.bind(this))
                    }
                }
            }
        })


    }

    repair() {
        const { navigate } = this.props.navigation;
        navigate('AllOrder');
        
    }
    scan(){
        const { navigate } = this.props.navigation;
        navigate('Scan',{
            targetRouteName : 'Repair'
        });
    }


    takePicture() {
        global.access_token = "aa17de2a-f945-4b1e-8024-1f3e617d96ba";
        AsyncStorage.setItem('token', 'aa17de2a-f945-4b1e-8024-1f3e617d96ba', function (error) {
            if (error) {
                console.log('error: save error');
            }
        });
        AsyncStorage.getItem("logInfo", function (error, result) {
            // console.log('uinfo: result = ' + result + ', error = ' + error);
            if (error) {
                console.log('读取失败')
            } else {
                if (result) {
                    var logInfo = JSON.parse(result);
                    console.log(logInfo.username);
                    console.log(logInfo.password);
                }

            }
        })
        console.log("替换错误token：aa17de2a-f945-4b1e-8024-1f3e617d96ba");

    }

    //报修导航
    newRepair(){
        const { navigate } = this.props.navigation;
        navigate('Repair',{
            callback: (
                () => {

                })
        })
    }

    _onTagDiscovered = tag => {
        console.log('Tag Discovered', tag);
        this.setState({ tag:tag });
        // const {navigation} = this.props;
        // navigation.navigate('WorkManager',{
        //     theme:this.theme,
        //     scanId : tag.id,
        //     // equipmentId : result.data.equipmentId,
        //     // equipmentName: result.data.equipmentName,
        //     isScan : true,
        //     callback: (
        //         () => {
        //             this.setHome();
        //         })
        // })
        // alert(tag.id);
        this.showModel();

    }
    _onTagToEquiment(){
        const {navigation} = this.props;
        navigation.navigate('WorkManager',{
            theme:this.theme,
            scanId : this.state.tag.id,
            isScan : true,
            callback: (
                () => {
                    this.setHome();
                })
        })
    }
    _onTagToRepair(){
        Loading.show()
        Request.requestGet(ScanMsg + this.state.tag.id,null,(result) => {
            Loading.hidden()
            let { navigate } = this.props.navigation;
            navigate('Repair',{
                isScan : true,
                equipmentId : result.data.equipmentId,
                equipmentName: result.data.equipmentName,
            })
        })

    }


    setHome(){
        DeviceEventEmitter.emit('NAVIGATOR_ACTION', true);
        this.setState({
            selectedTab: FLAG_TAB.flag_popularTab,
        })
    }

    _startDetection = () => {
        NfcManager.registerTagEvent(this._onTagDiscovered)
            .then(result => {
                console.log('registerTagEvent OK', result)
            })
            .catch(error => {
                console.warn('registerTagEvent fail', error)
            })
    }

    _stopDetection = () => {
        NfcManager.unregisterTagEvent()
            .then(result => {
                console.log('unregisterTagEvent OK', result)
            })
            .catch(error => {
                console.warn('unregisterTagEvent fail', error)
            })
    }
    _test(){
        // this.showModel();
        // var rfid = '04C88A3A325E80';
        // var qrCode = 'bf27a82f-85b2-4000-8dac-bec8257c6d3a'
        // const {navigation} = this.props;
        //
        // Request.requestGet(ScanMsg+qrCode,null,(result) => {
        //     if(result && result.code === 200){
        //
        //         InteractionManager.runAfterInteractions(() => {
        //             navigation.navigate('WorkManager',{
        //                 theme:this.theme,
        //                 scanId : rfid,
        //                 isScan : true,
        //                 callback: (
        //                     () => {
        //                         this.setHome();
        //                     })
        //             })
        //         });
        //     }
        // })

    }
    _sqlite(){
        // const {navigation} = this.props;
        // InteractionManager.runAfterInteractions(() => {
        //     navigation.navigate('SQLiteDemo',{
        //         theme:this.theme,
        //     })
        // });
        // this.getSqlite();
    }

    render() {
        return (
          <View style={styles.container}>
          <TitleBar
          centerText={'首页'}
          isShowLeftBackIcon={false}
          navigation={this.props.navigation}
          />
          <ScrollView horizontal={false} indicatorStyle={'white'} showsVerticalScrollIndicator={true} style={{height:Dimens.screen_height-49-64, width:Dimens.screen_width,flex:1}}>
          <View style={styles.images}>
          <Swiper autoplay={true} loop = {true} style={styles.images} autoplayTimeout={4}
          dot={<View style={{backgroundColor:'rgba(0,0,0,0.2)', width: 6, height: 6,borderRadius: 3, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3,}} />}
          activeDot={<View style={{backgroundColor: 'black', width: 14, height: 6, borderRadius: 3, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3}} />}
          paginationStyle={{
            bottom: 10
        }}>
        <View style={{backgroundColor:'transparent'}}>
        <Image style={styles.images} source={bannerImgs[0]} resizeMode={'contain'}/>
        </View>
        <View style={{backgroundColor:'transparent'}}>
        <Image style={styles.images} source={bannerImgs[1]} resizeMode={'contain'}/>
        </View>
        <View style={{backgroundColor:'transparent'}}>
        <Image style={styles.images} source={bannerImgs[2]} resizeMode={'contain'}/>
        </View>
        </Swiper>
        </View>
        <TouchableOpacity onPress={()=>{}}>
        <View style={{backgroundColor:'#f6f6f6', height:80, width:Dimens.screen_width, justifyContent:'center', textAlignVertical:'center', flexDirection:'row', alignItems:'center',}}>
                <Image source={require('../../../res/login/ic_notice.png')}
                style={{width:50,height:40,marginLeft:20}}/>
                <View style={{flex:1,}}>
                  <View style={{flexDirection:'row',}}>
                      <Text style={{fontSize:12,color:'#999',marginLeft:10,marginTop:5,}}>8:30</Text>
                      <Text style={{fontSize:12,color:'#333',marginLeft:10,marginTop:5,marginRight:30,}} numberOfLines={2}>系统提示：您尾号3048的订单已经派单。</Text>
                   </View>
                  <View style={{flexDirection:'row',}}>
                      <Text style={{fontSize:12,color:'#999',marginLeft:10,marginTop:5,}}>8:30</Text>
                      <Text style={{fontSize:12,color:'#333',marginLeft:10,marginTop:5,marginRight:30,}} numberOfLines={2}>医院公告：因电力故障，今日下午2点将紧急抢修半小时，全院人员需做好准备工作…</Text>
                  </View>
                </View>

                <View style={{justifyContent:'flex-end',flexDirection:'row',alignItems:'center',}}>
                <Image source={require('../../../res/login/ic_arrow.png')} style={{width:6,height:11,marginLeft:10, marginRight:10,}}/>
                </View>
        </View>
        </TouchableOpacity>

        <View style={{justifyContent:'center',flexDirection:'row',alignItems:'center',marginTop:10,paddingLeft:10,paddingRight:10,}}>
            <Image source={require('../../../res/login/menu_ljyc_01.jpeg')} style={{width:172,height:185,borderBottomRightRadius: 15,borderBottomLeftRadius: 15,borderTopLeftRadius: 15,borderTopRightRadius: 15,}}/>
            <View style={{justifyContent:'center',alignItems:'center',marginLeft:10, }}>
                <TouchableOpacity  onPress={()=>this.scan()}>
                <Image source={require('../../../res/login/menu_ljbx_01.jpeg')} style={{width:172,height:87,borderBottomRightRadius: 10,borderBottomLeftRadius: 10,borderTopLeftRadius: 10,borderTopRightRadius: 10,}}/>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Image source={require('../../../res/login/menu_ljdc_01.jpeg')} style={{width:172,height:87,borderBottomRightRadius: 10,borderBottomLeftRadius: 10,borderTopLeftRadius: 10,borderTopRightRadius: 10,marginTop:10,}}/>
                </TouchableOpacity>
            </View>
        </View>

        <View style={{backgroundColor:'#f6f6f6',height:10,width:Dimens.screen_width,marginTop:10,}}/>

        <View style={{justifyContent:'center',flexDirection:'row',alignItems:'center',marginTop:20,paddingLeft:0,paddingRight:0,}}>
            <View style={{justifyContent:'center',alignItems:'center',flex:1}}>
              <TouchableOpacity onPress={()=>this.newRepair()}>
                <Image source={require('../../../res/login/ico_bx.png')} style={{width:45,height:45,marginLeft:0, marginRight:0,}}/>
                <Text style={{fontSize:12,color:'#333',marginLeft:0,marginTop:5,textAlign:'center',}}>报修</Text>
                </TouchableOpacity>
            </View>

            <View style={{justifyContent:'center',alignItems:'center',flex:1}}>
                <TouchableOpacity onPress={()=>this.repair()}>
                <Image source={require('../../../res/login/ico_pj.png')} style={{width:45,height:45,marginLeft:0, marginRight:0,}}/>
                <Text style={{fontSize:12,color:'#333',marginLeft:0,marginTop:5,textAlign:'center',}}>报修单</Text>
                </TouchableOpacity>
            </View>
            <View style={{justifyContent:'center',alignItems:'center',flex:1}}>
                <TouchableOpacity onPress={()=>this.takePicture()}>
                <Image source={require('../../../res/login/ico_ts.png')} style={{width:45,height:45,marginLeft:0, marginRight:0,}}/>
                <Text style={{fontSize:12,color:'#333',marginLeft:0,marginTop:5,textAlign:'center',}}>一卡通</Text>
                </TouchableOpacity>
            </View>

            <View style={{justifyContent:'center',alignItems:'center',flex:1}}>
                <TouchableOpacity>
                <Image source={require('../../../res/login/ico_dc.png')} style={{width:45,height:45,marginLeft:0, marginRight:0,}}/>
                <Text style={{fontSize:12,color:'#333',marginLeft:0,marginTop:5,textAlign:'center',}}>送餐</Text>
                </TouchableOpacity>
            </View>
        </View>

        <View style={{justifyContent:'center',flexDirection:'row',alignItems:'center',marginTop:20,paddingLeft:0,paddingRight:0,}}>
            <View style={{justifyContent:'center',alignItems:'center',flex:1}}>
                <TouchableOpacity onPress={()=>this. _startDetection()} >
                <Image source={require('../../../res/login/ico_bj.png')} style={{width:45,height:45,marginLeft:0, marginRight:0,}}/>
                <Text style={{fontSize:12,color:'#333',marginLeft:0,marginTop:5,textAlign:'center',}}>清洁</Text>
                </TouchableOpacity>
            </View>

            <View style={{justifyContent:'center',alignItems:'center',flex:1}}>
                {/* <TouchableOpacity onPress={()=>this. _stopDetection()} > */}
                <Image source={require('../../../res/login/ico_yf.png')} style={{width:45,height:45,marginLeft:0, marginRight:0,}}/>
                <Text style={{fontSize:12,color:'#333',marginLeft:0,marginTop:5,textAlign:'center',}}>医疗</Text>
                {/* </TouchableOpacity> */}
            </View>
            <View style={{justifyContent:'center',alignItems:'center',flex:1}}>
                <TouchableOpacity onPress={()=>this._sqlite()} >
                <Image source={require('../../../res/login/ico_ys.png')} style={{width:45,height:45,marginLeft:0, marginRight:0,}}/>
                <Text style={{fontSize:12,color:'#333',marginLeft:0,marginTop:5,textAlign:'center',}}>运输</Text>
                </TouchableOpacity>
            </View>

            <View style={{justifyContent:'center',alignItems:'center',flex:1}}>
                <TouchableOpacity onPress={()=>this._test()}>
                <Image source={require('../../../res/login/ico_more.png')} style={{width:45,height:45,marginLeft:0, marginRight:0,}}/>
                <Text style={{fontSize:12,color:'#333',marginLeft:0,marginTop:5,textAlign:'center',}}>更多</Text>
                </TouchableOpacity>
            </View>
        </View>

        <View style={{backgroundColor:'#fff',height:80,width:Dimens.screen_width,marginTop:0,}}/>
        </ScrollView>

        <Modal
            animationType={"none"}
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {this.hideModel()}}
        >

        <View style={styles.modelStyle}>
            <TouchableOpacity onPress={()=>this.hideModel()} style={{width:Dimens.screen_width,height:"50%"}}>
            </TouchableOpacity>
            <View style={styles.gridStyle}>
                <TouchableOpacity onPress={()=>{this._onTagToRepair(),this.hideModel()}}>
                    <Text style={{fontSize:20,fontWeight:"bold",color:'#333',height:50,borderBottomWidth:1,borderBottomColor:"#61C0C5",textAlign:'center',textAlignVertical:"center",width:Dimens.screen_width}}>NFC设备报修</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{this._onTagToEquiment(),this.hideModel()}}>
                    <Text style={{fontSize:20,fontWeight:"bold",color:'#333',height:50,borderTopWidth:1,borderTopColor:"#61C0C5",textAlign:'center',textAlignVertical:"center",width:Dimens.screen_width}}>NFC设备查看</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={()=>this.hideModel()} style={{width:Dimens.screen_width,height:"50%"}}>
            </TouchableOpacity>
        </View>
        </Modal>


    </View>
        )
    }


    hideModel() {
        this.setState({modalVisible:false});
    }

    showModel() {
        this.setState({modalVisible:true});
    }
}


const styles = StyleSheet.create({

    modelStyle:{
        flex: 1,
        width:Dimens.screen_width,
        height:Dimens.screen_height,
        backgroundColor: 'rgba(0,0,0,0.1)',
        justifyContent:"center",
        alignItems:"center",
    },
    gridStyle:{
        width:Dimens.screen_width,
        height:100,
        backgroundColor: 'rgba(255,255,255,0.9)',
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
    },

    welcome:{
        color:'#123456',

    },

    images:{
        height:160,
        width: Dimens.screen_width,
    }
});
