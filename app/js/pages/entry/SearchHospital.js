

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
  ListView,
  ToastAndroid,
} from 'react-native';

import TitleBar from '../../component/TitleBar';
import BaseComponent from '../../base/BaseComponent'
import * as Dimens from '../../value/dimens';


const _DATA={
    "api":"GetStoreList",
    "v":"1.0",
    "code":"0",
    "msg":"success",
    "data":[{
        "id":1,
        "name":"四川Brunch",
        "star":4,
        "comment":45,
        "tag":"中国餐馆,四川菜,重辣",
        "location":"6.6km",
        "remark":"每日有优惠",
        "isSelected":0,
    },{
        "id":2,
        "name":"聚星楼",
        "star":4,
        "comment":45,
        "tag":"中国餐馆,四川菜,重辣",
        "location":"6.6km",
        "remark":"每日有优惠",
        "isSelected":0,
    },{
        "id":3,
        "name":"四川川二娃",
        "star":4,
        "comment":45,
        "tag":"中国餐馆,四川菜,重辣",
        "location":"6.6km",
        "remark":"每日有优惠",
        "isSelected":0,
    },{
        "id":4,
        "name":"韩国大烤肉",
        "star":4,
        "comment":45,
        "tag":"中国餐馆,四川菜,重辣",
        "location":"6.6km",
        "remark":"每日有优惠",
        "isSelected":0,
    },{
        "id":5,
        "name":"釜山料理",
        "star":4,
        "comment":45,
        "tag":"中国餐馆,四川菜,重辣",
        "location":"6.6km",
        "remark":"每日有优惠",
        "isSelected":0,
    }
    ]
};

export default class SearchHospital extends BaseComponent {
  constructor(props){
    super(props);
    this.state={
      theme:this.props.theme,
      dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2)=> {
            if (r1 !== r2) {
                console.log("不相等=");
                console.log(r1);
            } else {
                console.log("相等=");
                console.log(r1);
                console.log(r2);
            }
            return true//r1.isSelected !== r2.isSelected;
        }
      }),
      dataList :_DATA.data,

    }
  }


  componentDidMount() {
      this.setState({dataSource:this.state.dataSource.cloneWithRows(this.state.dataList)});
  }

  _onSure() {
    alert('确定');
  }

  _renderSeparatorView(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
    return (
      <View key={`${sectionID}-${rowID}`} style={styles.separator} />
    );
  }

  onPressItem(data){

  }

  renderItem(data) {
    var that = this;
    return (
      <TouchableOpacity onPress={()=>{that.onPressItem(data)}} style={{height:60,flex:1, backgroundColor:'white'}}>
          <View style={{marginLeft:0,height:45,}} >
              <Text style={{fontSize:15,color:'#333',marginLeft:15,marginTop:8,}}>{data.name}</Text>
              <Text style={{fontSize:12,color:'#999',marginLeft:15,marginTop:5,}}>{data.tag}</Text>
          </View>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={styles.container}>

      <View style={{height:44,backgroundColor:'white',justifyContent:'center', textAlignVertical:'center', flexDirection:'row',alignItems:'center', marginLeft:0, marginRight:0, marginTop:0,}}>
      <TouchableOpacity onPress={()=>this.naviGoBack(this.props.navigation)}>
      <Image source={require('../../../res/login/navbar_ico_back.png')} 
      style={{width:9,height:20,marginLeft:10}}/>
      </TouchableOpacity>
      <View style={{flex:1, height:30,backgroundColor:'#f0f0f0',justifyContent:'center', flexDirection:'row',alignItems:'center', marginLeft:10, marginRight:10, 
      borderBottomRightRadius: 15,borderBottomLeftRadius: 15,borderTopLeftRadius: 15,borderTopRightRadius: 15,}}>
      <TouchableOpacity onPress={()=>{}}>
      <View style={{justifyContent:'flex-start',flexDirection:'row',alignItems:'center'}}>
      <Image source={require('../../../res/login/ic_location.png')} 
      style={{width:14,height:17,marginLeft:10}}/>
      <Text style={{color:'#333',fontSize:14,marginLeft:5}}>上海</Text>
      <Image source={require('../../../res/login/dropdown_02.png')} 
      style={{width:7,height:5,marginLeft:5}}/>
      </View>
      </TouchableOpacity>
      <Text style={{color:'#999',fontSize:14,marginLeft:5, flex:1}}>请输入医院名称搜索</Text>

      </View>

      <Text style={{color:'#333',fontSize:15,marginLeft:10,marginRight:10}}>搜索</Text>
      </View>

      <ListView
      initialListSize={1}
      dataSource={this.state.dataSource}
      renderRow={(item) => this.renderItem(item)}
      style={{flex:1, width:Dimens.screen_width,height:Dimens.screen_height-44}}
      onEndReachedThreshold={10}
      enableEmptySections={true}
      renderSeparator={(sectionID, rowID, adjacentRowHighlighted) =>
        this._renderSeparatorView(sectionID, rowID, adjacentRowHighlighted)
      }
      />

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
    separator: {
       height: 0.5,
       backgroundColor: '#eee'
    }
  });