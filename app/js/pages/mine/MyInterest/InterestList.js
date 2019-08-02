

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
import AsyncStorage from '@react-native-community/async-storage';
import * as Dimens from '../../../value/dimens';
import Request, {GetRepairList,addFollow, RepairDetail} from '../../../http/Request';
import {toDate} from '../../../util/DensityUtils'
import { Tabs,Icon, SearchBar, TabBar } from '@ant-design/react-native';
import { toastShort } from '../../../util/ToastUtil';
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
        this.loadData()
        
    }
    componentWillUpdate(){
        this.loadData()
    }
    loadData(){
        var that = this;
       const{ deptRecords} = this.props
       AsyncStorage.getItem('uinfo',function (error, result) {
        if(error){
            console.log(error)
            return
        }else{
            var userInfo =  JSON.parse(result);
            that.setState({userData:userInfo}); 
        }
        })
    }
    //关注的科室列表
    deptList(item,i){
        return <DeptList item={item} userData={this.state.userData}></DeptList>
    }
    //关注的设备列表
    eqpList(item,i){
        return <EqpList item={item} gotoEqpDetail={()=>{this.gotoEqpDetail(item.sourceId,item.sourceName)}} userData={this.state.userData}></EqpList>
       
    }
    //关注的用户列表dom
    userList(item,i){
        return <UserList item={item} userData={this.state.userData}></UserList>
        
    }
    //工单里面列表dom
    workListdom(item,type){
        
        var list = null;
        if(item.length < 1){
            list = <Text style={{textAlignVertical:'center',backgroundColor:'white', color:'#999',fontSize:14, height:50, textAlign:'center',}}>暂无关注</Text>;
        }else{
            list=item.map((data,i)=>{
                return <WorkListdom gotoDetail={()=>this.gotoDetail(data.sourceId)} bizFlag={type} item={data} userData={this.state.userData}></WorkListdom>                
            })
        }

        return list
        
    }
    //关注的工单列表类别 分类
    workList(items){
        var list1=[]
        var list2=[]
        var list3=[]     
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
    LIstDom(newWorkList){
            var list1 = newWorkList.get('list1')
            var list2 = newWorkList.get('list2')
            var list3 = newWorkList.get('list3')
        return <Tabs  tabs={worktabs} tabBarActiveTextColor={'#61C0C5'} 
                            tabBarUnderlineStyle={{backgroundColor:'#61C0C5'}}
                            initialPage={0}>
                            <View style={styles.main1}>
                                { this.workListdom(list2,1) }
                            </View>
                            <View style={styles.main1}>
                            <ScrollView style={{ backgroundColor: '#fff' }}>
                                {this.workListdom(list1,2)} 
                            </ScrollView>  
                            </View>

                            <View style={styles.main1}>
                                {this.workListdom(list3,3)}
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

      //去工单详情
    gotoEqpDetail(id,name) {
        const {navigation} = this.props;
        InteractionManager.runAfterInteractions(() => {
            navigation.navigate('EquipmentDetail',{
                theme:this.theme,
                equipmentId:id,
                equipmentName:name,
            });
        });
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
      
    render() {
        var ViewList = <Text style={{textAlignVertical:'center',backgroundColor:'white', color:'#999',fontSize:14, height:50, textAlign:'center',}}>暂无关注</Text>;
       
        const {deptRecords,eqpRecords,userRecords,workRecords} = this.props
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
        if(deptRecords){
            
           
            ViewList = <ScrollView horizontal={false} indicatorStyle={'white'} showsVerticalScrollIndicator={true} 
                        style={{height:Dimens.screen_height-40-64,width:Dimens.screen_width,flex:1}}>
                {deptRecords.map((item,i)=>{
                    return this.deptList(item,i)
                })}
            </ScrollView> 
            
        }else if(eqpRecords){
          
            ViewList = <ScrollView horizontal={false} indicatorStyle={'white'} showsVerticalScrollIndicator={true} 
                        style={{height:Dimens.screen_height-40-64,width:Dimens.screen_width,flex:1}}>
                    {eqpRecords.map((item,i)=>{
                        return this.eqpList(item,i)
                    })}
            </ScrollView> 
        }else if(userRecords){
         
            ViewList = <ScrollView horizontal={false} indicatorStyle={'white'} showsVerticalScrollIndicator={true} 
                        style={{height:Dimens.screen_height-40-64,width:Dimens.screen_width,flex:1}}>
                { userRecords.map((item,i)=>{
                    return this.userList(item,i)
                })}
            </ScrollView>
        }else if(workRecords){
         
            var newWorkList = this.workList(workRecords)
            ViewList = this.LIstDom(newWorkList)    
        }
        return (
        <View style={styles.container1}>        
            {ViewList}
        </View>

    )
}

}

class DeptList extends Component{
    constructor(props){
        super(props);
        this.state={ 
            item:{},
            ifT:true
        }
    }
    componentDidMount() {
        var that = this;
        that.loadData()  
    }
    
    loadData(){
       const{ item} = this.props
        this.setState({
            item:item
        })
    }
    followOff(focusId,focusType){
        var params = {'focusId':focusId,'focusType':focusType }  
        Request.requestPost('api/opcs/follow/off', params, (result)=> {
            console.log(this.state)
            if (result && result.code == 200) {
                this.setState({
                    ifT:false
                })
            }else{
                return
            }
        });   
    }
    addFoucus(userData,data,type){
        var sourceId = data.sourceId;
        var sourceName = data.sourceName;
        var focusType = null;
        
        if(type == 1){
         
            focusType = 2;
        }else if(type ==2){
          
            focusType = 4;
        }
        
        var params = {focusUserId:userData.userId,focusUserName:userData.userName,
                        sourceId:sourceId,sourceName:sourceName,focusType:focusType}
        Request.requestPost(addFollow,params,(res)=>{
            if(res && res.code == 200){
                this.setState({
                    ifT:true
                })
                toastShort('关注成功')
            }
        })
    } 
    render(){
        const {item,ifT} = this.state;
        const {userData} = this.props
        return(
            <View key={item.sourceId} style={styles.list}>
                <Text style={{color:'#6DC5C9',fontWeight:'400',fontSize:16}}>{item.sourceName}</Text>             
                {ifT ?<TouchableOpacity onPress={()=>this.followOff(item.focusId,2)}>
                        <Text style={styles.rightT}>√已关注</Text></TouchableOpacity>:
                     <TouchableOpacity onPress={()=>this.addFoucus(userData,item,1)}>
                        <Text style={styles.rightT}>+关注</Text></TouchableOpacity>}    
            </View>
        )
    }
}
class UserList extends Component{
    constructor(props){
        super(props);
        this.state={ 
            item:{},
            ifT:true
        }
    }
    componentDidMount() {
        var that = this;
        that.loadData()  
    }
    
    loadData(){
       const{ item} = this.props
        this.setState({
            item:item
        })
    }
    followOff(focusId,focusType){
        var params = {'focusId':focusId,'focusType':focusType }  
        Request.requestPost('api/opcs/follow/off', params, (result)=> {
            console.log(this.state)
            if (result && result.code == 200) {
                this.setState({
                    ifT:false
                })
            }else{
                return
            }
        });   
    }
    addFoucus(userData,data,type){
        var sourceId = data.sourceId;
        var sourceName = data.sourceName;
        var focusType = null;
        
        if(type == 1){
         
            focusType = 2;
        }else if(type ==2){
          
            focusType = 4;
        }
        
        var params = {focusUserId:userData.userId,focusUserName:userData.userName,
                        sourceId:sourceId,sourceName:sourceName,focusType:focusType}
        Request.requestPost(addFollow,params,(res)=>{
            if(res && res.code == 200){
                this.setState({
                    ifT:true
                })
                toastShort('关注成功')
            }
        })
    } 
    render(){
        const {item,ifT} = this.state;
        const {userData} = this.props
        return(
            <View key={item.sourceId} style={styles.list}>
                <View style={styles.leftT2}>
                    <View style={{position:'relative'}}>
                        <Image style={{width:40,height:40,borderRadius:28}} source={require("../../../../image/user_wx.png")}/>
                        {/* <Image style={{width:9,height:13,position:'absolute',right:0,bottom:0}} source={require("../../../../res/login/f.png")}/> */}
                    </View>
                    
                    <Text style={{marginLeft:5,color:'#6DC5C9',fontWeight:'400',fontSize:16}}>{item.sourceName}</Text>
                
                </View>
                {ifT ?<TouchableOpacity onPress={()=>this.followOff(item.focusId,4)}>
                        <Text style={styles.rightT}>√已关注</Text></TouchableOpacity>:
                     <TouchableOpacity onPress={()=>this.addFoucus(userData,item,2)}>
                        <Text style={styles.rightT}>+关注</Text></TouchableOpacity>}  
            </View>
        )
    }
}

class EqpList extends Component{
    constructor(props){
        super(props);
        this.state={ 
            item:{},
            ifT:true
        }
    }
    componentDidMount() {
        var that = this;
        that.loadData()  
    }
    
    loadData(){
       const{ item} = this.props
        this.setState({
            item:item
        })
    }
    followOff(focusId,focusType){
        var params = {'focusId':focusId,'focusType':focusType }  
        Request.requestPost('api/opcs/follow/off', params, (result)=> {
            console.log(this.state)
            if (result && result.code == 200) {
                this.setState({
                    ifT:false
                })
            }else{
                return
            }
        });   
    }
    addFoucus(userData,data,type){
        var sourceId = data.sourceId;
        var sourceName = data.sourceName;
        var focusType = null;
        
        
        
        var params = {focusUserId:userData.userId,focusUserName:userData.userName,
                        sourceId:sourceId,sourceName:sourceName,focusType:type}
        Request.requestPost(addFollow,params,(res)=>{
            if(res && res.code == 200){
                this.setState({
                    ifT:true
                })
                toastShort('关注成功')
            }
        })
    } 
    render(){
        const {item,ifT} = this.state;
        const {userData} = this.props
        return(
            <View key={item.sourceId} style={styles.list}>
                <TouchableOpacity onPress={()=>{this.props.gotoEqpDetail()}}>
                <View style={styles.leftT}>
                    <Text style={{color:'#6DC5C9',fontWeight:'bold',fontSize:16,marginBottom:5}}>{item.sourceName}</Text>
                    <Text style={{color:'#666',fontWeight:'400',fontSize:12}}>{item.installLocation}</Text>
                </View>
                </TouchableOpacity>
                {ifT ?<TouchableOpacity onPress={()=>this.followOff(item.focusId,3)}>
                            <Text style={styles.rightT}>√已关注</Text>
                        </TouchableOpacity>:
                     <TouchableOpacity onPress={()=>this.addFoucus(userData,item,3)}>
                        <Text style={styles.rightT}>+关注</Text></TouchableOpacity>}  
            </View>
        )
    }
}

class WorkListdom extends Component{
    constructor(props){
        super(props);
        this.state={ 
            item:{},
            ifT:true
        }
    }
    componentDidMount() {
        var that = this;
        that.loadData()  
    }
    
    loadData(){
       const{ item} = this.props
        this.setState({
            item:item
        })
    }
    followOff(focusId,focusType){
        var params = {'focusId':focusId,'focusType':focusType }  
        Request.requestPost('api/opcs/follow/off', params, (result)=> {
            console.log(this.state)
            if (result && result.code == 200) {
                this.setState({
                    ifT:false
                })
            }else{
                return
            }
        });   
    }
    addFoucus(userData,data,type){
        var sourceId = data.sourceId;
        var sourceName = data.sourceName;
        var params = {focusUserId:userData.userId,focusUserName:userData.userName,
                        sourceId:sourceId,sourceName:sourceName,focusType:type,bizFlag:this.props.bizFlag}
        Request.requestPost(addFollow,params,(res)=>{
            if(res && res.code == 200){
                this.setState({
                    ifT:true
                })
                toastShort('关注成功')
            }
        })
    } 
    
    render(){
        const {item,ifT} = this.state;
        const {userData} = this.props
        return(
            <View key={item.sourceId} style={styles.list}>
                 <TouchableOpacity onPress={()=>this.props.gotoDetail()}>
                    <View style={styles.leftT}>
                        <Text style={{color:'#333333',fontWeight:'bold',fontSize:15,}}>ID：{item.sourceId}</Text>
                        <Text style={{color:'#666',fontWeight:'400',fontSize:13}}>{item.workDeptName}</Text>
                    </View>
                </TouchableOpacity>
                {ifT ?<TouchableOpacity onPress={()=>this.followOff(item.focusId,1)}>
                        <Text style={styles.rightT}>√已关注</Text>
                        </TouchableOpacity>:
                     <TouchableOpacity onPress={()=>this.addFoucus(userData,item,1)}>
                        <Text style={styles.rightT}>+关注</Text></TouchableOpacity>}  
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
        height:60,
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
        paddingLeft:4,
        paddingRight:4,
        height:25,
        width:60,
        backgroundColor:'rgba(255,255,255,1)',
        borderColor: 'rgba(153,153,153,1)',
        borderWidth: 1,
        borderRadius:3,
        fontSize: 14,
        color:'#909090',
        lineHeight:25,
        textAlign:'center'
    },
    main1:{
        backgroundColor: '#f0f0f0',  
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