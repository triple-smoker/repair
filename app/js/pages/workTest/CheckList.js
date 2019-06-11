
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
    ScrollView
} from 'react-native';


import BaseComponent from '../../base/BaseComponent'
import * as Dimens from '../../value/dimens';
import TitleBar from '../../component/TitleBar';

let cachedResults = {
  nextPage: 1, // 下一页
  items: [], // 
  huoItems: [],
  total: 0, // 总数
  pages:0
};

export default class CheckList extends BaseComponent {
    static navigationOptions = {
        header: null,
    };
  constructor(props){
    super(props);
    this.state={
      selectIndex:0,
      tabIndex:0,
      theme:this.props.theme,
    }
  }


  componentDidMount() {
        this.timer = setTimeout(() => {
               cachedResults.items = [];
    cachedResults.items.push({});
    cachedResults.items.push({});
    cachedResults.items.push({});
    cachedResults.items.push({});
    cachedResults.items.push({});
    cachedResults.items.push({});
    cachedResults.items.push({});

    cachedResults.huoItems = [];
    cachedResults.huoItems.push({});
    cachedResults.huoItems.push({});
    cachedResults.huoItems.push({});
    this.setState({selectIndex:0, });
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
                // navigator.push({
                //     component:CheckDetail,
                //     name: 'CheckDetail',
                //     params:{
                //         theme:this.theme
                //     }
                // });
            navigation.navigate('CheckDetail',{
                theme:this.theme});
        });

  }

  renderItem(data, i) {
    if (i == 0) {
    return (
      <TouchableOpacity onPress={()=>{this.onPressItem(data)}} style={{flex:1, backgroundColor:'white', width:Dimens.screen_width,}}>
        <View style={{flex:1, backgroundColor:'#f6ffee', height:85, width:Dimens.screen_width-100, position: 'absolute',left:0,top:0,}} />
        <View style={{flex:1, flexDirection:'row',height:80, width:Dimens.screen_width,
          alignItems:'center', justifyContent:'center', textAlignVertical:'center',}}>

        <View style={{flex:1, }}>
          <View style={{flexDirection:'row',}}>
            <Text style={{fontSize:12, color:'#404040', marginLeft:15,marginTop:8, textDecorationLine:'underline'}}>NO.00001</Text>
            <Text style={{flexWrap:'nowrap', marginLeft:10, height:16,
              color:'#949494',fontSize:9, marginTop:10,textAlignVertical:'center', textAlign:'center',borderWidth:1, borderColor:'#949494',
                borderBottomRightRadius:5,borderBottomLeftRadius:5,borderTopLeftRadius:5,borderTopRightRadius:5, paddingLeft:5, paddingRight:5}}>特例</Text>
          </View>
          <Text style={{fontSize:10, color:'#737373', marginLeft:15, marginTop:3, }}>位置：上海市</Text>
          <Text style={{fontSize:11, color:'#737373', marginLeft:15, marginTop:3,}}>上次检查：2019-01-01</Text>

        </View>
        <View style={{flex:1, justifyContent:'flex-end', }}>
          <View style={{flex:1, justifyContent:'flex-end', flexDirection:'row', marginTop:15,}}>
              <Text style={{fontSize:11, color:'#737373', marginLeft:0, marginRight:12,}}>【进行中】</Text>
          </View>
          
          <Text style={{fontSize:10, marginLeft:15, marginTop:3, flex:1}}></Text>
        </View>
      
        </View>
        
        <View style={{backgroundColor: '#f2f2f2', height:5, width:Dimens.screen_width, marginTop:5, }}/>
      </TouchableOpacity>
      
    );
    } else if (i == 1) {
    return (
      <TouchableOpacity onPress={()=>{this.onPressItem(data)}} style={{flex:1, backgroundColor:'white',}}>
        <View style={{flex:1, backgroundColor:'#f6ffee', height:85, width:Dimens.screen_width-100, position: 'absolute',left:0,top:0,}} />
        <View style={{flex:1, flexDirection:'row',height:80, 
          alignItems:'center', justifyContent:'center', textAlignVertical:'center',}}>

        <View style={{flex:1,}}>
          <View style={{flexDirection:'row',}}>
            <Text style={{fontSize:12, color:'#404040', marginLeft:15,marginTop:8, textDecorationLine:'underline'}}>NO.00001</Text>
            <Text style={{flexWrap:'nowrap', marginLeft:10, height:16,
              color:'#949494',fontSize:9, marginTop:10,textAlignVertical:'center', textAlign:'center',borderWidth:1, borderColor:'#949494',
                borderBottomRightRadius:5,borderBottomLeftRadius:5,borderTopLeftRadius:5,borderTopRightRadius:5, paddingLeft:5, paddingRight:5}}>特例</Text>
          </View>
          <Text style={{fontSize:10, color:'#737373', marginLeft:15, marginTop:3, }}>位置：上海市</Text>
          <Text style={{fontSize:11, color:'#737373', marginLeft:15, marginTop:3,}}>上次检查：2019-01-01</Text>

        </View>
        <View style={{flex:1, justifyContent:'flex-end', }}>
          <View style={{flex:1, justifyContent:'flex-end', flexDirection:'row', marginTop:15,}}>
              <Text style={{fontSize:11, color:'#737373', marginLeft:0, marginRight:12,}}>【已超时】</Text>
          </View>
          
          <Text style={{fontSize:10, marginLeft:15, marginTop:3, flex:1}}></Text>
        </View>
        </View>
        <View style={{backgroundColor: '#f2f2f2', height:5, width:Dimens.screen_width, marginTop:5, }}/>
      </TouchableOpacity>
      
    );
    } else if (i == 2) {
    return (
      <TouchableOpacity onPress={()=>{this.onPressItem(data)}} style={{flex:1, backgroundColor:'white',}}>
        <View style={{flex:1, flexDirection:'row',height:80, 
          alignItems:'center', justifyContent:'center', textAlignVertical:'center',}}>

        <View style={{flex:1, }}>
          <View style={{backgroundColor:'white',flexDirection:'row',}}>
            <Text style={{fontSize:12, color:'#404040', marginLeft:15,marginTop:8, textDecorationLine:'underline'}}>NO.00001</Text>
            <Text style={{flexWrap:'nowrap', marginLeft:10, height:16,
              color:'#949494',fontSize:9, marginTop:10,textAlignVertical:'center', textAlign:'center',borderWidth:1, borderColor:'#949494',
                borderBottomRightRadius:5,borderBottomLeftRadius:5,borderTopLeftRadius:5,borderTopRightRadius:5, paddingLeft:5, paddingRight:5}}>特例</Text>
          </View>
          <Text style={{fontSize:10, color:'#737373', marginLeft:15, marginTop:3, }}>位置：上海市</Text>
          <Text style={{fontSize:11, color:'#737373', marginLeft:15, marginTop:3,}}>上次检查：2019-01-01</Text>

        </View>
        <View style={{flex:1, justifyContent:'flex-end', }}>
          <View style={{flex:1, justifyContent:'flex-end', flexDirection:'row', marginTop:15,}}>
              <Text style={{fontSize:11, color:'#737373', marginLeft:0, marginRight:12,}}>【进行中】</Text>
          </View>
          
          <Text style={{fontSize:10, marginLeft:15, marginTop:3, flex:1}}></Text>
        </View>
        </View>
        <View style={{backgroundColor: '#f2f2f2', height:5, width:Dimens.screen_width, marginTop:5, }}/>
      </TouchableOpacity>
      
    );
    } else if (i == 3) {
    return (
      <TouchableOpacity onPress={()=>{this.onPressItem(data)}} style={{flex:1, backgroundColor:'white',}}>
        <View style={{flex:1, flexDirection:'row',height:80, 
          alignItems:'center', justifyContent:'center', textAlignVertical:'center',}}>

        <View style={{flex:1, }}>
          <View style={{flexDirection:'row',}}>
            <Text style={{fontSize:12, color:'#404040', marginLeft:15,marginTop:8, textDecorationLine:'underline'}}>NO.00001</Text>
            <Text style={{flexWrap:'nowrap', marginLeft:10, height:16,
              color:'#949494',fontSize:9, marginTop:10,textAlignVertical:'center', textAlign:'center',borderWidth:1, borderColor:'#949494',
                borderBottomRightRadius:5,borderBottomLeftRadius:5,borderTopLeftRadius:5,borderTopRightRadius:5, paddingLeft:5, paddingRight:5}}>保养</Text>
          </View>
          <Text style={{fontSize:10, color:'#737373', marginLeft:15, marginTop:3, }}>位置：上海市</Text>
          <Text style={{fontSize:11, color:'#737373', marginLeft:15, marginTop:3,}}>上次检查：2019-01-01</Text>

        </View>
        <View style={{flex:1, justifyContent:'flex-end', }}>
          <View style={{flex:1, justifyContent:'flex-end', flexDirection:'row', marginTop:15,}}>
              <Text style={{fontSize:11, color:'#737373', marginLeft:0, marginRight:12,}}>【待开始】</Text>
          </View>
          
          <Text style={{fontSize:10, marginLeft:15, marginTop:3, flex:1}}></Text>
        </View>
        </View>
        <View style={{backgroundColor: '#f2f2f2', height:5, width:Dimens.screen_width, marginTop:5, }}/>
      </TouchableOpacity>
      
    );
    } 

    return (
      <TouchableOpacity onPress={()=>{this.onPressItem(data)}} style={{flex:1, backgroundColor:'#f6f6f6',width:Dimens.screen_width,}}>
        <View style={{flex:1, flexDirection:'row',height:80, width:Dimens.screen_width,
          alignItems:'center', justifyContent:'center', textAlignVertical:'center',}}>

        <View style={{flex:1,}}>
          <View style={{flexDirection:'row',}}>
            <Text style={{fontSize:12, color:'#FF0000', marginLeft:15,marginTop:8, textDecorationLine:'underline'}}>NO.00001</Text>
            <Text style={{flexWrap:'nowrap', marginLeft:10, height:16,
              color:'#949494',fontSize:9, marginTop:10,textAlignVertical:'center', textAlign:'center',borderWidth:1, borderColor:'#949494',
                borderBottomRightRadius:5,borderBottomLeftRadius:5,borderTopLeftRadius:5,borderTopRightRadius:5, paddingLeft:5, paddingRight:5}}>特例</Text>
          </View>
          <Text style={{fontSize:10, color:'#737373', marginLeft:15, marginTop:3, }}>位置：上海市</Text>
          <Text style={{fontSize:11, color:'#737373', marginLeft:15, marginTop:3,}}>上次检查：2019-01-01</Text>

        </View>
        <View style={{flex:1, justifyContent:'flex-end', }}>
          <View style={{flex:1, justifyContent:'flex-end', flexDirection:'row', marginTop:15,}}>
              <Text style={{fontSize:11, color:'#737373', marginLeft:0, marginRight:12,}}>【已完成】</Text>
          </View>
          
          <Text style={{fontSize:10, marginLeft:15, marginTop:3, flex:1}}></Text>
        </View>
        </View>
        <View style={{backgroundColor: '#f2f2f2', height:5, width:Dimens.screen_width, marginTop:5, }}/>
      </TouchableOpacity>
      
    );

  }


  onPressTabItem(data, i) {
    cachedResults.items = [];
    cachedResults.items.push({});
    cachedResults.items.push({});
    cachedResults.items.push({});
    cachedResults.items.push({});
    cachedResults.items.push({});

    cachedResults.huoItems = [];
    cachedResults.huoItems.push({});
    cachedResults.huoItems.push({});
    cachedResults.huoItems.push({});
    this.setState({selectIndex:i, });
  }

  renderTabItem(item, i) {
    var color = this.state.selectIndex===i?'#6DC5C9':'#333';
    var text = '全部';
    if (i === 1) {
      text = '未完成(8)';
    } else if (i === 2) {
      text = '紧急(8)';
    }
    return (
      <TouchableOpacity onPress={()=>{this.onPressTabItem(item, i)}} style={{flex:1, backgroundColor:'white', 
         height:40, alignItems:'center', justifyContent:'center', textAlignVertical:'center',}}>
        <Text style={{fontSize:13, color:color, marginLeft:0, marginRight:0,textAlign:'center',flex:1, alignItems:'center', justifyContent:'center', textAlignVertical:'center',}}>{text}</Text>
        <View style={{backgroundColor: color, height:this.state.selectIndex===i?2:0, width:70}}/>
      </TouchableOpacity>
    );
  }   

  render() {
    var itemView = cachedResults.items.map((item, i)=>this.renderItem(item, i));
    return (
      <View style={styles.container}>
      <View style={styles.line} />
      <Text style={{backgroundColor:'#f6f6f6', color:'#999',fontSize:12,height:35, textAlignVertical:'center', textAlign:'center'}}>——  共 {(cachedResults.items.length+cachedResults.huoItems.length) } 条巡检工单  ——</Text>
      <ScrollView horizontal={false} indicatorStyle={'white'} showsVerticalScrollIndicator={true} style={{width:Dimens.screen_width,flex:1}}>
        {/*{itemView}*/}
      </ScrollView>

      </View>
      )
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