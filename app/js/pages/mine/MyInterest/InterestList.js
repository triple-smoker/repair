

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


import {Content, Accordion, Col, Textarea, Button,} from "native-base";
import {toDate} from '../../../util/DensityUtils'


let ScreenWidth = Dimensions
  .get('window')
  .width;
let ScreenHeight = Dimensions
  .get('window')
  .height;
export default class InterestList extends BaseComponent {
    static navigationOptions = {
        header: null,
    };
    constructor(props){
        super(props);
        this.state={
            theme:this.props.theme,
            userData : null
        }
    }
    componentDidMount() {
        var that = this;
        
    }
    componentWillUpdate(){

    }
    //关注的科室列表
    deptList(item,i){
        return <View key={i} style={styles.list}>
                        <Text style={{color:'#333333',fontWeight:'400',fontSize:13}}>{item.sourceName}</Text>
                        <Text style={styles.rightT}>√已关注</Text>
                    </View>
    }
    //关注的设备列表
    eqpList(item,i){
        return <View  key={i} style={styles.list}>
            <View style={styles.leftT}>
                <Text style={{color:'#333333',fontWeight:'400',fontSize:13}}>xxxxxx</Text>
                <Text style={{color:'#666',fontWeight:'400',fontSize:11}}>{item.sourceName}</Text>
            </View>
            <Text style={styles.rightT}>√已关注</Text>
        </View>
    }
    //关注的用户列表dom
    userList(item,i){
        return <View key={i} style={styles.list}>
                <View style={styles.leftT2}>
                    <View style={{position:'relative'}}>
                        <Image style={{width:28,height:28,borderRadius:28}} source={require("../../../../image/user_wx.png")}/>
                        <Image style={{width:9,height:13,position:'absolute',right:0,bottom:0}} source={require("../../../../res/login/f.png")}/>
                    </View>
                
                    <Text style={{marginLeft:5,color:'#333333',fontWeight:'400',fontSize:13}}>{item.sourceName}</Text>
                
                </View>
                <Text style={styles.rightT}>√已关注</Text>
            </View>
    }
    //关注的工单列表dom
    workList(item,i){
        return <View key={i} style={styles.list}>
                <View style={styles.leftT2}>
                    <Text style={{color:'#333333',fontWeight:'400',fontSize:13}}>{item.sourceName}</Text>
            
                
                    <Text style={{marginLeft:5,color:'#333333',fontWeight:'400',fontSize:13}}>{item.workUserName}</Text>
                
                </View>
                <Text style={styles.rightT}>√已关注</Text>
            </View>
    }
    
    render() {
        var ViewList = <Text style={{textAlignVertical:'center',backgroundColor:'white', color:'#999',fontSize:14, height:50, textAlign:'center',}}>暂无关注</Text>;
        var deptRecords = null;
        var eqpRecords = null;
        var userRecords = null;
        var workRecords =null;
        if(this.props.deptRecords){
            deptRecords = this.props.deptRecords
            ViewList = deptRecords.map((item,i)=>{
                return this.deptList(item,i)
            })
        }else if(this.props.eqpRecords){
            eqpRecords = this.props.eqpRecords
            ViewList = eqpRecords.map((item,i)=>{
                return this.eqpList(item,i)
            })
        }else if(this.props.userRecords){
            userRecords = this.props.userRecords
            ViewList = userRecords.map((item,i)=>{
                return this.userList(item,i)
            })
        }else if(this.props.workRecords){
            workRecords = this.props.workRecords
            ViewList = workRecords.map((item,i)=>{
                return this.workList(item,i)
            })
        }
        return (
        <View style={styles.container1}>
            <ScrollView horizontal={false} indicatorStyle={'white'} showsVerticalScrollIndicator={true} 
                    style={{height:Dimens.screen_height-40-64,width:Dimens.screen_width,flex:1}}>
            {ViewList}
           
            {/* <View style={styles.list}>
                <View style={styles.leftT}>
                    <Text style={{color:'#333333',fontWeight:'400',fontSize:13}}>{this.props.type}</Text>
                    <Text style={{color:'#666',fontWeight:'400',fontSize:11}}>中央空调（S19A36M7</Text>
                </View>
                <Text style={{color:'#333333',fontWeight:'400',fontSize:13}}>{this.props.type}</Text>
      
                <View style={styles.leftT2}>
                    <View style={{position:'relative'}}>
                        <Image style={{width:28,height:28,borderRadius:28}} source={require("../../../../image/user_wx.png")}/>
                        <Image style={{width:9,height:13,position:'absolute',right:0,bottom:0}} source={require("../../../../res/login/f.png")}/>
                    </View>
                
                    <Text style={{marginLeft:5,color:'#333333',fontWeight:'400',fontSize:13}}>{this.props.type}</Text>
                   
                </View>
                <Text style={styles.rightT}>√已关注</Text>
            </View> */}
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
        color:'#909090',
        lineHeight:18,
        textAlign:'center'
    }
});