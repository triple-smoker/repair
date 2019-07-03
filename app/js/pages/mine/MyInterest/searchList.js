

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
    ScrollView,
    Dimensions
} from 'react-native';
import BaseComponent from '../../../base/BaseComponent'
import * as Dimens from '../../../value/dimens';
import { toastShort } from '../../../util/ToastUtil';
import Request, {addFollow} from '../../../http/Request';
import {Content, Accordion, Col, Textarea, Button,} from "native-base";
import {toDate} from '../../../util/DensityUtils'



let ScreenWidth = Dimensions
  .get('window')
  .width;
let ScreenHeight = Dimensions
  .get('window')
  .height;
export default class SearchList extends BaseComponent {
    static navigationOptions = {
        header: null,
    };
    constructor(props){
        super(props);
        this.state={
            theme:this.props.theme,
            
        }
    }
    componentDidMount() {
        var that = this;
        
    }
    componentWillUpdate(){

    }
    addFoucus(data,type){
        var sourceId = null;
        var sourceName = null;
        var focusType = null;
        if(type == 1){
            sourceId = data.deptId;
            sourceName = data.deptName;
            focusType = 2;
        }else if(type ==2){
            sourceId = data.userId;
            sourceName = data.userName;
            focusType = 4;
        }

        

        var userData = this.props.userData;
        var params = {focusUserId:userData.userId,focusUserName:userData.userName,
                        sourceId:sourceId,sourceName:sourceName,focusType:focusType}
        console.log(params)
        Request.requestPost(addFollow,params,(res)=>{
            console.log(res)
            if(res && res.code == 200){
                toastShort('关注成功')
            }
        })
    }
    //科室数据列表
    deptList(item,i){
        return <View key={item.deptId} style={styles.list}>
                        <Text style={{color:'#333333',fontWeight:'400',fontSize:13}}>{item.deptName}</Text>
                        <TouchableOpacity onPress={()=>this.addFoucus(item,1)}>
                            <Text style={styles.rightT}>＋ 关注</Text>
                        </TouchableOpacity>
                    </View>
    }
    //用户数据列表
    userList(item,i){
        return <View key={i} style={styles.list}>
                <View style={styles.leftT2}>
                    <View style={{position:'relative'}}>
                        <Image style={{width:28,height:28,borderRadius:28}} source={require("../../../../image/user_wx.png")}/>
                        <Image style={{width:9,height:13,position:'absolute',right:0,bottom:0}} source={require("../../../../res/login/f.png")}/>
                    </View>
                
                    <Text style={{marginLeft:5,color:'#333333',fontWeight:'400',fontSize:13}}>{item.userName}</Text>
                
                </View>
                <TouchableOpacity onPress={()=>this.addFoucus(item,2)}>
                            <Text style={styles.rightT}>＋ 关注</Text>
                </TouchableOpacity>
            </View>
    }
    
    
    render() {
        var ViewList = <Text style={{textAlignVertical:'center',backgroundColor:'white', color:'#999',fontSize:13, height:50, textAlign:'center',}}>没有更多内容了</Text>;
        var titleList = <Text style={{color:'#999999',fontSize:12,marginLeft:21,lineHeight:30}}>搜索结果</Text>;
        var userListData = null;
        var deptListData = null;
        var titleShow = false
        if(this.props.userListData){
            userListData = this.props.userListData
            titleShow = true
            if(userListData.length !=0){
                ViewList =  userListData.map((item,i)=>{
                    return this.userList(item,i)
                })
            }
            
        }else if(this.props.deptListData){
            deptListData = this.props.deptListData
            titleShow = true
            if(deptListData.length != 0){
                ViewList =   deptListData.map((item,i)=>{
                    return this.deptList(item,i)
                })
            }
           
        }
        return (
        <View style={styles.container1}>
            <ScrollView horizontal={false} indicatorStyle={'white'} showsVerticalScrollIndicator={true} 
                    style={{height:Dimens.screen_height-40-64,width:Dimens.screen_width,flex:1}}>
            {titleShow ? titleList : null}
            {ViewList}
            </ScrollView>  
        </View>

    )
}

}


const styles = StyleSheet.create({
    container1: {
        flex: 1,
        marginTop:5
    },
    list:{
        height:36,
        width:ScreenWidth,
        paddingLeft: 30,
        paddingRight: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems:'center',
        backgroundColor:'#fff',
        marginBottom: 1,
    },
    line:{
        backgroundColor:'#eeeeee',height:1,width:(Dimens.screen_width-20),marginTop:0,
    },
    leftT:{
        flexDirection:'column',
        justifyContent: 'space-between',
        alignItems:'flex-start',
    },
    leftT2:{
        flexDirection:'row',
        justifyContent: 'flex-start',
        alignItems:'center',
    },
    rightT:{
        width:48,
        height:18,
        backgroundColor:'rgba(255,255,255,1)',
        borderColor: 'rgba(153,153,153,1)',
        borderWidth: 1,
        borderRadius:3,
        fontSize: 12,
        color:'#666',
        lineHeight:18,
        textAlign:'center'
    }
});