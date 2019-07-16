
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    DeviceEventEmitter, InteractionManager
} from 'react-native';

import TabNavigator from 'react-native-tab-navigator';

import {scaleSize} from '../../util/DensityUtils';
import * as Dimens from '../../value/dimens';

import BaseComponent from '../../base/BaseComponent'
import {DURATION} from 'react-native-easy-toast'
import HomePage from '../home/HomePage'
import WorkPage from '../work/WorkPage'
// import MinePage from '../mine/MinePage'
import ThemeDao from '../../dao/ThemeDao'
import MinePage from '../mine/myPage'
import WorkManager from '../workcheck/WorkManager'

//需要导出的常量
export const ACTION_HOME = {A_SHOW_TOAST:'showToast',A_RESTART:'restart',A_THEME:'theme'};
export const FLAG_TAB = {
    flag_popularTab: 'flag_popularTab',
    flag_trendingTab: 'flag_trendingTab',
    flag_favoriteTab: 'flag_favoriteTab'
}

export default class MainPage extends BaseComponent {
    static navigationOptions = {
        header: null,
    };
    constructor(props){
        super(props);
        let selectedTab = this.props.selectedTab?this.props.selectedTab:FLAG_TAB.flag_popularTab
        new ThemeDao().getTheme().then((data)=>{
            this.state = {
                selectedTab:selectedTab,
                theme:data
            }
        });

        this.state = {
            selectedTab:selectedTab,
            isShow: true,
        }
    }

    componentDidMount() {
        console.log('MainPage  componentDidMount112');
        super.componentDidMount();
        this.listener = DeviceEventEmitter.addListener('ACTION_HOME',(action,params)=>this.onAction(action,params));
        this.listener = DeviceEventEmitter.addListener('NAVIGATOR_ACTION',(isShow)=>this.setState({isShow : isShow}));
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
        console.log('MP : onRestart')
        // this.props.navigator.resetTo({
        //     component:HomePage,
        //     params:{
        //         ...this.props,
        //         theme:this.state.theme,
        //         selectedTab:jumpToTap
        //     }
        // })
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        if(this.listener){
            this.listener.remove();
        }
    }
    setHome(){
        DeviceEventEmitter.emit('NAVIGATOR_ACTION', true);
        this.setState({
            selectedTab: FLAG_TAB.flag_popularTab,
        })
    }
    setMyHome(){
        DeviceEventEmitter.emit('NAVIGATOR_ACTION', true);
        this.setState({
            selectedTab: FLAG_TAB.flag_trendingTab,
        })
    }

    onSelected(selectedTab) {
        if(selectedTab === "flag_favoriteTab"){
            DeviceEventEmitter.emit('NAVIGATOR_ACTION', false);
        }
        this.setState({
            selectedTab: selectedTab,
        })
    }


    _renderTab_old(Component, selectedTab, title, renderIcon) {
        return (
            <TabNavigator.Item
                selected={this.state.selectedTab === selectedTab}
                title={title}
                selectedTitleStyle={this.state.theme.styles.selectedTitleStyle}
                renderIcon={() => <Image style={styles.tabItemImageStyle}
                                         source={renderIcon}/>}
                renderSelectedIcon={() => <Image
                    style={[styles.tabItemImageStyle,this.state.theme.styles.tabBarSelectedIcon]}
                    source={renderIcon}/>}
                    onPress={() => this.onSelected(selectedTab)}>
                <Component {...this.props} theme={this.state.theme} homeComponent={this}/>
            </TabNavigator.Item>
        )
    }

    _renderTab(Component, selectedTab, title, renderIcon, renderIconSel,setHome) {
        // if(selectedTab === "flag_favoriteTab"){
        //     const {navigation} = this.props;
        //     InteractionManager.runAfterInteractions(() => {
        //         navigation.navigate('WorkManager',{
        //             theme:this.theme});
        //     });
        //     return null;
        // }
// console.log("2222");
        if (this.state.theme) {
        return (
            <TabNavigator.Item
                selected={this.state.selectedTab === selectedTab}
                title={title}
                selectedTitleStyle={this.state.theme.styles.selectedTitleStyle}
                renderIcon={() => <Image style={styles.tabItemImageStyle} source={renderIcon}/>}
                renderSelectedIcon={() => <Image style={styles.tabItemImageStyle} source={renderIconSel}/>}
                    onPress={() => this.onSelected(selectedTab)}>
                <Component {...this.props} theme={this.state.theme} homeComponent={this} setHome={()=>setHome()}/>
            </TabNavigator.Item>
        )
        } else {
            if(selectedTab === "flag_favoriteTab"){
               return ( <TabNavigator.Item
                    selected={this.state.selectedTab === selectedTab}
                    title={title}
                    selectedTitleStyle={styles.selectedTitleStyle}
                    renderIcon={() => <Image style={styles.tabItemImageStyle} source={renderIcon}/>}
                    renderSelectedIcon={() => <Image style={styles.tabItemImageStyle} source={renderIconSel}/>}
                    onPress={() =>{
                        const {navigation} = this.props;
                        InteractionManager.runAfterInteractions(() => {
                            navigation.navigate('WorkManager',{
                                theme:this.theme,
                                callback: (
                                    () => {
                                        this.setHome();
                                    })
                            });
                        });
                        }
                    }>
                    <Component {...this.props} theme={this.state.theme} homeComponent={this} setHome={()=>setHome()}/>
                </TabNavigator.Item>
               )
            }else if(selectedTab === "flag_trendingTab"){
                return (
                    <TabNavigator.Item
                        selected={this.state.selectedTab === selectedTab}
                        title={title}
                        selectedTitleStyle={styles.selectedTitleStyle}
                        renderIcon={() => <Image style={styles.tabItemImageStyle} source={renderIcon}/>}
                        renderSelectedIcon={() => <Image style={styles.tabItemImageStyle} source={renderIconSel}/>}
                        onPress={() => this.onSelected(selectedTab)}>
                        <Component {...this.props} theme={this.state.theme} homeComponent={this} setHome={()=>setHome()}/>
                    </TabNavigator.Item>
                )
            }else{
                return (
                    <TabNavigator.Item
                        selected={this.state.selectedTab === selectedTab}
                        title={title}
                        selectedTitleStyle={styles.selectedTitleStyle}
                        renderIcon={() => <Image style={styles.tabItemImageStyle} source={renderIcon}/>}
                        renderSelectedIcon={() => <Image style={styles.tabItemImageStyle} source={renderIconSel}/>}
                        onPress={() => this.onSelected(selectedTab)}>
                        <Component {...this.props} theme={this.state.theme} homeComponent={this} setHome={()=>setHome()}/>
                    </TabNavigator.Item>
                )
            }

        }

    }

    show(isShow){
        if(isShow){
           return {
                opacity: 1.0,
                    bottom: (Dimens.isIphoneX()?scaleSize(20):0),
            }
        }else {
            return {height: 0, overflow: 'hidden'}
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <TabNavigator
                    tabBarStyle={this.show(this.state.isShow)}
                    sceneStyle={{paddingBottom: 0}}
                >
                    {this._renderTab(HomePage, FLAG_TAB.flag_popularTab, '首页', require('../../../res/home/ic_tab_home_nor.png'), require('../../../res/home/ic_tab_home_sel.png'),()=>this.setHome())}
                    {/*{this._renderTab(WorkPage, FLAG_TAB.flag_favoriteTab, '工单', require('../../../res/home/ic_tab_gd_nor.png'), require('../../../res/home/ic_tab_gd_sel.png'))}*/}
                    {this._renderTab(WorkManager, FLAG_TAB.flag_favoriteTab, '工单', require('../../../res/home/ic_tab_gd_nor.png'), require('../../../res/home/ic_tab_gd_sel.png'),()=>this.setHome())}
                    {this._renderTab(MinePage, FLAG_TAB.flag_trendingTab, '我的', require('../../../res/home/ic_tab_mine_nor.png'), require('../../../res/home/ic_tab_mine_sel.png'),()=>this.setMyHome())}
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
    selectedTitleStyle:{
        color: '#5ec4c8'
    }
});
