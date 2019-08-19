import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    InteractionManager,
    TextInput,
    ListView,
    Modal,
    NativeModules
    // AsyncStorage,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import BaseComponent from '../../base/BaseComponent'
import * as Dimens from '../../value/dimens';
import Pop from 'rn-global-modal'
import Request, {AuthToken, GetUserInfo, GetZuHu ,GetYuanQuById} from '../../http/Request';
import {Toast} from '../../component/Toast'
import {aesEncrypt,aesEncryptWithKey} from '../../util/CipherUtils';
import Axios from '../../../util/Axios';
import {toastShort} from "../../util/ToastUtil";
import SQLite from "../../polling/SQLite";



var username = '';
var password = '';
var db;
export default class Login extends BaseComponent {

    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            focusIndex: -1,
            nameBgColor: '#eeeeee',
            pswBgColor: '#eeeeee',
            theme: this.props.theme,
            keepPsw: false,
            dialogShow: false,
            dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => {
                    if (r1 !== r2) {
                        console.log("不相等=");
                        console.log(r1);
                    } else {
                        console.log("相等=");
                        console.log(r1);
                        console.log(r2);
                    }
                    return true//r1.isSelected !== r2.isSelected;
                }
            }),
            selectIndex: '-1',
            modalVisible: false,
            username:null,
            password:null,
            zuhuList:[],
            yuanquList:[],
            dataSourceZuHu:new ListView.DataSource({
                rowHasChanged: (r1, r2)=> {
                    if (r1 !== r2) {
                    } else {
                        console.log("相等=");
                    }
                    return true//r1.isSelected !== r2.isSelected;
                }
            }),
            dataSourceYuanQu:new ListView.DataSource({
                rowHasChanged: (r1, r2)=> {
                    if (r1 !== r2) {
                    } else {
                        console.log("相等=");
                    }
                    return true//r1.isSelected !== r2.isSelected;
                }
            }),
            selectZuHuData:null,
            selectYuanQuData:null,
            selectZuHuName:null,
            selectZuHuNameTemp:"",
            selectYuanQuName:null,
            selectYuanQuNameTemp:"",
            dataMap:new Map(),
        }

    }

    componentDidMount(){
        this.loadData();
        this.loadZuHu();
        this.getHospitalInfo();
    }
    componentWillUnmount() {
        db=null;
    }
    getHospitalInfo(){
        var that = this;
        AsyncStorage.getItem("hospitalInfo", function (error, result) {
            if (error) {
                console.log("读取失败");
            } else {
                if (result) {
                    var hospitalInfo = JSON.parse(result);
                    if (hospitalInfo && hospitalInfo.selectZuHuData && hospitalInfo.selectYuanQuData) {
                        that.setState({
                            selectZuHuName:hospitalInfo.selectZuHuData.tenantName,
                            selectYuanQuName:hospitalInfo.selectYuanQuData.hospitalName,
                        });
                        var tenantKey = hospitalInfo.selectZuHuData.tenantKey;
                        var tenantKeyAes = aesEncrypt(tenantKey);
                        tenantKeyAes = encodeURIComponent(tenantKeyAes);
                        global.hospitalId = hospitalInfo.selectYuanQuData.hospitalId;
                        global.xTenantKey = tenantKeyAes;
                    }
                }
            }
        })
    }
    loadData(){
        var that = this;
        AsyncStorage.getItem('logInfo',function(err,res){
            if(err){
                console.log(err)
                return
            }else{
                var logininfo =  JSON.parse(res);
                if(logininfo){
                    that.setState({
                        username:username,
                        password:password,
                        keepPsw:((username!==null&&username!=="")&&(password!==null&&password!==""))?true:false
                    })
                }
                
            }
        })
      
    }
    loadZuHu(){
        var params = new Map();
        params.set('isGetZuHu', true);
        // var param = "Uf2k7ooB77T16lMO4eEkRg==";
        Request.requestGetZuHu(GetZuHu,null  ,(result)=> {
            console.log(result)
            if(result.data&&Array.isArray(result.data)){
                this.setState({zuhuList:result.data});
            }
        });
    }
    _onFocus(index) {

        if (index === 0) {
            this.setState({
                focusIndex: index,
                nameBgColor: '#5ec4c8',
                pswBgColor: '#eeeeee',
            });
        } else if (index === 1) {

            this.setState({
                focusIndex: index,
                pswBgColor: '#5ec4c8',
                nameBgColor: '#eeeeee',
            });
        }

        console.log('_onFocus2 : ' + this.state.focusIndex + ", this.state.nameBgColor = " + this.state.nameBgColor);
    }

    _onRemember() {
        console.log('onRemember');
        this.setState({keepPsw: !this.state.keepPsw});
    }

    _setting() {
        const {navigation} = this.props;
        InteractionManager.runAfterInteractions(() => {
            navigation.navigate('Setting', {theme: this.theme})
        });
    }

    _onForgotPsw() {

       
        const {navigation} = this.props;
        InteractionManager.runAfterInteractions(() => {
            navigation.navigate('findPsw', {theme: this.theme})
        });
    }

    _onLogin() {

    if(username === ''){
         Toast.show('用户名不能为空');
         return;
     }
     if (password === '') {
         Toast.show('密码不能为空');
         return;
     }
    var that = this;
    AsyncStorage.getItem("hospitalInfo", function (error, result) {
        if (error) {
            console.log("读取失败");
            return;
        } else {
            if (result) {

                var hospitalInfo = JSON.parse(result);
                if(hospitalInfo&&hospitalInfo.selectZuHuData&&hospitalInfo.selectYuanQuData){
                var tenantKey = hospitalInfo.selectZuHuData.tenantKey;
                var tenantKeyAes = aesEncrypt(tenantKey);
                tenantKeyAes = encodeURIComponent(tenantKeyAes);
                global.hospitalId = hospitalInfo.selectYuanQuData.hospitalId;
                global.xTenantKey = tenantKeyAes;

                 var keepPsw = that.state.keepPsw;
                 var psw = aesEncrypt(password);
                 console.log('password: ' + password + ', psw加密: ' + psw);
                 var params = new Map();
                 params.set('username', username);
                 params.set('password', encodeURIComponent(psw));
                 global.access_token = null;
                 Request.requestGet(AuthToken, params, (result)=> {

                        console.log(result)

                        if (result && result.access_token) {
                            var logInfo = {
                                username: username,
                                password: encodeURIComponent(password)
                            }
                            var logMsg = {
                                username: username,
                                password: encodeURIComponent(psw)
                            }
                            var logInfoString = JSON.stringify(logInfo);
                            var logMsgString = JSON.stringify(logMsg);

                            AsyncStorage.setItem('logMsg', logMsgString, function (error) {
                                if (error) {
                                    console.log('error: save error');
                                } else {
                                    console.log('save: logMsg = ' + logMsgString);
                                }
                            });

                            if(keepPsw){
                                AsyncStorage.setItem('logInfo', logInfoString, function (error) {
                                    if (error) {
                                        console.log('error: save error');
                                    } else {
                                        console.log('save: logInfo = ' + logInfo);
                                    }
                                });
                            }else{
                                AsyncStorage.setItem('logInfo', '', function (error) {
                                    if (error) {
                                        console.log('error: save error');
                                    }
                                });
                            }
                            global.access_token = result.access_token;
                            global.tenant_code = result.tenant_code;
                            AsyncStorage.setItem('token', result.access_token, function (error) {
                                if (error) {
                                    console.log('error: save error');
                                } else {
                                    console.log('save: access_token = ' + result.access_token);
                                }
                            });
                            that.fetchUserInfo();
                        } else {

                            Toast.show('用户名或密码错误');
                        }

                    });
                }else{
                    Toast.show('请选择院区');
                    return;
                }
            }else{
                Toast.show('请选择院区');
                return;
            }
        }
    })

    }

    logout(){
        global.access_token = null;
        global.deptId = null;
        global.userId = null;
        global.permissions = null;
        global.uinfo = null;
        AsyncStorage.setItem('token', '', function (error) {
            if (error) {
                console.log('error: save error');
            }
        });

        AsyncStorage.setItem('uinfo', '', function (error) {
            if (error) {
                console.log('error: save error' + JSON.stringify(error));
            }

        });
        AsyncStorage.setItem('logMsg', '', function (error) {
            if (error) {
                console.log('error: save error' + JSON.stringify(error));
            }

        });
        this.setState({keepPsw:false,username:"",password:""});
    }

    fetchUserInfo() {
        var that = this;
        Request.requestGet(GetUserInfo, null, (result) => {
            console.log(result);
            console.log('result.code: ' + result.code + ', is 200: ' + (result.code === 200));
            if (result && result.code === 200) {

                global.uinfo = result.data;
                if(result.data&&result.data.userId){global.userId = result.data.userId;}else{
                    Toast.show('请完善后勤基础资料');
                    this.logout();
                    return;
                }
                if(result.data&&result.data.deptAddresses.length>0){global.deptId = global.uinfo.deptAddresses[0].deptId;}else{
                    Toast.show('请完善后勤基础资料');
                    this.logout();
                    return;
                }
                var permissions = "3";
                if(global.uinfo.roleType==="ROLE_FOREMAN"){
                     permissions = "1";
                }
                if(global.uinfo.roleType==="ROLE_ENGINEER"){
                     permissions = "2";
                }
                if(global.uinfo.roleType===null){
                     permissions = "3";
                }
                global.permissions = permissions;
                NativeModules.MPush.bindAccount(global.tenant_code + global.userId,(callback)=>{
                    console.info(callback)
                });
                Toast.show('登录成功');
                AsyncStorage.setItem('uinfo', JSON.stringify(result.data), function (error) {
                    if (error) {
                        console.log('error: save error' + JSON.stringify(error));
                    } else {
                        console.log('save: uinfo = ' + JSON.stringify(result.data));
                    }
                    const {navigation} = that.props;
                    InteractionManager.runAfterInteractions(() => {
                        navigation.navigate('App', {theme: this.theme})
                    });
                });
            }

        });
    }

    _hide() {
        Pop.hide();
        this.setState({modalVisible: false});
    }
    submit() {
        if(this.state.selectZuHuData!==null&&this.state.selectYuanQuData!==null){
            Pop.hide();
            this.setState({modalVisible: false,selectZuHuName:this.state.selectZuHuNameTemp,selectYuanQuName:this.state.selectYuanQuNameTemp});
            var hospitalInfo = {
                selectZuHuData:this.state.selectZuHuData,
                selectYuanQuData:this.state.selectYuanQuData
            }
            var tenantKey = hospitalInfo.selectZuHuData.tenantKey;
            var tenantKeyAes = aesEncrypt(tenantKey);
            tenantKeyAes = encodeURIComponent(tenantKeyAes);
            global.hospitalId = hospitalInfo.selectYuanQuData.hospitalId;
            global.xTenantKey = tenantKeyAes
            db = SQLite.open();
            AsyncStorage.setItem('hospitalInfo', JSON.stringify(hospitalInfo), function (error) {
                if (error) {
                    console.log('error: hospitalInfo error' + JSON.stringify(error));
                } else {
                    console.log('save: hospitalInfo = ' + JSON.stringify(hospitalInfo));
                }
            });
        }
    }

    _pressSelect() {
        this.setState({modalVisible: true, dataSourceZuHu: this.state.dataSourceZuHu.cloneWithRows(this.state.zuhuList)});

        //Pop.show(popView, {animationType: 'slide-up', maskClosable: true, onMaskClose: ()=>{}});
    }


    _renderSeparatorView(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
        return (
            <View key={`${sectionID}-${rowID}`} style={styles.separator}/>
        );
    }




    renderItemLeft(data) {
        var that = this;
        var color = this.state.selectZuHuData&&this.state.selectZuHuData.tenantId===data.tenantId ? '#444' : '#999';
        var img = null;
        if (this.state.selectZuHuData&&this.state.selectZuHuData.tenantId===data.tenantId) {
            img = <Image source={require('../../../res/login/ic_arrow.png')} style={{width:6,height:11,marginLeft:15,marginRight:15,}}/>
        }
        return (
            <View key={data.tenantId}>
                <TouchableOpacity onPress={()=>{this.onPressItemLeft(data)}} style={{height:45,flex:1,backgroundColor: '#f6f6f6',}}>
                    <View style={{flexDirection:'row',marginLeft:10,height:45,textAlignVertical:'center',alignItems: 'center',}} >

                        <Text style={{fontSize:14,color:color,marginLeft:15,flex:1}}>{data.tenantName}</Text>
                        {img}
                    </View>
                </TouchableOpacity>

            </View>
        );
    }
    onPressItemLeft(data){
        var that = this;
        var items = this.state.zuhuList;
        console.log(JSON.stringify(data))
        this.setState({dataSourceZuHu:this.state.dataSourceZuHu.cloneWithRows(items),
            selectZuHuData:data,selectZuHuNameTemp:data.tenantName,selectYuanQuData:null,selectYuanQuNameTemp:""
        });
        that.getYuanQuListByZuHuId(data);
    }
    getYuanQuListByZuHuId(data) {
        var that = this;
        if (this.state.dataMap.has(data.tenantId)) {
            var list = this.state.dataMap.get(data.tenantId);
            that.setState({yuanquList:list, dataSourceYuanQu:that.state.dataSourceYuanQu.cloneWithRows(list), });
            return;
        }
        var tenantKey = data.tenantKey;
        var tenantKeyAes = aesEncrypt(tenantKey);
        tenantKeyAes = encodeURIComponent(tenantKeyAes);
        Request.requestGetZuHu(GetYuanQuById+tenantKeyAes,tenantKeyAes, (result)=> {
            console.log(result);
            if (result && result.code === 200) {
                if(result.data&&Array.isArray(result.data.hospitalList)){
                    this.state.dataMap.set(data.tenantId, result.data.hospitalList);
                    this.setState({yuanquList:result.data.hospitalList, dataSourceYuanQu:this.state.dataSourceYuanQu.cloneWithRows(result.data.hospitalList), });
                }else{
                    this.setState({yuanquList:[], dataSourceYuanQu:this.state.dataSourceYuanQu.cloneWithRows([]), });
                }
            }else{
                this.setState({yuanquList:[], dataSourceYuanQu:this.state.dataSourceYuanQu.cloneWithRows([]), });
            }
        });
    }

    renderItemRight(data) {
        var that = this;
        return (
            <View key={data.hospitalId}>
                <TouchableOpacity onPress={()=>{that.onPressItemRight(data)}} style={{height:45,flex:1}}>
                    <View style={{flexDirection:'row',marginLeft:10,height:45,textAlignVertical:'center',alignItems: 'center',}} >
                        <Image source={this.state.selectYuanQuData&&this.state.selectYuanQuData.hospitalId===data.hospitalId ? require('../../../res/login/checkbox_pre.png') : require('../../../res/login/checkbox_nor.png')} style={{width:18,height:18}}/>
                        <Text style={{fontSize:14,color:'#777',marginLeft:15,flex:1}}>{data.hospitalName}</Text>
                    </View>
                </TouchableOpacity>

            </View>
        );
    }
    onPressItemRight(data){
        var items = this.state.yuanquList;
        this.setState({dataSourceYuanQu:this.state.dataSourceYuanQu.cloneWithRows(items),
            selectYuanQuData:data,selectYuanQuNameTemp:data.hospitalName});
    }


    render() {

        var image = <TouchableOpacity style={styles.TouchableOpacityRightImgview} onPress={() => {
            this._setting()
        }}>
            <View style={{alignItems: 'center'}}>
                <Image
                    style={styles.rightImage}
                    source={require('../../../res/login/navbar_ico_set.png')}/>

            </View>
        </TouchableOpacity>

        let touchableOpacity =
            <TouchableOpacity
                style={styles.TouchableOpacityLeftText}
                onPress={() => this._pressSelect()}>
                <Text
                    style={{
                        borderTopLeftRadius: 6,
                        borderTopRightRadius: 6,
                        borderBottomRightRadius: 6,
                        borderBottomLeftRadius: 6,
                        fontSize: 14,
                        marginLeft: 0,
                        marginRight: 6,
                        color: '#5ec4c8',
                        backgroundColor: '#ffffff',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlignVertical: 'center',
                        borderWidth: 1,
                        borderColor: '#5ec4c8',
                        width: 38,
                        height: 25,
                        textAlign: 'center',
                    }}>切换</Text>
                <Text style={{
                    fontSize: 14,
                    color: '#999999',
                    height: 25,
                    textAlignVertical: 'center',
                    textAlign: 'center',
                }}>{(this.state.selectZuHuName===null||this.state.selectZuHuName==="" ? "医院":this.state.selectZuHuName)+"/"+(this.state.selectZuHuName===null||this.state.selectYuanQuName==="" ? "院区":this.state.selectYuanQuName)}</Text>


            </TouchableOpacity>

        let iOSTop = null;
        if (Dimens.isIOS) {
            iOSTop = <View style={{backgroundColor: 'white', height: (Dimens.isIphoneX() ? 30 : 20)}}/>
        }

        return (
            <View style={styles.container}>

                {iOSTop}
                <View style={{
                    height: 44,
                    backgroundColor: 'white',
                    borderBottomWidth: 1,
                    borderBottomColor: Dimens.color_line_cc,
                }}>
                    <View style={styles.containerText}>
                        {touchableOpacity}
                        <Text style={{
                            fontSize: 18,
                            color: Dimens.color_text_33
                        }}> </Text>

                        {image}
                    </View>
                </View>

                <View style={styles.logo_center_bg}>
                    <Image
                        style={{width: 207, height: 48}}
                        source={require('../../../res/login/ic_logo.png')}
                    />
                </View>

                <View style={styles.input_center_bg}>
                    <View style={styles.input_item}>
                        <Image
                            source={this.state.focusIndex === 0 ? require('../../../res/login/login_user_pre.png') : require('../../../res/login/login_user_nor.png')}
                            style={{width: 20, height: 20, marginLeft: 40}}/>

                        <TextInput
                            style={styles.input_style}
                            placeholder="请输入手机号或用户名"
                            placeholderTextColor="#aaaaaa"
                            underlineColorAndroid="transparent"
                            numberOfLines={1}
                            ref={'username'}
                            autoFocus={true}
                            onChangeText={(text) => {
                                username = text;
                                // this.setState({username:text});
                            }}
                            defaultValue= {this.state.username}
                            onFocus={(event) => this._onFocus(0)}
                            onBlur={(event) => this._onFocus(-1)}
                            
                        />
                    </View>
                    <View style={{
                        backgroundColor: this.state.nameBgColor,
                        height: 1,
                        width: (Dimens.screen_width - 40),
                        marginTop: 5
                    }}/>
                    <View style={{flexDirection: 'row', height: 40, alignItems: 'center', marginTop: 20,}}>
                        <Image
                            source={this.state.focusIndex === 1 ? require('../../../res/login/login_password_pre.png') : require('../../../res/login/login_password_nor.png')}
                            style={{width: 20, height: 20, marginLeft: 40}}/>
                        <TextInput
                            style={styles.input_style}
                            placeholder="请输入密码"
                            placeholderTextColor="#aaaaaa"
                            underlineColorAndroid="transparent"
                            numberOfLines={1}
                            ref={'password'}
                            secureTextEntry={true}
                            onChangeText={(text) => {
                                password = text;
                                // this.setState({password:text});
                            }}
                            defaultValue={this.state.password}
                            onFocus={(event) => this._onFocus(1)}
                            onBlur={(event) => this._onFocus(-1)}
                            // value={password}
                            
                        />

                    </View>
                    <View style={{
                        backgroundColor: this.state.pswBgColor,
                        height: 1,
                        width: (Dimens.screen_width - 40),
                        marginTop: 5
                    }}/>

                </View>

                <Text
                    onPress={() => this._onLogin()}
                    style={{
                        height: 46,
                        color: '#ffffff',
                        fontSize: 18,
                        textAlign: 'center',
                        backgroundColor: '#5ec4c8',
                        borderTopLeftRadius: 6,
                        borderTopRightRadius: 6,
                        borderBottomRightRadius: 6,
                        borderBottomLeftRadius: 6,
                        marginTop: 30,
                        marginLeft: 30,
                        marginRight: 30,
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlignVertical: 'center',
                    }}>登录</Text>

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 10,
                    marginLeft: 30,
                    marginRight: 30,
                }}>
                    <TouchableOpacity style={{flexDirection: 'row',}} onPress={() => this._onRemember()}>
                        <Image
                            style={{width: 18, height: 18}}
                            source={this.state.keepPsw ? require('../../../res/login/radio_pre.png') : require('../../../res/login/radio_nor.png')}
                        />
                        <Text style={{fontSize: 14, color: '#777', marginLeft: 10,}}>记住密码</Text>
                    </TouchableOpacity>
                    <Text style={{fontSize: 14, color: '#777'}}></Text>
                    <Text style={{fontSize: 14, color: '#777'}} onPress={() => this._onForgotPsw()}>找回密码</Text>
                </View>

                <Image source={require('../../../res/login/login_bottom.png')}
                       style={styles.logo_bottom}>

                </Image>

                <Text style={{

                    color: '#bbbbbb',
                    fontSize: 12,
                    textAlign: 'center',
                    margin: 30,
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlignVertical: 'center',
                    position: 'absolute',
                    top: Dimens.screen_height - 110,
                    left: 0,
                    right: 0,
                }}>上海见行信息科技有限公司</Text>

                <Text style={{

                    color: '#bbbbbb',
                    fontSize: 12,
                    textAlign: 'center',
                    margin: 30,
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlignVertical: 'center',
                    position: 'absolute',
                    top: Dimens.screen_height - 95,
                    left: 0,
                    right: 0,
                }}>版权所有@2018-2025</Text>

                <Modal
                    animationType={"none"}
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() =>this.setState({modalVisible:false})}
                >
                    <View style={{top:0,height:Dimens.screen_height,width:Dimens.screen_width,backgroundColor: 'rgba(0,0,0,0.5)',alignItems:'center',justifyContent:'center',}}>
                        <View style={stylesDept.bottomStyle}>
                            <View style={stylesDept.topStyle}>
                                <Text onPress={()=>this._hide()} style={{color:'#9b9b9b', marginLeft:10}}>取消</Text>
                                <View style={{flex:1}}/>
                                <Text onPress={()=>this.submit()} style={{color:'#9b9b9b', marginRight:10}}>确定</Text>
                            </View>
                            <View style={{flexDirection:'row', height:300,}}>
                                <ListView
                                    initialListSize={1}
                                    dataSource={this.state.dataSourceZuHu}
                                    renderRow={(item) => this.renderItemLeft(item)}
                                    style={{backgroundColor:'white',flex:1,height:300,width:Dimens.screen_width/3,}}
                                    onEndReachedThreshold={10}
                                    enableEmptySections={true}
                                    renderSeparator={(sectionID, rowID, adjacentRowHighlighted) =>this._renderSeparatorView(sectionID, rowID, adjacentRowHighlighted)}/>

                                <ListView
                                    initialListSize={1}
                                    dataSource={this.state.dataSourceYuanQu}
                                    renderRow={(item) => this.renderItemRight(item)}
                                    style={{backgroundColor:'white',flex:1,height:300,width:Dimens.screen_width*2/3,}}
                                    onEndReachedThreshold={10}
                                    enableEmptySections={true}
                                    renderSeparator={(sectionID, rowID, adjacentRowHighlighted) =>this._renderSeparatorView(sectionID, rowID, adjacentRowHighlighted)}/>

                            </View>
                        </View>
                    </View>
                </Modal>
            </View>

        )
    }
}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'white',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },

    welcome: {
        color: '#123456',

    },
    logo_center_bg: {
        alignItems: 'center',
        height: 48,
        width: Dimens.screen_width,
        marginTop: 40
    },

    input_center_bg: {
        alignItems: 'center',
        height: 120,
        width: Dimens.screen_width,
        marginTop: 40,

    },
    logo_bottom: {
        alignItems: 'center',
        height: 120,
        width: Dimens.screen_width,
        position: 'absolute',
        top: Dimens.screen_height - 120,
        left: 0,
        right: 0,
        alignSelf: 'center'
    },
    input_item: {
        flexDirection: 'row', height: 40, alignItems: 'center', marginTop: 10,
    },
    input_style: {
        fontSize: 15, height: 40, textAlign: 'left', textAlignVertical: 'center', flex: 1, marginLeft: 10
    },
    line: {
        backgroundColor: '#eeeeee', height: 1, width: (Dimens.screen_width - 40), marginTop: 5,
    },
    TouchableOpacityRightImgview: {
        position: 'absolute',
        right: 0,
        top: 8,
        bottom: 8,
        justifyContent: 'center',
    },
    rightTxt: {
        fontSize: 15,
        color: Dimens.color_text_33,
    },
    rightImage: {
        width: 22,
        height: 22,
        marginRight: 15,
    },
    containerText: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        height: 44,
    },
    TouchableOpacityLeftText: {
        position: 'absolute',
        left: 15,
        top: 8,
        bottom: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        textAlignVertical: 'center',
    },
    dialogContentView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    separator: {
        height: 0.5,
        backgroundColor: '#eee'
    }
});
const stylesDept = StyleSheet.create({
    modelStyle:{
        flex: 1,
        width:Dimens.screen_width,
        height:Dimens.screen_height,
        backgroundColor: 'rgba(0,0,0,0.6)',
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
    container: {
        flex: 1,
        backgroundColor: '#f6f6f6',
    },
    line:{
        backgroundColor:'#eeeeee',height:1,width:(Dimens.screen_width-15),marginTop:0,marginLeft:15,
    },
    button:{
        width:Dimens.screen_width,
        height:50,
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

    bottomStyle:{
        width:Dimens.screen_width,
        height:335,
        textAlign:'center',
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        alignSelf: 'center'
    },
    topStyle: {
        flexDirection:'row',
        fontSize:14,
        backgroundColor: '#EFF0F1',
        width:Dimens.screen_width,
        height:35,
        alignItems:'center',
        justifyContent:'center',
        textAlignVertical:'center',
    },

    separator: {
        height: 0.5,
        backgroundColor: '#eee'
    }

});


// {"code":200,"data":{"customerId":"1055390940066893827",
// "deptAddresses":[{"buildingId":"1078386477644865537","buildingName":"后勤大楼","deptId":"1078641550383865857",
// "deptName":"后勤总仓","detailAddress":"后勤大楼 / 1F / 001","floorId":"1078647953580318722","floorName":"1F",
// "parentId":null,"roomId":"1078648182631260162","roomName":"001"}],"gender":"1","generalFlag":"1",
// "headImgId":"https://dev.jxing.com.cn/000569/oss_images/c8b7278053444b2191b506db94574266.jpg",
// "hospitalIdList":["1055390940066893827","1098891173140557825","1116210351425863681"],
// "hospitalName":"上海市仁济人民医院","isAdmin":1,



