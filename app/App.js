/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { createStackNavigator, createAppContainer } from "react-navigation";

import RepairScreen from './pages/RepairScreen'
import DetailsScreen from './pages/DetailsScreen'
import HomeScreen from './pages/HomeScreen';
import MyAddress from './pages/Address';
import ConfirmReport from './pages/ConfirmReport'

const AppNavigator = createStackNavigator(
    {
        Home: HomeScreen,
        Details: DetailsScreen,
        Repair: RepairScreen,
        Address: MyAddress,
        Confirm: ConfirmReport,
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

