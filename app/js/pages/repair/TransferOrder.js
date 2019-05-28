

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
    TouchableOpacity
} from 'react-native';

import TitleBar from '../../component/TitleBar';
import * as Dimens from '../../value/dimens';
import Request, {GetRepairList, RepTransfer, DoTransfer, RepairDetail, GetDeptListByType, GetUserListByDeptId} from '../../http/Request';
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
      selectDeptPos:-1,
      selectUserPos:-1,
      selectDeptName:null,
      selectUserName:null,
      deptList:[],
      userList:[],
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
      this.loadDetail();
      this.loadRep();
      this.getDeptListByType();
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
    if (!this.state.deptList) {
        toastShort('部门列表未加载');
      return;
    }

    var that = this;
    var dept = this.state.deptList[this.state.selectDeptPos];
    if (this.state.dataMap.has(dept.deptId)) {
        var list = this.state.dataMap.get(dept.deptId);
        that.setState({userList:list, });
        return;
    }

    Request.requestGet(GetUserListByDeptId+dept.deptId, null, (result)=> {
        if (result && result.code === 200) {
            that.state.dataMap.set(dept.deptId, result.data);
            that.setState({userList:result.data});
        } else {

        }
    });
  }

  _onSure() {

    var that = this;
    if (this.state.selectDeptPos === -1 && this.state.typeCode === 0 ) {
        toastShort('请选择班组');
        return;
    }

    if (this.state.selectUserPos === -1 && this.state.typeCode === 0 ) {
        toastShort('请选择维修人员');
        return;
    }

    if (this.state.selectIndex === -1) {
        toastShort('请选择转单原因');
        return;
    }

      var causeIds = [];
      var items = this.state.repList;

      causeIds.push(items[this.state.selectIndex].causeId);

    var params = "";
    if(this.state.typeCode === 0){
        params = {
            repairDeptId:this.state.deptList[this.state.selectDeptPos].deptId,
            repairUserId:this.state.userList[this.state.selectUserPos].userId,
            causeIds:causeIds,
            remark:username,
            repairId:that.state.repairId,
            userId:global.uinfo.userId
        };
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
    Loading.show();
    Request.requestPost(DoTransfer, params, (result)=> {
        Loading.hidden();
        if (result && result.code === 200) {
            toastShort('提交成功');
            const {navigation} = that.props;
            that.naviGoBack(navigation);
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
          {this.state.typeCode === 0 &&
              <View>
                  <Text style={{color:'#999',fontSize:14, height:40, textAlignVertical:'center',paddingLeft:15,}}>请选择维修人员</Text>
                  <TouchableOpacity onPress={()=>{this.selectDept()}} style={{height:40}}>
                      <View style={{backgroundColor:'white', height:40, textAlignVertical:'center',marginLeft:15, marginRight:15, flexDirection:'row',alignItems:'center',}}>
                          <Text style={{color:'#999',fontSize:14, height:40, textAlignVertical:'center', marginLeft:10,}}>班组</Text>
                          <Text style={{color:'#333',fontSize:14, height:40, marginLeft:20,textAlignVertical:'center'}}>{this.state.selectDeptName}</Text>
                          <View style={{justifyContent:'flex-end',flexDirection:'row',alignItems:'center', flex:1}}>
                              <Image source={require('../../../res/login/ic_arrow.png')}
                                     style={{width:6,height:11,marginLeft:10, marginRight:10,}}/>

                          </View>
                      </View>
                  </TouchableOpacity>
                  <View style={styles.line} />
                  <TouchableOpacity onPress={()=>{this.selectUser()}} style={{height:40}}>
                      <View style={{backgroundColor:'white', height:40, textAlignVertical:'center',marginLeft:15, marginRight:15, flexDirection:'row',alignItems:'center',}}>
                          <Text style={{color:'#999',fontSize:14, height:40, textAlignVertical:'center', marginLeft:10,}}>人员</Text>
                          <Text style={{color:'#333',fontSize:14, height:40, marginLeft:20,textAlignVertical:'center'}}>{this.state.selectUserName}</Text>
                          <View style={{justifyContent:'flex-end',flexDirection:'row',alignItems:'center', flex:1}}>
                              <Image source={require('../../../res/login/ic_arrow.png')}
                                     style={{width:6,height:11,marginLeft:10, marginRight:10,}}/>

                          </View>
                      </View>
                  </TouchableOpacity>
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


          <Text
            onPress={()=>this._onSure()}
            style={styles.button}>确定</Text>

      <Modal
            animationType={"none"}
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {}}
        >

        <View style={styles.modelStyle}>
            <View style={[styles.popupStyle, {marginTop:(Dimens.screen_height-390)/2,backgroundColor:'#fbfbfb',}]}>
                <Text style={{fontSize:16,color:'#333',marginLeft:0,marginTop:10,textAlign:'center',width:Dimens.screen_width-80, height:40}}>{this.state.modelTitle}</Text>
                <View style={{backgroundColor:'#eeeeee',height:1,width:(Dimens.screen_width-80),}} />
                <ListView
                        initialListSize={1}
                        dataSource={this.state.dataSource}
                        renderRow={(item) => this.renderItem(item)}
                        style={{backgroundColor:'white',flex:1,height:300,width:Dimens.screen_width-80,}}
                        onEndReachedThreshold={10}
                        enableEmptySections={true}
                        renderSeparator={(sectionID, rowID, adjacentRowHighlighted) =>this._renderSeparatorView(sectionID, rowID, adjacentRowHighlighted)}
                        />
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


  selectDept() {
        this.setState({modelTitle:'选择班组', selectDeptState:true, modalVisible:true, dataSource:this.state.dataSource.cloneWithRows(this.state.deptList), });
  }

  selectUser() {
    if (this.state.selectDeptPos === -1) {
        toastShort('请先选择班组');
        return;
    }

    this.setState({modelTitle:'选择人员', selectDeptState:false, modalVisible:true, dataSource:this.state.dataSource.cloneWithRows(this.state.userList), });
  }

  cancel() {
    if (this.state.selectDeptState) {
        this.setState({modalVisible:false, selectDeptPos:-1});
    } else {

        this.setState({modalVisible:false, selectUserPos:-1, });
    }
  }

  submit() {

        if (this.state.selectDeptState) {
            if (this.state.selectDeptPos != -1) {
              var dept = this.state.deptList[this.state.selectDeptPos];
                this.setState({modalVisible:false, selectDeptName:dept.deptName,selectUserPos:-1, selectUserName:null});
                this.getUserListByDeptId();
            }

        } else {
            if (this.state.selectUserPos != -1) {
              var user = this.state.userList[this.state.selectUserPos];
                this.setState({modalVisible:false, selectUserName:user.userName});
            }
        }
  }

  _renderSeparatorView(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
    return (
      <View key={`${sectionID}-${rowID}`} style={styles.separator} />
    );
  }



  onPressItem(data) {
    var pos = 0;

    if (this.state.selectDeptState) {
      var items = this.state.deptList;

      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.deptId === data.deptId) {
            pos = i;
        }
    }

      this.setState({dataSource:this.state.dataSource.cloneWithRows(items), selectDeptPos:pos, });
    } else {
      var items = this.state.userList;
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.userId === data.userId) {
            pos = i;
        }
       }

       this.setState({dataSource:this.state.dataSource.cloneWithRows(items), selectUserPos:pos, });
    }

  }


  renderItem(data) {
    var that = this;
    if (this.state.selectDeptState) {
        var dept = null;
        if (this.state.selectDeptPos !== -1) {
            dept = this.state.deptList[this.state.selectDeptPos];
        }
        return (
            <TouchableOpacity onPress={()=>{that.onPressItem(data)}} style={{height:45,flex:1}}>
                <View style={{flexDirection:'row',marginLeft:15,height:45,textAlignVertical:'center',alignItems: 'center',}} >
                <Image source={dept&&dept.deptId===data.deptId ? require('../../../res/login/checkbox_pre.png') : require('../../../res/login/checkbox_nor.png')} style={{width:18,height:18}}/>
                <Text style={{fontSize:14,color:'#777',marginLeft:15,}}>{data.deptName}</Text>
                </View>
            </TouchableOpacity>
        );
    } else {

        var user = null;
        if (this.state.selectUserPos !== -1) {
            user = this.state.userList[this.state.selectUserPos];
        }
        return (
            <TouchableOpacity onPress={()=>{that.onPressItem(data)}} style={{height:45,flex:1}}>
                <View style={{flexDirection:'row',marginLeft:15,height:45,textAlignVertical:'center',alignItems: 'center',}} >
                <Image source={user&&user.userId===data.userId ? require('../../../res/login/checkbox_pre.png') : require('../../../res/login/checkbox_nor.png')} style={{width:18,height:18}}/>
                <Text style={{fontSize:14,color:'#777',marginLeft:15,}}>{data.userName}</Text>
                </View>
            </TouchableOpacity>
        );
    }

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
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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
