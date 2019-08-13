import React, { Component } from 'react';
import {
    DeviceEventEmitter,
    BackHandler,
    Platform, Alert,
} from 'react-native';

// import {ACTION_HOME} from '../pages/entry/MainPage'
import NotifService from '../../components/NotifService';
import AsyncStorage from '@react-native-community/async-storage';
import Sound from 'react-native-sound';

export default class BaseComponent extends Component {

    constructor(props){
        super(props);
        this.state={
            theme:this.props.theme,
        }
    }

    //新建通知的监听
    componentDidMount() {
        if (Platform.OS === 'android') {
            BackHandler.addEventListener("back", this.onBackClicked);
        }
        this.baseListener = DeviceEventEmitter.addListener('ACTION_BASE', (action,parmas)=>this.changeThemeAction(action,parmas));
        DeviceEventEmitter.addListener('onMessage', this.onMessage.bind(this));
        DeviceEventEmitter.addListener('onInit', this.onInit.bind(this));
        DeviceEventEmitter.addListener('onNotification', this.onNotification);
        DeviceEventEmitter.addListener('localMessage', this.localMessage.bind(this));
        this.notif = new NotifService(this.onRegister.bind(this), this.onNotif.bind(this));
        console.log('new notif')
        console.log(this.notif)
    }

    //卸载前移除通知
    componentWillUnmount() {
        if(this.baseListener){
            this.baseListener.remove();
        }
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener("back", this.onBackClicked);
        }
    }

    //BACK物理按键监听
    onBackClicked = () => {

         const {navigation,navigator} = this.props;
         // console.log("------"+JSON.stringify(navigation.state));
        if(navigation.state.routeName && navigation.state.routeName==="MainPage"){
            // console.log("-----");
            DeviceEventEmitter.emit('NAVIGATOR_ACTION', true);
        }
         if (navigator && navigator.getCurrentRoutes().length > 1) {

             navigator.pop();

             return true;//true 表示返回上一页
         }
         return false; // 默认false  表示跳出RN
     }


    //接收通知
    changeThemeAction(action,params){
        // if ( action === ACTION_HOME.A_THEME ){
            this.onThemeChange(params);
        // }
    }


    //更新通知
    onThemeChange(theme){
        if(!theme)return;
        this.setState({
            theme:theme
        })
    }

    naviGoBack(navigation) {
        if (navigation) { // && navigator.getCurrentRoutes().length > 1
            //  navigator.pop();
            navigation.goBack();
            return true;
        }

        return false;
    }

    onRegister(token) {
        // Alert.alert("Registered !", JSON.stringify(token));
        console.log(token);
        this.setState({ registerToken: token.token, gcmRegistered: true });
    }

    onNotif(notif) {
        console.log(notif);
        Alert.alert(notif.title, notif.message);
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
        console.log("Message Received. Title:" + e.title + ", Content:" + e.content);
        this._showYy();
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
    localMessage(){
        var e = {
            title:"数据待上报",
            content:"您尚有未上报的任务信息，请开启网络"
        }
        this.notif.localNotif(e);
    }
    onNotification(e){
        console.log(this.notif);
        this.notif.localNotif(e);
        console.log("Notification Received.Title:" + e.title + ", Content:" + e.content);
    }

   routeToPage(navigation, page) {
    //    console.log('routeToPage');
    //     console.log(page);
    // const routes = navigator.state.routeStack;//this.props.navigator.state.routeStack;
    // let destinationRoute = '';
    // for (let i = routes.length - 1; i >= 0; i--) {
    //     if(routes[i].name === page) {
    //         destinationRoute = navigator.getCurrentRoutes()[i];
    //     }
    // }
    //
    // if (destinationRoute === '') {
    //     navigator.pop();
    //     navigator.pop();
    //     return ;
    // }
    // navigator.popToRoute(destinationRoute);

       navigation.navigate(page);


  }

 routeToPageEx(navigator, page, page1) {
    const routes = navigator.state.routeStack;//this.props.navigator.state.routeStack;
    let destinationRoute = '';
    for (let i = routes.length - 1; i >= 0; i--) {

        if(routes[i].name === page) {
            destinationRoute = navigator.getCurrentRoutes()[i];
        }
    }

    if (destinationRoute === '') {
        for (let i = routes.length - 1; i >= 0; i--) {
            if(routes[i].name === page1) {
                destinationRoute = navigator.getCurrentRoutes()[i];
            }
        }

        if (destinationRoute === '') {
            navigator.pop();
            navigator.pop();
            return;
        }
    }

    navigator.popToRoute(destinationRoute);
  }

  routeTo(navigator, page) {
    const routes = navigator.state.routeStack;//this.props.navigator.state.routeStack;
    let destinationRoute = '';
    for (let i = routes.length - 1; i >= 0; i--) {
        if(routes[i].name === page) {
            destinationRoute = navigator.getCurrentRoutes()[i];
        }
    }

    navigator.popToRoute(destinationRoute);
  }

  routeTo(page) {
    routeTo(this.props.navigator, page)
  }

  async saveNotifyMessage(e){
    // console.info(global.userId)
    await AsyncStorage.getItem(global.userId, function (error, result) {
        if (error) {
            console.log('读取失败')
        } else {
            result = JSON.parse(result);
            let notifyData = {
                "title" : e.title,
                "content" : e.content,
                "notifyDate" : new Date().format("yyyy-MM-dd hh:mm:ss")
            }
            let resultData = result || [];

            resultData.push(notifyData);
            console.info("----saveNotifyMessage----")
            console.info(resultData)
            AsyncStorage.setItem(global.userId,JSON.stringify(resultData),function (error) {
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
}
