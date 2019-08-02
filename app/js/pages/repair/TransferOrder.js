import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    DeviceEventEmitter,
    TextInput,
    ListView,
    Modal,
    TouchableOpacity,
    InteractionManager,
    ScrollView
} from 'react-native';

import TitleBar from '../../component/TitleBar';
import * as Dimens from '../../value/dimens';
import Request, {GetRepairList, RepTransfer, DoTransfer, RepairDetail, GetDeptListByType, GetUserListByDeptId,listTagKeys,baseVendorList,DoOutsource,GetUserAtWorkByDeptId,userOnWork} from '../../http/Request';
import { Radio } from 'native-base';
import {Loading} from '../../component/Loading'
import { toastShort } from '../../util/ToastUtil';
import BaseComponent from '../../base/BaseComponent'

var username = '';
export default class TransferOrder extends BaseComponent {
  static navigationOptions = {
    header: null,
  };
  constructor(props){
    super(props);
      const { navigation } = this.props;
      const thisRepairId = navigation.getParam('repairId', '');
      const thisTypeCode = navigation.getParam('typeCode', '');
    this.state={
      dataMap:new Map(),
      repList:[],
      selectDeptState:false,
      repairId:thisRepairId,
      typeCode:thisTypeCode,
      detaiData:null,
      selectIndex:-1,
      modelTitle:'',
      modalVisible:false,
      modalDeptVisible:false,
      selectDeptPos:-1,
      selectUserPos:-1,
      selectDeptName:null,
      selectUserName:null,
      selectDeptData:null,
      selectUserData:null,
      selectVendorData:null,
      deptList:[],
      userList:[],
      vendorList:[],
      isInHospital: true,
      selectVendorName:null,
      modalVendorVisible:false,
      userAtWorkList:[],
      userAtWorkListMap:new Map(),
      dataSourceDept: new ListView.DataSource({
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
      dataSourcePerson: new ListView.DataSource({
        rowHasChanged: (r1, r2)=> {
            if (r1 !== r2) {

            } else {

            }
            return true//r1.isSelected !== r2.isSelected;
        }}),
      dataSourceVendor: new ListView.DataSource({
        rowHasChanged: (r1, r2)=> {
            if (r1 !== r2) {

            } else {
    
            }
            return true//r1.isSelected !== r2.isSelected;
        }}),  
    }

  }

    componentDidMount() {
        this.loadDetail();
        this.loadRep();
        this.getDeptListByType();
        this.getVendorList();
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

    getVendorList(){
        var that = this;
        var groupType = 1;
        Request.requestGet(listTagKeys + groupType, null, (result)=> {
            if (result && result.code === 200) {
                result.data.forEach(element => {
                    if(element.tagKey == "fws"){
                        Request.requestGet(baseVendorList + '?tagId=' + element.tagId, null, (resultData)=> {
                            if (resultData && resultData.code === 200) {
                                that.setState({vendorList:resultData.data.records});
                            }
                        });
                    }
                });

            }
        });
    }

    getUserListByDeptId(data) {
        var that = this;
        if (this.state.dataMap.has(data.deptId)) {
            var list = this.state.dataMap.get(data.deptId);
            that.setState({userList:list, dataSourcePerson:that.state.dataSourcePerson.cloneWithRows(list), });
            return;
        }

        Request.requestGet(GetUserListByDeptId+data.deptId, null, (result)=> {
            if (result && result.code === 200) {
                that.userListSortByAtWorkUser(data.deptId,result.data,this.state.userAtWorkList);
            } else {

            }
         
        });
    }

    
    getUserAtWorkListByDeptId(data) {
        var that = this;
        if (this.state.userAtWorkListMap.has(data.deptId)) {
            var list = this.state.userAtWorkListMap.get(data.deptId);
            that.setState({userAtWorkList:list});
            return;
        }

        Request.requestGet(GetUserAtWorkByDeptId+data.deptId, null, (result)=> {
            if (result && result.code === 200) {
                that.state.userAtWorkListMap.set(data.deptId, result.data);
                that.setState({userAtWorkList:result.data});
                that.userListSortByAtWorkUser(data.deptId,this.state.userList,result.data);
            }
        });
    }

    //在线员工展示到员工列表上层
    userListSortByAtWorkUser(deptId,userList,userAtWorkList){
        var t = [];
         for (var m = 0; m < userList.length; m++) {
            for (var n = 0; n < userAtWorkList.length; n++) {
                if(userList[m].userId == userAtWorkList[n].userId){
                    t = t.concat(userList.splice(m,1))
                }
            }
        }
        userList = t.concat(userList)
        this.state.dataMap.set(deptId, userList);
        this.setState({userList:userList, dataSourcePerson:this.state.dataSourcePerson.cloneWithRows(userList), });
    }

    _onSure() {

        var that = this;

        if(this.state.isInHospital){
            if (this.state.typeCode === 0&&(this.state.selectDeptData===null)) {
                toastShort('请选择班组');
                return;
            }
        }else{
            if (this.state.typeCode === 0&&(this.state.selectVendorData===null)) {
                toastShort('请选择厂商');
                return;
            }
        }

        

        if (this.state.selectIndex === -1) {
            toastShort('请选择转单原因');
            return;
        }

        var url = DoTransfer
        var causeIds = [];
        var items = this.state.repList;
        var repairUserId = null;
        if(this.state.selectUserData && this.state.selectUserData.userId){
        repairUserId = this.state.selectUserData.userId 
        }
        causeIds.push(items[this.state.selectIndex].causeId);

        var params = "";
        if(this.state.typeCode === 0){
            if(this.state.isInHospital){
                params = {
                    repairDeptId:this.state.selectDeptData.deptId,
                    repairUserId:repairUserId,
                    causeIds:causeIds,
                    remark:username,
                    repairId:that.state.repairId,
                    userId:global.uinfo.userId
                };
            }else{
                url = DoOutsource;
                params = {
                    vendorId: this.state.selectVendorData.vendorId,
                    vendorName: this.state.selectVendorData.fullName,
                    telNo: this.state.selectVendorData.telNo,
                    contactName: this.state.selectVendorData.contactName,
                    mobileNo: this.state.selectVendorData.mobileNo,
                    causeIds:causeIds,
                    remark:username,
                    repairId:that.state.repairId,
                    userId:global.uinfo.userId
                }
            }

            
        }else{
            params = {
                repairDeptId:this.state.detaiData.deptId,
                repairUserId:this.state.detaiData.ownerId,
                causeIds:causeIds,
                remark:username,
                repairId:that.state.repairId,
                userId:global.uinfo.userId
            };
        }
        console.log(params)
        Loading.show();
        Request.requestPost(url, params, (result)=> {
            Loading.hidden();
            if (result && result.code === 200) {
                toastShort('提交成功');
                // this.props.navigation.state.params.callback();
                // this.props.navigation.goBack();
                const {navigation} = this.props;
                InteractionManager.runAfterInteractions(() => {
                    navigation.navigate('WorkManager',{
                            theme:this.theme
                            })
                });
            } else {

            }
        });

    }


    loadDetail() {
        var that = this;
        Request.requestGet(RepairDetail+this.state.repairId, null, (result)=> {
            if (result && result.code === 200) {
                that.setState({detaiData:result.data});
            } else {

            }
        });
    }

    loadRep() {
        var that = this;
        Request.requestGet(RepTransfer, null, (result)=> {
            if (result && result.code === 200) {
                this.setState({repList: result.data});
            } else {

            }
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
        return (<Text onPress={()=>{this.onPressRepItem(data, i)}} key={i} style={{width:(Dimens.screen_width-130)/3,flexWrap:'nowrap', marginLeft:10,
                color:(this.state.selectIndex===i?'#369CED':'#333333'),fontSize:11, height:35, marginTop:10,
                textAlignVertical:'center', textAlign:'center',borderWidth:1, borderColor:(this.state.selectIndex===i?'#369CED':'#999999'),
                    borderBottomRightRadius:5,borderBottomLeftRadius:5,borderTopLeftRadius:5,borderTopRightRadius:5, paddingLeft:5, paddingRight:5}}>{data.causeCtn}</Text>
        );
    }

    addMan() {
        this.setState({
            modalDeptVisible:true,
            dataSourceDept:this.state.dataSourceDept.cloneWithRows(this.state.deptList),});
    }

    showVendorList(){
        this.setState({
            modalVendorVisible:true,
            dataSourceVendor:this.state.dataSourceVendor.cloneWithRows(this.state.vendorList)
        });
    }

    _hide() {
        this.setState({modalDeptVisible:false, selectUserData:null});
    }

    _vendorHide() {
        this.setState({modalVendorVisible:false});
    }


    vendorSubmit() {
        this.setState({modalVendorVisible:false});
    }

    renderItemVendor(data) {
        var color = 'none';
        var backColor = 'none';
        if (this.state.selectVendorData&&this.state.selectVendorData.vendorId===data.vendorId) {
            color = '#444';
            backColor = 'rgba(0,0,0,0.1)';
        }else{
            backColor = '#f6f6f6';
            color = '#999';
        }


        return (
            <View key={data.id}>
                <TouchableOpacity onPress={()=>{this.onPressItemVendor(data)}} style={{height:45,flex:1,backgroundColor: backColor}}>
                    <View style={{flexDirection:'row',marginLeft:10,height:45,textAlignVertical:'center',alignItems: 'center'}} >
                        <Text style={{fontSize:14,color:color,flex:1,textAlignVertical:'center',alignItems: 'center',textAlign:'center'}}>{data.fullName}</Text>
                    </View>
                </TouchableOpacity>

            </View>
        );
    }

    onPressItemVendor(data){
        var that = this;
        var items = this.state.vendorList;
        console.log(JSON.stringify(data))
        this.setState({dataSourceVendor:this.state.dataSourceVendor.cloneWithRows(items), 
            selectVendorData:data,selectVendorName:data.fullName});

    }

    renderItemLeft(data) {
        var that = this;
        var color = this.state.selectDeptData&&this.state.selectDeptData.deptId===data.deptId ? '#444' : '#999';
        var img = null;
        if (this.state.selectDeptData&&this.state.selectDeptData.deptId===data.deptId) {
            img = <Image source={require('../../../res/login/ic_arrow.png')} style={{width:6,height:11,marginLeft:15,marginRight:15,}}/>

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
    onPressItemLeft(data){
        var that = this;
        var items = this.state.deptList;
        console.log(JSON.stringify(data))
        this.setState({dataSourceDept:this.state.dataSourceDept.cloneWithRows(items), 
            selectDeptData:data,selectDeptName:data.deptName,selectUserData:null,selectUserName:null
        });
        // this.timer = setTimeout(() => {
            that.getUserListByDeptId(data);
            that.getUserAtWorkListByDeptId(data);
        // }, 200);

    }
    renderItemRight(data) {
        var that = this;

        var userAtWorkImage = <Image source={require('../../../image/no_online.png')} style={{width:18,height:18,marginRight:10}}/>;
        this.state.userAtWorkList.find(item=>{
            if(item.userId == data.userId){
                userAtWorkImage = <Image source={require('../../../image/online.png')} style={{width:18,height:18,marginRight:10}}/>
            }
        })

        return (
            <View key={data.id}>
                <TouchableOpacity onPress={()=>{that.onPressItemRight(data)}} style={{height:45,flex:1}}>
                    <View style={{flexDirection:'row',marginLeft:10,height:45,textAlignVertical:'center',alignItems: 'center',}} >
                        <Image source={this.state.selectUserData&&this.state.selectUserData.userId===data.userId ? require('../../../res/login/checkbox_pre.png') : require('../../../res/login/checkbox_nor.png')} style={{width:18,height:18}}/>
                        <Text style={{fontSize:14,color:'#777',marginLeft:15,flex:1}}>{data.userName}</Text>
                        {userAtWorkImage}
                    </View>
                </TouchableOpacity>

            </View>
        );
    }
    onPressItemRight(data){
        var items = this.state.userList;
        this.setState({dataSourcePerson:this.state.dataSourcePerson.cloneWithRows(items), 
                        selectUserData:data,selectUserName:data.userName});
    }

    submit() {
        this.setState({modalDeptVisible:false});
    }

  render() {
    var repDatas = null;
    if (this.state.repList) {
        repDatas = this.state.repList.map((item, i)=>this.renderRepItem(item,i));
    }

    var detaiData = this.state.detaiData;
    var detailAddress = null;
    var matterName = null;
    var repairNo = null;
    var createTime = null;
    var repairHours = null;
    var repairUserName = null;
    var parentTypeName = null;

    if (detaiData) {
        detailAddress = detaiData.detailAddress;
        matterName = detaiData.matterName;
        repairNo = detaiData.repairNo;
        createTime = new Date(detaiData.createTime).format("yyyy-MM-dd hh:mm:ss");

        if (detaiData.repairHours) {
            repairHours = detaiData.repairHours+'小时';
        }

        repairUserName = detaiData.repairUserName + '   ' + detaiData.telNo;
        parentTypeName = detaiData.parentTypeName;
    }

    return (
      <View style={styles.container}>
          {this.state.typeCode === 0 &&
              <TitleBar
                  centerText={'转单'}
                  isShowLeftBackIcon={true}
                  navigation={this.props.navigation}
              />
          }
          {this.state.typeCode === 1 &&
              <TitleBar
                  centerText={'拒绝'}
                  isShowLeftBackIcon={true}
                  navigation={this.props.navigation}
              />
          }
          <ScrollView horizontal={false} indicatorStyle={'white'} showsVerticalScrollIndicator={true} style={{height:Dimens.screen_height-40-64, width:Dimens.screen_width,flex:1}}>
          {this.state.typeCode === 0 &&
              <View>
                  <View style={{flexDirection:'row',alignItems: 'center',paddingTop:15,paddingLeft:15}}>
                        <Radio onPress={()=>(this.setState({isInHospital:true}))} style={{marginRight:5}} color={"#999"}
                            selectedColor={"#999"} selected={this.state.isInHospital == true} ></Radio><Text>院内转单</Text>
                        <Radio onPress={()=>(this.setState({isInHospital:false}))} style={{marginLeft:20,marginRight:5}} color={"#999"}
                                    selectedColor={"#999"} selected={this.state.isInHospital == false}></Radio><Text>院外转单</Text>
                  </View>

                  {this.state.isInHospital === true ? 
                    <View>
                        <Text style={{color:'#999',fontSize:14, height:40, textAlignVertical:'center',paddingLeft:15,}}>请选择维修对象</Text>
                        <TouchableOpacity onPress={()=>{this.addMan()}} style={{height:40}}>
                            <View style={{backgroundColor:'white', height:40, textAlignVertical:'center',marginLeft:15, marginRight:15, flexDirection:'row',alignItems:'center',}}>
                                <Text style={{color:'#999',fontSize:14, height:40, textAlignVertical:'center', marginLeft:10,}}>班组对象</Text>
                                <Text style={{color:'#333',fontSize:14, height:40, marginLeft:20,textAlignVertical:'center'}}>{this.state.selectDeptName } {this.state.selectUserName}</Text>
                                <View style={{justifyContent:'flex-end',flexDirection:'row',alignItems:'center', flex:1}}>
                                    <Image source={require('../../../res/login/ic_arrow.png')}
                                           style={{width:6,height:11,marginLeft:10, marginRight:10,}}/>

                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                    :
                    <View>
                        <Text style={{color:'#999',fontSize:14, height:40, textAlignVertical:'center',paddingLeft:15}}>请选择厂商</Text>
                        <TouchableOpacity onPress={()=>{this.showVendorList()}} style={{height:40}}>
                            <View style={{backgroundColor:'white', height:40, textAlignVertical:'center',marginLeft:15, marginRight:15, flexDirection:'row',alignItems:'center',}}>
                                <Text style={{color:'#999',fontSize:14, height:40, textAlignVertical:'center', marginLeft:10,}}>服务商</Text>
                                <Text style={{color:'#333',fontSize:14, height:40, marginLeft:20,textAlignVertical:'center'}}>{this.state.selectVendorName}</Text>
                                <View style={{justifyContent:'flex-end',flexDirection:'row',alignItems:'center', flex:1}}>
                                    <Image source={require('../../../res/login/ic_arrow.png')}
                                           style={{width:6,height:11,marginLeft:10, marginRight:10,}}/>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                  }

                  <Text style={{color:'#999',fontSize:14, height:40, textAlignVertical:'center',paddingLeft:15,}}>请选择转单原因</Text>
              </View>
          }
          {this.state.typeCode===1 &&
                <Text style={{color:'#999',fontSize:14, height:40, textAlignVertical:'center',paddingLeft:15,}}>请选择拒绝原因</Text>
          }

        <View style={styles.listViewStyle}>
                  {repDatas}
        </View>

        <TextInput
            style={styles.input_style}
            placeholder="原因描述…"
            placeholderTextColor="#aaaaaa"
            underlineColorAndroid="transparent"
            multiline = {true}
            ref={'username'}
            autoFocus={true}
            onChangeText={(text) => {
            username = text;
            }}
        />
          </ScrollView>

          <Text
            onPress={()=>this._onSure()}
            style={styles.button}>确定</Text>


          <Modal
              animationType={"none"}
              transparent={true}
              visible={this.state.modalDeptVisible}
              onRequestClose={() =>this.setState({modalDeptVisible:false})}
          >
              <View style={{top:0,height:Dimens.screen_height,width:Dimens.screen_width,backgroundColor: 'rgba(0,0,0,0.5)',alignItems:'center',justifyContent:'center',}}>
                  <View style={stylesDept.bottomStyle}>
                      <View style={stylesDept.topStyle}>
                          <Text onPress={()=>this._hide()} style={{color:'#9b9b9b', marginLeft:10, flex:1}}>取消</Text>
                          <Text onPress={()=>this.submit()} style={{color:'#9b9b9b', marginRight:10, }}>确定</Text>
                      </View>
                      <View style={{flexDirection:'row', height:300,}}>
                          <ListView
                              initialListSize={1}
                              dataSource={this.state.dataSourceDept}
                              renderRow={(item) => this.renderItemLeft(item)}
                              style={{backgroundColor:'white',flex:1,height:300,width:Dimens.screen_width/3,}}
                              onEndReachedThreshold={10}
                              enableEmptySections={true}
                              renderSeparator={(sectionID, rowID, adjacentRowHighlighted) =>this._renderSeparatorView(sectionID, rowID, adjacentRowHighlighted)}/>

                          <ListView
                              initialListSize={1}
                              dataSource={this.state.dataSourcePerson}
                              renderRow={(item) => this.renderItemRight(item)}
                              style={{backgroundColor:'white',flex:1,height:300,width:Dimens.screen_width*2/3,}}
                              onEndReachedThreshold={10}
                              enableEmptySections={true}
                              renderSeparator={(sectionID, rowID, adjacentRowHighlighted) =>this._renderSeparatorView(sectionID, rowID, adjacentRowHighlighted)}/>

                      </View>
                  </View>
              </View>
          </Modal>


          <Modal
              animationType={"none"}
              transparent={true}
              visible={this.state.modalVendorVisible}
              onRequestClose={() =>this.setState({modalVendorVisible:false})}
          >
              <View style={{top:0,height:Dimens.screen_height,width:Dimens.screen_width,backgroundColor: 'rgba(0,0,0,0.5)',alignItems:'center',justifyContent:'center',}}>
                  <View style={stylesDept.bottomStyle}>
                      <View style={stylesDept.topStyle}>
                          <Text onPress={()=>this._vendorHide()} style={{color:'#9b9b9b', marginLeft:10, flex:1}}>取消</Text>
                          <Text onPress={()=>this.vendorSubmit()} style={{color:'#9b9b9b', marginRight:10, }}>确定</Text>
                      </View>
                      <View style={{flexDirection:'row', height:300,}}>
                          <ListView
                              initialListSize={1}
                              dataSource={this.state.dataSourceVendor}
                              renderRow={(item) => this.renderItemVendor(item)}
                              style={{backgroundColor:'white',flex:1,height:300,width:Dimens.screen_width}}
                              onEndReachedThreshold={10}
                              enableEmptySections={true}
                              renderSeparator={(sectionID, rowID, adjacentRowHighlighted) =>this._renderSeparatorView(sectionID, rowID, adjacentRowHighlighted)}/>

                      </View>
                  </View>
              </View>

          </Modal>


      </View>
    )
  }


  _renderSeparatorView(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
    return (
      <View key={`${sectionID}-${rowID}`} style={styles.separator} />
    );
  }
}


const styles = StyleSheet.create({
listViewStyle:{
        // 主轴方向
        flexDirection:'row',
        // 一行显示不下,换一行
        flexWrap:'wrap',
        // 侧轴方向
        alignItems:'center', // 必须设置,否则换行不起作用
        width:Dimens.screen_width-10,
    },

    container: {
        flex: 1,
        backgroundColor: '#f6f6f6',
    },

    welcome:{
        color:'#123456',

    },
    line:{
        backgroundColor:'#eeeeee',height:1,width:(Dimens.screen_width-20),marginTop:0,marginLeft:20,
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
    // position: 'absolute',
    // bottom: 0,
    // left: 0,
    // right: 0,
    alignSelf: 'center'
  },
  input_style:{
        paddingVertical: 0,marginTop:10, textAlignVertical:'top', textAlign:'left',backgroundColor: 'white',fontSize: 14,height:80, marginLeft:15,marginRight:15, paddingLeft:8,paddingRight:8,paddingTop:5,paddingBottom:5,
    },
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
        backgroundColor: 'white',
    },
    separator: {
       height: 1,
       backgroundColor: '#f6f6f6'
    },
});
const stylesDept = StyleSheet.create({
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
        // position: 'absolute',
        // bottom: 0,
        // left: 0,
        // right: 0,
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