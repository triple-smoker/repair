import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    InteractionManager,
    Linking, Platform, BackHandler
} from 'react-native';

import TitleBar from '../../component/TitleBar';
import BaseComponent from '../../base/BaseComponent'
import * as Dimens from '../../value/dimens';
export default class findPsw extends BaseComponent {

    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            
        }
    }
    componentDidMount() {
        //监听物理返回键
        if (Platform.OS === 'android') {
            BackHandler.addEventListener("back", this.onBackClicked);
        }
    }
    //卸载前移除物理监听
    componentWillUnmount() {
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener("back", this.onBackClicked);
        }
    }
    //BACK物理按键监听
    onBackClicked = () => {
        const { navigate } = this.props.navigation;
        navigate('Login');
        return true;
    }

    goBack(){
        const {navigation} = this.props;
        InteractionManager.runAfterInteractions(() => {
            navigation.navigate('Login', {theme: this.theme})
        });
    }
    callPhone(num) {
        let url = 'tel: ' + num;
        Linking.canOpenURL(url).then(supported => {
          if (!supported) {
            console.log('Can\'t handle url: ' + url);
          } else {
            return Linking.openURL(url);
          }
        }).catch(err => console.error('An error occurred', err));
      }
    render() {

        return (
            <View style={styles.container}>
                <TitleBar
                    centerText={'找回密码'}
                    isShowLeftBackIcon={true}
                    navigation={this.props.navigation}
                    leftPress={() => this.goBack()}

                />
               <Image source={require('../../../res/login/service.png')} style={styles.headerImg}/>
                <View style={{height:Dimens.screen_height-20-44-300-40,width:Dimens.screen_width,flexDirection:'column',justifyContent:'flex-start',alignItems:'center',alignContent:'center'}}>
                    <TouchableOpacity onPress={()=>{this.callPhone(400823823)}}>
                    <Text style={{marginTop:40,color:'#6DC5C9',width:Dimens.screen_width,textAlign:"center",fontSize:25,fontWeight:'bold',textDecorationLine:'underline'}}>400-823-823</Text>
                   </TouchableOpacity>
                    <View style={{marginTop:20,flexDirection:'row',justifyContent:'center',alignItems:'center',alignContent:'center'}}>
                    <Image source={require('../../../res/login/service_min.png')} style={{width:20,height:20}}/><Text style={{fontWeight:'400',fontSize:14,color:'#8C8C8C'}}>服务热线</Text>
                    </View>
                    
                </View>
                <View style={{height:20,width:Dimens.screen_width,flexDirection:'row',justifyContent:'center',alignItems:'center',alignContent:'center'}}>
                    <Text style={{color:'#8C8C8C',fontSize:14}}>注：请拨打服务热线，联系客服直接找回密码</Text>
                </View>
                
            </View>

        )
    }
}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'white',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
    headerImg:{
        width:Dimens.screen_width,
        height:300,
    },

});


