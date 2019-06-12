

import React, { Component } from 'react';
import {
    View,
    Text,
    BackAndroid,
    TouchableOpacity,
    Image,
    StyleSheet,
    InteractionManager,
    TextInput,
    Platform,
    ToastAndroid,
    Switch
} from 'react-native';
import RNFetchBlob from '../../../util/RNFetchBlob';
import TitleBar from '../../component/TitleBar';
import BaseComponent from '../../base/BaseComponent'
import * as Dimens from '../../value/dimens';
import AsyncStorage from '@react-native-community/async-storage';

export default class SystemInform extends BaseComponent {
    static navigationOptions = {
        header: null,
    };
    constructor(props){
        super(props);
        this.state={
            theme:this.props.theme,
            pushStatus:false
        }
    }


   
    lookData(){
        const {navigation} = this.props;
        InteractionManager.runAfterInteractions(() => {
                navigation.navigate('MyData',{theme:this.theme})
            });
    }

    render() {
        return (
          <View style={styles.container}>
          <TitleBar
          centerText={'系统通知'}
          isShowLeftBackIcon={true}
          navigation={this.props.navigation}
          leftPress={() => this.naviGoBack(this.props.navigation)}
          
          />
          
            <View style={styles.input_center_bg}>
                
                <View style={styles.case}>
                    <View style={{position:'relative'}}>
                        <Text style={{fontSize:16,color:'#404040'}}>
                            版本更新    
                        </Text>
                        <View style={{position:'absolute',top:0,right:-7,height:5,width:5,borderRadius:5,backgroundColor:'red'}}></View>
                    </View>
                   
                    <Text style={{fontSize:14,color:'#7f7f7f'}}>
                        2019-05-01
                    </Text>
                </View>
                <View style={styles.line} />
                <View style={styles.case}>
                    <Text style={{fontSize:15,color:'#404040'}}>
                        版本V*.0发布啦，更多好玩的快去更新！ 版本V*.0发布啦，更多好玩的快去更新！
                    </Text>
                    
                    
                </View>
            </View>
            <View style={styles.input_center_bg2}>
                
                <View style={styles.case}>
                    <View style={{flexDirection: 'row',justifyContent:'flex-start'}}>
                        <Text style={{fontSize:16,color:'#737373'}}>
                            版本更新 
                        </Text>
                        <Text style={{fontSize:14,color:'#a5a5a5',marginLeft:5}}>
                        已读
                        </Text>
                    </View>
                    
                    <Text style={{fontSize:14,color:'#a5a5a5'}}>
                        2019-05-01
                    </Text>
                </View>
                <View style={styles.line} />
                <View style={styles.case}>
                    <Text style={{fontSize:15,color:'#737373'}}>
                        版本V*.0发布啦，更多好玩的快去更新！
                    </Text>
                    
                    
                </View>
            </View>
           


    </View>
    )
}
onChange(val) {
    this.setState({
        pushStatus : val
    })
    console.log(this.state.pushStatus)
  }
}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#f6f6f6',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
    case:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        lineHeight:45,
        height:45,
        marginLeft:0,
        marginRight:0,
        paddingLeft: 10,
        paddingRight: 10,
        
    },
    input_center_bg:{
        overflow:'hidden',
        backgroundColor: 'white',
        marginTop:10,
        marginLeft:10,
        marginRight:10,
        borderRadius:5,
        borderColor: '#d0d0d0',
        borderWidth: 1,

    },
    input_center_bg2:{
        overflow:'hidden',
        backgroundColor: '#f5f5f5',
        marginTop:10,
        marginLeft:10,
        marginRight:10,
        borderRadius:5,
        borderColor: '#d0d0d0',
        borderWidth: 1,

    },
    input_item:{
        flexDirection:'row',height:40,alignItems:'center',marginTop:0,
    },
    input_style:{
        fontSize: 15,height:40,textAlign: 'left',textAlignVertical:'center',flex:1,marginLeft:0
    },
    line:{
        backgroundColor:'#d0d0d0',height:1,width:(Dimens.screen_width-40),marginTop:0,marginLeft:10
    },
});