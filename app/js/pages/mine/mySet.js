

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
    Switch
} from 'react-native';
import RNFetchBlob from '../../../util/RNFetchBlob';
import TitleBar from '../../component/TitleBar';
import BaseComponent from '../../base/BaseComponent'
import * as Dimens from '../../value/dimens';
import AsyncStorage from '@react-native-community/async-storage';
import { toastShort } from '../../util/ToastUtil';
export default class MySet extends BaseComponent {
    static navigationOptions = {
        header: null,
    };
    constructor(props){
        super(props);
        this.state={
            theme:this.props.theme,
            pushStatus:false
        }
    }


    logout() {
        global.access_token = null;
        global.deptId = null;
        global.userId = null;
        global.permissions = null;
            AsyncStorage.setItem('token', '', function (error) {
                if (error) {
                    console.log('error: save error');
                } 
            });
            AsyncStorage.setItem('logInfo', '', function (error) {
                if (error) {
                    console.log('error: save error');
                }
            });

        global.uinfo = null;
            AsyncStorage.setItem('uinfo', '', function (error) {
                //console.log('uinfo: error' + error);
                if (error) {
                    console.log('error: save error' + JSON.stringify(error));
                } 

            });

        const {navigation} = this.props;
                InteractionManager.runAfterInteractions(() => {
                        navigation.navigate('Login',{theme:this.theme})
                    });
    }
    _deleteData(){
        console.log('删除')

        //删除一条数据
        AsyncStorage.removeItem('token', function (error) {
            if (error) {
                toastShort('删除失败')
            }else {
                toastShort('删除完成')
            }
        })

        //删除一条数据
        AsyncStorage.removeItem('fileVideoCache', function (error) {
            if (error) {
                // alert('删除失败')
            }else {
                // alert('删除完成')
            }
        })

        RNFetchBlob.clearCache();
    }
    lookData(){
        const {navigation} = this.props;
        InteractionManager.runAfterInteractions(() => {
                navigation.navigate('MyData',{theme:this.theme})
            });
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
                        消息推送
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

onChange(val) {
    this.setState({
        pushStatus : val
    })
    console.log(this.state.pushStatus)
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