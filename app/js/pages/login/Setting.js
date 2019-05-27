

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
} from 'react-native';

import TitleBar from '../../component/TitleBar';
import BaseComponent from '../../base/BaseComponent'
import * as Dimens from '../../value/dimens';


export default class Setting extends BaseComponent {
    static navigationOptions = {
        header: null,
    };
    constructor(props){
        super(props);
        this.state={
            theme:this.props.theme,
    
        }
    }


    _onSure() {
        alert('确定');
    }

    render() {
        return (
          <View style={styles.container}>
          <TitleBar
          centerText={'系统设置'}
          isShowLeftBackIcon={true}
          navigation={this.props.navigation}
          leftPress={() => this.naviGoBack(this.props.navigation)}
          
          />
          
          <View style={styles.input_center_bg}>
          <View style={styles.input_item}>
          <Text style={{marginLeft:20,color:'#999999',fontSize:15,width:95}}>服务器IP地址</Text>

          <TextInput 
          style={styles.input_style}
          placeholder=""
          placeholderTextColor="#aaaaaa"
          underlineColorAndroid="transparent"
          numberOfLines={1}
          ref={'username'}
          multiline={true}
          autoFocus={true}
          onChangeText={(text) => {
           username = text;
       }}

       />
       </View>
       <View style={styles.line} />
       <View style={styles.input_item}>
       <Text style={{marginLeft:20,color:'#999999',fontSize:15,width:95}}>端口号</Text>
       <TextInput 
       style={styles.input_style}
       placeholder=""
       placeholderTextColor="#aaaaaa"
       underlineColorAndroid="transparent"
       numberOfLines={1}
       ref={'password'}
       multiline={true}
       secureTextEntry={true}
       onChangeText={(text) => {
           password = text;
       }}
   
       />
       
       </View>
      
       </View>

       <Text
       onPress={()=>this._onSure()}
       style={{
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
    }}>确定</Text>

    </View>
    )
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

    input_center_bg:{
        backgroundColor: 'white',
        alignItems:'center',
        height:82,
        width:Dimens.screen_width,
        marginTop:0,

    },
    input_item:{
        flexDirection:'row',height:40,alignItems:'center',marginTop:0,
    },
    input_style:{
        fontSize: 15,height:40,textAlign: 'left',textAlignVertical:'center',flex:1,marginLeft:0
    },
    line:{
        backgroundColor:'#eeeeee',height:1,width:(Dimens.screen_width-20),marginTop:0,
    },
});