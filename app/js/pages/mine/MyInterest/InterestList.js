

import React, { Component } from 'react';
import {
    View,
    Text,
    BackAndroid,
    TouchableOpacity,
    Image,
    ListView,
    StyleSheet,
    InteractionManager,
    TextInput,
    ScrollView,
    Dimensions,
    Modal,
} from 'react-native';
import BaseComponent from '../../../base/BaseComponent'
import * as Dimens from '../../../value/dimens';
import Request, {GetRepairList, RepairDetail} from '../../../http/Request';
import Swiper from 'react-native-swiper';
import {Content, Accordion, Col, Textarea, Button,} from "native-base";
import {toDate} from '../../../util/DensityUtils'
import { Tabs,Icon, SearchBar, TabBar } from '@ant-design/react-native';
import RefreshListView from '../../../component/RefreshListView'
let ScreenWidth = Dimensions
  .get('window')
  .width;
let ScreenHeight = Dimensions
  .get('window')
  .height;
let cachedResults = {
    nextPage: 1, // 下一页
    items: [], // listview 数据(视频列表)
    total: 0, // 总数
    pages:0,
    tabIndex:0,
    timeIndex: 0,
  };
  const worktabs = [
    { title: '维修' },
    { title: '巡检' },
    { title: '保养' },
  ];
export default class InterestList extends Component {
    static navigationOptions = {
        header: null,
    };
    constructor(props){
        super(props);
        this.state={
            theme:this.props.theme,
            userData : null,
            selectedTab : 'redTab',
            modalPictureVisible:false,
            videoItemRefMap: new Map(), 
            dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2)=> {
                    if (r1 !== r2) {
                        console.log('不等')
                        return false
                    } else {
                        console.log('相等')
                    }
            return true
            }}),
            repairListData:[]
            
        }
    }
    componentDidMount() {
        var that = this;
        this.loadData()
        
    }
    componentWillUpdate(){
        this.loadData()
    }
    loadData(){
       
    }
    //关注的科室列表
    deptList(item,i){
        console.log('deptList--------------------------------')
        return <View key={i} style={styles.list}>
                        <Text style={{color:'#333333',fontWeight:'400',fontSize:15}}>{item.sourceName}</Text>
                        <TouchableOpacity onPress={()=>this.followOff(item.focusId,2)}>
                        <Text style={styles.rightT}>√已关注</Text>
                        </TouchableOpacity>
                    </View>
    }
    //关注的设备列表
    eqpList(item,i){
        return <View  key={i} style={styles.list}>
            <View style={styles.leftT}>
                <Text style={{color:'#333333',fontWeight:'bold',fontSize:15}}>{item.sourceName}</Text>
                <Text style={{color:'#666',fontWeight:'400',fontSize:13}}>{item.installLocation}</Text>
            </View>
            <TouchableOpacity onPress={()=>this.followOff(item.focusId,3)}>
            <Text style={styles.rightT}>√已关注</Text>
            </TouchableOpacity>
        </View>
    }
    //关注的用户列表dom
    userList(item,i){
        return <View key={i} style={styles.list}>
                <View style={styles.leftT2}>
                    <View style={{position:'relative'}}>
                        <Image style={{width:28,height:28,borderRadius:28}} source={require("../../../../image/user_wx.png")}/>
                        {/* <Image style={{width:9,height:13,position:'absolute',right:0,bottom:0}} source={require("../../../../res/login/f.png")}/> */}
                    </View>
                
                    <Text style={{marginLeft:5,color:'#333333',fontWeight:'400',fontSize:15}}>{item.sourceName}</Text>
                
                </View>
                <TouchableOpacity onPress={()=>this.followOff(item.focusId,4)}>
                    <Text style={styles.rightT}>√已关注</Text>
                </TouchableOpacity>
            </View>
    }
    workListdom(item){
        var list = null;
        if(item.length < 1){
            list = <Text style={{textAlignVertical:'center',backgroundColor:'white', color:'#999',fontSize:14, height:50, textAlign:'center',}}>暂无关注</Text>;
        }else{
            list=item.map((data,i)=>{
                return <View key={i}  style={styles.list}>
                        <TouchableOpacity onPress={()=>this.gotoDetail(data.sourceId)}>
                        <View style={styles.leftT}>
                            <Text style={{color:'#333333',fontWeight:'bold',fontSize:15}}>工单ID：{data.sourceId}</Text>
                            <Text style={{color:'#666',fontWeight:'400',fontSize:13}}>{data.workDeptName}</Text>
                        </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>this.followOff(data.focusId,1)}>
                        <Text style={styles.rightT}>√已关注</Text>
                        </TouchableOpacity>
                    </View>
            })
        }

        return list
        
    }
    //关注的工单列表类别 分类
    workList(items){
        var list1=[]
        var list2=[]
        var list3=[]
        
        //   console.log(items)
        items.map((item,i)=>{ 
            switch(item.bizFlag) {
                case 2:
                        list1.push(item)
                    break;
                case 1:
                        list2.push(item)
                    break;
                case 3:
                        list3.push(item)
                    break;
                default:
                    break;
            }  
        })  
        var newWorkData = new Map();
        newWorkData.set('list1',list1);
        newWorkData.set('list2',list2);
        newWorkData.set('list3',list3);
        return newWorkData
    }
    // 根据工单id二次查询 有bug 先不搞
    workChildList(item,index){
    
        
        
            var listt = new Array();
            item.map((data)=>{
                var id = data.sourceId
                var item2 = null;
                  Request.requestGet(RepairDetail+id, null, (result)=> {
                    if (result && result.code == 200) {
                        item2 = result.data  
                        listt.push(item2);    
                    }
                });   
             })
             
             
            //  setTimeout(()=>{
            //     console.log(listt)
            //     this.setState({
            //         repairListData:listt,
            //         dataSource:this.state.dataSource.cloneWithRows(listt),
            //     })
            //  },200)   
       
    }
    //去工单详情
    gotoDetail(id) {
        const {navigation} = this.props;
            InteractionManager.runAfterInteractions(() => {

                    navigation.navigate('OrderDetail',{
                            repairId:id,
                            theme:this.theme,
                            noFooter:true
                        })
            });
      }
    LIstDom(newWorkList){
        console.log(newWorkList)
            var list1 = newWorkList.get('list1')
            var list2 = newWorkList.get('list2')
            var list3 = newWorkList.get('list3')
        return <Tabs  tabs={worktabs} tabBarActiveTextColor={'#61C0C5'} 
                            tabBarUnderlineStyle={{backgroundColor:'#61C0C5'}}
                            initialPage={0}>
                            <View style={styles.main1}>
                                { this.workListdom(list2) }
                            </View>
                            <View style={styles.main1}>
                            <ScrollView style={{ backgroundColor: '#fff' }}>
                                {this.workListdom(list1)} 
                            </ScrollView>  
                            </View>

                            <View style={styles.main1}>
                                {this.workListdom(list3)}
                            </View>
                    
                        </Tabs>
                {/* <TouchableOpacity onPress={()=>{this.onPressItem(data,(page)=>this._fetchData(page))}} style={{flex:1, backgroundColor:'white'}}>
                    <View style={{marginLeft:0,}} >
                        <View style={{flexDirection:'row',paddingLeft:15}} >
                            
                            <Text style={{fontSize:14,color:'#333',marginTop:3,}}>报修内容：{data.matterName}</Text>
                        </View>
                        <View style={{height:1, width:Dimens.screen_width-30, marginTop:5, marginLeft:15, marginRight:15, backgroundColor:'#eeeeee'}}/>
                        <View style={{marginLeft:0, marginTop:10, justifyContent:'center', textAlignVertical:'center', flexDirection:'row',alignItems:'center',}} >
                            
                            <View style={{marginLeft:15, flex:1}} >
                                <View style={{marginLeft:0, marginTop:0, flexDirection:'row',}} >
                                    <Text style={{fontSize:13,color:'#999',marginLeft:0,marginTop:3,}}>报修单号：</Text>
                                    <Text style={{fontSize:13,color:'#333',marginLeft:5,marginTop:3,width:'60%'}}>{data.repairNo}</Text>
                                </View>
                                <View style={{marginLeft:0, marginTop:3, flexDirection:'row',}} >
                                    <Text style={{fontSize:13,color:'#999',marginLeft:0,marginTop:0,}}>报修时间：</Text>
                                    <Text style={{fontSize:13,color:'#333',marginLeft:5,marginTop:0,width:'60%'}}>{new Date(data.createTime).format("yyyy-MM-dd hh:mm:ss")}</Text>
                                </View>
                                <View style={{marginLeft:0, marginTop:3, flexDirection:'row',}} >
                                    <Text style={{fontSize:13,color:'#999',marginLeft:0,marginTop:0,}}>已耗时长：</Text>
                                    <Text style={{fontSize:13,color:'#333',marginLeft:5,marginTop:0,width:'60%'}}>{data.hours}小时</Text>
                                </View>
                                <View style={{marginLeft:0, marginTop:3, flexDirection:'row',}} >
                                    <Text style={{fontSize:13,color:'#999',marginLeft:0,marginTop:0,}}>报修位置：</Text>
                                    <Text style={{fontSize:13,color:'#333',marginLeft:5,marginTop:0,width:'60%'}}>{data.detailAddress}</Text>
                                </View>
                                {
                                data.isEquipment === 1 && 
                                <View style={{marginLeft:0, marginTop:3, flexDirection:'row',}} >
                                    <Text style={{fontSize:13,color:'#999',marginLeft:0,marginTop:0,}}>设备名称：</Text>
                                    <Text style={{fontSize:13,color:'#333',marginLeft:5,marginTop:0,width:'60%'}}>{data.equipmentName}</Text>
                                </View>
                                }
                                <View style={{marginLeft:0, marginTop:3, flexDirection:'row',}} >
                                    <Text style={{fontSize:13,color:'#999',marginLeft:0,marginTop:0,}}>报修人员12：</Text>
                                    <Text style={{fontSize:13,color:'#333',marginLeft:5,marginTop:0,}}>{data.ownerName}</Text>
                                    <TouchableOpacity onPress={()=>{that.callPhone(data.telNo)}} style={{marginLeft:10}}>
                                        <Image source={require('../../../../res/repair/list_call.png')} style={{width:20,height:20,}}/>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
            
                        <View style={{height:8, width:Dimens.screen_width, marginTop:10, backgroundColor:'#f8f8f8'}}/>
            
                    </View>
            
                </TouchableOpacity>
                             */}
            
        
        
    }
    _renderSeparatorView(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
        return (
          <View key={`${sectionID}-${rowID}`} style={styles.separator} />
        );
      }
    setTab(tab,index){
        console.log(index)
    }
    //  图片预览框
    _setModalPictureVisible(data) {
        if((data.fileMap.imagesRequest && data.fileMap.imagesRequest.length > 0) || (data.fileMap.videosRequest && data.fileMap.videosRequest.length > 0 )){
            this.setState({modalPictureVisible: !this.state.modalPictureVisible,imagesRequest:data.fileMap.imagesRequest,videosRequest:data.fileMap.videosRequest})
        }else{
            this.setState({modalPictureVisible: !this.state.modalPictureVisible})
        }

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
      onRef = (ref) => {
        this.videoItemRef = ref
        this.appentRefMap(ref.props.num,ref);
      }
    
      appentRefMap(index,ref){
          let map = this.state.videoItemRefMap;
          map.set(index,ref);
          this.setState({
              videoItemRefMap: map
          });
      }
      setVideoCurrentTime = (index) => {
        let videoItemRef = this.state.videoItemRefMap.get(index + 1);
        if(videoItemRef){
            videoItemRef.setVideoCurrentTime();
        }
      }
      followOff(focusId,focusType){
        var params = {'focusId':focusId,'focusType':focusType }  
        Request.requestPost('api/opcs/follow/off', params, (result)=> {
            console.log(result)
            if (result && result.code == 200) {
                  this.props.updateData()
            }
        });   
      }
    render() {
        var ViewList = <Text style={{textAlignVertical:'center',backgroundColor:'white', color:'#999',fontSize:14, height:50, textAlign:'center',}}>暂无关注</Text>;
        var deptRecords = null;
        var eqpRecords = null;
        var userRecords = null;
        var workRecords =null;
       
          // -----
          var i = 0;
          var j = 0;
          var listItems = [];
  
          if(this.state.imagesRequest != null && this.state.imagesRequest.length > 0){
          j = this.state.imagesRequest.length;
          i += this.state.imagesRequest.length;
          }
          if(this.state.videosRequest != null && this.state.videosRequest.length > 0){
              i += this.state.videosRequest.length;
          }
  
  
          if(this.state.imagesRequest && this.state.imagesRequest.length > 0){
          listItems =(  this.state.imagesRequest === null ? null : this.state.imagesRequest.map((imageItem, index) =>
              <View style={stylesImage.slide} key={index}>
                  {/*<TouchableOpacity style={{zIndex:1,position: 'absolute',top: 0,right: 0}} onPress={()=> this.setState({modalPictureVisible:false})}>*/}
                  <TouchableOpacity activeOpacity={1} style={{zIndex:1,flex:1}} onPress={()=> this.setState({modalPictureVisible:false})}>
                      {/*<Image source={require('../../../res/repair/ic_photo_close.png')} style={{width:20,height:25,marginRight:10,marginTop:18, }}/>*/}
                  {/*</TouchableOpacity>*/}
                      <Image resizeMode='contain' style={stylesImage.image} num={index+1} source={{uri:imageItem.filePath}} />
                      <View style={{position: 'relative',left:ScreenWidth-70,top:-40,backgroundColor:'#545658',height:22,paddingLeft:2,width:40,borderRadius:10}}><Text style={{color:'#fff',paddingLeft:5}}>{index+1}/{i}</Text></View>
                  </TouchableOpacity>
              </View>
          ))
          }
  
  
          if(this.state.videosRequest && this.state.videosRequest.length > 0){
          let videoItems =(  this.state.videosRequest === null ? null : this.state.videosRequest.map((videoItem, index) =>
              <View style={stylesImage.slide} key={index}>
                  <VideoPreview onRef={this.onRef} setModalVisible={()=> {this.setState({modalPictureVisible:false})}} num={index+1+j} sum={i} url={videoItem.filePath} fileName={videoItem.fileName} />
              </View>
          ))
          listItems = listItems.concat(videoItems);
          }
  
          if((this.state.imagesRequest == null || this.state.imagesRequest.length == 0) && (this.state.videosRequest == null || this.state.videosRequest.length == 0)){
              listItems = <View style={{width:"100%",height:"100%",backgroundColor:'#222',justifyContent:'center',alignItems:"center"}}><Text style={{color:'#666',fontSize:16}}>暂无图片</Text></View>
          }
          // ----
        if(this.props.deptRecords && this.props.deptRecords.length>0){
            deptRecords = this.props.deptRecords
            
            ViewList = <ScrollView horizontal={false} indicatorStyle={'white'} showsVerticalScrollIndicator={true} 
                        style={{height:Dimens.screen_height-40-64,width:Dimens.screen_width,flex:1}}>
                {deptRecords.map((item,i)=>{
                    return this.deptList(item,i)
                })}
            </ScrollView> 
            
        }else if(this.props.eqpRecords && this.props.eqpRecords.length>0){
            eqpRecords = this.props.eqpRecords
       
            ViewList = <ScrollView horizontal={false} indicatorStyle={'white'} showsVerticalScrollIndicator={true} 
                        style={{height:Dimens.screen_height-40-64,width:Dimens.screen_width,flex:1}}>
                    {eqpRecords.map((item,i)=>{
                        return this.eqpList(item,i)
                    })}
            </ScrollView> 
        }else if(this.props.userRecords && this.props.userRecords.length>0){
            userRecords = this.props.userRecords
            ViewList = <ScrollView horizontal={false} indicatorStyle={'white'} showsVerticalScrollIndicator={true} 
                        style={{height:Dimens.screen_height-40-64,width:Dimens.screen_width,flex:1}}>
                { userRecords.map((item,i)=>{
                    return this.userList(item,i)
                })}
            </ScrollView>
        }else if(this.props.workRecords && this.props.workRecords.length>0){
            workRecords = this.props.workRecords
           
            var newWorkList = this.workList(workRecords)
            ViewList = this.LIstDom(newWorkList)
            // this.setState({
            //     repairListData:list2,
            //     dataSource:this.state.dataSource.cloneWithRows(list2),
            // })
            // this.workChildList(newWorkList.get('list2'),2)
            // var ServiceList = <ListView
            //                 initialListSize={1}
            //                 dataSource={this.state.dataSource}
            //                 renderRow={(item) => this.LIstDom(item)}
            //                 style={{backgroundColor: 'white', flex: 1, height: 219,}}
            //                 onEndReachedThreshold={10}
            //                 enableEmptySections={true}
            //                 renderSeparator={(sectionID, rowID, adjacentRowHighlighted) =>
            //                     this._renderSeparatorView(sectionID, rowID, adjacentRowHighlighted)
            //                 }
            //             />
            // onChange={(tab,index)=>{this.setTab(tab,index)}}
            
          
              
             
            
        }
        return (
        <View style={styles.container1}>
           
            {ViewList}
            {/* <Modal
              animationType={"slide"}
              transparent={true}
              visible={this.state.modalPictureVisible}
              onRequestClose={() =>this.setState({modalPictureVisible:false})}
          >
              <View style={stylesImage.container2}>
                  <TouchableOpacity style={{height:ScreenHeight/2}} onPress={() => this.setState({modalPictureVisible:false})}>
                  </TouchableOpacity>
                  <View style={{width:ScreenWidth,height:ScreenHeight,alignItems:'center',backgroundColor:'rgba(0, 0, 0, 0.5)',justifyContent:'center'}}>
                      <Swiper
                          style={{width:ScreenWidth,height:ScreenHeight}}
                          onMomentumScrollEnd={(e, state, context) => (console.log('index:', state.index),this.setVideoCurrentTime(state.index))}
                          dot={<View style={{backgroundColor: 'rgba(0,0,0,0.2)', width: 5, height: 5, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3}} />}
                          activeDot={<View style={{backgroundColor: '#000', width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3}} />}
                          paginationStyle={{
                              bottom: -23, left: null, right: 10
                          }} loop>
                          {listItems}
                      </Swiper>
                  </View>
                  <TouchableOpacity style={{height:ScreenHeight/2}} onPress={() => this.setState({modalPictureVisible:false})}>
                  </TouchableOpacity>
              </View>
          </Modal>            */}
        </View>

    )
}

}


const styles = StyleSheet.create({
    container1: {
        flex: 1,
        marginTop:5
    },
    container2: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    list:{
        height:45,
        width:ScreenWidth,
        paddingLeft: 30,
        paddingRight: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems:'center',
        backgroundColor:'#fff',
        marginBottom: 1,
    },
    line:{
        backgroundColor:'#eeeeee',height:1,width:(Dimens.screen_width-20),marginTop:0,
    },
    leftT:{
        flexDirection:'column',
        justifyContent: 'space-between',
        alignItems:'flex-start',
    },
    leftT2:{
        flexDirection:'row',
        justifyContent: 'flex-start',
        alignItems:'center',
    },
    rightT:{
        paddingLeft:2,
        paddingRight:2,
        height:20,
        backgroundColor:'rgba(255,255,255,1)',
        borderColor: 'rgba(153,153,153,1)',
        borderWidth: 1,
        borderRadius:3,
        fontSize: 14,
        color:'#909090',
        lineHeight:20,
        textAlign:'center'
    },
    main1:{
        backgroundColor: '#fff',  
        paddingTop: 5,
        flex:2,
      }
});
const stylesImage =StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    innerContainer: {
        borderRadius: 10,
        alignItems:'center',
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
    image: {
        width:ScreenWidth,
        flex: 1,
    }
})
const modalStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 40,
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    innerContainer: {
        borderRadius: 10,
        alignItems:'center',
    },
    btnContainer:{
        width:ScreenWidth,
        height:46,
        borderRadius: 5,
        backgroundColor:'#eff0f2',
        alignItems:'center',
        paddingTop:8
    },

});