

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

export default class MyData extends BaseComponent {
    static navigationOptions = {
        header: null,
    };
    constructor(props){
        super(props);
        this.state={
            theme:this.props.theme,
            userData:null,
        }
    }
    componentDidMount() {
        var that = this;
        this.loadDetail();
    }
    componentWillReceiveProps(nextProps) {
        this.loadDetail();
    }
    loadDetail() {
        var that = this;
    
        AsyncStorage.getItem('uinfo',function (error, result) {
            if(error){
                console.log(error)
                return
            }else{
                var userInfo =  JSON.parse(result);
                that.setState({userData:userInfo});
                console.log(userInfo)
            }
        })
    }

    render() {
        var  userData = this.state. userData;
        if (userData) {
            var headerImg = userData.headImgId;
            var workNumber = userData.workNumber;
            var  deptName = userData.deptAddresses[0].deptName
            var userName = userData.userName;
            var gender = userData.gender;
            var telNo = userData.telNo;
        }
        return (
          <View style={styles.container}>
          <TitleBar
          centerText={'个人资料'}
          isShowLeftBackIcon={true}
          navigation={this.props.navigation}
          leftPress={() => this.naviGoBack(this.props.navigation)}
          
          />
          
            <View style={{...styles.input_center_bg,borderTopLeftRadius: 45,borderBottomLeftRadius: 45,}}>
                <View style={{flexDirection: 'row',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                lineHeight:45,
                                height:45,
                                marginLeft:0,
                                marginRight:0,
                                paddingRight: 15,}}>
                {headerImg ? <Image style={{height:45,width:45,borderRadius:45}} source={{uri:headerImg}}/> : <Image style={{height:45,width:45,borderRadius:45}} source={require('../../../res/repair/user_wx.png')}/>}
                
                    <Text style={{fontSize:16,marginLeft:20,}}>
                        更换头像
                    </Text>
                </View>
            </View>

            <View style={styles.input_center_bg}>
                <View style={styles.case}>
                    <Text style={{fontSize:16}}>
                        姓名
                    </Text>
                    <View style={{flexDirection:'row',justifyContent:'flex-end',alignItems: 'center',}}>
                    <Text>{userName}</Text>
                    <Image style={{height:20,width:19,marginLeft:5}} source={require('../../../res/login/edit.png')}/>
                    </View>
                    
                </View>
            </View>

            <View style={styles.input_center_bg}>
                
                <View style={styles.case}>
                    <Text style={{fontSize:16}}>
                        性别
                    </Text>
                    <View style={{flexDirection:'row',justifyContent:'flex-end',alignItems: 'center',}}>
                    <Text>{gender == 1 ? '男' : '女'}</Text>
                    <Image style={{height:20,width:19,marginLeft:5}} source={require('../../../res/login/edit.png')}/>
                    </View>
                </View>
               
            </View>
            <View style={styles.input_center_bg}>
                
                <View style={styles.case}>
                    <Text style={{fontSize:16}}>
                        联系方式
                    </Text>
                    <View style={{flexDirection:'row',justifyContent:'flex-end',alignItems: 'center',}}>
                    <Text>{telNo}</Text>
                    <Image style={{height:20,width:19,marginLeft:5}} source={require('../../../res/login/edit.png')}/>
                    </View>
                </View>
               
            </View>
       
            <View style={styles.input_center_bg}>
                
                <View style={styles.case}>
                    <Text style={{fontSize:16}}>
                        工号
                    </Text>
                    <View>
                    <Text>{workNumber}</Text>
                   
                    </View>
                </View>
               
            </View>
            <View style={styles.input_center_bg}>
                
                <View style={styles.case}>
                    <Text style={{fontSize:16}}>
                        部门
                    </Text>
                    <View>
                    <Text>{deptName}</Text>
                   
                    </View>
                </View>
               
            </View>
    </View>
    )
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