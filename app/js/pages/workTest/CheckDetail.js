
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
    Modal,
    ScrollView, TouchableHighlight
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

var username = '';
export default class CheckDetail extends BaseComponent {
    static navigationOptions = {
        header: null,
    };
  constructor(props){
    super(props);
    this.state={
      selectIndex:0,
      theme:this.props.theme,
      modalVisible:false,

    }
  }



  componentDidMount() {

   
  }

  componentWillUnmount() {
  
  }

  goBack(){
        const { navigate } = this.props.navigation;
        this.props.navigation.goBack();
        this.props.navigation.state.params.callback()
  }


  

  render() {
var data1= {
    title:"1,暂存点卫生是否整洁",
}
var data2= {
    title:"2,暂存处防盗，防渗漏，防四害是否合格洁",
}
var data3= {
    title:"3,暂存处交接记录资料是否齐全",
}
    return (
      <View style={styles.container}>
      <View style={{height:44,backgroundColor:'white',justifyContent:'center', textAlignVertical:'center', flexDirection:'row',alignItems:'center', marginBottom:5}}>
          <TouchableHighlight style={{width:25,height:50}} onPress={()=>this.goBack()}>
              <Image style={{width:12,height:25,margin:10}} source={require("../../../image/navbar_ico_back.png")}/>
          </TouchableHighlight>
          <View style={{flex:1,justifyContent:'center',alignItems:'center',height:30,fontWeight:"600"}}>
              <Text style={{color:'#555',fontSize:18,marginLeft:5, flex:1}}>NO.00002</Text>
          </View>
      </View>

      <View style={styles.line} />
      <ScrollView horizontal={false} indicatorStyle={'white'} showsVerticalScrollIndicator={true} style={{width:Dimens.screen_width,flex:1}}>
        <View style={{flexDirection:'row',marginLeft:10,textAlignVertical:'center',}}>
            <View style={{marginLeft:15,marginTop:20,marginBottom:20,flexDirection:'row',height:3,backgroundColor:'#fff', width:Dimens.screen_width-95}}> 
                  <View style={{flexDirection:'row',height:3,backgroundColor:'#6DC5C9', width: 50}}/>
            </View>
            <Text style={{color:'#333',fontSize:12, marginLeft:10,marginRight:10,marginTop:10,}}>3/5</Text>
        </View>
        <CheckItem checkType={0} data={data1} onPressFeedback={()=>{this.onPressFeedback()}}/>
        <CheckItem checkType={1} data={data2} onPressFeedback={()=>{this.onPressFeedback()}}/>
        <CheckItem checkType={2} data={data3} onPressFeedback={()=>{this.onPressFeedback()}}/>


        {/*<View style={{backgroundColor:'white',flexDirection:'row', height:35,*/}
          {/*alignItems:'center', justifyContent:'center', textAlignVertical:'center',}}>*/}
            {/*<Text style={{fontSize:13, color:'#333', marginLeft:10,flex:1, }}>2,暂存处安全标志是否安全</Text>*/}
            {/*<TouchableOpacity  onPress={()=>{this.onPressFeedback()}}>*/}
                {/*<View style={{backgroundColor:'white',flexDirection:'row',justifyContent:'center',alignItems:'center', marginRight:10, textAlignVertical:'center',borderWidth:1, borderColor:'#6DC5C9',*/}
                    {/*borderBottomRightRadius:5,borderBottomLeftRadius:5,borderTopLeftRadius:5,borderTopRightRadius:5, paddingLeft:5, paddingRight:5}}>*/}
                  {/*<Image source={require('../../../res/static/ic_feedback_deng.png')} style={{width:18,height:22, marginLeft:5,}}/>*/}
                  {/*<Text style={{flexWrap:'nowrap', marginLeft:5,*/}
                  {/*color:'#6DC5C9',fontSize:10, textAlignVertical:'center', textAlign:'center',marginRight:5, }}>反馈</Text>*/}
                {/*</View>*/}
            {/*</TouchableOpacity>*/}
        {/*</View>*/}
        {/*<View style={styles.line} />*/}
        {/*<View style={{backgroundColor:'#ffffff',}} >*/}
          {/*<View style={{height:40,flexDirection:'row',textAlignVertical:'center',}} >*/}
            {/*<Image source={require('../../../res/static/ic_checked.png')} style={{width:18,height:18, marginLeft:10,marginTop:11,}}/>*/}
            {/*<Text style={{color:'#333',fontSize:13, marginLeft:10,marginRight:10,marginTop:10,height:40,}}>齐全，醒目</Text>*/}
          {/*</View>*/}
          {/*<View style={{height:40,flexDirection:'row',textAlignVertical:'center',}} >*/}
            {/*<Image source={require('../../../res/login/checkbox_nor.png')} style={{width:14,height:14, marginLeft:10,marginTop:13,}}/>*/}
            {/*<Text style={{color:'#333',fontSize:13, marginLeft:10,marginRight:10,marginTop:10,height:40,}}>缺失</Text>*/}
          {/*</View>*/}
          {/*<View style={{height:40,flexDirection:'row',textAlignVertical:'center',}} >*/}
            {/*<Image source={require('../../../res/login/checkbox_nor.png')} style={{width:14,height:14, marginLeft:10,marginTop:13,}}/>*/}
            {/*<Text style={{color:'#333',fontSize:13, marginLeft:10,marginRight:10,marginTop:10,height:40,}}>遮挡</Text>*/}
          {/*</View>*/}
        {/*</View>*/}
        {/*<View style={{width:Dimens.screen_width,height:5}} />*/}

        {/*<View style={{backgroundColor:'white',flexDirection:'row', height:35,*/}
          {/*alignItems:'center', justifyContent:'center', textAlignVertical:'center',}}>*/}
            {/*<Text style={{fontSize:13, color:'#333', marginLeft:10,flex:1, }}>3,暂存处防盗，防渗漏，防四害是否合格</Text>*/}
            {/*<TouchableOpacity  onPress={()=>{this.onPressFeedback()}}>*/}
                {/*<View style={{backgroundColor:'white',flexDirection:'row',justifyContent:'center',alignItems:'center', marginRight:10, textAlignVertical:'center',borderWidth:1, borderColor:'#6DC5C9',*/}
                    {/*borderBottomRightRadius:5,borderBottomLeftRadius:5,borderTopLeftRadius:5,borderTopRightRadius:5, paddingLeft:5, paddingRight:5}}>*/}
                  {/*<Image source={require('../../../res/static/ic_feedback_deng.png')} style={{width:18,height:22, marginLeft:5,}}/>*/}
                  {/*<Text style={{flexWrap:'nowrap', marginLeft:5,*/}
                  {/*color:'#6DC5C9',fontSize:10, textAlignVertical:'center', textAlign:'center',marginRight:5, }}>反馈</Text>*/}
                {/*</View>*/}
            {/*</TouchableOpacity>*/}
        {/*</View>*/}
        {/*<View style={styles.line} />*/}
        {/*<View style={{backgroundColor:'#ffffff',height:100}} >*/}
          {/*<TextInput */}
            {/*style={styles.input_style}*/}
            {/*placeholder="请输入检查结果"*/}
            {/*placeholderTextColor="#aaaaaa"*/}
            {/*underlineColorAndroid="transparent"*/}
            {/*multiline = {true}*/}
            {/*ref={'username'}*/}
            {/*autoFocus={false}*/}
            {/*onChangeText={(text) => {*/}
            {/*username = text;*/}
            {/*}}*/}
        {/*/>*/}
        {/*</View>*/}

        {/*<View style={{width:Dimens.screen_width,height:5}} />*/}

        {/*<View style={{backgroundColor:'white',flexDirection:'row', height:35,*/}
          {/*alignItems:'center', justifyContent:'center', textAlignVertical:'center',}}>*/}
            {/*<Text style={{fontSize:13, color:'#333', marginLeft:10,flex:1, }}>4,暂存处交接记录资料是否齐全</Text>*/}
            {/*<TouchableOpacity  onPress={()=>{this.onPressFeedback()}}>*/}
                {/*<View style={{backgroundColor:'white',flexDirection:'row',justifyContent:'center',alignItems:'center', marginRight:10, textAlignVertical:'center',borderWidth:1, borderColor:'#6DC5C9',*/}
                    {/*borderBottomRightRadius:5,borderBottomLeftRadius:5,borderTopLeftRadius:5,borderTopRightRadius:5, paddingLeft:5, paddingRight:5}}>*/}
                  {/*<Image source={require('../../../res/static/ic_feedback_deng.png')} style={{width:18,height:22, marginLeft:5,}}/>*/}
                  {/*<Text style={{flexWrap:'nowrap', marginLeft:5,*/}
                  {/*color:'#6DC5C9',fontSize:10, textAlignVertical:'center', textAlign:'center',marginRight:5, }}>反馈</Text>*/}
                {/*</View>*/}
            {/*</TouchableOpacity>*/}
        {/*</View>*/}
        {/*<View style={styles.line} />*/}
        {/*<View style={{backgroundColor:'#ffffff',height:120}} >*/}
          {/**/}
          {/*<View style={{zIndex:10,width:81,height:80,alignItems:'center', justifyContent:'center', textAlignVertical:'center',marginLeft:15,marginTop:15,}} >*/}
              {/*<Image source={require('../../../res/static/ic_add.png')} style={{width:26,height:27, }}/>*/}
              {/*<Text style={{fontSize:13, color:'#999', marginTop:5, }}>拍照</Text>*/}
          {/*</View>*/}
          {/*<Image source={require('../../../res/static/ic_frame.png')} style={{zIndex:1,width:81,height:80, top:15,left:15,position: 'absolute',}}/>*/}


        {/*</View>*/}

        {/*<View style={{width:Dimens.screen_width,height:5}} />*/}


        {/*<View style={{backgroundColor:'white',flexDirection:'row', height:35,*/}
          {/*alignItems:'center', justifyContent:'center', textAlignVertical:'center',}}>*/}
            {/*<Text style={{fontSize:13, color:'#333', marginLeft:10,flex:1, }}>5,暂存处交接记录资料是否齐全</Text>*/}
            {/*<TouchableOpacity  onPress={()=>{this.onPressFeedback()}}>*/}
                {/*<View style={{backgroundColor:'white',flexDirection:'row',justifyContent:'center',alignItems:'center', marginRight:10, textAlignVertical:'center',borderWidth:1, borderColor:'#6DC5C9',*/}
                    {/*borderBottomRightRadius:5,borderBottomLeftRadius:5,borderTopLeftRadius:5,borderTopRightRadius:5, paddingLeft:5, paddingRight:5}}>*/}
                  {/*<Image source={require('../../../res/static/ic_feedback_deng.png')} style={{width:18,height:22, marginLeft:5,}}/>*/}
                  {/*<Text style={{flexWrap:'nowrap', marginLeft:5,*/}
                  {/*color:'#6DC5C9',fontSize:10, textAlignVertical:'center', textAlign:'center',marginRight:5, }}>反馈</Text>*/}
                {/*</View>*/}
            {/*</TouchableOpacity>*/}
        {/*</View>*/}
        {/*<View style={styles.line} />*/}
        {/*<View style={{backgroundColor:'#ffffff',height:120}} >*/}
          {/**/}
          {/*<View style={{zIndex:10,width:81,height:80,alignItems:'center', justifyContent:'center', textAlignVertical:'center',marginLeft:15,marginTop:15,}} >*/}
              {/*<Image source={require('../../../res/static/ic_add.png')} style={{width:26,height:27, }}/>*/}
              {/*<Text style={{fontSize:13, color:'#999', marginTop:5, }}>拍照</Text>*/}
          {/*</View>*/}
          {/*<Image source={require('../../../res/static/ic_frame.png')} style={{zIndex:1,width:81,height:80, top:15,left:15,position: 'absolute',}}/>*/}


        {/*</View>*/}

        {/*<View style={{width:Dimens.screen_width,height:100}} />*/}

      </ScrollView>
      <Text
            onPress={()=>this._onSure()}
            style={styles.button}>提交</Text>
      <Modal
            animationType={"none"}
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {this.setState({modalVisible:false})}}
        >

        <View style={styles.modelStyle}>
            <View style={[styles.popupStyle1, {marginTop:(Dimens.screen_height-130)/2,backgroundColor:'#fbfbfb',}]}>
                <View style={{width:Dimens.screen_width-80, height:40,flexDirection:'row',
          alignItems:'center', justifyContent:'center', textAlignVertical:'center',}}>
                <Image source={require('../../../res/static/ic_feedback_deng.png')} style={{width:23,height:28, marginLeft:0,marginRight:5,}}/>
                <Text style={{fontSize:16,color:'#333',marginLeft:0,marginTop:0,textAlign:'center',height:40,textAlignVertical:'center',}}>反馈</Text>
                </View>
                <View style={{backgroundColor:'#eeeeee',height:1,width:(Dimens.screen_width-80),}} />
                <Text onPress={()=>this.onChangeType(0)} style={{alignItems:'center',justifyContent:'center',textAlignVertical:'center',fontSize:14,color:'#333',marginLeft:0,textAlign:'center',marginTop:0,width:Dimens.screen_width-80, height:40}}>自报自修</Text>
                <View style={{backgroundColor:'#eeeeee',height:1,width:(Dimens.screen_width-80),}} />
                <Text onPress={()=>this.onChangeType(1)} style={{alignItems:'center',justifyContent:'center',textAlignVertical:'center',fontSize:14,color:'#333',marginLeft:0,textAlign:'center',marginTop:0,width:Dimens.screen_width-80, height:40}}>异常反馈</Text>
         
            </View>
        </View>
    </Modal> 
      </View>
      )
    }


    onPressFeedback() {
        this.setState({modalVisible:true, });
    }

  _onSure() {

  }

    onChangeType(index) {
      this.setState({modalVisible:false, });

    }

}
class CheckItem extends Component {


    render(){
        return (
            <View>
                <View style={{backgroundColor:'white',flexDirection:'row', height:35,
                    alignItems:'center', justifyContent:'center', textAlignVertical:'center',}}>
                    <Text style={{fontSize:13, color:'#333', marginLeft:10,flex:1, }}>{this.props.data.title}</Text>
                    <TouchableOpacity  onPress={()=>{this.props.onPressFeedback()}}>
                        <View style={{backgroundColor:'white',flexDirection:'row',justifyContent:'center',alignItems:'center', marginRight:10, textAlignVertical:'center',borderWidth:1, borderColor:'#6DC5C9',
                            borderBottomRightRadius:5,borderBottomLeftRadius:5,borderTopLeftRadius:5,borderTopRightRadius:5, paddingLeft:5, paddingRight:5}}>
                            <Image source={require('../../../res/static/ic_feedback_deng.png')} style={{width:18,height:22, marginLeft:5,}}/>
                            <Text style={{flexWrap:'nowrap', marginLeft:5,
                                color:'#6DC5C9',fontSize:10, textAlignVertical:'center', textAlign:'center',marginRight:5, }}>反馈</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.line} />

                {this.props.checkType === 0 &&
                    <View style={{backgroundColor:'#ffffff',}} >
                        <View style={{height:40,flexDirection:'row',textAlignVertical:'center',}} >
                            <Image source={require('../../../res/static/ic_checked.png')} style={{width:18,height:18, marginLeft:10,marginTop:11,}}/>
                            <Text style={{color:'#333',fontSize:13, marginLeft:10,marginRight:10,marginTop:10,height:40,}}>整洁</Text>
                        </View>
                        <View style={{height:40,flexDirection:'row',textAlignVertical:'center',}} >
                            <Image source={require('../../../res/login/checkbox_nor.png')} style={{width:14,height:14, marginLeft:10,marginTop:13,}}/>
                            <Text style={{color:'#333',fontSize:13, marginLeft:10,marginRight:10,marginTop:10,height:40,}}>脏乱，有杂物</Text>
                        </View>
                    </View>
                }
                {this.props.checkType === 1 &&
                    <View style={{backgroundColor:'#ffffff',height:100}} >
                        <TextInput
                            style={styles.input_style}
                            placeholder="请输入检查结果"
                            placeholderTextColor="#aaaaaa"
                            underlineColorAndroid="transparent"
                            multiline = {true}
                            ref={'username'}
                            autoFocus={false}
                            onChangeText={(text) => {
                                username = text;
                            }}
                        />
                    </View>
                }
                {this.props.checkType === 2 &&
                    <View style={{backgroundColor:'#ffffff',height:120}} >
                        <View style={{zIndex:10,width:81,height:80,alignItems:'center', justifyContent:'center', textAlignVertical:'center',marginLeft:15,marginTop:15,}} >
                            <Image source={require('../../../res/static/ic_add.png')} style={{width:26,height:27, }}/>
                            <Text style={{fontSize:13, color:'#999', marginTop:5, }}>拍照</Text>
                        </View>
                        <Image source={require('../../../res/static/ic_frame.png')} style={{zIndex:1,width:81,height:80, top:15,left:15,position: 'absolute',}}/>
                    </View>
                }





                <View style={{width:Dimens.screen_width,height:5}} />
            </View>
        );
    }
}


  const styles = StyleSheet.create({
    modelStyle:{
        flex: 1,
        width:Dimens.screen_width,
        height:Dimens.screen_height,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    popupStyle1:{
        marginLeft:40,
        width:Dimens.screen_width-80,
        height:134,
        backgroundColor: 'white',
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15,
        borderTopLeftRadius: 15,
        borderTopRightRadius:15, 
        backgroundColor: 'white',
    },
    container: {
      flex: 1,
      backgroundColor: '#f6f6f6',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    },
  input_style:{
        paddingVertical: 0,marginTop:10, textAlignVertical:'top', textAlign:'left',backgroundColor: 'white',fontSize: 14,height:80, marginLeft:15,marginRight:15, paddingLeft:8,paddingRight:8,paddingTop:5,paddingBottom:5,
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

  });