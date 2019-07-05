

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
import { Tabs,Icon, SearchBar, TabBar } from '@ant-design/react-native';
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
            userData : null,
            selectedTab : 'redTab',
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
                <Text style={{color:'#333333',fontWeight:'bold',fontSize:13}}>{item.sourceName}</Text>
                <Text style={{color:'#666',fontWeight:'400',fontSize:12}}>{item.installLocation}</Text>
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
                        {/* <Image style={{width:9,height:13,position:'absolute',right:0,bottom:0}} source={require("../../../../res/login/f.png")}/> */}
                    </View>
                
                    <Text style={{marginLeft:5,color:'#333333',fontWeight:'400',fontSize:13}}>{item.sourceName}</Text>
                
                </View>
                <Text style={styles.rightT}>√已关注</Text>
            </View>
    }
    //关注的工单列表dom
    workList(item,i){
        var list1=[]
        var list2=[]
        var list3=[]
        const worktabs = [
            { title: '巡检' },
            { title: '维修' },
            { title: '保养' },
          ];
        switch(item.bizFlag) {
            case 1:
                    list1.push(item)
               break;
            case 2:
                    list2.push(item)
               break;
            case 3:
                    list3.push(item)
                break;
            default:
                break;
       } 
       console.log('list1')
       console.log(list1)
       return  <Tabs key={i} onChange={(tab,index)=>{this.setTab(tab,index)}} 
                            tabs={worktabs} tabBarActiveTextColor={'#61C0C5'} 
                            tabBarUnderlineStyle={{backgroundColor:'#61C0C5'}}
                            initialPage={0}>
                            <View style={styles.main1}>
                            <ScrollView style={{ backgroundColor: '#fff' }}>
                                {this.workChildList(list1)}
                            </ScrollView>  
                            </View>
                            <View style={styles.main1}>
                            {this.workChildList(list2)}
                            </View>
                            <View style={styles.main1}>
                            {this.workChildList(list3)}
                            </View>
                        
                    </Tabs>
    }
    workChildList(item){
        var childList = null;
        if(item.length != 0){
            childList = item.map((data,i)=>{
                return this.workChildList2(data,i)
             })
     
        }else{
            childList = <Text style={{textAlignVertical:'center',backgroundColor:'white', color:'#999',fontSize:14, height:50, textAlign:'center',}}>暂无关注</Text>;
        }
       
        return childList
       
    }
    workChildList2(data,i){
     
        return <View key={i} style={styles.list}>
                    <View style={styles.leftT2}>
                        <Text style={{marginLeft:5,color:'#333333',fontWeight:'400',fontSize:13}}>{data.workUserName}</Text>
                    
                    </View>
                    <Text style={styles.rightT}>√已关注</Text>
                </View>
   
            
        
    }
    setTab(tab,index){
        console.log(index)
    }
    render() {
        var ViewList = <Text style={{textAlignVertical:'center',backgroundColor:'white', color:'#999',fontSize:14, height:50, textAlign:'center',}}>暂无关注</Text>;
        var deptRecords = null;
        var eqpRecords = null;
        var userRecords = null;
        var workRecords =null;
        if(this.props.deptRecords){
            deptRecords = this.props.deptRecords
            
            ViewList = <ScrollView horizontal={false} indicatorStyle={'white'} showsVerticalScrollIndicator={true} 
                        style={{height:Dimens.screen_height-40-64,width:Dimens.screen_width,flex:1}}>
                {deptRecords.map((item,i)=>{
                    return this.deptList(item,i)
                })}
            </ScrollView> 
            
        }else if(this.props.eqpRecords){
            eqpRecords = this.props.eqpRecords
       
            ViewList = <ScrollView horizontal={false} indicatorStyle={'white'} showsVerticalScrollIndicator={true} 
                        style={{height:Dimens.screen_height-40-64,width:Dimens.screen_width,flex:1}}>
                    {eqpRecords.map((item,i)=>{
                        return this.eqpList(item,i)
                    })}
            </ScrollView> 
        }else if(this.props.userRecords){
            userRecords = this.props.userRecords
            ViewList = <ScrollView horizontal={false} indicatorStyle={'white'} showsVerticalScrollIndicator={true} 
                        style={{height:Dimens.screen_height-40-64,width:Dimens.screen_width,flex:1}}>
                { userRecords.map((item,i)=>{
                    return this.userList(item,i)
                })}
            </ScrollView>
        }else if(this.props.workRecords){
            workRecords = this.props.workRecords
            ViewList = workRecords.map((item,i)=>{
                return this.workList(item,i)
            })
        }
        return (
        <View style={styles.container1}>
           
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
        height:40,
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
    },
    main1:{
        backgroundColor: '#fff',  
        paddingTop: 5,
        flex:2,
      }
});