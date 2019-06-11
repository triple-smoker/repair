

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    DeviceEventEmitter,
    Dimensions,
    InteractionManager,
    TouchableOpacity,
    ScrollView,
    Modal,
    TextInput,
    Linking,
    ActivityIndicator
} from 'react-native';

import TitleBar from '../../component/TitleBar';
import * as Dimens from '../../value/dimens';
import Request, {ScanDetails} from '../../http/Request';
import { toastShort } from '../../util/ToastUtil';
import { toDate } from '../../util/DensityUtils';
import BaseComponent from '../../base/BaseComponent'
import Sound from "react-native-sound";
import {Content,Accordion,} from "native-base";
import AsyncStorage from '@react-native-community/async-storage';

let ScreenWidth = Dimensions.get('window').width;
let ScreenHeight = Dimensions.get('window').height;
export default class MyPage extends BaseComponent {
    static navigationOptions = {
        header: null,
    };
    constructor(props){
        super(props);
        this.state={
            userData:null,
        }
    }
    componentWillUnmount(){
        // this.loadDetail();
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

    materielList() {
        // const {navigation} = this.props;
        // InteractionManager.runAfterInteractions(() => {
        //     navigation.navigate('MaterielList',{
        //         theme:this.theme,
        //         repairId: this.state.repairId})
        // });
    }
    gotoSet(){
        const {navigation} = this.props;
        InteractionManager.runAfterInteractions(() => {
            navigation.navigate('MySet',{
                theme:this.theme,
            })
        });
    }
    gotoPage(num){
        console.log('qu'+num)
    }
    render() {
        var  userData = this.state. userData;
        var materialList = <Text style={{textAlignVertical:'center',backgroundColor:'white', color:'#999',fontSize:14, height:50, textAlign:'center',}}>暂无内容</Text>;
        var processList = <Text style={{textAlignVertical:'center',backgroundColor:'white', color:'#999',fontSize:14, height:50, textAlign:'center',}}>暂无内容</Text>;
        if (userData) {
            var headerImg = userData.headImgId;
            var workNumber = userData.workNumber;
            var  deptName = userData.deptAddresses[0].deptName
            var userName = userData.userName;
            var gender = userData.gender;
            var telNo = userData.telNo;
        }
        var rightImg = require('../../../res/login/navbar_ico_set.png')
        return (
            <View style={styles.container}>
                <TitleBar
                    backgroundColor={'#61c0c5'}
                    rightImg={rightImg}
                    navigation={this.props.navigation}
                    lineHeight={0}
                    rightImgPress={this.gotoSet.bind(this)}
                />
                <ScrollView horizontal={false} indicatorStyle={'white'} showsVerticalScrollIndicator={true} style={{height:Dimens.screen_height-40-64, 
                    width:Dimens.screen_width,flex:1}}>
                   <View style={styles.header}> 
                   </View>
                    <View style={styles.main}>
                        <View style={{flexDirection: 'row',justifyContent:'flex-start',alignItems: 'center',paddingLeft: 8,
                            paddingRight: 8,}}>
                            {headerImg ? <Image style={styles.images} source={{uri:headerImg}}/> : <Image style={styles.images} source={require('../../../res/repair/user_wx.png')}/> }
                            
                            <Text style={{marginLeft:20}}>{userName}</Text>
                            { gender == 1 ? <Image style={{width:15,height:15}} source={require('../../../res/login/m.png')}/> : <Image style={{width:15,height:15}} source={require('../../../res/login/f.png')}/> }
                            
                        </View>
                        <View style={{flexDirection: 'row', justifyContent:'space-around',alignItems: 'center',paddingLeft: 8,
                                paddingRight: 8,marginTop:15}}>
                            <Image style={{width:22,height:20}} source={require('../../../res/login/gh.png')}/>
                            <Text>{workNumber + ' | '}</Text>
                            <Image style={{width:22,height:20}} source={require('../../../res/login/cellph.png')}/>
                            <Text> {telNo + ' | '}</Text>
                            <Image style={{width:22,height:20}} source={require('../../../res/login/department.png')}/>
                            <Text>{deptName}</Text>
                        </View>
                        <View style={{backgroundColor:'#61c0c5',paddingLeft: 8,height:30,marginTop:15,
                                paddingRight: 8,}}>
                            <Text style={{lineHeight:30,}}>操作证</Text>
                        </View>
                    </View>
                    <View style={{justifyContent:'center',flexDirection:'row',alignItems:'center',marginTop:40,paddingLeft:0,paddingRight:0,}}>
                        <View style={{justifyContent:'center',alignItems:'center',flex:1}}>
                        <TouchableOpacity onPress={()=>this.gotoPage(1)}>
                            <Image source={require('../../../res/login/jf.png')} style={{width:45,height:45,marginLeft:0, marginRight:0,}}/>
                            <Text style={{fontSize:12,color:'#333',marginLeft:0,marginTop:5,textAlign:'center',}}>我的积分</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{justifyContent:'center',alignItems:'center',flex:1}}>
                            <TouchableOpacity onPress={()=>this.gotoPage(2)}>
                            <Image source={require('../../../res/login/jx.png')} style={{width:45,height:45,marginLeft:0, marginRight:0,}}/>
                            <Text style={{fontSize:12,color:'#333',marginLeft:0,marginTop:5,textAlign:'center',}}>我的绩效</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{justifyContent:'center',alignItems:'center',flex:1}}>
                            <TouchableOpacity onPress={()=>this.gotoPage(3)}>
                            <Image source={require('../../../res/login/gz.png')} style={{width:45,height:45,marginLeft:0, marginRight:0,}}/>
                            <Text style={{fontSize:12,color:'#333',marginLeft:0,marginTop:5,textAlign:'center',}}>我的关注</Text>
                            </TouchableOpacity>
                        </View>

                        
                    </View>

                    <View style={{justifyContent:'center',flexDirection:'row',alignItems:'center',marginTop:20,paddingLeft:0,paddingRight:0,}}>
                        <View style={{justifyContent:'center',alignItems:'center',flex:1}}>
                            <TouchableOpacity onPress={()=>this.gotoPage(4)} >
                            <Image source={require('../../../res/login/gd.png')} style={{width:45,height:45,marginLeft:0, marginRight:0,}}/>
                            <Text style={{fontSize:12,color:'#333',marginLeft:0,marginTop:5,textAlign:'center',}}>工单</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{justifyContent:'center',alignItems:'center',flex:1}}>
                            <TouchableOpacity onPress={()=>this.gotoPage(5)} >
                            <Image source={require('../../../res/login/notice.png')} style={{width:45,height:45,marginLeft:0, marginRight:0,}}/>
                            <Text style={{fontSize:12,color:'#333',marginLeft:0,marginTop:5,textAlign:'center',}}>通知</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{justifyContent:'center',alignItems:'center',flex:1}}>
                            <TouchableOpacity onPress={()=>this.gotoPage(6)} >
                            <Image source={require('../../../res/login/cggn.png')} style={{width:45,height:45,marginLeft:0, marginRight:0,}}/>
                            <Text style={{fontSize:12,color:'#333',marginLeft:0,marginTop:5,textAlign:'center',}}>常规功能</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </ScrollView>    
            </View>
        )
    }

}


const styles = StyleSheet.create({
   
    container: {
        flex: 1,
        backgroundColor: '#f6f6f6',
    },
    images:{
        height:45,
        width:45,
        borderRadius:45,
        marginLeft:10
    },
    header:{
        backgroundColor:'#61c0c5',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height:50,
        borderBottomLeftRadius: 150,
        borderBottomRightRadius: 150,
    },
    main:{
        backgroundColor:'#fff',
        marginLeft: 18,
        marginRight: 18,
        marginTop: -50,
        paddingTop:15,
        paddingBottom:0,
        borderRadius: 5,
        overflow:'hidden'
    },
    title:{
        paddingLeft:30,
        marginTop:5,
        flexDirection: 'row',
        justifyContent:'space-between',
    }
});
