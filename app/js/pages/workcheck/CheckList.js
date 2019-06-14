
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
    Modal,
    ScrollView, TouchableHighlight, Dimensions
} from 'react-native';


import BaseComponent from '../../base/BaseComponent'
import * as Dimens from '../../value/dimens';
import TitleBar from '../../component/TitleBar';
import RefreshListView from '../../component/RefreshListView'

let cachedResults = {
  nextPage: 1, // 下一页
  items: [], // 
  total: 0, // 总数
  pages:0,
  tabIndex:0,
};
let ScreenWidth = Dimensions.get('window').width;

export default class CheckList extends BaseComponent {
    static navigationOptions = {
        header: null,
    };
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
                // navigator.push({
                //     component:CheckDetail,
                //     name: 'CheckDetail',
                //     params:{
                //         theme:this.theme
                //     }
                // });
            navigation.navigate('CheckDetail',{
                theme:this.theme,
                callback: (
                    () => {
                        this._fetchData(0);
                    })
            });
        });

  }

  renderItem(data, i) {
    return <CheckItem data={data} key={i} onPressItem = {(data)=>this.onPressItem(data)}/>

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
        }else if(cachedResults.tabIndex === 2){
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

  // onPressTabItem(data, i) {
  //   cachedResults.items = [];
  //   cachedResults.items.push({});
  //   cachedResults.items.push({});
  //   cachedResults.items.push({});
  //   cachedResults.items.push({});
  //   cachedResults.items.push({});
  //
  //   cachedResults.huoItems = [];
  //   cachedResults.huoItems.push({});
  //   cachedResults.huoItems.push({});
  //   cachedResults.huoItems.push({});
  //   this.setState({selectIndex:i, });
  // }
  //
  // renderTabItem(item, i) {
  //   var color = this.state.selectIndex===i?'#6DC5C9':'#333';
  //   var text = '全部';
  //   if (i === 1) {
  //     text = '未完成(8)';
  //   } else if (i === 2) {
  //     text = '紧急(8)';
  //   }
  //   return (
  //     <TouchableOpacity onPress={()=>{this.onPressTabItem(item, i)}} style={{flex:1, backgroundColor:'white',
  //        height:40, alignItems:'center', justifyContent:'center', textAlignVertical:'center',}}>
  //       <Text style={{fontSize:13, color:color, marginLeft:0, marginRight:0,textAlign:'center',flex:1, alignItems:'center', justifyContent:'center', textAlignVertical:'center',}}>{text}</Text>
  //       <View style={{backgroundColor: color, height:this.state.selectIndex===i?2:0, width:70}}/>
  //     </TouchableOpacity>
  //   );
  // }

    goBack(){
        const { navigate } = this.props.navigation;
        this.props.navigation.goBack();
        this.props.navigation.state.params.callback()
    }
    captrue() {

    }
    //未完成、紧急、全部数据切换
    onPressTabItem(index){
        cachedResults.items = [];
        cachedResults.tabIndex = index;
        cachedResults.total = 0;
        cachedResults.pages = 0;
        cachedResults.nextPage = 1;
        this.setState({tabIndex:index, dataSource: this.state.dataSource.cloneWithRows(cachedResults.items)});
        this._fetchData(0);
    }

  render() {
      var tabBar = <View style={{backgroundColor:'white', height:49, justifyContent:'center', flexDirection:'row', bottom:0}}>
          <TouchableOpacity onPress={()=>{this.onPressTabItem(0)}} style={{alignItems:'center',textAlignVertical:'center', height:49, justifyContent:'center',flex:1}}>
              <View style={{alignItems:'center',textAlignVertical:'center', height:49, justifyContent:'center',flex:1}}>
                  <Text style={{color:this.state.tabIndex===0 ?'#5ec4c8':'#999',fontSize:14, textAlign:'center', textAlignVertical:'center'}}>未完成</Text>
              </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{this.onPressTabItem(1)}} style={{alignItems:'center',textAlignVertical:'center', height:49, justifyContent:'center',flex:1}}>
              <View style={{alignItems:'center',textAlignVertical:'center', height:49, justifyContent:'center',flex:1}}>
                  <Text style={{color:this.state.tabIndex===1 ?'#5ec4c8':'#999',fontSize:14, textAlign:'center', textAlignVertical:'center'}}>紧急</Text>
              </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{this.onPressTabItem(2)}} style={{alignItems:'center',textAlignVertical:'center', height:49, justifyContent:'center',flex:1}}>
              <View style={{alignItems:'center',textAlignVertical:'center', height:49, justifyContent:'center',flex:1}}>
                  <Text style={{color:this.state.tabIndex===2 ?'#5ec4c8':'#999',fontSize:14, textAlign:'center', textAlignVertical:'center'}}>全部</Text>
              </View>
          </TouchableOpacity>
      </View>
    // var itemView = cachedResults.items.map((item, i)=>this.renderItem(item, i));
    return (
      <View style={styles.container}>
      <View style={{height:44,backgroundColor:'white',justifyContent:'center', textAlignVertical:'center', flexDirection:'row',alignItems:'center', marginBottom:5}}>
          <TouchableHighlight style={{width:50,height:44,alignItems:"center",justifyContent:"center"}} onPress={()=>this.goBack()}>
              <Image style={{width:21,height:37}} source={require("../../../image/navbar_ico_back.png")}/>
          </TouchableHighlight>
          <View style={{flex:1,justifyContent:'center',alignItems:'center',height:30,fontWeight:"600"}}>
              <Text style={{color:'#555',fontSize:18,marginLeft:5, flex:1}}>巡检</Text>
          </View>
          <TouchableOpacity onPress={()=>this.captrue()}>
              <Image style={{width:16,height:20,marginLeft:5,marginRight:10}} source={require('../../../res/repair/navbar_ico_sys.png')} />
          </TouchableOpacity>
      </View>
      {/*<View style={styles.line} />*/}
      {/*<Text style={{backgroundColor:'#f6f6f6', color:'#999',fontSize:12,height:35, textAlignVertical:'center', textAlign:'center'}}>——  共 {cachedResults.items.length} 条巡检工单  ——</Text>*/}
      {/*<ScrollView horizontal={false} indicatorStyle={'white'} showsVerticalScrollIndicator={true} style={{width:Dimens.screen_width,flex:1}}>*/}
        {/*{itemView}*/}
      {/*</ScrollView>*/}
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
            <TouchableOpacity onPress={()=>{this.props.onPressItem(this.props.data)}} style={{flex:1, backgroundColor:'#f6f6f6',width:Dimens.screen_width,}}>
                <View style={{flex:1, flexDirection:'row',height:80, width:Dimens.screen_width,
                    alignItems:'center', justifyContent:'center', textAlignVertical:'center',backgroundColor:"white"}}>
                    <View style={{
                        backgroundColor:'rgba(239,249,249,0.6)',
                        position:"absolute",
                        width:3/5*ScreenWidth,
                        height:80,
                        left:0
                    }}
                    />
                    <View style={{flex:2,}}>
                        <View style={{flexDirection:'row',}}>
                            <Text style={{fontSize:16, color:'#FF0000', marginLeft:15,marginTop:0, textDecorationLine:'underline'}}>NO.00001</Text>
                            {/*<Text style={{flexWrap:'nowrap', marginLeft:10, height:16,*/}
                                {/*color:'#949494',fontSize:9, marginTop:2,textAlignVertical:'center', textAlign:'center',borderWidth:1, borderColor:'#949494',*/}
                                {/*borderBottomRightRadius:5,borderBottomLeftRadius:5,borderTopLeftRadius:5,borderTopRightRadius:5, paddingLeft:5, paddingRight:5}}>特例</Text>*/}
                        </View>
                        <Text style={{fontSize:14, color:'#737373', marginLeft:15, marginTop:3, }}>上海市</Text>
                        <Text style={{fontSize:14, color:'#737373', marginLeft:15, marginTop:3,}}>08:00-12:00</Text>

                    </View>
                    <View style={{flex:1,height:80,  textAlignVertical:'center',justifyContent:"center"}}>
                        <Text style={{fontSize:16,textAlign:"center"}}>
                            Tiffany
                        </Text>
                    </View>
                    <View style={{flex:1, justifyContent:'flex-end',paddingRight:10}}>
                        <View style={{flex:1, justifyContent:'flex-end', flexDirection:'row',alignItems:"center"}}>
                            <Text style={{fontSize:16, color:'#737373', marginLeft:0, marginRight:12,}}>已完成</Text>
                        </View>

                        {/*<Text style={{fontSize:10, marginLeft:15, marginTop:3, flex:1}}></Text>*/}
                    </View>
                </View>
                {/*<View style={{backgroundColor: '#f2f2f2', height:5, width:Dimens.screen_width, marginTop:5, }}/>*/}
            </TouchableOpacity>
        );
    }
}


  const styles = StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor: '#f2f2f2',
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
      backgroundColor:'#eeeeee',height:1,width:(Dimens.screen_width),marginTop:0,marginLeft:0,
    },
    separator: {
       height: 5,
       backgroundColor: '#f6f6f6'
    }
  });