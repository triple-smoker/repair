
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


import BaseComponent from '../../base/BaseComponent'
import { Container, Header, Content, Tab, Tabs , TabHeading  } from 'native-base';
import TodayTask from './TodayTask';
import WorkPage from '../work/WorkPage';



export default class CheckDetail extends BaseComponent {
    static navigationOptions = {
        header: null,
    };
    constructor(props){
        super(props);
        this.state={
        }
    }
    // componentDidMount() {
    //     DeviceEventEmitter.emit('NAVIGATOR_ACTION', false);
    //     if (Platform.OS === 'android' && this.props.setHome != null) {
    //         BackHandler.addEventListener("back", this.onBackClicked);
    //     }
    // }
    // onBackClicked = () => {
    //     this.props.setHome();
    //
    //     return true; // 默认false  表示跳出RN
    // }
    goBack(){
        const { navigate } = this.props.navigation;
        this.props.navigation.goBack();
        this.props.navigation.state.params.callback()
    }
    captrue() {

    }

    render() {

        return (
            <Container>
                <View style={{height:44,backgroundColor:'white',justifyContent:'center', textAlignVertical:'center', flexDirection:'row',alignItems:'center', marginLeft:0, marginRight:0, marginTop:0,}}>
                    <TouchableHighlight style={{width:25,height:50}} onPress={()=>this.goBack()}>
                        <Image style={{width:12,height:25,margin:10}} source={require("../../../image/navbar_ico_back.png")}/>
                    </TouchableHighlight>
                    <View style={{flex:1,justifyContent:'center',alignItems:'center',height:30,fontWeight:"600"}}>
                        <Text style={{color:'#666',fontSize:18,marginLeft:5, flex:1}}>我的工单</Text>
                    </View>
                    <TouchableOpacity onPress={()=>this.captrue()}>
                        <Image style={{width:16,height:20,marginLeft:5,marginRight:10}} source={require('../../../res/repair/navbar_ico_sys.png')} />
                    </TouchableOpacity>
                </View>
                <Tabs>
                    <Tab heading='维修' tabStyle={{backgroundColor:'#fff'}} activeTabStyle={{backgroundColor:'#fff',borderBottomWidth:2,borderColor:'#62c0c5'}} textStyle={{color:'#999',fontWeight:"300"}} activeTextStyle={{color:'#62c0c5',fontWeight:'300'}}>
                        <WorkPage  navigation = {this.props.navigation}/>
                    </Tab>
                    <Tab heading='巡检' tabStyle={{backgroundColor:'#fff'}} activeTabStyle={{backgroundColor:'#fff',borderBottomWidth:2,borderColor:'#62c0c5'}} textStyle={{color:'#999',fontWeight:"300"}} activeTextStyle={{color:'#62c0c5',fontWeight:'300'}}>
                        <TodayTask  navigation = {this.props.navigation}/>
                    </Tab>
                </Tabs>
            </Container>
        )
    }


}

