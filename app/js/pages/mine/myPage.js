

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
import Request, {ScanDetails,GetUserAtWork} from '../../http/Request';
import BaseComponent from '../../base/BaseComponent';
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
            atWork:false
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

                Request.requestGet(GetUserAtWork + userInfo.userId,null,(result) => {
                    if (result && result.code === 200) {
                        that.setState({
                            atWork:result.data
                        })
                    }
                })
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
    gotoWorkPage(){
        const {navigation} = this.props;
        InteractionManager.runAfterInteractions(() => {
            navigation.navigate('WorkManager',{
                theme:this.theme,
                callback: (
                    () => {
                        this.props.setHome();
                    })
            })
        });
    }
    /**导航栏（123。。。） */
    gotoPage(num){
        console.log('qu'+num)
        const {navigation} = this.props;
        var page = 'MainPage'
        switch (num) {
            case 1:
                page = ''
                break;
            case 2:
                page = ''
            break;
            case 3:
                page = 'MyInterest'
            break;
            case 4:
                page = ''
            break;
            case 5:
                page = 'Inform'
            break;
            case 6:
                page = ''
            break;
            page = ''
            default:
                break;
        }
        InteractionManager.runAfterInteractions(() => {
            navigation.navigate(page,{
                theme:this.theme,
            })
        });
    }
    /**跳到证照 */
    loogPapers(){
        const {navigation} = this.props;
        InteractionManager.runAfterInteractions(() => {
            navigation.navigate('PapersPage',{
                theme:this.theme,
            })
        });
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
                            
                            <Text style={{marginLeft:20,fontSize:15,color:'#333'}}>{userName}</Text>
                            { gender == 1 ? <Image style={{width:15,height:15,marginLeft:5}} source={require('../../../res/login/m.png')}/> : <Image style={{width:15,height:15,marginLeft:5}} source={require('../../../res/login/f.png')}/> }
                            {this.state.atWork === true ? 
                                <View style={{flexDirection: 'row',position:"absolute",top:-5,right:10,fontSize:14}}>
                                    <Image style={{width:20,height:20}} source={require('../../../image/clock_in_2.jpg')}/>
                                    <Text> 已打卡</Text>    
                                </View>                                :
                                <View style={{flexDirection: 'row',position:"absolute",top:-5,right:10,fontSize:14}}>
                                    <Image style={{width:20,height:20}} source={require('../../../image/no_clock_in_2.jpg')}/>
                                    <Text> 未打卡</Text>    
                                </View>
                                
                                }
                        </View>
                        <View style={{flexDirection: 'row', justifyContent:'space-around',alignItems: 'center',paddingLeft: 8,
                                paddingRight: 8,marginTop:15}}>
                            <Image style={{width:22,height:20}} source={require('../../../res/login/gh.png')}/>
                            <Text style={{color:'#999',fontWeight:'400',fontSize:13}}>{workNumber + ' | '}</Text>
                            <Image style={{width:20,height:20}} source={require('../../../res/login/cellph.png')}/>
                            <Text style={{color:'#999',fontWeight:'400',fontSize:13}}> {telNo + ' | '}</Text>
                            <Image style={{width:23,height:20}} source={require('../../../res/login/department.png')}/>
                            <Text style={{color:'#999',fontWeight:'400',fontSize:13}}>{deptName}</Text>
                        </View>
                        <View style={{backgroundColor:'#61c0c5',paddingLeft: 8,height:35,marginTop:15,
                                paddingRight: 8,}}>
                            <TouchableOpacity onPress={()=>this.loogPapers()}>      
                            <Text style={{lineHeight:35,color:'#fff',fontWeight:'400',fontSize:14}}>证照</Text>
                            </TouchableOpacity> 
                        </View>
                    </View>
                    <View style={{justifyContent:'center',flexDirection:'row',alignItems:'center',marginTop:30,paddingLeft:0,paddingRight:0,}}>
                        <TouchableOpacity onPress={()=>this.gotoPage(1)} style={{...styles.pageBox,borderBottomWidth:1,borderRightWidth:1}}>
                            <View style={styles.touchSize} >
                            <Image source={require('../../../res/login/jf.png')} style={{width:39,height:39,marginLeft:0, marginRight:0,}}/>
                            </View>
                            <Text style={styles.pageTxt}>我的积分</Text>
                            
                        </TouchableOpacity>

                        <TouchableOpacity onPress={()=>this.gotoPage(2)} style={{...styles.pageBox,borderRightWidth:1,borderBottomWidth:1}}>
                            <View  style={styles.touchSize}  >
                            <Image source={require('../../../res/login/jx.png')} style={{width:34,height:34,marginLeft:0, marginRight:0,}}/>
                            </View>
                            <Text style={styles.pageTxt}>我的绩效</Text>
                            
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>this.gotoPage(3)} style={{...styles.pageBox,borderBottomWidth:1}}>
                            <View style={styles.touchSize}  >
                            <Image source={require('../../../res/login/gz.png')} style={{width:37,height:38,marginLeft:0, marginRight:0,}}/>
                            </View>
                            <Text style={styles.pageTxt}>我的关注</Text>
                           
                        </TouchableOpacity>

                        
                    </View>

                    <View style={{justifyContent:'center',flexDirection:'row',alignItems:'center',marginTop:0,paddingLeft:0,paddingRight:0,}}>
                        <TouchableOpacity  onPress={()=>this.gotoWorkPage()} style={{...styles.pageBox,borderRightWidth:1}}>
                            <View  style={styles.touchSize}  >
                            <Image source={require('../../../res/login/gd.png')} style={{width:30,height:37,marginLeft:0, marginRight:0,}}/>
                            
                            </View>
                            <Text style={styles.pageTxt}>工单</Text>
                        </TouchableOpacity>
                        <TouchableOpacity  onPress={()=>this.gotoPage(5)} style={{...styles.pageBox,borderRightWidth:1}}>
                            <View  style={styles.touchSize}  >
                            <Image source={require('../../../res/login/notice.png')} style={{width:35,height:32,marginLeft:0, marginRight:0,}}/>
                            </View>
                            <Text style={styles.pageTxt}>通知</Text>
                            
                        </TouchableOpacity>

                        <TouchableOpacity onPress={()=>this.gotoPage(6)} style={styles.pageBox}>
                            <View style={styles.touchSize}  >
                            <Image source={require('../../../res/login/cggn.png')} style={{width:32,height:34,marginLeft:0, marginRight:0,}}/>
                            </View>
                            <Text style={styles.pageTxt}>常规功能</Text>
                            
                        </TouchableOpacity>
                    </View>

                </ScrollView>    
            </View>
        )
    }

}


const styles = StyleSheet.create({
   
    container: {
        flex: 1,
        backgroundColor: '#fcfcfc',
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
    },
    pageTxt:{
        fontSize:14,color:'#666',fontWeight:'400',marginLeft:0,marginTop:5,textAlign:'center',
    },
    pageBox:{
        justifyContent:'center',alignItems:'center',flex:1,padding:20,backgroundColor:'#fff',borderColor: '#f6f6f6',
    },
    touchSize:{
        width:40,
        height:40,
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    }
});
