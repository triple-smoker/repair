/**
 * 欢迎页
 * @flow
 * **/
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    InteractionManager,
    Platform,
    Image,
} from 'react-native'
import MainPage from './MainPage'
import ThemeDao from '../../dao/ThemeDao'


export default class WelcomePage extends Component {

    componentDidMount() {

        const {navigator} = this.props;

        new ThemeDao().getTheme().then((data)=>{
            this.theme=data;
        });

        this.timer = setTimeout(() => {
            InteractionManager.runAfterInteractions(() => {
                navigator.resetTo({
                    component: MainPage,
                    name: 'MainPage',
                    params:{
                        theme:this.theme
                    }
                });
            });
        }, 2000);
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