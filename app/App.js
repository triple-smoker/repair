/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format  5.7  5.7
 * @flow
 */


import React from 'react';
import { createStackNavigator, createAppContainer } from "react-navigation";

import AllOrder from './pages/AllOrder';
import MyAddress from './pages/Address';
import DetailsScreen from './pages/DetailsScreen';
import OrderEvaluate from './pages/Evaluate';

import RepairScreen from './pages/RepairScreen';
import HomeScreen from './pages/HomeScreen';
import ConfirmReport from './pages/ConfirmReport';
import OrderSearch from './pages/OrderSearch';

import Axios from "./util/Axios";

import LoginPage from './js/pages/login/Login'
import MainPage from './js/pages/entry/MainPage'
import AllOrderDemo from './test/AllOrderDemo'
// import SQLiteDemo from "./test/SQLiteDemo";


const AppNavigator = createStackNavigator(
    {
        MainPage: MainPage,
        Home: HomeScreen,
        Details: DetailsScreen,
        Repair: RepairScreen,
        Address: MyAddress,
        Confirm: ConfirmReport,
        AllOrder: AllOrder,
        Evaluate: OrderEvaluate,
        OrderSearch : OrderSearch,
        Login : LoginPage,
        AllOrderDemo : AllOrderDemo,
        // SQLiteDemo : SQLiteDemo,
    },
    {
        initialRouteName: "MainPage"
    }
);

console.log(">>>>>>>>>>>>>>>>>>>");
Axios.GetAxios('/api/auth/oauth/token?username=10001&password=BlvxyJFFYLcg7n2OB4G5uA%3D%3D&grant_type=password&scope=server').then(
    (response) => {
        console.log(">>>>>>>>>>>>>>>>>>>");
        console.log(response);
        global.access_token = response.access_token;
        console.log(response.access_token)

        // DeviceStorage.save('access_token',response.access_token)
        //获取用户登录信息
        Axios.GetAxios('/api/admin/user/login').then(
            (response) => {
                console.log(">>>>>>>>>>>>>>>>>>>");
                console.log(response);
                var deptAddresses = response.data.deptAddresses[0];
                global.userId = response.data.userId;
                global.deptId = deptAddresses.deptId;
            }
        )
    }
)


const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
    render() {
        return <AppContainer />;
    }
}

