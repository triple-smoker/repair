
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    DeviceEventEmitter
} from 'react-native';

import TabNavigator from 'react-native-tab-navigator';

import {scaleSize} from '../../util/DensityUtils';
import * as Dimens from '../../value/dimens';

import BaseComponent from '../../base/BaseComponent'
import {DURATION} from 'react-native-easy-toast'
import HomePage from '../home/HomePage'
import WorkPage from '../work/WorkPage'
import MinePage from '../mine/MinePage'
import OrderList from './OrderList'
import HistoryList from './HistoryList'
import DeptList from './DeptList'


//需要导出的常量
export const ACTION_HOME = {A_SHOW_TOAST:'showToast',A_RESTART:'restart',A_THEME:'theme'};
export const FLAG_TAB = {
    flag_popularTab: 'flag_popularTab',
    flag_trendingTab: 'flag_trendingTab',
    flag_favoriteTab: 'flag_favoriteTab'
}



export default class OrderContainer extends BaseComponent {

    constructor(props){
        super(props);
        let selectedTab = this.props.selectedTab?this.props.selectedTab:FLAG_TAB.flag_popularTab

        this.state = {
            selectedTab:selectedTab,
            theme:this.props.theme
        }
    }

    componentDidMount() {

        super.componentDidMount();

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
        this.props.navigator.resetTo({
            component:OrderList,
            params:{
                ...this.props,
                theme:this.props.theme,
                selectedTab:jumpToTap
            }
        })
    }

    componentWillUnmount() {
    
        super.componentWillUnmount();

    }

    onSelected(selectedTab) {
        this.setState({
            selectedTab: selectedTab,
        })
    }


    _renderTab(Component, selectedTab, title, renderIcon, renderIconSel) {
        return (
            <TabNavigator.Item
                selected={this.state.selectedTab === selectedTab}
                title={title}
                selectedTitleStyle={{color: '#5ec4c8'}}
                renderIcon={() => <Image style={styles.tabItemImageStyle} source={renderIcon}/>}
                renderSelectedIcon={() => <Image style={styles.tabItemImageStyle} source={renderIconSel}/>}
                    onPress={() => this.onSelected(selectedTab)}>
                <Component {...this.props} theme={this.props.theme} homeComponent={this}/>
            </TabNavigator.Item>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <TabNavigator
                    tabBarStyle={styles.tabBarStyle}
                    sceneStyle={{paddingBottom: 0}}
                >
                    {this._renderTab(DeptList, FLAG_TAB.flag_popularTab, '部门任务', require('../../../res/repair/tab_ico_bmrw_nor.png'), require('../../../res/home/ic_tab_home_sel.png'))}
                    {this._renderTab(OrderList, FLAG_TAB.flag_favoriteTab, '我的任务', require('../../../res/repair/tab_ico_wdrw_nor.png'), require('../../../res/home/ic_tab_gd_sel.png'))}
                    {this._renderTab(HistoryList, FLAG_TAB.flag_myTab, '历史任务', require('../../../res/repair/tab_ico_lswx_nor.png'), require('../../../res/home/ic_tab_mine_sel.png'))}
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
});