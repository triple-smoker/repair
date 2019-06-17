/**
 * 欢迎页
 * @flow
 * **/
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    InteractionManager,
    Image,
} from 'react-native'
import ThemeDao from '../../dao/ThemeDao'
import AsyncStorage from "@react-native-community/async-storage";


export default class WelcomePage extends Component {

    componentDidMount() {

        // const {navigation} = this.props;

        new ThemeDao().getTheme().then((data)=>{
            this.theme=data;
        });

        this.loadUserInfo()
        // this.timer = setTimeout(() => {
        //     InteractionManager.runAfterInteractions(() => {
        //         // navigation.navigate('MainPage',{theme:this.theme})
        //         this.loadUserInfo()
        //
        //
        //     });
        // }, 100);
    }

    loadUserInfo() {
        console.log('loadUserInfo');
        var that = this;
        const {navigation} = that.props;
        AsyncStorage.getItem('token', function (error, result) {
            if (error) {
                console.log('读取失败')
            } else {
                if (result && result.length) {
                    global.access_token = result;
                    console.log('access_token: result = ' + result);
                    InteractionManager.runAfterInteractions(() => {
                        navigation.navigate('App',{theme:that.theme})

                    });
                } else {
                    InteractionManager.runAfterInteractions(() => {
                        navigation.navigate('Auth',{theme:that.theme})

                    });
                }
            }
        });

        AsyncStorage.getItem('uinfo', function (error, result) {
            // console.log('uinfo: result = ' + result + ', error = ' + error);
            if (error) {
                console.log('读取失败')
            } else {
                if (result && result.length) {

                    global.uinfo = JSON.parse(result);

                    global.userId=global.uinfo.userId;
                    global.deptId=global.uinfo.deptAddresses[0].deptId;
                    var permissions = global.uinfo.permissions.indexOf("biz_repair_mgr")===-1? false:true;
                    global.permissions = permissions;
                }

            }
        });
    }

    componentWillUnmount() {
        this.timer &&  (this.timer);
    }
    render() {
        return (
            <View style={styles.container}>
                {<Image style={{flex:1,width:null}} resizeMode='stretch' source={require('../../../res/home/ic_loading.png')}/>}
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#00ffff',
    }
})
