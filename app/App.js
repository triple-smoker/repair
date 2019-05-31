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

import LoginPage from './js/pages/login/Login'
import MainPage from './js/pages/entry/MainPage'
import AllOrderDemo from './test/AllOrderDemo'
import OrderSearchDemo from './test/OrderSearchDemo'
// import SQLiteDemo from "./test/SQLiteDemo";




import store from './util/RouterStore.js'
import {Linking} from "react-native";



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
        OrderSearchDemo : OrderSearchDemo,
        // SQLiteDemo : SQLiteDemo,
        ...store

    },
    {
        initialRouteName: "MainPage"
    }
);



const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
    render() {
        return <AppContainer />;
    }
}

