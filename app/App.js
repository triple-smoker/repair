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
// import SQLiteDemo from "./test/SQLiteDemo";

import HistoryDetail from './js/pages/repair/HistoryDetail';
import OrderDetail from './js/pages/repair/detail/OrderDetail'
import TakePhotos from './js/pages/repair/detail/TakePhotos'
import ArrangeWork from './js/pages/repair/ArrangeWork';
import TransferOrder from './js/pages/repair/TransferOrder';
import SearchOrder from './js/pages/work/SearchOrder'
// import {store} from './util/store'
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
        HistoryDetail : HistoryDetail,
        OrderDetail : OrderDetail,
        TakePhotos : TakePhotos,
        ArrangeWork:ArrangeWork,
        TransferOrder : TransferOrder,
        SearchOrder : SearchOrder,
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

