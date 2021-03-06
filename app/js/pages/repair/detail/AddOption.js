

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
    ListView,
    Modal,
    ScrollView,
    // Slider

} from 'react-native';
import { List, Radio, Flex, WhiteSpace } from '@ant-design/react-native';
import {Toast} from '../../../component/Toast'
const RadioItem = Radio.RadioItem;
import TitleBar from '../../../component/TitleBar';
import * as Dimens from '../../../value/dimens';
import Request, {GetRepairType, RepairMatterList, RepairDetail ,GetDeptListByType, GetUserListByDeptId, SaveRepairMatter} from '../../../http/Request';
import AsyncStorage from '@react-native-community/async-storage';
import { toastShort } from '../../../util/ToastUtil';
import BaseComponent from '../../../base/BaseComponent'
import Slider from "react-native-slider";
import {Loading} from '../../../component/Loading';
import RepairType from '../../../../pages/publicTool/RepairType'


export default class AddOption extends BaseComponent {
    static navigationOptions = {
        header: null,
    };
    constructor(props){
        super(props);
        this.state={
            repairId:props.navigation.state.params.repairId,
            selectMatterState:false,
            modelTitle:'',
            selectMatterPos:-1,
            selectTypePos:-1,
            dataMap:new Map(),
            processMap:new Map(),
            deptList:[],
            userList:[],
            selUserList:[],
            repairMatterList:null,
            repairTypeList:null,
            modalVisible: false,
            modalTypeVisible: false,
            theme:this.props.theme,
            selectDeptPos:-1,
            selectUserPos:-1,
            selectDeptData:null,
            selectUserData:null,
            oldItemPersonList:null,
            type:1,
            userId:null,
            modalTypeVisible2:false,
            repairParentCn : null,
            repairChildCn : null,
            repairMatterId : null,
            dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2)=> {
                    if (r1 !== r2) {

                    } else {

                    }
            return true//r1.isSelected !== r2.isSelected;
            }}),
            dataSource1: new ListView.DataSource({
                rowHasChanged: (r1, r2)=> {
                    if (r1 !== r2) {

                    } else {

                    }
            return true//r1.isSelected !== r2.isSelected;
            }}),
            listSource: new ListView.DataSource({
                rowHasChanged: (r1, r2)=> {
                    if (r1 !== r2) {

                    } else {

                    }
            return true//r1.isSelected !== r2.isSelected;
            }}),
            listSource1:new ListView.DataSource({
                rowHasChanged: (r1, r2)=> {
                    if (r1 !== r2) {

                    } else {

                    }
            return true//r1.isSelected !== r2.isSelected;
            }}),
        }

    }
    componentWillMount(){
        this.loadMainPerson();
    }
  componentDidMount() {
    this.loadRepairTypes();
    this.getRepairDetail();  
    this.getDeptListByType();
    
  }
  loadMainPerson(){
    let that = this
    var list = that.state.selUserList
    let mainPerson = {};
    AsyncStorage.getItem('uinfo', function (error, result) {
        var userInfo =  JSON.parse(result);
         that.setState({userId:userInfo.userId})
        mainPerson = {
            userName : userInfo.userName,
            process : 100,
            userId : userInfo.userId,
            telNo : userInfo.telNo,
            type : 1
        };
        
      list.push(mainPerson)
       that.setState({selUserList:list});
    })
   
    
  }
  getRepairDetail(){
    var that = this;
    Request.requestGet(RepairDetail+this.state.repairId, null, (result)=> {
        if (result && result.code === 200) {
            that.setState({
                oldItemPersonList:result.data.itemPersonList,
            });
        } else {
          
        }
    });
  }
  getDeptListByType() {
    var that = this;
    Request.requestGet(GetDeptListByType, null, (result)=> {
        if (result && result.code === 200) {
            that.setState({deptList:result.data});
        } else {

        }
    });
  }

  getUserListByDeptId() {
    var that = this;
    if (this.state.dataMap.has(this.state.selectDeptData.deptId)) {
        var list = this.state.dataMap.get(this.state.selectDeptData.deptId); 
        that.setState({userList:list, dataSource1:that.state.dataSource1.cloneWithRows(list), });
        return;
    }

    Request.requestGet(GetUserListByDeptId+this.state.selectDeptData.deptId, null, (result)=> {
        let list = []    
        if (result && result.code === 200) {
            result.data.forEach((arr,i)=>{              
            if(arr.userId != this.state.userId){             
                    list.push(arr)
                }
            })
            that.state.dataMap.set(that.state.selectDeptData.deptId, list);
            that.setState({userList:list,
                         dataSource1:that.state.dataSource1.cloneWithRows(list), });

        } else {

        }
    });
  }

    loadRepairMatterList() {
        var that = this;
        console.log('loadRepairMatterList : selectTypePos = ' + this.state.selectTypePos);
        var item = this.state.repairTypeList[this.state.selectTypePos];

        let params = {repairTypeId:item.repairTypeId, typeParentId:'', matterName:''};//item.parentId, item.repairTypeCtn
        console.log(params);
        Request.requestPost(RepairMatterList, params, (result)=> {
            console.log('loadRepairMatterList : 0');
            if (result && result.code === 200) {

                that.setState({repairMatterList:result.data,
                    listSource1:that.state.dataSource1.cloneWithRows(result.data), });
            }
      });
    }

    loadRepairTypes() {
        var that = this;
        Request.requestGet(GetRepairType, null, (result)=> {
            if (result && result.code === 200) {
                if (result.data && result.data.length) {
                    var dataList = [];
                    var items = result.data;
                    for (var i = 0; i < items.length; i++) {
                        item = items[i];
                        if (item.childrenList&&item.childrenList.length) {
                            dataList = dataList.concat(item.childrenList);
                        }
                    }

                    that.setState({repairTypeList:dataList});
                }
            }
      });
    }

  _onSure() {
    var that = this;
    if (this.state.repairMatterId == null) {
        toastShort('维修事项不能为空');
        return;
    }

    if (this.state.selUserList.length === 0) {
        toastShort('协助人不能为空');
        return;
    }

    // var matterItem = this.state.repairMatterList[this.state.selectMatterPos];
                     
    var deleteIds = [];

    var oldList = this.state.oldItemPersonList
    for(var i = 0;i < oldList.length;i++){
        deleteIds.push(oldList[i].itemAssistantId)
    }
    var itemPersonList = [];
    for (var i = 0; i < this.state.selUserList.length; i++) {
        var item = this.state.selUserList[i];
        itemPersonList.push({
                assistantId:''+item.userId, 
                repairItemId: ''+this.state.repairMatterId,
                itemPercentage:''+Math.round(item.process), 
                personType:item.type});
    }

     let params = {
            repairId: ''+this.state.repairId,
            itemPersonList: itemPersonList,
            deleteIds:deleteIds,
        };
     console.log(params);

     
     Loading.show();
     Request.requestPost(SaveRepairMatter, params, (result)=> {
        Loading.hidden();
        if (result && result.code === 200) {
            toastShort('提交成功');
            DeviceEventEmitter.emit('Event_Refresh_Detail', 'Event_Refresh_Detail');
            const {navigation} = that.props;
            that.naviGoBack(navigation);
        } else {
            if (result && result.data && result.data.error){
                toastShort(result.data.message);
            } else {
                    toastShort('提交失败，请重新尝试');
            }
        }
     });

  }

  addMan(type) {
    this.setState({
        modalVisible:true, 
        type:type,
        dataSource:this.state.dataSource.cloneWithRows(this.state.deptList),});
  }

  _hide() {
    this.setState({modalVisible:false, selectUserData:null});
  }

  submit() {
    var type = this.state.type
    if (this.state.selectUserData) {
        var list = this.state.selUserList;
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            if (item.userId === this.state.selectUserData.userId) {
                // toastShort('不能重复添加');
                Toast.show('请勿重复添加')
                return;
            }
        }

        let userInfo = {
            userName:this.state.selectUserData.userName, 
            process:0,
            userId:this.state.selectUserData.userId, 
            telNo:this.state.selectUserData.telNo,
            type:type
        };
        list.push(userInfo);
        this.setState({modalVisible:false, selectUserData:null, selUserList:list});

        return;
    }

    this.setState({modalVisible:false});
  }

  onPressUserItem(data) {

  }


  _onChange(data, i, value) {
    var selUserList = this.state.selUserList;
    data.process = value;
    selUserList[i] = data;
    this.setState({selUserList:selUserList});
    //var processMap = this.state.processMap;
    //processMap.set(i, value);
    //this.setState({processMap:processMap});
  }

  _complete() {
    //this.setState({selUserList:this.state.selUserList});
  }
  personCheck(id){
    var selUserList = this.state.selUserList;
    var list = [];
    for (var i = 0; i < selUserList.length; i++) {
        var item = selUserList[i];
        var content = {
            userId : item.userId,
            userName : item.userName,
            telNo : item.telNo,
            process : item.process,
            type : 2
        }
        item.userId == id ? content.type = 1 : content.type = 2;
        list.push(content)
    }
    this.setState({selUserList:list})
  }
  renderUserItem(data, i) {
    //console.log(data);
    //<TouchableOpacity onPress={()=>{that.onPressUserItem(data)}} style = {{marginTop:15,}}> </TouchableOpacity>
    var that = this;
    return (
        <List key={i}>    
          {/* <RadioItem key={i} checked={data.type === 1} 
            onChange={() => that.personCheck(data.userId)}> */}    
            <View key={i} style={{height:60, marginTop:15, flexDirection: 'row', justifyContent:'space-between', textAlignVertical:'center',marginLeft:0, marginRight:0, alignItems:'center',}}>
                <Image source={require('../../../../res/repair/user_wx.png')} style={{width:30,height:30,marginLeft:15}}/>
                <View style={{backgroundColor:'white', marginLeft:5, marginRight:5, textAlign:'center', paddingLeft:3, paddingRight:3, paddingTop:3, paddingBottom:3,
                    flex:1}}>
                    <View style={{flexDirection:'row',marginLeft:5,marginTop:5, }}>
                        <Text style={{color:'#000',fontSize:14, textAlignVertical:'center', }}>{data.userName}</Text>
                        <Text style={{color:'#000',fontSize:13, textAlignVertical:'center', marginLeft:20,}}>{data.telNo}</Text>
                    </View>

                    <View style={{flexDirection:'row',height:25,textAlignVertical:'center',flex:1}}>
                        <Text style={{color:'#999',fontSize:12, }}>维修占比</Text>
                        <View style={{flexDirection:'row',justifyContent:'space-between', textAlignVertical:'center'}}>
                            <Slider style={{marginLeft:10,marginTop:8,height:10,minWidth: 150}}
                            minimumValue={0}
                            maximumValue={100}
                            minimumTrackTintColor={'#3F9AED'}
                            maximumTrackTintColor={'#bbb'}
                            step={10}
                            value={data.process}
                            onSlidingComplete={this._complete}
                            onValueChange={(value)=>{that._onChange(data, i, value)}}/>
                            
                        </View>
                        <Text style={{color:'#3F9AED',fontSize:12, marginLeft:5,marginRight:15,}}>{Math.round(data.process)}%</Text>
                        
                    </View>
                </View>
                <View style={{flexDirection:'column' ,justifyContent:'center',alignItems:'flex-end', marginRight:10,width:50 }}>
                    <Text style={{color:'#000',fontSize:13, }}>{data.type && data.type === 1 ? '主修人' : ''}</Text> 
                    <TouchableOpacity onPress={() => that.personCheck(data.userId)}>
                        <Image source={data.type && data.type === 1 ? 
                            require('../../../../res/login/checkbox_pre.png') : require('../../../../res/login/checkbox_nor.png')} 
                            style={{width:18,height:18,}}/>
                    </TouchableOpacity>
                </View>
            </View>
          {/* </RadioItem> */}
        
        </List>
    );
  }



  render() {
    var selectUser = null;
    if (this.state.selUserList && this.state.selUserList.length) {

        selectUser = this.state.selUserList.map((item, i)=>this.renderUserItem(item,i));
    }

    var repairTypeName = '请选择';
    //if (this.state.selectTypePos !== -1) {
    //    repairTypeName = this.state.repairTypeList[this.state.selectTypePos].repairTypeCtn;
    //}

    if(this.state.repairParentCn != null){
        repairTypeName = this.state.repairParentCn;
    }

    var matterName = '';
    if(this.state.repairChildCn != null){
        matterName = '/' + this.state.repairChildCn;
    }

    return (
      <View style={styles.container}>
      <TitleBar
      centerText={'添加维修事项'}
      isShowLeftBackIcon={true}
      navigation={this.props.navigation}
      />

      <ScrollView horizontal={false} indicatorStyle={'white'} showsVerticalScrollIndicator={true} style={{height:Dimens.screen_height-50-64, width:Dimens.screen_width,flex:1}}>
      {/* <TouchableOpacity onPress={()=>this.selectType()}>
      <View style={{backgroundColor:'white', height:40, textAlignVertical:'center',marginLeft:0, marginRight:0, flexDirection:'row',alignItems:'center',}}>
            <Text style={{color:'#999',fontSize:14, height:40, textAlignVertical:'center', marginLeft:15,}}>维修类别</Text>
            <Text style={{color:'#666',fontSize:14, height:40, marginLeft:20,textAlignVertical:'center'}}>{repairTypeName}</Text>
            <View style={{justifyContent:'flex-end',flexDirection:'row',alignItems:'center', flex:1}}>
                                <Image source={require('../../../../res/login/ic_arrow.png')}
                                       style={{width:6,height:11,marginLeft:10, marginRight:10,}}/>

            </View>
        </View>
        </TouchableOpacity> */}
        <View style={styles.line} />
        {/* <TouchableOpacity onPress={()=>this.selectOption()}>
        <View style={{backgroundColor:'white', height:40, textAlignVertical:'center',marginLeft:0, marginRight:0, flexDirection:'row',alignItems:'center',}}>
            <Text style={{color:'#999',fontSize:14, height:40, textAlignVertical:'center', marginLeft:15,}}>维修事项</Text>
            <Text style={{color:'#666',fontSize:14, height:40, marginLeft:20,textAlignVertical:'center'}}>{matterName}</Text>
            <View style={{justifyContent:'flex-end',flexDirection:'row',alignItems:'center', flex:1}}>
                                <Image source={require('../../../../res/login/ic_arrow.png')}
                                       style={{width:6,height:11,marginLeft:10, marginRight:10,}}/>

            </View>
        </View>
        </TouchableOpacity> */}
        <View style={styles.line} />
        <TouchableOpacity onPress={()=>this.selectType2()}>
        <View style={{backgroundColor:'white', height:40, textAlignVertical:'center',marginLeft:0, marginRight:0, flexDirection:'row',alignItems:'center',}}>
            <Text style={{color:'#999',fontSize:14, height:40, textAlignVertical:'center', marginLeft:15,}}>维修事项</Text>
            <Text style={{color:'#666',fontSize:14, height:40, marginLeft:20,textAlignVertical:'center'}}>{repairTypeName}</Text>
            <Text style={{color:'#666',fontSize:14, height:40, marginLeft:0,textAlignVertical:'center'}}>{ matterName}</Text>
            <View style={{justifyContent:'flex-end',flexDirection:'row',alignItems:'center', flex:1}}>
                                <Image source={require('../../../../res/login/ic_arrow.png')}
                                       style={{width:6,height:11,marginLeft:10, marginRight:10,}}/>

            </View>
        </View>
        </TouchableOpacity>
        {selectUser}
        <TouchableOpacity onPress={()=>this.addMan(2)} style={{marginTop:25,}}>
        <View style={{height:40, backgroundColor:'white',justifyContent:'center',flexDirection:'row',alignItems:'center',marginTop:0, marginLeft:20, marginRight:20,textAlign:'center', paddingLeft:3, paddingRight:3, paddingTop:3, paddingBottom:3,
                    borderBottomRightRadius: 5,borderBottomLeftRadius: 5,borderTopLeftRadius: 5,borderTopRightRadius:5, borderWidth:1, borderColor:'#6DC5C9'}}>
                    <Image source={require('../../../../res/repair/btn_ico_tjxzr.png')} style={{width:12,height:12,marginLeft:10, marginRight:10,}}/>
                    <Text style={{color:'#6DC5C9',fontSize:14,  marginLeft:0,marginRight:10,textAlignVertical:'center'}}>添加协助人</Text>

        </View>
        </TouchableOpacity>
        
        <View style={{ height:100, }} />
        </ScrollView>
        <Text
            onPress={()=>this._onSure()}
            style={styles.button}>提交</Text>



        <Modal
            animationType={"none"}
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {}}
        >
            <View style={{top:0,height:Dimens.screen_height,width:Dimens.screen_width,backgroundColor: 'rgba(0,0,0,0.5)',alignItems:'center',justifyContent:'center',}}>
                <View style={styles.bottomStyle}>
                    <View style={styles.topStyle}>
                        <Text onPress={()=>this._hide()} style={{color:'#9b9b9b', marginLeft:10, flex:1}}>取消</Text>
                        <Text onPress={()=>this.submit()} style={{color:'#9b9b9b', marginRight:10, }}>确定</Text>
                    </View>
                    <View style={{flexDirection:'row', height:300,}}>
                    <ListView
                        initialListSize={1}
                        dataSource={this.state.dataSource}
                        renderRow={(item) => this.renderItemLeft(item)}
                        style={{backgroundColor:'white',flex:1,height:300,width:Dimens.screen_width/3,}}
                        onEndReachedThreshold={10}
                        enableEmptySections={true}
                        renderSeparator={(sectionID, rowID, adjacentRowHighlighted) =>this._renderSeparatorView(sectionID, rowID, adjacentRowHighlighted)}/>

                    <ListView
                        initialListSize={1}
                        dataSource={this.state.dataSource1}
                        renderRow={(item) => this.renderItem(item)}
                        style={{backgroundColor:'white',flex:1,height:300,width:Dimens.screen_width*2/3,}}
                        onEndReachedThreshold={10}
                        enableEmptySections={true}
                        renderSeparator={(sectionID, rowID, adjacentRowHighlighted) =>this._renderSeparatorView(sectionID, rowID, adjacentRowHighlighted)}/>

                    </View>
                </View>
            </View>

        </Modal>

        {/* <Modal
            animationType={"none"}
            transparent={true}
            visible={this.state.modalTypeVisible2}
            onRequestClose={() => {}}
        >
            <View style={{top:0,height:Dimens.screen_height,width:Dimens.screen_width,backgroundColor: 'rgba(0,0,0,0.5)',alignItems:'center',justifyContent:'center',}}>
                <View style={styles.bottomStyle}>
                    <View style={styles.topStyle}>
                        <Text onPress={()=>this.cancel()} style={{color:'#9b9b9b', marginLeft:10, flex:1}}>取消</Text>
                        <Text onPress={()=>this.submitType()} style={{color:'#9b9b9b', marginRight:10, }}>确定</Text>
                    </View>
                    <View style={{flexDirection:'row', height:300,}}>
                    <ListView
                        initialListSize={1}
                        dataSource={this.state.listSource}
                        renderRow={(item) => this.renderTypeItemLeft(item)}
                        style={{backgroundColor:'white',flex:1,height:300,width:Dimens.screen_width/3,}}
                        onEndReachedThreshold={10}
                        enableEmptySections={true}
                        renderSeparator={(sectionID, rowID, adjacentRowHighlighted) =>this._renderSeparatorView(sectionID, rowID, adjacentRowHighlighted)}/>

                    <ListView
                        initialListSize={1}
                        dataSource={this.state.listSource1}
                        renderRow={(item) => this.renderTypeItemRight(item)}
                        style={{backgroundColor:'white',flex:1,height:300,width:Dimens.screen_width*2/3,}}
                        onEndReachedThreshold={10}
                        enableEmptySections={true}
                        renderSeparator={(sectionID, rowID, adjacentRowHighlighted) =>this._renderSeparatorView(sectionID, rowID, adjacentRowHighlighted)}/>

                    </View>
                </View>
            </View>

        </Modal> */}

      <Modal
            animationType={"none"}
            transparent={true}
            visible={this.state.modalTypeVisible}
            onRequestClose={() => {}}
        >

        <View style={styles.modelStyle}>
            <View style={[styles.popupStyle, {marginTop:(Dimens.screen_height-390)/2,backgroundColor:'#fbfbfb',}]}>
                <Text style={{fontSize:16,color:'#333',marginLeft:0,marginTop:10,textAlign:'center',width:Dimens.screen_width-80, height:40}}>{this.state.modelTitle}</Text>
                <View style={{backgroundColor:'#eeeeee',height:1,width:(Dimens.screen_width-80),}} />
                <ListView
                        initialListSize={1}
                        dataSource={this.state.listSource}
                        renderRow={(item) => this.renderTypeItem(item)}
                        style={{backgroundColor:'white',flex:1,height:300,width:Dimens.screen_width-80,}}
                        onEndReachedThreshold={10}
                        enableEmptySections={true}
                        renderSeparator={(sectionID, rowID, adjacentRowHighlighted) =>this._renderSeparatorView(sectionID, rowID, adjacentRowHighlighted)}
                        />
                <View style={{backgroundColor:'transparent', flexDirection:'row',textAlignVertical:'center',alignItems:'center',}}>
                    <Text onPress={()=>this.cancel()} style={{borderBottomLeftRadius: 15,textAlignVertical:'center',backgroundColor:'#EFF0F1', color:'#333',fontSize:16, height:40, textAlign:'center', flex:1}}>取消</Text>
                    <Text onPress={()=>this.submitType()} style={{borderBottomRightRadius: 15,textAlignVertical:'center',backgroundColor:'#E1E4E8', color:'#333',fontSize:16, height:40, textAlign:'center', flex:1}}>确定</Text>
                </View>
            </View>
        </View>
    </Modal>

    <RepairType goToRepair={(repairTypeId,repairMatterId,repairParentCn,repairChildCn)=>this.newRepair(repairTypeId,repairMatterId,repairParentCn,repairChildCn)} 
                                isShowModal={()=>this.closePrairType()} 
                                modalVisible = {this.state.modalTypeVisible2}/>
    </View>


    )
}
  selectItem(){
      this.setState({
        //   dataList
      })
  }

  selectType() {
     this.setState({
         modelTitle:'选择维修类别', 
         selectMatterState:false, 
         modalTypeVisible:true, 
         listSource:this.state.listSource.cloneWithRows(this.state.repairTypeList), selectMatterPos:-1});

         
  }
  selectType2() {
    this.setState({
        modelTitle:'选择维修类别', 
        selectMatterState:false, 
        modalTypeVisible2:true, 
        listSource:this.state.listSource.cloneWithRows(this.state.repairTypeList), selectMatterPos:-1});

        
 }

  selectOption() {
     if (this.state.selectTypePos === -1) {
        toastShort('请优先选择维修类型');
        return;
     }

     this.setState({
         modelTitle:'选择维修事项', 
         selectMatterState:true, 
         modalTypeVisible:true, 
         listSource:this.state.listSource.cloneWithRows(this.state.repairMatterList), });

  }

  onPressTypeItem(data) {
    var pos = -1;

    if (this.state.selectMatterState) {
      var items = this.state.repairMatterList;

      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.repairMatterId === data.repairMatterId) {
            pos = i;
        }
    }

      this.setState({listSource:this.state.listSource.cloneWithRows(items), selectMatterPos:pos, });
    } else {
      var items = this.state.repairTypeList;
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.repairTypeId === data.repairTypeId) {
            pos = i;
        }
       }

       this.setState({listSource:this.state.listSource.cloneWithRows(items), selectTypePos:pos,});
       this.timer = setTimeout(() => {
            this.loadRepairMatterList();
        }, 200);

    }

  }

  onPressTypeItem2(data) {
    var pos = -1;

    var items = this.state.repairTypeList;
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.repairTypeId === data.repairTypeId) {
            pos = i;
        }
       }

       this.setState({listSource:this.state.listSource.cloneWithRows(items), selectTypePos:pos,});
       this.timer = setTimeout(() => {
            this.loadRepairMatterList();
        }, 200);
    return    
  }

  onPressItem2(data){
    var items = this.state.repairMatterList;

      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.repairMatterId === data.repairMatterId) {
            pos = i;
        }
    }
      this.setState({listSource1:this.state.listSource.cloneWithRows(items), selectMatterPos:pos, });
  }
  renderTypeItem(data) {
    var that = this;
    if (this.state.selectMatterState) {
        var repairMatterId = null;
        if (this.state.selectMatterPos !== -1) {
            repairMatterId = this.state.repairMatterList[this.state.selectMatterPos].repairMatterId;
        }
        return (
            <TouchableOpacity onPress={()=>{that.onPressTypeItem(data)}} style={{height:45,flex:1}}>
                <View style={{flexDirection:'row',marginLeft:15,height:45,textAlignVertical:'center',alignItems: 'center',}} >
                <Image source={repairMatterId===data.repairMatterId ? require('../../../../res/login/checkbox_pre.png') : require('../../../../res/login/checkbox_nor.png')} style={{width:18,height:18}}/>
                <Text style={{fontSize:14,color:'#777',marginLeft:15,}}>{data.matterName}</Text>
                </View>
            </TouchableOpacity>
        );
    } else {
        var repairTypeId = null;
        if (this.state.selectTypePos !== -1) {
            repairTypeId = this.state.repairTypeList[this.state.selectTypePos].repairTypeId;
        }

        return (
            <TouchableOpacity onPress={()=>{that.onPressTypeItem(data)}} style={{height:45,flex:1}}>
                <View style={{flexDirection:'row',marginLeft:15,height:45,textAlignVertical:'center',alignItems: 'center',}} >
                <Image source={repairTypeId&&repairTypeId===data.repairTypeId ? require('../../../../res/login/checkbox_pre.png') : require('../../../../res/login/checkbox_nor.png')} style={{width:18,height:18}}/>
                <Text style={{fontSize:14,color:'#777',marginLeft:15,}}>{data.repairTypeCtn}</Text>
                </View>
            </TouchableOpacity>
        );
    }

  }


  cancel() {
    if (this.state.selectMatterState) {
        this.setState({modalTypeVisible:false, selectMatterPos:-1});
        this.setState({modalTypeVisible2:false, selectMatterPos:-1});
    } else {

        this.setState({modalTypeVisible:false, selectMatterPos:-1});
        this.setState({modalTypeVisible2:false, selectMatterPos:-1});
    }
  }

  closePrairType(){
      this.setState({
        modalTypeVisible2 : false
      })
  }

  submitType() {

        if (this.state.selectMatterState) {
            if (this.state.selectMatterPos != -1) {
                this.setState({modalTypeVisible:false,modalTypeVisible2:false});
            }

        } else {
            if (this.state.selectTypePos != -1) {
                this.setState({modalTypeVisible:false,modalTypeVisible2:false });
            }
        }
  }

_renderSeparatorView(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
    return (
      <View key={`${sectionID}-${rowID}`} style={styles.separator} />
      );
  }

onPressItem(data){
    var items = this.state.userList;
    //   for (var i = 0; i < items.length; i++) {
    //     var item = items[i];
    //     if (item.id === data.id) {
    //         item.isSelected = 1;
    //     } else {
    //         item.isSelected = 0;
    //     }
    // }

    this.setState({dataSource1:this.state.dataSource1.cloneWithRows(items), selectUserData:data});
}

onPressItemLeft(data){
    var that = this;
    var items = this.state.deptList;
    //   for (var i = 0; i < items.length; i++) {
    //     var item = items[i];
    //     if (item.id === data.id) {
    //         item.isSelected = 1;
    //     } else {
    //         item.isSelected = 0;
    //     }

    // }

    //
    this.setState({dataSource:this.state.dataSource.cloneWithRows(items), selectDeptData:data});
    this.timer = setTimeout(() => {
            that.getUserListByDeptId();
        }, 200);

}
renderTypeItemLeft(data) {
    var that = this;
    console.log('++++++++++++++++++++++++++++++++++')
    // this.selectOption();
    img = <Image source={require('../../../../res/login/ic_arrow.png')} style={{width:6,height:11,marginLeft:15,marginRight:15,}}/>
    var repairTypeId = null;
    if (this.state.selectTypePos !== -1) {
        repairTypeId = this.state.repairTypeList[this.state.selectTypePos].repairTypeId;
    }
    return (
        <TouchableOpacity onPress={()=>{that.onPressTypeItem2(data)}} style={{height:45,flex:1}}>
            <View style={{flexDirection:'row',marginLeft:15,height:45,textAlignVertical:'center',alignItems: 'center',}} >
            <Text style={{fontSize:14,color:'#777',marginLeft:15,}}>{data.repairTypeCtn}</Text>
            {repairTypeId&&repairTypeId===data.repairTypeId ? img : null}
            </View>
        </TouchableOpacity>
    );
}



renderItemLeft(data) {
    var that = this;
    var color = this.state.selectDeptData&&this.state.selectDeptData.deptId===data.deptId ? '#444' : '#999';
    var img = null;
    if (this.state.selectDeptData&&this.state.selectDeptData.deptId===data.deptId) {
        img = <Image source={require('../../../../res/login/ic_arrow.png')} style={{width:6,height:11,marginLeft:15,marginRight:15,}}/>

    }
    return (
    <View key={data.id}>
    <TouchableOpacity onPress={()=>{this.onPressItemLeft(data)}} style={{height:45,flex:1,backgroundColor: '#f6f6f6',}}>
    <View style={{flexDirection:'row',marginLeft:10,height:45,textAlignVertical:'center',alignItems: 'center',}} >

    <Text style={{fontSize:14,color:color,marginLeft:15,flex:1}}>{data.deptName}</Text>
    {img}
    </View>
    </TouchableOpacity>

    </View>
    );
}
renderTypeItemRight(data) {
    var that = this;
    var repairMatterId = null;
    if (this.state.selectMatterPos !== -1) {
        repairMatterId = this.state.repairMatterList[this.state.selectMatterPos].repairMatterId;
    }
    return (
    <View key={data.id}>
        <TouchableOpacity onPress={()=>{that.onPressItem2(data)}} style={{height:45,flex:1}}>
        <View style={{flexDirection:'row',marginLeft:10,height:45,textAlignVertical:'center',alignItems: 'center',}} >
        <Image source={repairMatterId===data.repairMatterId ?
                require('../../../../res/login/checkbox_pre.png') : require('../../../../res/login/checkbox_nor.png')} 
                style={{width:18,height:18}}/>
        <Text style={{fontSize:14,color:'#777',marginLeft:15,}}>{data.matterName}</Text>
        </View>
        </TouchableOpacity>

    </View>
    );
}
renderItem(data) {
    var that = this;
    return (
    <View key={data.id}>
    <TouchableOpacity onPress={()=>{that.onPressItem(data)}} style={{height:45,flex:1}}>
    <View style={{flexDirection:'row',marginLeft:10,height:45,textAlignVertical:'center',alignItems: 'center',}} >
    <Image source={this.state.selectUserData&&this.state.selectUserData.userId===data.userId ? 
            require('../../../../res/login/checkbox_pre.png') : require('../../../../res/login/checkbox_nor.png')} 
            style={{width:18,height:18}}/>
    <Text style={{fontSize:14,color:'#777',marginLeft:15,}}>{data.userName}</Text>
    </View>
    </TouchableOpacity>

    </View>
    );
}
     //报修导航
    newRepair(repairTypeId,repairMatterId,repairParentCn,repairChildCn){
        // this.submitType();
        this.setState({modalTypeVisible2:false});
        if(repairTypeId != null && repairTypeId != ''){
            this.setState({ 
                repairParentCn: repairParentCn,
                repairChildCn: repairChildCn,
                repairMatterId: repairTypeId,
            });
        }
    }

}


const styles = StyleSheet.create({
    modelStyle:{
        flex: 1,
        width:Dimens.screen_width,
        height:Dimens.screen_height,
        backgroundColor: 'rgba(0,0,0,0.6)',
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
    },
  container: {
        flex: 1,
        backgroundColor: '#f6f6f6',
    },
    line:{
        backgroundColor:'#eeeeee',height:1,width:(Dimens.screen_width-15),marginTop:0,marginLeft:15,
    },
  button:{
    width:Dimens.screen_width,
    height:50,
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

  bottomStyle:{
    width:Dimens.screen_width,
    height:335,
    textAlign:'center',
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignSelf: 'center'
  },
  topStyle: {
        flexDirection:'row',
        fontSize:14,
        backgroundColor: '#EFF0F1',
        width:Dimens.screen_width,
        height:35,
        alignItems:'center',
    justifyContent:'center',
    textAlignVertical:'center',
    },

  separator: {
     height: 0.5,
     backgroundColor: '#eee'
 }

});
