/**
 * 欢迎页
 * @flow
 * **/
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    InteractionManager,
    Image,
    DeviceEventEmitter,
    NativeModules
} from 'react-native'
import ThemeDao from '../../dao/ThemeDao'
import AsyncStorage from "@react-native-community/async-storage";
import Request, {messageRecordList} from '../../http/Request';
import {aesEncrypt} from "../../util/CipherUtils";


export default class WelcomePage extends Component {

    componentDidMount() {

        // const {navigation} = this.props;

        new ThemeDao().getTheme().then((data)=>{
            this.theme=data;
        });

        this.loadUserInfo()
        // this.timer = setTimeout(() => {
        //     InteractionManager.runAfterInteractions(() => {
        //         // navigation.navigate('MainPage',{theme:this.theme})
        //         this.loadUserInfo()
        //
        //
        //     });
        // }, 100);
    }

    loadUserInfo() {
        console.log('loadUserInfo');
        var that = this;
        const {navigation} = that.props;
        AsyncStorage.getItem('token', function (error, result) {
            if (error) {
                console.log('读取失败')
            } else {
                if (result && result.length) {
                    global.access_token = result;
                    console.log('access_token: result = ' + result);
                    InteractionManager.runAfterInteractions(() => {
                        navigation.navigate('App',{theme:that.theme})

                    });
                } else {
                    InteractionManager.runAfterInteractions(() => {
                        navigation.navigate('Auth',{theme:that.theme})

                    });
                }
            }
        });
        AsyncStorage.getItem("hospitalInfo", function (error, result) {
            if (error) {
                console.log("读取失败");
            } else {
                if (result) {
                    var hospitalInfo = JSON.parse(result);
                    if (hospitalInfo && hospitalInfo.selectZuHuData && hospitalInfo.selectYuanQuData) {
                        var tenantKey = hospitalInfo.selectZuHuData.tenantKey;
                        var tenantKeyAes = aesEncrypt(tenantKey);
                        tenantKeyAes = encodeURIComponent(tenantKeyAes);
                        global.hospitalId = hospitalInfo.selectYuanQuData.hospitalId;
                        global.xTenantKey = tenantKeyAes;
                        global.tenant_code = hospitalInfo.selectZuHuData.tenantCode;
                    }
                }
            }
        })

        AsyncStorage.getItem('uinfo', function (error, result) {
            // console.log('uinfo: result = ' + result + ', error = ' + error);
            if (error) {
                console.log('读取失败')
            } else {
                if (result && result.length) {

                    global.uinfo = JSON.parse(result);

                    global.userId=global.uinfo.userId;
                    global.deptId=global.uinfo.deptAddresses[0].deptId;
                    var permissions;
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
                    // if(global.uinfo.workNumber==="40001"){
                    //     global.permissions = true;
                    // }

                    console.info("----------before bindAccount-------------")
                    
                    NativeModules.MPush.bindAccount(global.tenant_code + global.userId,(callback)=>{
                        console.info(callback)
                        if(callback.success === true){
                            return;    
                            AsyncStorage.getItem(global.tenant_code + global.userId, function (error, result) {
                                if (error) {
                                    console.log('读取失败')
                                } else {
                                
                                    result = JSON.parse(result);
                                    var resultData = result || [];

                                    let lastMsgRecordId = -1;
                                    resultData.forEach(item =>{
                                        if(eval(item.recordId - lastMsgRecordId) > 0){
                                            lastMsgRecordId = item.recordId;
                                        }
                                    });

                                    //TODO getMaxRecordId;
                                    let params = {recordUserId:global.userId, lastMsgRecordId:lastMsgRecordId};
                                    console.log(params);

                                    Request.requestPost(messageRecordList, params, (messageResult)=> {
                                
                                    });
                                    let messageResult = {
                                            "code": 200,
                                            "data": [
                                                {
                                                    "createTime": 1565768592000,
                                                    "recordAlreadyRead": 0,
                                                    "recordContent": "您的工单：BX-192142000001已被催单",
                                                    "recordId": "1161543780579287041",
                                                    "recordTitle": "催单通知",
                                                    "recordType": "工单提醒",
                                                    "recordUserId": "1115484764914716673"
                                                },
                                                {
                                                    "createTime": 1565768643000,
                                                    "recordAlreadyRead": 0,
                                                    "recordContent": "您的工单：BX-192142000002已被催单",
                                                    "recordId": "1161543992299364354",
                                                    "recordTitle": "催单通知",
                                                    "recordType": "工单提醒",
                                                    "recordUserId": "1115484764914716673"
                                                },
                                                {
                                                    "createTime": 1565851239000,
                                                    "recordAlreadyRead": 0,
                                                    "recordContent": "您的工单：BX-192142000001已被催单",
                                                    "recordId": 1,
                                                    "recordTitle": "催单通知",
                                                    "recordType": "工单提醒",
                                                    "recordUserId": "1115484764914716673"
                                                }
                                            ],
                                            "msg": "操作成功"
                                    }

                                    if (messageResult && messageResult.code === 2000) {
                                        if(messageResult.data.length === 0){
                                            return;
                                        }
                                        var messageRecord = [];
                                        messageResult.data.forEach(e=>{
                                            let message = {
                                                "recordId": e.recordId,
                                                "title" : e.recordTitle,
                                                "content" : e.recordContent,
                                                "recordAlreadyRead": e.recordAlreadyRead,
                                                "notifyDate" : new Date(e.createTime).format("yyyy-MM-dd hh:mm:ss")
                                            }
                                            messageRecord.push(message);
                                            DeviceEventEmitter.emit("onAppInitOnMessage",message);
                                        });
                                        var cacheMaxLength = 50;
                                        var localStorageRecordMaxLength = cacheMaxLength - messageRecord.length;
                                        if(resultData.length > localStorageRecordMaxLength){
                                            let deleteLength = resultData.length - localStorageRecordMaxLength;
                                            // if(messageRecord.length > cacheMaxLength){
                                            //     messageRecord.splice(cacheMaxLength - 1,messageRecord.length - cacheMaxLength);
                                            //     resultData = [];
                                            // }
                                            resultData.splice(0,deleteLength);
                                        }
                                        resultData = resultData.concat(messageRecord);
                                        console.info("----bindAccount After saveNotifyMessage----")
                                        console.info(resultData)
                        
                                        AsyncStorage.setItem(global.tenant_code + global.userId,JSON.stringify(resultData),function (error) {
                                            if (error) {
                                                console.log('存储失败')
                                                console.log(error)
                                            }else {
                                                console.log('存储完成')
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    });
                }
            }
        });
    }

    componentWillUnmount() {
        this.timer &&  (this.timer);
    }
    render() {
        return (
            <View style={styles.container}>
                {<Image style={{flex:1,width:null}} resizeMode='stretch' source={require('../../../res/home/ic_loading.png')}/>}
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#00ffff',
    }
})
