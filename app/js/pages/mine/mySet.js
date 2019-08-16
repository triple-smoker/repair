

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
    Switch,
    NativeModules
} from 'react-native';
import RNFetchBlob from '../../../util/RNFetchBlob';
import TitleBar from '../../component/TitleBar';
import BaseComponent from '../../base/BaseComponent'
import * as Dimens from '../../value/dimens';
import AsyncStorage from '@react-native-community/async-storage';
import { toastShort } from '../../util/ToastUtil';
import SQLite from "../../polling/SQLite";
import {aesEncrypt} from "../../util/CipherUtils";
import Axios from "../../../util/Axios";



const tabs = [
    "inspect_job",
    "equipment_ref_item",
    "inspect_equipment_type_conf",
    "inspect_item_conf",
    "inspect_job_manager",
    "job_exec_time",
    "man_ref_item",
    "t_base_equipment_type",
    "t_base_equipment",
    "daily_report",
    "daily_task",
    "r_building_floor",
    "r_floor_room",
    "t_base_building",
    "t_base_place",
    "t_base_room",
    "t_base_floor",
    "t_base_equipment",
    "t_base_equipment",
    "t_base_equipment",
    // "auto_up",
    "auto_percent",
]

var db;
export default class MySet extends BaseComponent {
    static navigationOptions = {
        header: null,
    };
    constructor(props){
        super(props);
        this.state={
            theme:this.props.theme,
            pushStatus:true
        }
    }
    componentDidMount() {
        var that = this;
        AsyncStorage.getItem("pushStatus", function (error, result) {
            if (error) {
                console.log("读取失败");
            } else {
                var pushStatus = JSON.parse(result);
                if(pushStatus){
                    that.setState({
                        pushStatus:(pushStatus===0)? true:false
                    })
                }else{
                    that.setState({
                        pushStatus:true
                    })
                }

            }
        })
    }
    componentWillUnmount() {
        db=null;
    }


    /** 退出*/
    logout() {
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
        AsyncStorage.setItem('reporterInfoHistory', '', function (error) {
                if (error) {
                    console.log('error: save error' + JSON.stringify(error));
                }

        });
        AsyncStorage.setItem('searchItemHistory', '', function (error) {
                if (error) {
                    console.log('error: save error' + JSON.stringify(error));
                }

        });
        AsyncStorage.setItem(global.userId, '', function (error) {
                if (error) {
                    console.log('error: save error' + JSON.stringify(error));
                }
        });
        SQLite.close();
        NativeModules.MPush.unbindAccount((callback)=>{
            console.info(callback)
        });

        const {navigation} = this.props;
                InteractionManager.runAfterInteractions(() => {
                        navigation.navigate('Login',{theme:this.theme})
                    });
    }
    //del
    _deleteData(){

        //删除一条数据
        AsyncStorage.setItem('fileVideoCache',"", function (error) {
            if (error) {
                console.log('error: save error' + JSON.stringify(error));
            }
        })
        AsyncStorage.setItem('reporterInfoHistory', '', function (error) {
            if (error) {
                console.log('error: save error' + JSON.stringify(error));
            }

        });
        AsyncStorage.setItem('searchItemHistory', '', function (error) {
            if (error) {
                console.log('error: save error' + JSON.stringify(error));
            }

        });

        AsyncStorage.setItem(global.tenant_code + global.userId,"", function (error) {
            if (error) {
                console.log('error: save error' + JSON.stringify(error));
            }
        })
        RNFetchBlob.clearCache();

        toastShort("清除缓存");


    }
    /**跳转个人信息 */
    lookData(){
        const {navigation} = this.props;
        InteractionManager.runAfterInteractions(() => {
                navigation.navigate('MyData',{theme:this.theme})
            });
    }
    deleteSqlite(){
        AsyncStorage.setItem('sqLiteTimeTemp'+decodeURIComponent(global.xTenantKey), '', function (error) {
            if (error) {
                console.log('error: save error' + JSON.stringify(error));
            }

        });

        if(!db){
            db = SQLite.open();
        }
        tabs.forEach((tabName)=>{
            SQLite.dropTable(tabName);
        })
        toastShort("清除离线数据");
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
                                        toastShort("本地数据同步成功");
                                    }
                                );
                            }
                        }.bind(this))
                    }
                }
            }
        })


    }

    render() {
        return (
          <View style={styles.container}>
          <TitleBar
          centerText={'设置'}
          isShowLeftBackIcon={true}
          navigation={this.props.navigation}
          leftPress={() => this.naviGoBack(this.props.navigation)}
          
          />
          
            <View style={styles.input_center_bg}>
                <TouchableOpacity onPress={()=>this.lookData()}> 
                <View style={styles.case}>
                    <Text style={{fontSize:16}}>
                        个人资料
                    </Text>
                    <Image style={{height:15,width:8}} source={require('../../../res/login/ic_arrow.png')}/>
                </View>
                </TouchableOpacity>
                <View style={styles.line} />
                <View style={styles.case}>
                    <Text style={{fontSize:16}}>
                        账号绑定
                    </Text>
                    <Image style={{height:15,width:8}} source={require('../../../res/login/ic_arrow.png')}/>
                </View>
            </View>

            <View style={styles.input_center_bg}>
                <View style={styles.case}>
                    <Text style={{fontSize:16}}>
                        关于 xxx V1.0
                    </Text>
                    <Image style={{height:15,width:8}} source={require('../../../res/login/ic_arrow.png')}/>
                </View>
                <View style={styles.line} />
                <View style={styles.case}>
                    <Text style={{fontSize:16}}>
                        意见反馈
                    </Text>
                    <Image style={{height:15,width:8}} source={require('../../../res/login/ic_arrow.png')}/>
                </View>
                <View style={styles.line} />
                <View style={styles.case}>
                    <Text style={{fontSize:16}}>
                        给我们评分
                    </Text>
                    <Image style={{height:15,width:8}} source={require('../../../res/login/ic_arrow.png')}/>
                </View>
            </View>

            <View style={styles.input_center_bg}>
                <TouchableOpacity onPress={()=>this.getSqlite()}>
                    <View style={styles.case}>
                        <Text style={{fontSize:16}}>
                            离线数据同步
                        </Text>
                        <Image style={{height:15,width:8}} source={require('../../../res/login/ic_arrow.png')}/>
                    </View>
                </TouchableOpacity>
                <View style={styles.line} />
                <TouchableOpacity onPress={()=>this.deleteSqlite()}>
                    <View style={styles.case}>
                        <Text style={{fontSize:16}}>
                            清除离线数据
                        </Text>
                        <Image style={{height:15,width:8}} source={require('../../../res/login/ic_arrow.png')}/>
                    </View>
                </TouchableOpacity>
                <View style={styles.line} />
                <TouchableOpacity onPress={()=>this._deleteData()}> 
                <View style={styles.case}>
                    <Text style={{fontSize:16}}>
                        清除缓存
                    </Text>
                    <Image style={{height:15,width:8}} source={require('../../../res/login/ic_arrow.png')}/>
                </View>
                </TouchableOpacity>
                <View style={styles.line} />
                
                <View style={styles.case} >
                    <Text style={{fontSize:16}}>
                        消息提示音
                    </Text>
                    <Switch  value = {this.state.pushStatus}
                             onValueChange={(value)=>this.onChange(value)} />
            
                </View>
            </View>
       <Text
         onPress={()=>this.logout()} style={styles.button}
        style={{
            height:46,
            color:'#ffffff',
            fontSize:16,
            textAlign:'center',
            backgroundColor: '#5ec4c8',
            borderRadius: 2,
            marginTop:30,
            marginLeft:15,
            marginRight:15,
            alignItems:'center',
            justifyContent:'center',
            textAlignVertical:'center',
        }}>退出</Text>

    </View>
    )
}

onChange() {
        var that = this;
        var pushStatus = (!that.state.pushStatus)?"0":"1";
        AsyncStorage.setItem("pushStatus", pushStatus , function (error) {
            if (error) {
                console.log('error: save error' + JSON.stringify(error));
            }else{
                that.setState({
                    pushStatus : !that.state.pushStatus
                })
            }

        });
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
    case:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        lineHeight:45,
        height:45,
        marginLeft:0,
        marginRight:0,
        paddingLeft: 20,
        paddingRight: 15,
    },
    input_center_bg:{
        overflow:'hidden',
        backgroundColor: 'white',
        marginTop:10,
        marginLeft:14,
        marginRight:14,
        borderRadius:5,
        borderColor: '#d0d0d0',
        borderWidth: 1,
    },
    input_item:{
        flexDirection:'row',height:40,alignItems:'center',marginTop:0,
    },
    input_style:{
        fontSize: 15,height:40,textAlign: 'left',textAlignVertical:'center',flex:1,marginLeft:0
    },
    line:{
        backgroundColor:'#eeeeee',height:1,width:(Dimens.screen_width-20),marginTop:0,
    },
});