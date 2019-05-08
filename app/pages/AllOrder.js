import React, { Component } from 'react';
import {
    Image,
    Dimensions,
    StyleSheet,
    Modal,
    TouchableHighlight,
    TouchableOpacity,
    View,
    Alert,
} from 'react-native';
import {  Footer,FooterTab,Item,Input,Button,Icon, Tabs, Tab , Col, Row, Container, Content, Header, Left, Body, Right, Text, List, ListItem, Thumbnail} from 'native-base';
import Axios from '../util/Axios';
import OrderType from './publicTool/OrderType'
import OrderItem from './publicTool/OrderItem';
import AsyncStorage from '@react-native-community/async-storage';
import moment from "moment";



let ScreenWidth = Dimensions.get('window').width;
let dialogWidth = ScreenWidth-80;
class AllOrder extends Component {


    static navigationOptions = {
        header: null,
    };
    constructor(props) {

            super(props);
            this.state = { modalVisible: false,
                typeVisible:false,
                searchVisible: true,
                tab1:0,
                tab2:0,
                tab3:0,
                recordList1:[],
                recordList2:[],
                recordList3:[],
                cdTimeList:[],
             };
            this.getRepairList();
    }

    getRepairList(){
        let repRepairInfo = {
                    page: 1,
                    limit: 10000,
                    deptId: '1078386763486683138',
                    ownerId: '',
                    status: ''
                 }
        var    data1=repRepairInfo;
        var    data2=repRepairInfo;
        var    data3=repRepairInfo;
               data3.status='9,10,11';
        var url1 = "/api/repair/request/list/underway?page="+repRepairInfo.page+"&limit="+repRepairInfo.limit+"&deptId="+repRepairInfo.deptId;
        var url2 = "/api/repair/request/list/evaluate?page="+repRepairInfo.page+"&limit="+repRepairInfo.limit+"&deptId="+repRepairInfo.deptId;
        var url3 = "/api/repair/request/list?page="+repRepairInfo.page+"&limit="+repRepairInfo.limit+"&deptId="+repRepairInfo.deptId+"&status="+data3.status;
        Axios.GetAxios(url1).then(
            (response) => {
                if(Array.isArray(response.data)){
                    this.setState({recordList1:[],tab1:0});
                }else{
                    var records1 = response.data.records;
                    console.log("当前订单");
                    console.log(records1);
                    this.setState({recordList1:records1,tab1:records1.length});
                }
            }
        )
        Axios.GetAxios(url2).then(
            (response) => {
                if(Array.isArray(response.data)){
                    this.setState({recordList2:[],tab2:0});
                }else{
                    var records2 = response.data.records;
                    this.setState({recordList2:records2,tab2:records2.length});
                }
            }
        )
        Axios.GetAxios(url3).then(
            (response) => {
                if(Array.isArray(response.data)){
                    this.setState({recordList3:[],tab3:0});
                }else{
                    var records3 = response.data.records;
                    this.setState({recordList3:records3,tab3:records3.length});
                }
            }
        )
    }

    goBack(){
        const { navigate } = this.props.navigation;
        this.props.navigation.goBack();
    }
    _setTypeVisible() {
       this.setState({typeVisible: !this.state.typeVisible});
    }


    goSearch(getRepairList){
        const { navigate } = this.props.navigation;
        navigate('OrderSearch',{
            callback: (
                () => {
                        setTimeout(function(){
                            getRepairList();
                        },500)
                })
        })
    }

    onClose() {
       this.setState({modalVisible: false});
    }
//催单
    _setModalVisible(repairId,sendDeptId,sendUserId) {

        if(!this.state.modalVisible){
            var cdTimeList =[];
            AsyncStorage.getItem('cdTimeHistory',function (error, result) {
                    if (error) {
                         console.log('读取失败')
                    }else {
                        cdTimeList = JSON.parse(result);
                        var cdInfo = "";
                        cdTimeList.forEach(function(item){
                            if(item.repairId==repairId&&item.sendDeptId==sendDeptId&&item.sendUserId==sendUserId){
                                cdInfo = item;
                            }
                        })
                        if(cdInfo==""){
                            this.gotoCuiDan(cdTimeList,repairId,sendDeptId,sendUserId);
                        }else{
                            var oldTime = moment(cdInfo.currentTime);
                            var nowDate = moment();
                            var timeDiff = moment(nowDate.diff(oldTime)).minute();
                            if(timeDiff>30){
                                var cdTimeListNew = [];
                                cdTimeList.forEach(function(item){
                                    if(item.repairId==repairId&&item.sendDeptId==sendDeptId&&item.sendUserId==sendUserId){
                                    }else{
                                    cdTimeListNew.push(item);
                                    }
                                })
                                this.gotoCuiDan(cdTimeListNew,repairId,sendDeptId,sendUserId);
                            }else{
                                Alert.alert("过"+(30-timeDiff)+"分钟后再次催单");
                            }
                        }
                    }
                }.bind(this)
            )
        }else{
            this.setState({modalVisible: false})
            }
    }
//催单接口调用
    gotoCuiDan(cdTimeList,repairId,sendDeptId,sendUserId){
        var currentTime = moment();
        var newCuiDanInfo = {
            currentTime: currentTime,
            repairId:repairId,
            sendDeptId:sendDeptId,
            sendUserId:sendUserId,
        }
        cdTimeList.push(newCuiDanInfo);
        this.setState({cdTimeList:cdTimeList});
        this.saveCdTime();
        var url= '/api/repair/request/remind';
        var data = {
                  repairId: repairId,
                  sendDeptId: sendDeptId,
                  sendUserId: sendUserId
               }
        var headers={
                'Content-type': 'application/json',
            }
        Axios.PostAxios(url,data,headers).then(
            (response) => {
                this.setState({modalVisible: true});
                }
        )
    }

//催单时间缓存记录
    saveCdTime(){
        let key = 'cdTimeHistory';
        var cdTimeList = this.state.cdTimeList;
        //json转成字符串
        let jsonStr = JSON.stringify(cdTimeList);
        //存储
        AsyncStorage.setItem(key, jsonStr, function (error) {
            if (error) {
                console.log('存储失败')
            }else {
                console.log('存储完成')
            }
        })
    }
    getCdTime(){
        var cdTimeList =[]
        AsyncStorage.getItem('cdTimeHistory',function (error, result) {
                if (error) {
                     console.log('读取失败')
                }else {
                    cdTimeList = JSON.parse(result);
                    this.setState({cdTimeList:cdTimeList});
                }
            }.bind(this)
        )
        return cdTimeList;
    }


    _setSearchVisible(visible) {
      this.setState({searchVisible: visible});
    }

    _setOrderItem(recordListTy,ty,getRepairList){
        let recordList = [];
            recordList = recordListTy;
        let listItems =(  recordList === null ? null : recordList.map((record, index) =>
            <OrderItem key={index} getRepairList={()=>this.getRepairList()}  type={ty} getEvaluate={()=>this.getEvaluate(record,()=>getRepairList())} record={record} ShowModal = {(repairId,sendDeptId,sendUserId) => this._setModalVisible(repairId,sendDeptId,sendUserId)}/>
        ))
        return listItems;
    }
    getEvaluate(record,getRepairList){
        const { navigate } = this.props.navigation;
        navigate('Evaluate', {
            record: record,
            callback: (
                () => {
                    setTimeout(function(){
                        getRepairList();
                    },500)
                }
            ),
        })
    }

//报修导航
    newRepair(repairTypeId,repairMatterId,getRepairList){
        this.setState({typeVisible: !this.state.typeVisible});
        const { navigate } = this.props.navigation;
        navigate('Repair',{
            repairTypeId:repairTypeId,
            repairMatterId:repairMatterId,
            callback: (
                () => {
                    setTimeout(function(){
                        getRepairList();
                    },500)
                })
        })
    }


  render() {
    return (
      <Container>
        <Content>
            <Row>
                    <TouchableHighlight style={{width:'10%',height:50}} onPress={()=>this.goBack()}>
                        <Image style={{width:12,height:25,margin:13}} source={require("../image/navbar_ico_back.png")}/>
                    </TouchableHighlight>
                    <Button  onPress={()=>this.goSearch(()=>this.getRepairList())} transparent style={{width:'75%',backgroundColor:'#f4f4f4',borderRadius:25}}>
                            <Row>
                                <Image style={{width:20,height:20,marginTop:5,marginLeft:10,marginRight:5}} source={require("../image/ico_seh.png")}/>
                                <Text style={{marginTop:5,fontSize:16,color:'#d0d0d0'}}>请输入单号或内容</Text>
                            </Row>
                    </Button>
                    <TouchableHighlight onPress={()=>this._setTypeVisible()} transparent style={{width:'15%',height:50,borderWidth:0,paddingTop:13,paddingLeft:"0.5%"}}>
                        <Row style={{width:"100%"}}>
                            <Image style={{width:"35%",height:20}} source={require("../image/navbar_ico_bx.png")}/>
                            <Text style={{color:"#252525",fontSize:16}}>报修</Text>
                        </Row>
                    </TouchableHighlight>
                    <OrderType goToRepair={(repairTypeId,repairMatterId)=>this.newRepair(repairTypeId,repairMatterId,()=>this.getRepairList())} isShowModal={()=>this._setTypeVisible()} modalVisible = {this.state.typeVisible}/>
            </Row>
            {this.state.searchVisible==true&&
                <Tabs style={{backgroundColor:'#000'}}>
                  <Tab heading={'待维修('+this.state.tab1+')'} tabStyle={{backgroundColor:'#fff'}} activeTabStyle={{backgroundColor:'#fff',borderBottomWidth:2,borderColor:'#62c0c5'}} textStyle={{color:'#999',fontSize:16}} activeTextStyle={{color:'#62c0c5',fontWeight:"normal",fontSize:16}}>
                        <View  style={{backgroundColor:'#f8f8f8'}}>
                            <Row style={{height:40}}>
                                <Text style={{width:ScreenWidth,textAlign:'center',color:'#a7a7a7',marginTop:14,fontSize:12}}>{'-------共'+this.state.tab1+'条维修中工单-------'}</Text>
                            </Row>
                            {this._setOrderItem(this.state.recordList1,1,()=>this.getRepairList())}
                        </View>
                  </Tab>
                  <Tab heading={'待评价('+this.state.tab2+')'} tabStyle={{backgroundColor:'#fff'}} activeTabStyle={{backgroundColor:'#fff',borderBottomWidth:2,borderColor:'#62c0c5'}} textStyle={{color:'#999',fontSize:16}} activeTextStyle={{color:'#62c0c5',fontWeight:"normal",fontSize:16}}>
                        <View  style={{backgroundColor:'#f8f8f8'}}>
                            <Row style={{height:40}}>
                                <Text style={{width:ScreenWidth,textAlign:'center',color:'#a7a7a7',marginTop:14,fontSize:12}}>{'-------共'+this.state.tab2+'条待评价工单-------'}</Text>
                            </Row>
                            {this._setOrderItem(this.state.recordList2,2,()=>this.getRepairList())}
                        </View>
                  </Tab>
                </Tabs>
            }
            {this.state.searchVisible==false&&
                <Tabs style={{backgroundColor:'#000'}}>
                  <Tab heading={'历史维修('+this.state.tab3+')'} tabStyle={{backgroundColor:'#fff'}} activeTabStyle={{backgroundColor:'#fff',borderBottomWidth:2,borderColor:'#62c0c5'}} textStyle={{color:'#999',fontSize:16}} activeTextStyle={{color:'#62c0c5',fontWeight:"normal",fontSize:16}}>
                        <View  style={{backgroundColor:'#f8f8f8'}}>
                            <Row style={{height:40}}>
                                <Text style={{width:ScreenWidth,textAlign:'center',color:'#a7a7a7',marginTop:14,fontSize:12}}>{'-------共'+this.state.tab3+'条维修工单-------'}</Text>
                            </Row>
                            {this._setOrderItem(this.state.recordList3,3,()=>this.getRepairList())}
                        </View>
                  </Tab>
                </Tabs>
            }
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() =>this._setModalVisible()}
            >
            <MD Closer = {() => this._setModalVisible()} />
            </Modal>
        </Content>
        <Footer>
          <FooterTab style={{borderTopWidth:1,borderColor:'#e5e5e5'}}>
            <Button full style={{backgroundColor:'#fafafa'}} onPress={()=>this._setSearchVisible(true)} >
                <Col style={{flex: 1,justifyContent:'center',alignItems:'center'}}>
                    <Image
                        style={{width: 25,height:25}}
                        source={(this.state.searchVisible==true) ? require('../image/tab_ico_wdwx_pre.png'):require('../image/tab_ico_wdwx_nor.png')}
                    />
                    <Text style={{color:(this.state.searchVisible==true) ?'#56c3c8':'#a6a6a6',fontSize:12}}>当前报修</Text>
                </Col>
            </Button>
            <Button full style={{backgroundColor:'#fafafa'}} onPress={()=>this._setSearchVisible(false)} >
                <Col style={{flex: 1,alignItems:'center'}}>
                   <Image
                        style={{width: 25,height:25}}
                        source={(this.state.searchVisible==true) ? require('../image/tab_ico_lswx_nor.png'):require('../image/tab_ico_lswx_pre.png')}
                    />
                    <Text style={{color:(this.state.searchVisible==true) ?'#a6a6a6':'#56c3c8',fontSize:12}}>历史报修</Text>
                </Col>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

class MD extends Component {
        render(){
            return (
                <TouchableOpacity style={{flex:1}} onPress={this.props.Closer}>
                <View style={modalStyles.container}>
                    <View style={modalStyles.innerContainer}>
                             <Image
                              style={{width:dialogWidth-20,height:dialogWidth-60}}
                              resizeMode={'contain'}
                              source={require('../image/cuidan.png')}
                            />
                        <View style={{width: dialogWidth,paddingTop:20,paddingLeft:20,paddingBottom:20}}>
                            <Text style={{color:'#999',fontSize:20}}>催单已成功，维修人员整火速前往，请您稍等片刻</Text>
                        </View>
                        <View style={modalStyles.btnContainer}>
                            <TouchableHighlight
                            onPress={this.props.Closer}>
                                <Text  style={modalStyles.hideModalTxt}>OK</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </View>
                </TouchableOpacity>
            );
        }
}

class MyHeader extends Component {//head模块
  render() {
    return (
        <Header  searchBar rounded style={stylesHeader.headerColor}>
              <Item style={{backgroundColor:'#666',width:300}}>
                <Icon name="search"/>
                <Input placeholder="Search"/>
              </Item>
              <Button transparent>
                <Text>Search</Text>
              </Button>
        </Header>
    );
  }
}

const stylesHeader=StyleSheet.create({
       headerColor:{
           backgroundColor:'#fff',
           width:ScreenWidth
       },
      headerBordy:{
            alignItems: 'center',
            marginLeft:100
       },
       titleColor:{
           color:'#000'
       },
});

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
        backgroundColor: '#fff',
    },
    btnContainer:{
        width:dialogWidth,
        height:46,
        borderRadius: 5,
        backgroundColor:'#eff0f2',
        alignItems:'center',
        paddingTop:10
    },
    hieModalTxt: {
        marginTop:10,
    },
});

module.exports=AllOrder;
