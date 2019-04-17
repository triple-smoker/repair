/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { createStackNavigator, createAppContainer } from "react-navigation";

import AllOrder from './pages/AllOrder'
import MyAddress from './pages/Address';
import DetailsScreen from './pages/DetailsScreen'
import OrderEvaluate from './pages/Evaluate';

import RepairScreen from './pages/RepairScreen'
import HomeScreen from './pages/HomeScreen';
import ConfirmReport from './pages/ConfirmReport'
import OrderSearch from './pages/OrderSearch'


const AppNavigator = createStackNavigator(
    {
        Home: HomeScreen,
        Details: DetailsScreen,
        Repair: RepairScreen,
        Address: MyAddress,
        Confirm: ConfirmReport,
        AllOrder: AllOrder,
        Evaluate: OrderEvaluate,
        OrderSearch : OrderSearch,
    },
    {
        initialRouteName: "Home"
    }
);

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
    render() {
        return <AppContainer />;
    }
}

