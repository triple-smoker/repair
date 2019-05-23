import React, { Component } from 'react';
import {
    DeviceEventEmitter,
    BackHandler,
    Platform,
} from 'react-native';

// import {ACTION_HOME} from '../pages/entry/MainPage'

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
         const {navigator} = this.props;
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

   routeToPage(navigator, page) {
    const routes = navigator.state.routeStack;//this.props.navigator.state.routeStack;
    let destinationRoute = '';
    for (let i = routes.length - 1; i >= 0; i--) {
        if(routes[i].name === page) {
            destinationRoute = navigator.getCurrentRoutes()[i];
        }
    }

    if (destinationRoute === '') {
        navigator.pop();
        navigator.pop();
        return ;
    }
    navigator.popToRoute(destinationRoute);
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
