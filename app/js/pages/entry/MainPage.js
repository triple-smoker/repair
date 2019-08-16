
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    Alert,
    DeviceEventEmitter, InteractionManager
} from 'react-native';

import TabNavigator from 'react-native-tab-navigator';

import {scaleSize} from '../../util/DensityUtils';
import * as Dimens from '../../value/dimens';

import BaseComponent from '../../base/BaseComponent'
import {DURATION} from 'react-native-easy-toast'
import HomePage from '../home/HomePage'
import WorkPage from '../work/WorkPage'
// import MinePage from '../mine/MinePage'
import ThemeDao from '../../dao/ThemeDao'
import MinePage from '../mine/myPage'
import WorkManager from '../workcheck/WorkManager'
import NotifService from '../../../components/NotifService';
import AsyncStorage from '@react-native-community/async-storage';
import Sound from 'react-native-sound';


//需要导出的常量
export const ACTION_HOME = {A_SHOW_TOAST:'showToast',A_RESTART:'restart',A_THEME:'theme'};
export const FLAG_TAB = {
    flag_popularTab: 'flag_popularTab',
    flag_trendingTab: 'flag_trendingTab',
    flag_favoriteTab: 'flag_favoriteTab'
}

export default class MainPage extends BaseComponent {
    static navigationOptions = {
        header: null,
    };
    constructor(props){
        super(props);
        let selectedTab = this.props.selectedTab?this.props.selectedTab:FLAG_TAB.flag_popularTab
        new ThemeDao().getTheme().then((data)=>{
            this.state = {
                selectedTab:selectedTab,
                theme:data
            }
        });

        this.state = {
            selectedTab:selectedTab,
            isShow: true,
        }
    }

    componentDidMount() {
        console.log('MainPage  componentDidMount112');
        super.componentDidMount();
        this.listener = DeviceEventEmitter.addListener('ACTION_HOME',(action,params)=>this.onAction(action,params));
        this.listener = DeviceEventEmitter.addListener('NAVIGATOR_ACTION',(isShow)=>this.setState({isShow : isShow}));
        DeviceEventEmitter.addListener('onMessage', this.onMessage.bind(this));
        DeviceEventEmitter.addListener('onInit', this.onInit.bind(this));
        DeviceEventEmitter.addListener('onNotification', this.onNotification.bind(this));
        DeviceEventEmitter.addListener('onAppInitOnMessage', this.onAppInitOnMessage.bind(this));
        DeviceEventEmitter.addListener('localMessage', this.localMessage.bind(this));
        this.notif = new NotifService(this.onRegister.bind(this), this.onNotif.bind(this));
        console.log('new notif')
        console.log(this.notif)
    }

    onAction(action,params){
        if (action === ACTION_HOME.A_RESTART ){
            this.onRestart(params);
        }else if (action === ACTION_HOME.A_SHOW_TOAST ){
            this.toast.show(params.text,DURATION.LENGTH_LONG);
        }else{

        }
    }

    onRestart(jumpToTap){
        console.log('MP : onRestart')
        // this.props.navigator.resetTo({
        //     component:HomePage,
        //     params:{
        //         ...this.props,
        //         theme:this.state.theme,
        //         selectedTab:jumpToTap
        //     }
        // })
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        if(this.listener){
            this.listener.remove();
        }
    }
    setHome(){
        DeviceEventEmitter.emit('NAVIGATOR_ACTION', true);
        this.setState({
            selectedTab: FLAG_TAB.flag_popularTab,
        })
    }
    setMyHome(){
        DeviceEventEmitter.emit('NAVIGATOR_ACTION', true);
        this.setState({
            selectedTab: FLAG_TAB.flag_trendingTab,
        })
    }

    onSelected(selectedTab) {
        if(selectedTab === "flag_favoriteTab"){
            DeviceEventEmitter.emit('NAVIGATOR_ACTION', false);
        }
        this.setState({
            selectedTab: selectedTab,
        })
    }

    onRegister(token) {
        // Alert.alert("Registered !", JSON.stringify(token));
        console.log(token);
        this.setState({ registerToken: token.token, gcmRegistered: true });
    }

    onNotif(notif) {
        console.log(notif);
        Alert.alert(notif.title, notif.message);
        this.setNotifyMessageToAlreadyRead(notif);
    }

    onInit (e){
        console.log('--------------');
        console.log(e);
        // alert("Message Init. Title:");
    }
    onMessage(e){
        console.log(this.notif);
        this.saveNotifyMessage(e);
        this.notif.localNotif(e);
        console.log("Message Received. Title:" + e.title + ", Content:" + e.content.msg);
        var that = this;
        AsyncStorage.getItem("pushStatus", function (error, result) {
            if (error) {
                console.log("读取失败");
            } else {
                var pushStatus = JSON.parse(result);
                if(pushStatus&&pushStatus===1){
                    return null;
                }else{
                    that._showYy();
                }
            }
        })
    }
    onAppInitOnMessage(e){
        console.log(this.notif);
        this.notif.localNotif(e);
        console.log("Message Received. Title:" + e.title + ", Content:" + e.content);
    }

    localMessage(){
        var e = {
            title:"数据待上报",
            content:"您尚有未上报的任务信息，请开启网络"
        }
        this.notif.localNotif(e);
    }
    
    onNotification(e){
        console.log(this.notif);
        this.notif.scheduleNotif(e);
        console.log("Notification Received.Title:" + e.title + ", Content:" + e.content);
    }

    //语音播放
    async _showYy(){
        var whoosh = new Sound('xiaoxi_a.mp3', Sound.MAIN_BUNDLE, (error) => {
            if (error) {
                console.log('failed to load the sound', error);
                return;
            }
            // loaded successfully
            console.log('duration in seconds: ' + whoosh.getDuration() + 'number of channels: ' + whoosh.getNumberOfChannels());

            // Play the sound with an onEnd callback
            whoosh.play((success) => {
                if (success) {
                    console.log('successfully finished playing');
                } else {
                    console.log('playback failed due to audio decoding errors');
                }
            });
        });
    }

    async saveNotifyMessage(e){
        // console.info(global.userId)
        await AsyncStorage.getItem(global.tenant_code + global.userId, function (error, result) {
            if (error) {
                console.log('读取失败')
            } else {

                let temp = {"casecode":"repair_reminder","level":0,"focus":1,"triggerType":"normal","msg":"您关注的设备有新动态","extra":null}


                result = JSON.parse(result);
                let notifyData = {
                    "messageId" : e.messageId,
                    "title" : e.title,
                    "content" : e.content,
                    "recordAlreadyRead": 0,
                    "notifyDate" : new Date().format("yyyy-MM-dd hh:mm:ss")
                }
                let resultData = result || [];
    
                var cacheMaxLength = 10;
                if(resultData.length >= cacheMaxLength){
                    let deleteLength = resultData.length - 10 + 1;
                    resultData.splice(0,deleteLength);
                }
                resultData.push(notifyData);
                console.info("----saveNotifyMessage----")
                console.info(resultData);

                AsyncStorage.setItem(global.tenant_code + global.userId,JSON.stringify(resultData),function (error) {
                    if (error) {
                        console.log('存储失败')
                        console.log(error)
                    }else {
                        console.log('存储完成')
                    }
                })
                    
            }
        });
    }
    
    async setNotifyMessageToAlreadyRead(e){
        await AsyncStorage.getItem(global.tenant_code + global.userId, function (error, result) {
            if (error) {
                console.log('读取失败')
            } else {
                result = JSON.parse(result);
                
                let resultData = result || [];
                resultData.find(item => {
                    if(item.messageId === e.messageId){
                        item.recordAlreadyRead = 1;
                    }
                })
                console.info(resultData)
                AsyncStorage.setItem(global.tenant_code + global.userId,JSON.stringify(resultData),function (error) {
                    if (error) {
                        console.log('存储失败')
                        console.log(error)
                    }else {
                        console.log('存储完成')
                    }
                })
            }
        });
    }


    _renderTab_old(Component, selectedTab, title, renderIcon) {
        return (
            <TabNavigator.Item
                selected={this.state.selectedTab === selectedTab}
                title={title}
                selectedTitleStyle={this.state.theme.styles.selectedTitleStyle}
                renderIcon={() => <Image style={styles.tabItemImageStyle}
                                         source={renderIcon}/>}
                renderSelectedIcon={() => <Image
                    style={[styles.tabItemImageStyle,this.state.theme.styles.tabBarSelectedIcon]}
                    source={renderIcon}/>}
                    onPress={() => this.onSelected(selectedTab)}>
                <Component {...this.props} theme={this.state.theme} homeComponent={this}/>
            </TabNavigator.Item>
        )
    }

    _renderTab(Component, selectedTab, title, renderIcon, renderIconSel,setHome) {
        // if(selectedTab === "flag_favoriteTab"){
        //     const {navigation} = this.props;
        //     InteractionManager.runAfterInteractions(() => {
        //         navigation.navigate('WorkManager',{
        //             theme:this.theme});
        //     });
        //     return null;
        // }
// console.log("2222");
        if (this.state.theme) {
        return (
            <TabNavigator.Item
                selected={this.state.selectedTab === selectedTab}
                title={title}
                selectedTitleStyle={this.state.theme.styles.selectedTitleStyle}
                renderIcon={() => <Image style={styles.tabItemImageStyle} source={renderIcon}/>}
                renderSelectedIcon={() => <Image style={styles.tabItemImageStyle} source={renderIconSel}/>}
                    onPress={() => this.onSelected(selectedTab)}>
                <Component {...this.props} theme={this.state.theme} homeComponent={this} setHome={()=>setHome()}/>
            </TabNavigator.Item>
        )
        } else {
            if(selectedTab === "flag_favoriteTab"){
               return ( <TabNavigator.Item
                    selected={this.state.selectedTab === selectedTab}
                    title={title}
                    selectedTitleStyle={styles.selectedTitleStyle}
                    renderIcon={() => <Image style={styles.tabItemImageStyle} source={renderIcon}/>}
                    renderSelectedIcon={() => <Image style={styles.tabItemImageStyle} source={renderIconSel}/>}
                    onPress={() =>{
                        const {navigation} = this.props;
                        InteractionManager.runAfterInteractions(() => {
                            navigation.navigate('WorkManager',{
                                theme:this.theme,
                                callback: (
                                    () => {
                                        this.setHome();
                                    })
                            });
                        });
                        }
                    }>
                    <Component {...this.props} theme={this.state.theme} homeComponent={this} setHome={()=>setHome()}/>
                </TabNavigator.Item>
               )
            }else if(selectedTab === "flag_trendingTab"){
                return (
                    <TabNavigator.Item
                        selected={this.state.selectedTab === selectedTab}
                        title={title}
                        selectedTitleStyle={styles.selectedTitleStyle}
                        renderIcon={() => <Image style={styles.tabItemImageStyle} source={renderIcon}/>}
                        renderSelectedIcon={() => <Image style={styles.tabItemImageStyle} source={renderIconSel}/>}
                        onPress={() => this.onSelected(selectedTab)}>
                        <Component {...this.props} theme={this.state.theme} homeComponent={this} setHome={()=>setHome()}/>
                    </TabNavigator.Item>
                )
            }else{
                return (
                    <TabNavigator.Item
                        selected={this.state.selectedTab === selectedTab}
                        title={title}
                        selectedTitleStyle={styles.selectedTitleStyle}
                        renderIcon={() => <Image style={styles.tabItemImageStyle} source={renderIcon}/>}
                        renderSelectedIcon={() => <Image style={styles.tabItemImageStyle} source={renderIconSel}/>}
                        onPress={() => this.onSelected(selectedTab)}>
                        <Component {...this.props} theme={this.state.theme} homeComponent={this} setHome={()=>setHome()}/>
                    </TabNavigator.Item>
                )
            }

        }

    }

    show(isShow){
        if(isShow){
           return {
                opacity: 1.0,
                    bottom: (Dimens.isIphoneX()?scaleSize(20):0),
            }
        }else {
            return {height: 0, overflow: 'hidden'}
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <TabNavigator
                    tabBarStyle={this.show(this.state.isShow)}
                    sceneStyle={{paddingBottom: 0}}
                >
                    {this._renderTab(HomePage, FLAG_TAB.flag_popularTab, '首页', require('../../../res/home/ic_tab_home_nor.png'), require('../../../res/home/ic_tab_home_sel.png'),()=>this.setHome())}
                    {/*{this._renderTab(WorkPage, FLAG_TAB.flag_favoriteTab, '工单', require('../../../res/home/ic_tab_gd_nor.png'), require('../../../res/home/ic_tab_gd_sel.png'))}*/}
                    {this._renderTab(WorkManager, FLAG_TAB.flag_favoriteTab, '工单', require('../../../res/home/ic_tab_gd_nor.png'), require('../../../res/home/ic_tab_gd_sel.png'),()=>this.setHome())}
                    {this._renderTab(MinePage, FLAG_TAB.flag_trendingTab, '我的', require('../../../res/home/ic_tab_mine_nor.png'), require('../../../res/home/ic_tab_mine_sel.png'),()=>this.setMyHome())}
                </TabNavigator>
            </View>
        )
    }

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'white',
    },

    tabItemImageStyle:{
        width:24,
        height:24
    },
    tabBarStyle:{
        opacity: 1.0,
        bottom: (Dimens.isIphoneX()?scaleSize(20):0),
    },
    selectedTitleStyle:{
        color: '#5ec4c8'
    }
});
