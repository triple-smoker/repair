

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    DeviceEventEmitter,
    Dimensions,
    InteractionManager,
    TouchableOpacity,
    ScrollView,
    Modal,
    TextInput,
    Linking
} from 'react-native';

import TitleBar from '../../../component/TitleBar';
import * as Dimens from '../../../value/dimens';
import Request, {GetRepairList, RepairDetail, RepPause, DoPause, RepairCommenced} from '../../../http/Request';
import { toastShort } from '../../../util/ToastUtil';
import BaseComponent from '../../../base/BaseComponent'
import Sound from "react-native-sound";
export default class OrderDetail extends BaseComponent {
    static navigationOptions = {
        header: null,
    };
  constructor(props){
    super(props);
    this.state={
        detaiData:null,
        repairId:props.navigation.state.params.repairId,
        repList:[],
        selectIndex:-1,
        modalVisible:false,
        status:null
    }
  }

  componentDidMount() {
    var that = this;
    this.eventListener = DeviceEventEmitter.addListener('Event_Refresh_Detail', (param) => {
            console.log('componentDidMount OrderDetail : ' + param);
            that.loadDetail();
        });

      this.loadDetail();
      this.loadRep();
  }


  complete() {
    var that = this;
    console.log('跳到拍照')
    global.from = 'OrderDetail';
    const {navigation} = this.props;
    InteractionManager.runAfterInteractions(() => {
            navigation.navigate('TakePhotos',{
                    theme:this.theme,
                    title:'完工开始拍照',
                    step:2,
                    repairId:this.state.repairId})
    });
  }


   takePhotos() {
        global.from = 'OrderDetail';
        const {navigation} = this.props;
        InteractionManager.runAfterInteractions(() => {
                navigation.navigate('TakePhotos',{
                        theme:this.theme,
                        repairId:this.state.repairId})
        });
  }


  loadDetail() {
    var that = this;
    Request.requestGet(RepairDetail+this.state.repairId, null, (result)=> {
        if (result && result.code === 200) {
            console.log(result)
            that.setState({
                detaiData:result.data,
                status:result.data.status
            });
        } else {
          
        }
    });
  }

  _onSure() {

  }

  addOption() {
        const {navigation} = this.props;
        InteractionManager.runAfterInteractions(() => {
                navigation.navigate('AddOption',{
                        theme:this.theme,
                        repairId: this.state.repairId})
        });
  }

 materielList() {
        const {navigation} = this.props;
        InteractionManager.runAfterInteractions(() => {             
                navigation.navigate('MaterielList',{
                        theme:this.theme,
                        repairId: this.state.repairId})
        });
  }



  onPressRepItem(data, index) {

      var items = this.state.repList;
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.causeId === data.causeId) {
            item.selected = item.selected===0?1:0;
        } else {
            //item.selected = 0;
        }
      }
    
    this.setState({selectIndex:index, repList:items, });    
  }

renderRepItem(data,i) {
      return (<Text key={i} onPress={()=>{this.onPressRepItem(data, i)}} style={{width:(Dimens.screen_width-130)/3,flexWrap:'nowrap', marginLeft:10,
              color:(this.state.selectIndex===i?'#369CED':'#333333'),fontSize:11, height:35, marginTop:10,
              textAlignVertical:'center', textAlign:'center',borderWidth:1, borderColor:(this.state.selectIndex===i?'#369CED':'#aaaaaa'),
                borderBottomRightRadius:5,borderBottomLeftRadius:5,borderTopLeftRadius:5,borderTopRightRadius:5, paddingLeft:5, paddingRight:5}}>{data.causeCtn}</Text>
    );
  }


renderMaterialItem(data, i) {
    var that = this;
    return (
    <View key={i}>
        <View style={{backgroundColor:'white', paddingTop:10, paddingBottom:10,flexDirection:'row',textAlignVertical:'center',alignItems:'center',}}>
            <View style={{marginLeft:15,}}>
                <Text style={{color:'#333',fontSize:14,}}>{data.materialName}</Text>
                <Text style={{color:'#999',fontSize:12,}}>规格：{data.spec}；品牌：{data.brand}</Text>
            </View>
            <View style={{justifyContent:'flex-end',flexDirection:'row',alignItems:'center', flex:1}}>
                    <Text style={{color:'#333',fontSize:13, width:70, marginLeft:0,marginRight:10,textAlignVertical:'center', textAlign:'center'}}>x{data.qty}</Text>
                    <Text style={{color:'#333',fontSize:13, width:70, marginLeft:0,marginRight:10,textAlignVertical:'center', textAlign:'center'}}>¥{data.unitPrice}</Text>         
            </View>
        </View>
        <View style={{backgroundColor:'#eeeeee',height:1,width:(Dimens.screen_width),}} />
    </View>
    );
}

renderPersonItem(data,i) {
    var withSel = Math.round(data.itemPercentage*150/100);
      return (
            <View key={i} style={{backgroundColor:'white', height:60, textAlignVertical:'center',marginLeft:0, marginRight:0, marginTop:6,}}>
                <View style={{flexDirection:'row',justifyContent : 'flex-start',marginLeft:10,marginTop:5, }}>
                    <Text style={{color:'#000',fontSize:14, marginLeft:10,textAlignVertical:'center', width:55}}>{data.assistantName}</Text>
                    <Text style={{color:'#000',fontSize:13, textAlignVertical:'center', width: 140,}}>{data.assistantMobile}</Text>
                    {
                        data.personType == 1 ? <Text style={{color:'#000',fontSize:13, textAlignVertical:'center',}}>主修人</Text> : 
                        <Text style={{color:'#000',fontSize:13, textAlignVertical:'center', marginLeft:5,}}> </Text> 
                    }
                    
                </View>
                <View style={{flexDirection:'row',marginLeft:10,height:25,textAlignVertical:'center',}}>
                    <Text style={{color:'#999',fontSize:12, }}>维修占比</Text>
                    <View style={{marginLeft:10,marginTop:8,flexDirection:'row',height:3,backgroundColor:'#f0f0f0', width: 150}}> 
                        <View style={{flexDirection:'row',height:3,backgroundColor:'#3F9AED', width: withSel}}/>
                    </View>
                    <Text style={{color:'#3F9AED',fontSize:12, marginLeft:10,}}>%{data.itemPercentage}</Text>
                </View>
            </View>
                              
    );
  }

    onPlayVoice(filePath) {
        console.log('bofang')
        const s = new Sound(filePath, null, (e) => {
            if (e) {
                toastShort('播放失败');
                return;
            }

            toastShort('开始播放');
            s.play(() => s.release());
        });

    }



  renderIconItem(data,i) {
     if (i === 0) {
     return (<View key={i} style={{backgroundColor:'white',}}>
                   <Image source={require('../../../../res/repair/user_wx.png')} style={{width:30,height:30,marginLeft:15,marginTop:10,}}/>               
            </View> 
        );                               
     } else {
      return (<View key={i} style={{backgroundColor:'white',}}>
                   <Image source={require('../../../../res/repair/line_wg.png')} style={{width:2,height:50,marginLeft:29,marginTop:0,}}/>
                   <Image source={require('../../../../res/repair/steps_xzr.png')} style={{width:18,height:18,marginLeft:21,marginTop:0,}}/>                 
            </View> 
        );
    }
  }   
                                 
  render() {
    var detaiData = this.state.detaiData;
    var detailAddress = null;
    var matterName = null;
    var repairNo = null;
    var createTime = null;
    var repairHours = null;
    var repairUserName = null;
    var parentTypeName = null;
    var telNo = null;
    //语音和图片
    var uriImg = null;
    var voiceView = null;
    var materialList = <Text style={{textAlignVertical:'center',backgroundColor:'white', color:'#999',fontSize:14, height:50, textAlign:'center',}}>暂无内容</Text>;
    var processList = <Text style={{textAlignVertical:'center',backgroundColor:'white', color:'#999',fontSize:14, height:50, textAlign:'center',}}>暂无内容</Text>;
    if (detaiData) {
        detailAddress = detaiData.detailAddress;
        matterName = detaiData.matterName;
        repairNo = detaiData.repairNo;
        createTime = new Date(detaiData.createTime).format("yyyy-MM-dd hh:mm:ss");

        if (detaiData.hours.hoursRequest) {
            // maio / 60 /60
            var desc = detaiData.hours.hoursRequest
            var hours = null;
            hours  = (desc/3600).toFixed(1)
            repairHours = hours+'小时';
        }
        
        repairUserName = detaiData.ownerName;
        telNo = detaiData.telNo;
        parentTypeName = detaiData.parentTypeName;

        if (detaiData.materialList && detaiData.materialList.length > 0) {
            var total = 0;
            for (var i = 0; i < detaiData.materialList.length; i++) {
                var item = detaiData.materialList[i];
                total = total + item.unitPrice*item.qty;
            }

            var list = detaiData.materialList.map((item, i)=>this.renderMaterialItem(item, i));
            materialList = <View>
                            <View style={{backgroundColor:'white', flexDirection:'row',textAlignVertical:'center',alignItems:'center',}}>
                                <Text style={{color:'#333',fontSize:14, height:35, textAlignVertical:'center',marginLeft:15,}}>名称</Text>
                                <View style={{justifyContent:'flex-end',flexDirection:'row',alignItems:'center', flex:1}}>
                                    <Text style={{color:'#333',fontSize:13, width:80, height:35, marginLeft:0,marginRight:10,textAlignVertical:'center', textAlign:'center'}}>数量</Text>
                                    <Text style={{color:'#333',fontSize:13, width:80, height:35, marginLeft:0,marginRight:10,textAlignVertical:'center', textAlign:'center'}}>价格</Text>         
                                </View>
                            </View>
                            <View style={{backgroundColor:'#eeeeee',height:1,width:(Dimens.screen_width),}} />
                                {list}
                            <View style={{backgroundColor:'white', paddingTop:5, paddingBottom:5,flexDirection:'row',textAlignVertical:'center',alignItems:'center',}}>
                                <Text style={{color:'#333',fontSize:16,marginLeft:15,}}>合计</Text>
                                <View style={{justifyContent:'flex-end',flexDirection:'row',alignItems:'center', flex:1}}>
                                    <Text style={{color:'#EA6060',fontSize:16, width:70, marginLeft:0,marginRight:10,textAlignVertical:'center', textAlign:'center'}}>¥{total}</Text>       
                                </View>
                            </View>
                        </View>;
        }

        if (detaiData.itemPersonList && detaiData.itemPersonList.length > 0) {
            var viewList = detaiData.itemPersonList.map((item, i)=>{
                if(item.assistantId != null){}
                    return this.renderPersonItem(item, i)
                      
            });
            var iconList = detaiData.itemPersonList.map((item, i)=>{
                if(item.assistantId != null){}
                    return this.renderIconItem(item, i)
                
            });
            processList = <View style={{backgroundColor:'white', paddingTop:10, paddingBottom:10,}}>
                            <Text style={{fontSize:13,color:'#333',marginLeft:10,textAlign:'left', }}>维修类别：{detaiData.parentTypeName}</Text>
                            <Text style={{fontSize:13,color:'#333',marginLeft:10,textAlign:'left', marginBottom:10, }}>维修事项：{detaiData.matterName}</Text>
                            <View style={styles.line} />
                            <View style={{flexDirection:'row',}}>
                                    <View style={{backgroundColor:'white',}}>
                                        {iconList}
                                    </View> 
                                    <View style={{backgroundColor:'white',}}>
                                        {viewList}
                                    </View> 
                            </View>
                          </View>
        }

        var repDatas = null;
        if (this.state.modalVisible) {
            repDatas = this.state.repList.map((item, i)=>this.renderRepItem(item,i));
        }
        //语音和图片
        if (detaiData.fileMap) {
            if (detaiData.fileMap.imagesRequest && detaiData.fileMap.imagesRequest.length > 0) {
                if(detaiData.fileMap.imagesRequest[0].filePath!=null) {
                    uriImg = detaiData.fileMap.imagesRequest[0].filePath;
                }
            }

            if (detaiData.fileMap.voicesRequest && detaiData.fileMap.voicesRequest.length > 0) {
                if(detaiData.fileMap.voicesRequest[0].filePath!=null) {
                    var filePath = detaiData.fileMap.voicesRequest[0].filePath;
                    voiceView = <TouchableOpacity onPress={() => {
                        this.onPlayVoice(filePath)
                    }} style={{backgroundColor: 'white'}}>
                        <Image source={require('../../../../res/repair/btn_voice.png')}
                               style={{width: 25, height: 25, marginRight: 5,}}/>
                    </TouchableOpacity>
                }
            }
        }
    }







    return (
      <View style={styles.container}>
      <TitleBar
      centerText={'维修单详情'}
      isShowLeftBackIcon={true}
      navigation={this.props.navigation}
      />
      <ScrollView horizontal={false} indicatorStyle={'white'} showsVerticalScrollIndicator={true} style={{height:Dimens.screen_height-40-64, width:Dimens.screen_width,flex:1}}>

    <View style={{backgroundColor:'transparent', flexDirection:'row',textAlignVertical:'center',alignItems:'center',}}>
            <Image source={require('../../../../res/repair/collapse_02.png')} 
                style={{width:20,height:20,marginLeft:10, marginRight:10,}}/>
            <Text style={{color:'#666',fontSize:14, height:35, textAlignVertical:'center',paddingLeft:0,}}>概况</Text>
    </View>

        <View style={{marginLeft:0,backgroundColor:'white',}} >
            <View style={{flexDirection:'row',paddingLeft:10}} >
                {voiceView}
              <Text style={{fontSize:14,color:'#333',marginTop:3,}}>报修内容：{matterName}</Text>
            </View>
              <View style={{height:1, width:Dimens.screen_width-30, marginTop:5, marginLeft:10, marginRight:10, backgroundColor:'#eeeeee'}}/>
              <View style={{marginLeft:0, marginTop:10, justifyContent:'center', textAlignVertical:'center', flexDirection:'row',alignItems:'center',}} >
                <View style={{marginLeft:10, justifyContent:'center', textAlignVertical:'center', alignItems:'center',width:60,}} >
                    <Image source={require('../../../../res/repair/user_wx.png')} style={{width:60,height:60,marginLeft:0}}/>
              
                </View>
                <View style={{marginLeft:10, flex:1}} >
                    <View style={{marginLeft:0, marginTop:0, flexDirection:'row',}} >
                        <Text style={{fontSize:12,color:'#999',marginLeft:0,marginTop:3,}}>报修单号：</Text>
                        <Text style={{fontSize:12,color:'#333',marginLeft:5,marginTop:3,}}>{repairNo}</Text>
                    </View>
                    <View style={{marginLeft:0, marginTop:3, flexDirection:'row',}} >
                        <Text style={{fontSize:12,color:'#999',marginLeft:0,marginTop:0,}}>报修时间：</Text>
                        <Text style={{fontSize:12,color:'#333',marginLeft:5,marginTop:0,}}>{createTime}</Text>
                    </View>
                    <View style={{marginLeft:0, marginTop:3, flexDirection:'row',}} >
                        <Text style={{fontSize:12,color:'#999',marginLeft:0,marginTop:0,}}>已耗时长：</Text>
                        <Text style={{fontSize:12,color:'#333',marginLeft:5,marginTop:0,}}>{repairHours}</Text>
                    </View>
                    <View style={{marginLeft:0, marginTop:3, flexDirection:'row',}} >
                        <Text style={{fontSize:12,color:'#999',marginLeft:0,marginTop:0,}}>报修位置：</Text>
                        <Text style={{fontSize:12,color:'#333',marginLeft:5,marginTop:0,}}>{detailAddress}</Text>
                    </View>
                    <View style={{marginLeft:0, marginTop:3, flexDirection:'row',}} >
                        <Text style={{fontSize:12,color:'#999',marginLeft:0,marginTop:0,}}>报修人员：</Text>
                        <Text style={{fontSize:12,color:'#333',marginLeft:5,marginTop:0,}}>{repairUserName}</Text>
                        <TouchableOpacity onPress={()=>{this.callPhone(telNo)}} style={{marginLeft:5}}>
                            <Image source={require('../../../../res/repair/list_call.png')} style={{width:20,height:20,}}/>
                        </TouchableOpacity>
                    </View>
                </View>
              </View>
              <View style={{height:1, width:Dimens.screen_width, marginTop:10, backgroundColor:'white'}}/>
        </View>


    <View style={{backgroundColor:'transparent', height:40, flexDirection:'row',textAlignVertical:'center',alignItems:'center',}}>
            <Image source={require('../../../../res/repair/collapse_02.png')} 
                style={{width:20,height:20,marginLeft:10, marginRight:10,}}/>
            <Text style={{color:'#666',fontSize:14, height:35, textAlignVertical:'center',paddingLeft:0, flex:1}}>维修事项</Text>

            {this.state.status === '5' ? <TouchableOpacity onPress={()=>this.addOption()} style={{}}>
            <View style={{backgroundColor:'white',justifyContent:'flex-end',flexDirection:'row',alignItems:'center',  marginRight:10,textAlign:'center', paddingLeft:3, paddingRight:3, paddingTop:3, paddingBottom:3,
                    borderBottomRightRadius: 15,borderBottomLeftRadius: 15,borderTopLeftRadius: 15,borderTopRightRadius:15, borderWidth:1, borderColor:'#eee'}}>
                    <Image source={require('../../../../res/repair/btn_ico_tj.png')} style={{width:12,height:12,marginLeft:10, marginRight:10,}}/>
                    <Text style={{color:'#666',fontSize:12,  marginLeft:0,marginRight:10,textAlignVertical:'center'}}>添加</Text>                    
            </View>
            </TouchableOpacity> : null }
    </View>

    {processList}
    <View style={{backgroundColor:'transparent', height:40, flexDirection:'row',textAlignVertical:'center',alignItems:'center',}}>
            <Image source={require('../../../../res/repair/collapse_02.png')} 
                style={{width:20,height:20,marginLeft:10, marginRight:10,}}/>
            <Text style={{color:'#666',fontSize:14, height:40, textAlignVertical:'center',paddingLeft:0, flex:1}}>物料</Text>
            {this.state.status === '5' ? <TouchableOpacity onPress={()=>this.materielList()} style={{}}>
             <View style={{backgroundColor:'white',justifyContent:'flex-end',flexDirection:'row',alignItems:'center',  marginRight:10,textAlign:'center', paddingLeft:3, paddingRight:3, paddingTop:3, paddingBottom:3,
                    borderBottomRightRadius: 15,borderBottomLeftRadius: 15,borderTopLeftRadius: 15,borderTopRightRadius:15, borderWidth:1, borderColor:'#eee'}}>
                    <Image source={require('../../../../res/repair/btn_ico_tj.png')} style={{width:12,height:12,marginLeft:10, marginRight:10,}}/>
                     <Text style={{color:'#666',fontSize:12,  marginLeft:0,marginRight:10,textAlignVertical:'center'}}>添加</Text>                     
            </View>
            </TouchableOpacity> : null}
    </View>

    {materialList}
 
    </ScrollView>
    {this.state.status === '5' ? <View style={{backgroundColor:'transparent', flexDirection:'row',textAlignVertical:'center',alignItems:'center',}}>
        <Text onPress={()=>this.pauseOrder()} style={{textAlignVertical:'center',backgroundColor:'#EFF0F1', color:'#333',fontSize:16, height:49, textAlign:'center', flex:1}}>暂停</Text>
        <Text onPress={()=>this.complete()} style={{textAlignVertical:'center',backgroundColor:'#98C3C5', color:'#fff',fontSize:16, height:49, textAlign:'center', flex:1}}>完工</Text>
    </View>
    : null}

        <Modal
            animationType={"none"}
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {}}
        >

        <View style={styles.modelStyle}>
            <View style={[styles.popupStyle, {marginTop:(Dimens.screen_height-390)/2,backgroundColor:'#fbfbfb',}]}>
                <Text style={{fontSize:16,color:'#333',marginLeft:0,marginTop:10,textAlign:'center',width:Dimens.screen_width-80, height:40}}>暂停</Text>
                <View style={{backgroundColor:'#eeeeee',height:1,width:(Dimens.screen_width-80),}} />
                <View style={{width:Dimens.screen_width-80, height:300}} >
                <Text style={{color:'#999',fontSize:14, height:40, textAlignVertical:'center',paddingLeft:10,}}>请选择暂停原因</Text>
                <View style={styles.listViewStyle}>
                  {repDatas}

                </View>
                <TextInput 
                  style={styles.input_style}
                  placeholder="原因描述…"
                  placeholderTextColor="#aaaaaa"
                  underlineColorAndroid="transparent"
                  multiline = {true}
                  ref={'otherDesc'}
                  onChangeText={(text) => {
                    otherDesc = text;
                  }}
                />
                </View>
                <View style={{backgroundColor:'transparent', flexDirection:'row',textAlignVertical:'center',alignItems:'center',}}>
                    <Text onPress={()=>this.cancel()} style={{borderBottomLeftRadius: 15,textAlignVertical:'center',backgroundColor:'#EFF0F1', color:'#333',fontSize:16, height:40, textAlign:'center', flex:1}}>取消</Text>
                    <Text onPress={()=>this.submit()} style={{borderBottomRightRadius: 15,textAlignVertical:'center',backgroundColor:'#E1E4E8', color:'#333',fontSize:16, height:40, textAlign:'center', flex:1}}>确定</Text>
                </View> 
            </View>
        </View>
    </Modal> 
    </View>
    ) 
}

  callPhone(num) {
    let url = 'tel: ' + num;
    Linking.canOpenURL(url).then(supported => {
      if (!supported) {
        console.log('Can\'t handle url: ' + url);
      } else {
        return Linking.openURL(url);
      }
    }).catch(err => console.error('An error occurred', err));
  }

  cancel() {
        this.setState({modalVisible:false});
    }



    pauseOrder() {
        this.setState({modalVisible:true});

    }

    submit() {
        if (this.state.selectIndex === -1) {
            toastShort('请选择暂停原因');
            return;
        }

      var causeIds = []; 
      var items = this.state.repList;
      // for (var i = 0; i < items.length; i++) {
      //   var item = items[i];
      //   if (item.selected === 1) {
      //       causeIds.push(item.causeId);
      //   }
      // }

        causeIds.push(items[this.state.selectIndex].causeId);
        this.setState({modalVisible:false});
        // var params = new Map();
        // params.set('repairId', this.state.repairId);
        // params.set('remark', otherDesc);
        // params.set('causeIds', causeIds);
        let params = {repairId:this.state.repairId, remark:otherDesc ? otherDesc : '', causeIds:causeIds};
        console.log(params);
        Request.requestPost(DoPause, params, (result)=> {
            if (result && result.code === 200) {
              toastShort('暂停成功');
            } else {
                toastShort('失败，请重试');
            }
      });
    }


  loadRep() {
    var that = this;
    Request.requestGet(RepPause, null, (result)=> {
        if (result && result.code === 200) {
            this.setState({repList: result.data});
        } else {
          
        }
    });
  }
}


const styles = StyleSheet.create({
    modelStyle:{
        flex: 1,
        width:Dimens.screen_width,
        height:Dimens.screen_height,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    listViewStyle:{
        // 主轴方向
        flexDirection:'row',
        // 一行显示不下,换一行
        flexWrap:'wrap',
        // 侧轴方向
        alignItems:'center', // 必须设置,否则换行不起作用
        width:Dimens.screen_width-100,
    },
    popupStyle:{
        marginLeft:40,
        width:Dimens.screen_width-80,
        height:390,
        backgroundColor: 'white',
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15,
        borderTopLeftRadius: 15,
        borderTopRightRadius:15, 
        backgroundColor: 'white',
    },
    input_style:{
        paddingVertical: 0,marginTop:10, textAlignVertical:'top', textAlign:'left',backgroundColor: 'white',fontSize: 14,height:80, marginLeft:15,marginRight:15, paddingLeft:8,paddingRight:8,paddingTop:5,paddingBottom:5,
    },
    container: {
        flex: 1,
        backgroundColor: '#f6f6f6',
    },

    welcome:{
        color:'#123456',

    },
    line:{
        backgroundColor:'#eeeeee',height:1,width:(Dimens.screen_width-15),marginTop:0,marginLeft:15,
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
    images:{
        height:160,
        width: Dimens.screen_width,
    }
});