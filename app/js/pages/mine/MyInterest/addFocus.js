
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
import Request, {BaseDeptList,BaseUserList,FollowUser,FollowWork,FollowList} from '../../../http/Request';
import BaseComponent from '../../../base/BaseComponent'
import { Container, Header, Content,  TabHeading  } from 'native-base';
import TitleBar from '../../../component/TitleBar';
import SearchLIst from './searchList'
import { thisTypeAnnotation } from '@babel/types';
import AsyncStorage from '@react-native-community/async-storage';
import { Tabs } from '@ant-design/react-native';

let ScreenWidth = Dimensions
  .get('window')
  .width;
let ScreenHeight = Dimensions
  .get('window')
  .height;
export default class AddFocus extends BaseComponent {
    static navigationOptions = {
        header: null,
    };
    constructor(props){
        super(props);
        const { navigation } = this.props;
        const searchId = navigation.getParam('searchId', '');
        this.state = {
            searchContext:'',
            userData:null,
            recordListSearch:[],
            searchId : searchId,
            deptListData:null,
            userListData:null,
            placeholderTxt:null,
            titleName:null,
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
        if(this.state.searchId == 1){
            that.setState({placeholderTxt:'请输入科室名',titleName:'科室添加关注'});  
        }else if(this.state.searchId == 2){
            that.setState({placeholderTxt:'请输入用户名',titleName:'用户添加关注'});  
        } 
        AsyncStorage.getItem('uinfo',function (error, result) {
        if(error){
            console.log(error)
            return
        }else{
            var userInfo =  JSON.parse(result);
            that.setState({userData:userInfo});  
        }
        })  
    }
    //搜索
    _setSerachShow(context){
        
        this.setState({recordListSearch:[],searchContext:context});
        var data = null;
        console.log(this.state.searchContext)
        var params = new Map();
        
     
        if(this.state.searchId == 1){
            params.set('deptName', context);
            Request.requestGet(BaseDeptList,params,(res)=>{
                if(res && res.code==200){
                    data = res.data.records
                    this.setState({deptListData:data})
                }
                console.log(res.data)
            })
        }else if(this.state.searchId == 2){
            params.set('userName', context);
            Request.requestGet(BaseUserList,params,(res)=>{
                if(res && res.code==200){
                    data = res.data.records
                    this.setState({userListData:data})
                }
                
                console.log(res.data)
            })
        }
       
    }
    goback(){

        const { navigate } = this.props.navigation;
        console.log(this.props)
        this.props.navigation.state.params.callback()
        this.props.navigation.goBack();
        
    }
 
    render() {
        var userListData =null;
        var deptListData = null;
        var placeholderTxt = null;
        var titleName = null;
        if(this.state.userListData){
            userListData = this.state.userListData
        }
        if(this.state.deptListData){
            deptListData = this.state.deptListData
        }
        if(this.state.placeholderTxt || this.state.titleName){
            placeholderTxt = this.state.placeholderTxt;
            titleName = this.state.titleName;
        }
        return (
            <View style={styles.container}>
                <TitleBar
                    centerText={'添加关注'}
                    isShowLeftBackIcon={true}
                    navigation={this.props.navigation}
                    leftPress={() => this.goback()}
                    
                    />
                <View style={{height:44,backgroundColor:'white', marginLeft:0, marginRight:0, marginTop:0,flexDirection:'row',justifyContent:'center',alignItems: 'center',}}>
                   
                    <View style={{flex:1, height:30,backgroundColor:'#f0f0f0',justifyContent:'center', flexDirection:'row',alignItems:'center', marginRight:5,
                        borderBottomRightRadius: 15,borderBottomLeftRadius: 15,borderTopLeftRadius: 15,borderTopRightRadius: 15,marginLeft:20}}>

                        <Image source={require('../../../../image/ico_seh.png')}
                               style={{width:16,height:16,marginLeft:12}}/>
                       
                        <TextInput style={{color:'#333',fontSize:14,marginLeft:5, flex:1, height:40, textAlignVertical:'center'}}
                                   placeholder={placeholderTxt} placeholderTextColor="#aaaaaa" underlineColorAndroid="transparent" numberOfLines={1}
                                   onChangeText={(searchContext) => this.setState({searchContext:searchContext})}
                        />
                    </View>
                    <View style={{marginLeft:10}}>
                        <TouchableOpacity onPress={()=>this._setSerachShow(this.state.searchContext)} style={{width:60,flexDirection:'row'}}>
                            <Text style={{color:"#252525"}}>搜索</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                 <SearchLIst userData={this.state.userData} userListData={userListData} deptListData={deptListData} /> 
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
