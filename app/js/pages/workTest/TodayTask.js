
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
    Modal, TouchableHighlight, Dimensions,
} from 'react-native';


import BaseComponent from '../../base/BaseComponent'
import * as Dimens from '../../value/dimens';
import TitleBar from '../../component/TitleBar';
import RefreshListView from '../../component/RefreshListView'
import Request, {GetRepairList} from "../../http/Request";


let cachedResults = {
  nextPage: 1, // 下一页
  items: [], // 
  total: 0, // 总数
  pages:0,
    tabIndex:0,
};
let ScreenWidth = Dimensions.get('window').width;
export default class TodayTask extends BaseComponent {
  constructor(props){
    super(props);
    this.state={
      tabIndex:0,
      theme:this.props.theme,
      isLoadingTail: false, // loading?
      isRefreshing: false, // refresh?
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
      this._fetchData(0);
  }
    componentWillReceiveProps(){
        this._fetchData(0);
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
                theme:this.theme,
                callback: (
                    () => {
                        this._fetchData(0);
                    })
            });
        });

  }

  renderItem(data,i) {
    return (
        <CheckItem data={data} key={i} onPressItem = {(data)=>this.onPressItem(data)}/>
    );
  }
    //当前巡检、历史巡检数据切换
    onPressTabItem(index){
        cachedResults.items = [];
        cachedResults.tabIndex = index;
        cachedResults.total = 0;
        cachedResults.pages = 0;
        cachedResults.nextPage = 1;
        this.setState({tabIndex:index, dataSource: this.state.dataSource.cloneWithRows(cachedResults.items)});
        this._fetchData(0);
    }
    //请求数据
    _fetchData(page) {
        var params = new Map();
        params.set('page', cachedResults.nextPage);
        params.set('limit', '20');
       if(cachedResults.tabIndex === 0){
           cachedResults.items.push({});
           cachedResults.items.push({});
           cachedResults.items.push({});
       }else if(cachedResults.tabIndex === 1){
           cachedResults.items.push({});
           cachedResults.items.push({});
           cachedResults.items.push({});
           cachedResults.items.push({});
           cachedResults.items.push({});
           cachedResults.items.push({});
       }
        this.setState({
            isLoadingTail: false,
            isRefreshing: false,
            dataSource: this.state.dataSource.cloneWithRows(cachedResults.items)
        });
    }

  render() {
      var tabBar = <View style={{backgroundColor:'white', height:49, justifyContent:'center', flexDirection:'row', bottom:0}}>
          <TouchableOpacity onPress={()=>{this.onPressTabItem(0)}} style={{alignItems:'center',textAlignVertical:'center', height:49, justifyContent:'center',flex:1}}>
              <View style={{alignItems:'center',textAlignVertical:'center', height:49, justifyContent:'center',flex:1}}>
                  <Text style={{color:this.state.tabIndex===0 ?'#5ec4c8':'#999',fontSize:14, textAlign:'center', textAlignVertical:'center'}}>当前巡检</Text>
              </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{this.onPressTabItem(1)}} style={{alignItems:'center',textAlignVertical:'center', height:49, justifyContent:'center',flex:1}}>
              <View style={{alignItems:'center',textAlignVertical:'center', height:49, justifyContent:'center',flex:1}}>
                  <Text style={{color:this.state.tabIndex===1 ?'#5ec4c8':'#999',fontSize:14, textAlign:'center', textAlignVertical:'center'}}>历史巡检</Text>
              </View>
          </TouchableOpacity>
      </View>
      var sechBar = null;
      if(this.state.tabIndex===1){
          sechBar =
              <View style={{height:44,backgroundColor:'white',justifyContent:'center', textAlignVertical:'center', flexDirection:'row',alignItems:'center', marginLeft:0, marginRight:0, marginTop:0,}}>
                  <TouchableOpacity style={{flex:1,height:30, marginLeft:10, marginRight:0,}}>
                      <View style={{flex:1, height:30,backgroundColor:'#f0f0f0',justifyContent:'center', flexDirection:'row',alignItems:'center', marginLeft:10, marginRight:10,
                          borderBottomRightRadius: 15,borderBottomLeftRadius: 15,borderTopLeftRadius: 15,borderTopRightRadius: 15,}}>
                          <Image source={require('../../../res/repair/ico_seh.png')}
                                 style={{width:16,height:16,marginLeft:10}}/>
                          <Text style={{color:'#999',fontSize:14,marginLeft:5, flex:1}}>请输入设备号/时间/任务名称或类型名称</Text>
                      </View>
                  </TouchableOpacity>
              </View>
      }
    return (
      <View style={styles.container}>
          {sechBar}
      <Text style={{backgroundColor:'#f8f8f8', color:'#737373',fontSize:14,height:35, textAlignVertical:'center', textAlign:'center'}}>——  共 {cachedResults.items.length} 条巡检工单  ——</Text>
      <RefreshListView
          style={{flex:1, width:Dimens.screen_width,height:Dimens.screen_height-44*2-49}}
          onEndReachedThreshold={10}
          dataSource={this.state.dataSource}
          // 渲染item(子组件)
          renderRow={this.renderItem.bind(this)}
          renderSeparator={this._renderSeparatorView.bind(this)}
          // 是否可以刷新
          isRefreshing={this.state.isRefreshing}
          // 是否可以加载更多
          isLoadingTail={this.state.isLoadingTail}
          // 请求数据
          fetchData={this._fetchData.bind(this)}
          // 缓存列表数据
          cachedResults={cachedResults}
          ref={component => this._listView = component}
      />
          {tabBar}
      </View>
      )
    }
  }
class CheckItem extends Component {

    render(){
        return (
            <TouchableOpacity onPress={()=>{this.props.onPressItem(this.props.data)}} >
                <View style={{flex:1, backgroundColor:'white',flexDirection:'row',height:80,
                    alignItems:'center', justifyContent:'center', textAlignVertical:'center',}}>
                {cachedResults.tabIndex === 0 &&
                <View style={{
                    backgroundColor:'rgba(239,249,249,0.6)',
                    position:"absolute",
                    width:1/4*ScreenWidth,
                    height:80,
                    left:0
                    }}
                />}
                <View style={{flex:2,}}>
                    <Text style={{fontSize:16, color:'#404040', marginLeft:10, }}>日常电梯巡检</Text>
                    <Text style={{fontSize:14, color:'#737373', marginLeft:10, marginTop:10,}}>8:00-10:00</Text>
                </View>
                <View style={{flex:1,height:80,  textAlignVertical:'center',paddingTop:5}}>
                        <Text style={{fontSize:16}}>【设备】</Text>
                </View>
                {cachedResults.tabIndex === 0 &&
                    <View style={{flex:2, flexDirection:'column',justifyContent:'flex-end',alignItems:'flex-end',  textAlignVertical:'center',paddingRight:10}}>
                        <Text style={{fontSize:16, color:'#62c0c5', marginLeft:0, marginRight:8,textAlign:'center',}}>进行中</Text>
                        <Text style={{fontSize:13, color:'#999', marginLeft:0, marginRight:8,textAlign:'center',}}>距离结束还剩18分12秒</Text>
                    </View>
                }
                {cachedResults.tabIndex === 1 &&
                    <View style={{flex:2,flexDirection:'column',justifyContent:'flex-end',alignItems:'flex-end',  textAlignVertical:'center',paddingRight:10}}>
                        <Text style={{fontSize:16, color:'#999', marginLeft:0, marginRight:8,textAlign:'center',}}>已完成</Text>
                    </View>
                }
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