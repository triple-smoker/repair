import React, { Component } from 'react';
import {
    DeviceEventEmitter,
    BackHandler,
    Platform, Alert,
} from 'react-native';

// import {ACTION_HOME} from '../pages/entry/MainPage'
import NotifService from '../../components/NotifService';


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
        this.notif = new NotifService(this.onRegister.bind(this), this.onNotif.bind(this));
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
        if(navigation.state.routeName && navigation.state.routeName==="WorkManager"){
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
        this.notif.localNotif();
        console.log("Message Received. Title:" + e.title + ", Content:" + e.content);
    }
    onNotification(e){
        console.log(this.notif);
        this.notif.localNotif();
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
}
