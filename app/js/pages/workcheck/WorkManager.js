
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
    ScrollView, DeviceEventEmitter, BackHandler, TouchableHighlight
} from 'react-native';

import Request, {ScanMsg,ScanDetails} from '../../http/Request';
import BaseComponent from '../../base/BaseComponent'
import { Container, Header, Content, Tab, Tabs , TabHeading  } from 'native-base';
import TodayTask from './TodayTask';
import ScanResult from '../repair/ScanResult'
import WorkPage from '../work/WorkPage';
import TitleBar from '../../component/TitleBar';


export default class CheckDetail extends BaseComponent {
    static navigationOptions = {
        header: null,
    };
    constructor(props){
        super(props);
        const { navigation } = this.props;
        const isScan = navigation.getParam('isScan', '');
        const scanId = navigation.getParam('scanId', '');
        const equipmentId = navigation.getParam('equipmentId', '');
        const equipmentName = navigation.getParam('equipmentName', '');
        this.state = {
            isScan : isScan,
            scanId : scanId,
            equipmentId : equipmentId,
            equipmentName : equipmentName,
        }
    }
    componentDidMount() {
        // DeviceEventEmitter.emit('NAVIGATOR_ACTION', false);
        // if (Platform.OS === 'android' && this.props.setHome != null) {
        //     BackHandler.addEventListener("back", this.onBackClicked);
        // }
    }
    
    goBack(){
        const { navigate } = this.props.navigation;
        this.props.navigation.goBack();
        this.props.navigation.state.params.callback()
    }
    captrue() {
        const { navigate } = this.props.navigation;
        navigate('Scan',{
            targetRouteName : 'WorkManager',
            callback:((data)=>{
                this.setState({
                    isScan : data.isScan,
                    equipmentId : data.equipmentId,
                    equipmentName : data.equipmentName,
                    scanId : null
                })
            })
        });
    }

    render() {
        var scanId = this.state.scanId;
        var pageName = '我的工单';
        var detailShow = false;
        if(scanId || this.state.isScan == true){
            detailShow = true;
            pageName = this.state.equipmentName;
        }

        return (
            <Container>
                <View style={{height:44,backgroundColor:'white',justifyContent:'center', textAlignVertical:'center', flexDirection:'row',alignItems:'center', marginLeft:0, marginRight:0, marginTop:0,}}>
                    <TouchableHighlight style={{width:40,height:44,justifyContent:"center",alignItems:"center"}} onPress={()=>this.goBack()}>
                        <Image style={{width:21,height:37}} source={require("../../../image/navbar_ico_back.png")}/>
                    </TouchableHighlight>
                    <View style={{flex:1,justifyContent:'center',alignItems:'center',height:30,fontWeight:"600"}}>
                        <Text style={{color:'#555',fontSize:18,marginLeft:5, flex:1}}>{pageName}</Text>
                    </View>
                    <TouchableOpacity onPress={()=>this.captrue()}>
                        <Image style={{width:16,height:20,marginLeft:5,marginRight:10}} source={require('../../../res/repair/navbar_ico_sys.png')} />
                    </TouchableOpacity>
                </View>
                {/* <TitleBar
                    backgroundColor={'white'}
                    centerText={TitleName}
                    navigation={this.props.navigation}
                    rightImg={require('../../../res/repair/navbar_ico_sys.png')}
                    rightImgPress={this.captrue.bind(this)} 
                    isShowLeftBackIcon={true}
                    leftPress={() => this.naviGoBack(this.props.navigation)}
                    rightStyle={{width:16,height:20}}
                /> */}
                <Tabs>
                    <Tab heading='维修' tabStyle={{backgroundColor:'#fff'}} activeTabStyle={{backgroundColor:'#fff',borderBottomWidth:2,borderColor:'#62c0c5'}} textStyle={{color:'#999',fontWeight:"300"}} activeTextStyle={{color:'#62c0c5',fontWeight:'300'}}>
                        <WorkPage isScan={this.state.isScan} equipmentId={this.state.equipmentId} navigation = {this.props.navigation}/>
                    </Tab>
                    <Tab heading='巡检' tabStyle={{backgroundColor:'#fff'}} activeTabStyle={{backgroundColor:'#fff',borderBottomWidth:2,borderColor:'#62c0c5'}} textStyle={{color:'#999',fontWeight:"300"}} activeTextStyle={{color:'#62c0c5',fontWeight:'300'}}>
                        <TodayTask  navigation = {this.props.navigation}/>
                    </Tab>
                    <Tab heading='保养' tabStyle={{backgroundColor:'#fff'}} activeTabStyle={{backgroundColor:'#fff',borderBottomWidth:2,borderColor:'#62c0c5'}} textStyle={{color:'#999',fontWeight:"300"}} activeTextStyle={{color:'#62c0c5',fontWeight:'300'}}>
                        <TodayTask  navigation = {this.props.navigation}/>
                    </Tab>
                    {
                        detailShow ? <Tab heading={'详情'} tabStyle={{backgroundColor:'#fff'}} activeTabStyle={{backgroundColor:'#fff',borderBottomWidth:2,borderColor:'#62c0c5'}} textStyle={{color:'#999',fontWeight:"300"}} activeTextStyle={{color:'#62c0c5',fontWeight:'300'}}>
                                    <ScanResult equipmentId={this.state.equipmentId} navigation = {this.props.navigation}/> 
                                    </Tab>: null
                    }
                </Tabs>
            </Container>
        )
    }


}

