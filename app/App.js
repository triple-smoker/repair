/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format  5.7  5.7
 * @flow
 */


import React from 'react';
import { createSwitchNavigator, createStackNavigator, createAppContainer } from 'react-navigation';

import AllOrder from './pages/AllOrder';
import MyAddress from './pages/Address';
import DetailsScreen from './pages/DetailsScreen';
import OrderEvaluate from './pages/Evaluate';
import RepairScreen from './pages/RepairScreen';
import HomeScreen from './pages/HomeScreen';
import ConfirmReport from './pages/ConfirmReport';
import OrderSearch from './pages/OrderSearch';


import LoginPage from './js/pages/login/Login';
import MainPage from './js/pages/entry/MainPage';
import CheckList from './js/pages/workcheck/CheckList';
import CheckDetail from './js/pages/workcheck/CheckDetail';
import WorkManager from './js/pages/workcheck/WorkManager';
import store from './util/RouterStore.js'
import SQLiteDemo from "./test/SQLiteDemo";
import Scan from './js/pages/scan/Scan';

import WelcomePage from './js/pages/entry/WelcomePage'

const AppStack = createStackNavigator({
        MainPage: MainPage,
        Home: HomeScreen,
        Details: DetailsScreen,
        Repair: RepairScreen,
        Address: MyAddress,
        Confirm: ConfirmReport,
        AllOrder: AllOrder,
        Evaluate: OrderEvaluate,
        OrderSearch : OrderSearch,
        WorkManager : WorkManager,
        CheckList : CheckList,
        CheckDetail : CheckDetail,
        SQLiteDemo : SQLiteDemo,
        Scan : Scan,
        ...store
    },
    {
        initialRouteName: "MainPage"
    });
const AuthStack = createStackNavigator({ Login : LoginPage });

const AppSwitchNavigator = createSwitchNavigator(
    {
        Welcome: WelcomePage,
        App: AppStack,
        Auth: AuthStack,
    },
    {
        initialRouteName: 'Welcome',
    }
);

const AppContainer = createAppContainer(AppSwitchNavigator);

export default class App extends React.Component {
    render() {
        return <AppContainer />;
    }
}

