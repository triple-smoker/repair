

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    DeviceEventEmitter,
    InteractionManager
} from 'react-native';

import TitleBar from '../../component/TitleBar';
import Login from '../login/Login';
import AsyncStorage from '@react-native-community/async-storage';
export default class MinePage extends Component {
    static navigationOptions = {
        header: null,
    };
  render() {
    return (
      <View style={styles.container}>
            <TitleBar
                    centerText={'我的'}
                    isShowLeftBackIcon={false}
                    navigation={this.props.navigation}
            />
      
       <Text
            onPress={()=>this.logout()} style={styles.button}>注 销</Text>
      
      </View>
    )
  }

  logout() {
    global.access_token = null;
      global.deptId = null;
      global.userId = null;
      global.permissions = null;
            AsyncStorage.setItem('token', '', function (error) {
                if (error) {
                   console.log('error: save error');
                } 
            });
            AsyncStorage.setItem('logInfo', '', function (error) {
                if (error) {
                   console.log('error: save error');
                }
            });
            AsyncStorage.setItem('logMsg', '', function (error) {
                if (error) {
                   console.log('error: save error');
                }
            });

    global.uinfo = null;
            AsyncStorage.setItem('uinfo', '', function (error) {
                //console.log('uinfo: error' + error);
                if (error) {
                   console.log('error: save error' + JSON.stringify(error));
                } 

            });

        const {navigation} = this.props;
                InteractionManager.runAfterInteractions(() => {
                        // navigator.push({
                        //     component: Login,
                        //     name: 'Login',
                        //     params:{
                        //         theme:this.theme
                        //     }
                        // });
                        navigation.navigate('Login',{theme:this.theme})
                    });
        }



}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'white',
    },

    welcome:{
        color:'#123456',
       
    },
    button:{
    height:46,
    color:'#ffffff',
    fontSize:18,
    textAlign:'center',
    backgroundColor: '#5ec4c8',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    borderBottomLeftRadius: 6,
    marginTop:30,
    marginLeft:30,
    marginRight:30,
    alignItems:'center',
    justifyContent:'center',
    textAlignVertical:'center',
    }
});