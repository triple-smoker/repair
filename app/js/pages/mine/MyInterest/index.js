
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
    Alert,
    Dimensions,
    ScrollView, DeviceEventEmitter, BackHandler, TouchableHighlight
} from 'react-native';
import * as Dimens from '../../../value/dimens';
import Request, {FollowDept,FollowEqp,FollowUser,FollowWork,FollowList} from '../../../http/Request';
import BaseComponent from '../../../base/BaseComponent'
import { Container, Header, Content,  TabHeading  } from 'native-base';
import TitleBar from '../../../component/TitleBar';
import InterestList from './InterestList'
import { thisTypeAnnotation } from '@babel/types';
import AsyncStorage from '@react-native-community/async-storage';
import { Tabs } from '@ant-design/react-native';

let ScreenWidth = Dimensions
  .get('window')
  .width;
let ScreenHeight = Dimensions
  .get('window')
  .height;
export default class MyInterest extends BaseComponent {
    static navigationOptions = {
        header: null,
    };
    constructor(props){
        super(props);
        this.state = {
            isScan : null,
            scanId : null,
            equipmentId : null,
            equipmentName : null,
            isDesk:false,
            rightImg:null,
            deptRecords:null,
            eqpRecords:null,
            userData:null,
            userRecords:null,
            workRecords:null,
            captrueId:1
        }
    }
    componentDidMount() {
        this.loadDetail()
      
    }
    componentWillReceiveProps(nextProps){
        setTimeout(
            () => { 
             this.loadDetail()
            }, 500)
        
       
    }
    loadDetail(type){    
        var that = this;        
        AsyncStorage.getItem('uinfo',function (error, result) {
        if(error){
            console.log(error)
            return
        }else{
            var userInfo =  JSON.parse(result);
            Request.requestGet(FollowWork+userInfo.userId,null,(res)=>{
                
                console.log('workRecords--------------------------')
                console.log(res)
                if(res && res.code ==  200){
                    var data =  res.data.records
                    that.setState({workRecords:data,})
                }
            })
            that.setState({userData:userInfo});  
        }
        }) 
        
    }
   
    goBack(){
        const { navigate } = this.props.navigation;
        this.props.navigation.goBack();
    }
    //去 添加关注页面
    captrue() {     
        const {navigation} = this.props;
        InteractionManager.runAfterInteractions(() => {
            navigation.navigate('addFocus',{
                theme:this.theme,
                searchId:this.state.captrueId,
                callback: (
                    () => {
                        if(this.state.captrueId==1){
                            this.setDesk(null,1) 
                        }else{
                            this.setDesk(null,3) 
                        }
                    })
            })
        });   
    }
    //请求不同的接口设置列表信息
    loadData(url,index){
        var data = null;
        Request.requestGet(url,null,(res)=>{
            console.log(res)
            if(res && res.code==200){
                 data =  res.data.records
                if(index==0){
                    this.setState({workRecords:data,isDesk : false})
                }else if(index == 1){
                    this.setState({deptRecords:data,isDesk : true,captrueId:1})
                }else if(index==2){
                    this.setState({eqpRecords:data,isDesk : false})
                }else if(index==3){
                    this.setState({userRecords:data,isDesk : true,captrueId:2})
                }
            }
        })
    }
    //按导航栏 设置请求不同关注的接口
    setDesk(tab,index){
        var userdata = this.state.userData;
        if(index == 0){
            url = FollowWork + userdata.userId;
            // url = FollowList + '1/' + userdata.userId;
            this.loadData(url,index)  
        }else if(index == 1){
            
            url = FollowDept + userdata.userId;
            this.loadData(url,index)  
        }else if(index==2){
            url = FollowEqp + userdata.userId;
            this.loadData(url,index)
        }else if(index == 3){
            
            url = FollowUser + userdata.userId;
            this.loadData(url,index)
        }
    }
    
      
    render() {
        const tabs = [
            { title: '工单' },
            { title: '科室' },
            { title: '设备' },
            { title: '用户' }
          ];
        var deptRecords  = null;
        var eqpRecords = null;
        var userRecords = null;
        var workRecords = null;
        if(this.state.deptRecords){
            deptRecords = this.state.deptRecords
        }
        if(this.state.eqpRecords){
            eqpRecords = this.state.eqpRecords
        }
        if(this.state.userRecords){
            userRecords = this.state.userRecords
        }
        if(this.state.workRecords){
            workRecords = this.state.workRecords
        }
        return (
            <View style={styles.container}>
                 <View style={{height:44,backgroundColor:'white',justifyContent:'center', textAlignVertical:'center', flexDirection:'row',
                               alignItems:'center', marginLeft:0, marginRight:0, marginTop:0,borderBottomColor:'#eeeeee',borderBottomWidth:1}}>
                    <TouchableHighlight style={{width:40,height:44,justifyContent:"center",alignItems:"center"}} onPress={()=>this.goBack()}>
                        <Image style={{width:21,height:37}} source={require("../../../../image/navbar_ico_back.png")}/>
                    </TouchableHighlight>
                    <View style={{flex:1,justifyContent:'center',alignItems:'center',height:30,fontWeight:"600"}}>
                        <Text style={{color:'#555',fontSize:18,marginLeft:5, flex:1}}>我的关注</Text>
                    </View>
                    {
                        this.state.isDesk ? <TouchableOpacity onPress={()=>this.captrue()}>
                                                <Image style={{width:21,height:21,marginLeft:5,marginRight:10}} source={require('../../../../res/repair/navbar_desk.png')} />
                                            </TouchableOpacity> : <View style={{width:21,height:21,marginLeft:5,marginRight:10}}></View>
                    }
                    
                    
                </View>
                <Tabs onChange={(tab,index)=>{this.setDesk(tab,index)}} 
                    tabs={tabs} tabBarActiveTextColor={'#61C0C5'} 
                    tabBarUnderlineStyle={{width:0,}}
                    initialPage={0}>
                    <View style={styles.main}>
                        <InterestList workRecords={workRecords} />
                    </View>
                    <View style={styles.main}>
                         <InterestList deptRecords={deptRecords} />
                    </View>
                    <View style={styles.main}>
                        <InterestList eqpRecords={eqpRecords} />
                    </View>
                    <View style={styles.main}>
                        <InterestList userRecords={userRecords}/>
                    </View>
                </Tabs>
            </View>
        )
    }


}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
    line:{
        backgroundColor:'#eeeeee',height:1,width:(Dimens.screen_width-20),marginTop:0,
    },
    main:{
        backgroundColor: '#f0f0f0',  
        flex:1
      }
});
