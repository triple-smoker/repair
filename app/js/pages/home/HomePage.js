import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    DeviceEventEmitter,
    InteractionManager,
    TouchableOpacity,
    ScrollView,
    Modal
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import Swiper from 'react-native-swiper';
import TitleBar from '../../component/TitleBar';
import * as Dimens from '../../value/dimens';
import Login from '../login/Login';
import Request, {GetRepairType} from '../../http/Request';
import Permissions from 'react-native-permissions';
import OrderType from "../../../pages/publicTool/OrderType";

const bannerImgs=[
require('../../../res/default/banner_01.jpg'),
require('../../../res/default/banner_02.jpg'),
require('../../../res/default/banner_03.jpg')
]

export default class HomePage extends Component {
    static navigationOptions = {
        header: null,
    };
    constructor(props){
        super(props);
        this.state={
            customThemeVisible:false,
            theme:this.props.theme,
            modalVisible:false,
            typeVisible:false,
        }
    }


    loadUserInfo() {
        console.log('loadUserInfo');
        var that = this;
        AsyncStorage.getItem('token', function (error, result) {
            if (error) {
                console.log('读取失败')
            } else {
               if (result && result.length) {
                    global.access_token = result;
                    console.log('access_token: result = ' + result);
               } else {
                const {navigation} = that.props;
                InteractionManager.runAfterInteractions(() => {
                    console.log('HP : loadUserInfo');
                    navigation.navigate('Login',{theme:that.theme})

                    });
               }
            }
        });

        AsyncStorage.getItem('uinfo', function (error, result) {
            console.log('uinfo: result = ' + result + ', error = ' + error);
            if (error) {
                console.log('读取失败')
            } else {
               if (result && result.length) {

                    global.uinfo = JSON.parse(result);
                    console.log('global.uinfo.userId: ' + global.uinfo.userId)
               }

            }
        });
    }

    onAction(action, params) {
        console.log('onAction : ' + action);
    }
    componentDidMount() {
        this.eventListener = DeviceEventEmitter.addListener('Event_Home', (param) => {
            console.log('componentDidMount Home : ' + param);
        });
        this.loadUserInfo();
        this.loadRepairTypes();
        Permissions.request('storage', { type: 'always' }).then(response => {

        })
    }


    componentWillUnmount() {
        //DeviceEventEmitter.removeAllListeners();
        this.timer &&  (this.timer);
        if(this.eventListener){
            this.eventListener.remove();
        }
    }

    loadRepairTypes() {
        var that = this;
        Request.requestGet(GetRepairType, null, (result)=> {
            if (result && result.code === 200) {
                console.log('loadRepairTypes : ' + result)
            } else if (result && result.code === 401) {
                global.access_token = '';
                AsyncStorage.setItem('token', '', function (error) {
                    if (error) {
                        console.log('error: save error');
                    } else {

                    }
                });
                global.uinfo = null;
                AsyncStorage.setItem('uinfo', null, function (error) {
                    if (error) {
                        console.log('error: save error');
                    } else {

                    }
                });
                that.login();
            }
      });
    }

    login() {
        const {navigator} = this.props;
        InteractionManager.runAfterInteractions(() => {
            console.log('hp : login')
                navigator.push({
                    component: Login,
                    name: 'Login',
                    params:{
                        theme:this.theme
                    }
                });
            });
    }

    repair() {
        const { navigate } = this.props.navigation;
        navigate('AllOrder');
    }

    historyDetail() {
        // const {navigator} = this.props;
        // InteractionManager.runAfterInteractions(() => {
        //         navigator.push({
        //             component: HistoryDetail,
        //             name: 'HistoryDetail',
        //             params:{
        //                 theme:this.theme
        //             }
        //         });
        // });
    }

    takePicture() {
        // const {navigator} = this.props;
        // InteractionManager.runAfterInteractions(() => {
        //         navigator.push({
        //             component: FinishWork,
        //             name: 'FinishWork',
        //             params:{
        //                 theme:this.theme
        //             }
        //         });
        // });
    }

    //报修导航
    newRepair(repairTypeId,repairMatterId){
        this.setState({typeVisible: !this.state.typeVisible});
        const { navigate } = this.props.navigation;
        navigate('Repair',{
            repairTypeId:repairTypeId,
            repairMatterId:repairMatterId,
            callback: (
                () => {
                    // setTimeout(function(){
                    //     getRepairList();
                    // },500)
                })
        })
    }
    _setTypeVisible() {
        this.setState({typeVisible: !this.state.typeVisible});
    }

    render() {
        return (
          <View style={styles.container}>
          <TitleBar
          centerText={'首页'}
          isShowLeftBackIcon={false}
          navigator={this.props.navigator}
          />
          <ScrollView horizontal={false} indicatorStyle={'white'} showsVerticalScrollIndicator={true} style={{height:Dimens.screen_height-49-64, width:Dimens.screen_width,flex:1}}>
          <View style={styles.images}>
          <Swiper autoplay={true} loop = {true} style={styles.images} autoplayTimeout={4}
          dot={<View style={{backgroundColor:'rgba(0,0,0,.2)', width: 6, height: 6,borderRadius: 3, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3,}} />}
          activeDot={<View style={{backgroundColor: 'black', width: 14, height: 6, borderRadius: 3, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3}} />}
          paginationStyle={{
            bottom: 10
        }}>
        <View style={{backgroundColor:'transparent'}}>
        <Image style={styles.images} source={bannerImgs[0]} resizeMode={'contain'}/>
        </View>
        <View style={{backgroundColor:'transparent'}}>
        <Image style={styles.images} source={bannerImgs[1]} resizeMode={'contain'}/>
        </View>
        <View style={{backgroundColor:'transparent'}}>
        <Image style={styles.images} source={bannerImgs[2]} resizeMode={'contain'}/>
        </View>
        </Swiper>
        </View>
        <TouchableOpacity onPress={()=>{}}>
        <View style={{backgroundColor:'#f6f6f6', height:80, width:Dimens.screen_width, justifyContent:'center', textAlignVertical:'center', flexDirection:'row', alignItems:'center',}}>
                <Image source={require('../../../res/login/ic_notice.png')}
                style={{width:50,height:40,marginLeft:20}}/>
                <View style={{flex:1,}}>
                  <View style={{flexDirection:'row',}}>
                      <Text style={{fontSize:12,color:'#999',marginLeft:10,marginTop:5,}}>8:30</Text>
                      <Text style={{fontSize:12,color:'#333',marginLeft:10,marginTop:5,marginRight:30,}} numberOfLines={2}>系统提示：您尾号3048的订单已经派单。</Text>
                   </View>
                  <View style={{flexDirection:'row',}}>
                      <Text style={{fontSize:12,color:'#999',marginLeft:10,marginTop:5,}}>8:30</Text>
                      <Text style={{fontSize:12,color:'#333',marginLeft:10,marginTop:5,marginRight:30,}} numberOfLines={2}>医院公告：因电力故障，今日下午2点将紧急抢修半小时，全院人员需做好准备工作…</Text>
                  </View>
                </View>

                <View style={{justifyContent:'flex-end',flexDirection:'row',alignItems:'center',}}>
                <Image source={require('../../../res/login/ic_arrow.png')} style={{width:6,height:11,marginLeft:10, marginRight:10,}}/>
                </View>
        </View>
        </TouchableOpacity>

        <View style={{justifyContent:'center',flexDirection:'row',alignItems:'center',marginTop:10,paddingLeft:10,paddingRight:10,}}>
            <Image source={require('../../../res/login/menu_ljyc.jpg')} style={{width:172,height:185,borderBottomRightRadius: 15,borderBottomLeftRadius: 15,borderTopLeftRadius: 15,borderTopRightRadius: 15,}}/>
            <View style={{justifyContent:'center',alignItems:'center',marginLeft:10, }}>
                <Image source={require('../../../res/login/menu_ljbx.jpg')} style={{width:172,height:87,borderBottomRightRadius: 10,borderBottomLeftRadius: 10,borderTopLeftRadius: 10,borderTopRightRadius: 10,}}/>
                <TouchableOpacity  onPress={()=>this._setTypeVisible()}>
                    <Image source={require('../../../res/login/menu_ljdc.jpg')} style={{width:172,height:87,borderBottomRightRadius: 10,borderBottomLeftRadius: 10,borderTopLeftRadius: 10,borderTopRightRadius: 10,marginTop:10,}}/>
                </TouchableOpacity>
            </View>
            <OrderType goToRepair={(repairTypeId,repairMatterId)=>this.newRepair(repairTypeId,repairMatterId)} isShowModal={()=>this._setTypeVisible()} modalVisible = {this.state.typeVisible}/>
        </View>

        <View style={{backgroundColor:'#f6f6f6',height:10,width:Dimens.screen_width,marginTop:10,}}/>

        <View style={{justifyContent:'center',flexDirection:'row',alignItems:'center',marginTop:20,paddingLeft:0,paddingRight:0,}}>
            <View style={{justifyContent:'center',alignItems:'center',flex:1}}>
              <TouchableOpacity onPress={()=>this.repair()}>
                <Image source={require('../../../res/login/ico_bx.png')} style={{width:45,height:45,marginLeft:0, marginRight:0,}}/>
                <Text style={{fontSize:12,color:'#333',marginLeft:0,marginTop:5,textAlign:'center',}}>报修</Text>
                </TouchableOpacity>
            </View>

            <View style={{justifyContent:'center',alignItems:'center',flex:1}}>
                <TouchableOpacity onPress={()=>this.showModel()}>
                <Image source={require('../../../res/login/ico_pj.png')} style={{width:45,height:45,marginLeft:0, marginRight:0,}}/>
                <Text style={{fontSize:12,color:'#333',marginLeft:0,marginTop:5,textAlign:'center',}}>评价</Text>
                </TouchableOpacity>
            </View>
            <View style={{justifyContent:'center',alignItems:'center',flex:1}}>
                <TouchableOpacity onPress={()=>this.takePicture()}>
                <Image source={require('../../../res/login/ico_ts.png')} style={{width:45,height:45,marginLeft:0, marginRight:0,}}/>
                <Text style={{fontSize:12,color:'#333',marginLeft:0,marginTop:5,textAlign:'center',}}>投诉</Text>
                </TouchableOpacity>
            </View>

            <View style={{justifyContent:'center',alignItems:'center',flex:1}}>
                <TouchableOpacity >
                <Image source={require('../../../res/login/ico_dc.png')} style={{width:45,height:45,marginLeft:0, marginRight:0,}}/>
                <Text style={{fontSize:12,color:'#333',marginLeft:0,marginTop:5,textAlign:'center',}}>订餐</Text>
                </TouchableOpacity>
            </View>
        </View>

        <View style={{justifyContent:'center',flexDirection:'row',alignItems:'center',marginTop:20,paddingLeft:0,paddingRight:0,}}>
            <View style={{justifyContent:'center',alignItems:'center',flex:1}}>
                <Image source={require('../../../res/login/ico_bj.png')} style={{width:45,height:45,marginLeft:0, marginRight:0,}}/>
                <Text style={{fontSize:12,color:'#333',marginLeft:0,marginTop:5,textAlign:'center',}}>保洁</Text>
            </View>

            <View style={{justifyContent:'center',alignItems:'center',flex:1}}>
                <Image source={require('../../../res/login/ico_yf.png')} style={{width:45,height:45,marginLeft:0, marginRight:0,}}/>
                <Text style={{fontSize:12,color:'#333',marginLeft:0,marginTop:5,textAlign:'center',}}>医费</Text>
            </View>
            <View style={{justifyContent:'center',alignItems:'center',flex:1}}>
                <Image source={require('../../../res/login/ico_ys.png')} style={{width:45,height:45,marginLeft:0, marginRight:0,}}/>
                <Text style={{fontSize:12,color:'#333',marginLeft:0,marginTop:5,textAlign:'center',}}>运送</Text>
            </View>

            <View style={{justifyContent:'center',alignItems:'center',flex:1}}>
                <Image source={require('../../../res/login/ico_more.png')} style={{width:45,height:45,marginLeft:0, marginRight:0,}}/>
                <Text style={{fontSize:12,color:'#333',marginLeft:0,marginTop:5,textAlign:'center',}}>更多</Text>
            </View>
        </View>

        <View style={{backgroundColor:'#fff',height:80,width:Dimens.screen_width,marginTop:0,}}/>
        </ScrollView>

        <Modal
            animationType={"none"}
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {}}
        >

        <View style={styles.modelStyle}>
            <View style={[styles.gridStyle, {marginTop:74,}]}>
                <Text style={{fontSize:15,color:'#333',marginLeft:0,marginTop:10,textAlign:'center',width:Dimens.screen_width-84}}>选择报修类别</Text>

            </View>

            <View style={[styles.gridStyle, {marginTop:15,}]}>
                <Text style={{fontSize:15,color:'#333',marginLeft:0,marginTop:10,textAlign:'center',width:Dimens.screen_width-84}}>快修入口</Text>


            </View>
            <TouchableOpacity onPress={()=>this.hideModel()} style={{width:Dimens.screen_width,height:28,marginTop:15,alignItems:'center',justifyContent:'center',textAlignVertical:'center',}}>
                <Image source={require('../../../res/repair/mesbox_close.png')} style={{width:28,height:28,}}/>
            </TouchableOpacity>
        </View>
        </Modal>


    </View>
        )
    }


    hideModel() {
        this.setState({modalVisible:false});
    }

    showModel() {
        //this.setState({modalVisible:true});
    }
}


const styles = StyleSheet.create({

    modelStyle:{
        flex: 1,
        width:Dimens.screen_width,
        height:Dimens.screen_height,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    gridStyle:{
        marginLeft:42,
        width:Dimens.screen_width-84,
        height:230,
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15,
        borderTopLeftRadius: 15,
        borderTopRightRadius:15,
        backgroundColor: 'white',
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
    },

    welcome:{
        color:'#123456',

    },

    images:{
        height:160,
        width: Dimens.screen_width,
    }
});
