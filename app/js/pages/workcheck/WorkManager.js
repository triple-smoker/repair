
import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    TouchableHighlight,
    DeviceEventEmitter
} from 'react-native';

import Request, {ScanMsg} from '../../http/Request';
import BaseComponent from '../../base/BaseComponent'
import { Container, Tab, Tabs   } from 'native-base';
import TodayTask from './TodayTask';
import ScanResult from '../repair/ScanResult'
import WorkPage from '../work/WorkPage';
import {Loading} from '../../component/Loading'

export default class CheckDetail extends BaseComponent {
    static navigationOptions = {
        header: null,
    };
    constructor(props){
        super(props);
        const { navigation } = this.props;
        // const isScan = navigation.getParam('isScan', '');
        // const scanId = navigation.getParam('scanId', '');
        // const equipmentId = navigation.getParam('equipmentId', '');
        // const equipmentName = navigation.getParam('equipmentName', '');
        var routerNameUnity = navigation.getParam('routerNameUnity', 0);
        this.state = {
            isScan : null,
            scanId : null,
            equipmentId : null,
            equipmentName : null,
            equipmentType : null,
            routerNameUnity : routerNameUnity,
        }
    }
    componentDidMount() {
        this.loadDetail()
    }
    // componentWillUnmount() {
    //     DeviceEventEmitter.emit('NAVIGATOR_ACTION', true);
    // }
    componentWillReceiveProps(nextProps){
        setTimeout(
            () => { 
             this.loadDetail()
            }, 200)
    }
    loadDetail(type){
        const { navigation } = this.props;
        var isScan = navigation.getParam('isScan', '');
        var scanId = navigation.getParam('scanId', '');
		if(scanId != null && scanId !== ''){
			// this.setState({
			//     isScan : isScan,
			//     scanId : scanId,
			// })
			// this.loadScanMsg(scanId)
            Loading.show()
            Request.requestGet(ScanMsg + scanId,null,(result) => {
                console.log("+++++++");
                console.log(result);
                Loading.hidden()
                this.setState({
                    equipmentId : result.data.equipmentId,
                    equipmentName: result.data.equipmentName,
                    equipmentTypeId: result.data.equipmentTypeId,
                    isScan : isScan,
                    scanId : scanId,
                    routerNameUnity : navigation.getParam('routerNameUnity', 0),
                })
            })
		}




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
                    equipmentTypeId: data.equipmentTypeId,
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
                    <TouchableOpacity style={{width:40,height:44,justifyContent:"center",alignItems:"center"}} onPress={()=>this.goBack()}>
                        <Image style={{width:21,height:37}} source={require("../../../image/navbar_ico_back.png")}/>
                    </TouchableOpacity>
                    <View style={{flex:1,justifyContent:'center',alignItems:'center',height:30,fontWeight:"600"}}>
                        <Text style={{color:'#555',fontSize:18,marginLeft:5, flex:1}}>{pageName}</Text>
                    </View>
                    <View style={{width:9}}/>
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
                    <Tab heading='维修' tabStyle={{backgroundColor:'#fff'}} routerNameUnity={this.state.routerNameUnity} activeTabStyle={{backgroundColor:'#fff',borderBottomWidth:2,borderColor:'#fff'}} textStyle={{color:'#999',fontWeight:"300"}} activeTextStyle={{color:'#62c0c5',fontWeight:'300'}}>
                        <WorkPage isScan={this.state.isScan} equipmentId={this.state.equipmentId} navigation = {this.props.navigation}/>
                    </Tab>
                    <Tab heading='巡检' tabStyle={{backgroundColor:'#fff'}} activeTabStyle={{backgroundColor:'#fff',borderBottomWidth:2,borderColor:'#fff'}} textStyle={{color:'#999',fontWeight:"300"}} activeTextStyle={{color:'#62c0c5',fontWeight:'300'}}>
                        <TodayTask isScan={this.state.isScan} equipmentId={this.state.equipmentTypeId}  navigation = {this.props.navigation} checkType={1}/>
                    </Tab>
                    <Tab heading='保养' tabStyle={{backgroundColor:'#fff'}} activeTabStyle={{backgroundColor:'#fff',borderBottomWidth:2,borderColor:'#fff'}} textStyle={{color:'#999',fontWeight:"300"}} activeTextStyle={{color:'#62c0c5',fontWeight:'300'}}>
                        <TodayTask isScan={this.state.isScan} equipmentId={this.state.equipmentTypeId}  navigation = {this.props.navigation} checkType={2}/>
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

