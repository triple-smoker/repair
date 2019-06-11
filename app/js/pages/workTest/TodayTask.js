
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
    ListView,
    Modal, TouchableHighlight,
} from 'react-native';


import BaseComponent from '../../base/BaseComponent'
import * as Dimens from '../../value/dimens';
import TitleBar from '../../component/TitleBar';


let cachedResults = {
  nextPage: 1, // 下一页
  items: [], // 
  total: 0, // 总数
  pages:0
};

export default class TodayTask extends BaseComponent {
  constructor(props){
    super(props);
    this.state={
      selectIndex:0,
      theme:this.props.theme,
      dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2)=> {
            if (r1 !== r2) {
                //console.log("不相等=");
                //console.log(r1);
            } else {
                console.log("相等=");
                //console.log(r1);
                //console.log(r2);
            }
            return true//r1.isSelected !== r2.isSelected;
        }
      }),

    }
  }


  componentDidMount() {
        this.timer = setTimeout(() => {
           cachedResults.items = [];
    cachedResults.items.push({});
    cachedResults.items.push({});
    cachedResults.items.push({});

    this.setState({selectIndex:0, dataSource:this.state.dataSource.cloneWithRows(cachedResults.items)});
        }, 500);
   
  }

  componentWillUnmount() {
  
        this.timer &&  (this.timer);

    }


  _renderSeparatorView(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
    return (
      <View key={`${sectionID}-${rowID}`} style={styles.separator} />
    );
  }

  onPressItem(data){

        const {navigation} = this.props;
        InteractionManager.runAfterInteractions(() => {
            navigation.navigate('CheckList',{
                theme:this.theme});
        });

  }

  renderItem(data,i) {
    return (
        <CheckItem data={data} key={i} onPressItem = {(data)=>this.onPressItem(data)}/>
    );
  }


  onPressTabItem(data, i) {
    cachedResults.items = [];
    cachedResults.items.push({});
    cachedResults.items.push({});
    cachedResults.items.push({});
    this.setState({selectIndex:i, dataSource:this.state.dataSource.cloneWithRows(cachedResults.items)});
  }


  render() {
    return (
      <View style={styles.container}>
      <Text style={{backgroundColor:'#f8f8f8', color:'#737373',fontSize:14,height:35, textAlignVertical:'center', textAlign:'center'}}>——  共 {cachedResults.items.length} 条巡检工单  ——</Text>
      <ListView
        initialListSize={1}
        dataSource={this.state.dataSource}
        renderRow={(item) => this.renderItem(item)}
        style={{backgroundColor:'white',flex:1, }}
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
class CheckItem extends Component {
    render(){
        return (
            <TouchableOpacity onPress={()=>{this.props.onPressItem(this.props.data)}} style={{flex:1, backgroundColor:'white',flexDirection:'row',height:80,
                alignItems:'center', justifyContent:'center', textAlignVertical:'center',}}>
                <View style={{flex:1, backgroundColor:'white',}}>
                    <Text style={{fontSize:16, color:'#404040', marginLeft:10, }}>日常电梯巡检</Text>
                    <Text style={{fontSize:14, color:'#737373', marginLeft:10, marginTop:2, }}>位置：上海市</Text>
                    <Text style={{fontSize:14, color:'#737373', marginLeft:10, marginTop:2,}}>8:00-10:00</Text>
                </View>
                <View style={{flex:1, backgroundColor:'white',flexDirection:'row',justifyContent:'flex-end',alignItems:'center',  textAlignVertical:'center',}}>
                    {/*<Image source={require('../../../res/static/ic_finish_big.png')} style={{width:72,height:69, marginRight:20,}}/>*/}
                    <Text style={{fontSize:13, color:'#999', marginLeft:0, marginRight:8,textAlign:'center',}}>8/10</Text>
                    <Image source={require('../../../res/login/ic_arrow.png')} style={{width:6,height:11, marginRight:10,}}/>
                </View>
            </TouchableOpacity>
        );
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
      backgroundColor:'#e9e9e9',height:1,width:(Dimens.screen_width),marginTop:0,marginLeft:0,
    },
    separator: {
       height: 5,
       backgroundColor: '#f6f6f6'
    }
  });