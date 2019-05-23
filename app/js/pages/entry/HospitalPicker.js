

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
import SearchHospital from './SearchHospital';


export default class HospitalPicker extends BaseComponent {
  constructor(props){
    super(props);
    this.state={
      theme:this.props.theme,

    }
  }


  _onSure() {
    alert('确定');
  }

  _onSearch() {
    const {navigation} = this.props;
        InteractionManager.runAfterInteractions(() => {
            // navigator.push({
            //     component: SearchHospital,
            //     name: 'SearchHospital',
            //     params:{
            //         theme:this.theme
            //     }
            // });
            navigation.navigate('SearchHospital',{theme:this.theme})
        });

  }

  render() {
    return (
      <View style={styles.container}>
      <TitleBar
      centerText={'医院选择'}
      isShowLeftBackIcon={false}
      navigation={this.props.navigation}
      leftPress={() => this.naviGoBack(this.props.navigation)}

      /> 

       <View style={{height:30,backgroundColor:'#f0f0f0',justifyContent:'center', flexDirection:'row',alignItems:'center', marginLeft:10, marginRight:10, marginTop:10,
       borderBottomRightRadius: 15,borderBottomLeftRadius: 15,borderTopLeftRadius: 15,borderTopRightRadius: 15,}}>
            <TouchableOpacity onPress={()=>{}}>
                          <View style={{justifyContent:'flex-start',flexDirection:'row',alignItems:'center'}}>
                                <Image source={require('../../../res/login/ic_location.png')} 
                                       style={{width:14,height:17,marginLeft:10}}/>
                                <Text style={{color:'#333',fontSize:14,marginLeft:5}}>上海</Text>
                                <Image source={require('../../../res/login/dropdown_01.png')} 
                                       style={{width:7,height:5,marginLeft:5}}/>
                          </View>
                    </TouchableOpacity>
                    <Text style={{color:'#999',fontSize:14,marginLeft:5, flex:1}} onPress={()=>this._onSearch()}>请输入医院名称搜索</Text>

        </View>

        <Text style={{backgroundColor:'#f0f0f0',color:'#999',fontSize:14, height:40, justifyContent:'flex-start',textAlignVertical:'center',paddingLeft:15,marginTop:5,}}>我的医院</Text>
        <View style={{backgroundColor:'white', height:40, textAlignVertical:'center',paddingLeft:15, flexDirection:'row',alignItems:'center',}}>
            <Text style={{color:'#999',fontSize:14, height:40, textAlignVertical:'center', marginLeft:5,}}>地区</Text>
            <Text style={{color:'#333',fontSize:14, height:40, marginLeft:20,textAlignVertical:'center'}}>上海</Text>
            <View style={{justifyContent:'flex-end',flexDirection:'row',alignItems:'center', flex:1}}>
                                <Image source={require('../../../res/login/ic_arrow.png')} 
                                       style={{width:6,height:11,marginLeft:10, marginRight:10,}}/>
                                
            </View>
        </View>
        <View style={styles.line} />
        <View style={{backgroundColor:'white', height:40, textAlignVertical:'center',paddingLeft:15, flexDirection:'row',alignItems:'center',}}>
            <Text style={{color:'#999',fontSize:14, height:40, textAlignVertical:'center', marginLeft:5,}}>医院</Text>
            <Text style={{color:'#333',fontSize:14, height:40, marginLeft:20,textAlignVertical:'center'}}>仁济医院</Text>
            <View style={{justifyContent:'flex-end',flexDirection:'row',alignItems:'center', flex:1}}>
                                <Image source={require('../../../res/login/ic_arrow.png')} 
                                       style={{width:6,height:11,marginLeft:10, marginRight:10,}}/>
                                
            </View>
        </View>
        <View style={{backgroundColor:'#f0f0f0', height:40, textAlignVertical:'center',paddingLeft:15, flexDirection:'row',alignItems:'center',justifyContent:'flex-start',}}>
          <Text style={{color:'#999',fontSize:14, height:40, textAlignVertical:'center',paddingLeft:0,}}>附近的医院</Text>
            <View style={{justifyContent:'flex-end',flexDirection:'row',alignItems:'center', flex:1}}>
                                <Image source={require('../../../res/login/ic_dw.png')} 
                                       style={{width:15,height:15,marginLeft:10, marginRight:10,}}/>
                                <Text style={{color:'#5ec4c8',fontSize:14, height:40, textAlignVertical:'center',marginRight:10}}>重新定位</Text>
                                
            </View>
        </View>

        <View style={{backgroundColor:'white', height:40, textAlignVertical:'center',paddingLeft:15, flexDirection:'row',alignItems:'center',}}>
            <Text style={{color:'#333',fontSize:14, height:40, marginLeft:20,textAlignVertical:'center'}}>上海儿童医院</Text>
          
        </View>

        <View style={styles.line} />
        <View style={{backgroundColor:'white', height:40, textAlignVertical:'center',paddingLeft:15, flexDirection:'row',alignItems:'center',}}>
            <Text style={{color:'#333',fontSize:14, height:40, marginLeft:20,textAlignVertical:'center'}}>上海同济大学附属医院</Text>
          
        </View>
        
        <View style={styles.line} />
     <Text
     onPress={()=>this._onSure()}
     style={styles.button}>确定</Text>

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

  button:{
    width:Dimens.screen_width,
    height:46,
    color:'#ffffff',
    fontSize:18,
    textAlign:'center',
    backgroundColor: '#5ec4c8',
    alignItems:'center',
    justifyContent:'center',
    textAlignVertical:'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignSelf: 'center'
  },
  line:{
        backgroundColor:'#eeeeee',height:1,width:(Dimens.screen_width-20),marginTop:0,marginLeft:20,
    },
});