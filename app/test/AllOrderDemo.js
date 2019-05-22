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
    RefreshControl,
    ScrollView,
    ListView
} from 'react-native';
import {  Footer,FooterTab,Item,Input,Button,Icon, Tabs, Tab , Col, Row, Container, Content, Header, Left, Body, Right, Text, List, ListItem, Thumbnail} from 'native-base';
import Axios from '../util/Axios';
import OrderType from '../pages/publicTool/OrderType'
import OrderItem from '../pages/publicTool/OrderItem';
import AsyncStorage from '@react-native-community/async-storage';
import moment from "moment";
import BaseComponent from '../js/base/BaseComponent';
import RefreshListView from '../js/component/RefreshListView'
import * as Dimens from '../js/value/dimens';


let cachedResults = {
    nextPage: 1, // 下一页
    items: [], // listview 数据
    total: 0, // 总数
    pages:0,
    tabIndex:0,//个人任务、部门任务、。。。。编码
    timeIndex: 0,//自定义时间编码
};


let ScreenWidth = Dimensions.get('window').width;
let dialogWidth = ScreenWidth-80;
class AllOrder extends BaseComponent {


    static navigationOptions = {
        header: null,
    };
    constructor(props) {
            super(props);
            const { navigation } = this.props;
            const thisRecord = navigation.getParam('data', '');
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
                isRefreshing: false,
                dataSource: new ListView.DataSource({
                    rowHasChanged: (r1, r2)=> {
                        if (r1 !== r2) {
                        } else {
                            console.log("相等=");
                        }
                        return true//r1.isSelected !== r2.isSelected;
                    }
                }),
                isLoadingTail: false, // loading?
             };
            // this.getRepairList();
    }
    // componentWillReceiveProps(){
    //     this.getRepairList();
    // }
    componentDidMount() {
        this._fetchData(0);
    }
    _fetchData(page) {
        console.log('WP : _fetchData')
        var that = this;
        if (page !== 0) { // 加载更多操作
            this.setState({
                isLoadingTail: true
            });
            cachedResults.nextPage = page;
        } else { // 刷新操作
            this.setState({
                isRefreshing: true
            });
            // 初始哈 nextPage
            cachedResults.nextPage = 1;
        }


        let repRepairInfo = {
            page: cachedResults.nextPage,
            limit: 10,
            deptId: global.deptId,
            ownerId: global.userId,
            status: ''
        }
        console.log(repRepairInfo);
        var url1 = "/api/repair/request/list/underway?page="+repRepairInfo.page+"&limit="+repRepairInfo.limit+"&deptId="+repRepairInfo.deptId;
        Axios.GetAxios(url1).then(
            (response) => {
                console.log(">>>>>>>>>>>>>>>>>>>>>>>>>");
                console.log(response);
            if (response && response.code === 200) {

                var items = [];
                cachedResults.total = 0;
                if (response.data.current&&response.data.current !== 1) { // 加载更多操作
                    items = cachedResults.items.slice();
                    if (response.data&&response.data.records) {//&& result.data.records.length > 0
                        items = items.concat(response.data.records);
                        cachedResults.total = response.data.total;
                        cachedResults.pages = response.data.pages;
                        cachedResults.nextPage = response.data.current+1;
                    } else {

                    }

                } else { // 刷新操作

                    if (response.data&&response.data.records) {
                        items = response.data.records;
                        cachedResults.total = response.data.total;
                        cachedResults.pages = response.data.pages;
                        cachedResults.nextPage = response.data.current+1;
                    } else {

                    }
                }
                cachedResults.items = items;
                console.log("--------------"+page);
                //this.setState({dataSource:this.state.dataSource.cloneWithRows(result.data.records), dataList:result.data.records});
                if (page !== 0) { // 加载更多操作
                    console.log("--------------1");
                    that.setState({
                        isLoadingTail: false,
                        isRefreshing: false,
                        dataSource: that.state.dataSource.cloneWithRows(cachedResults.items)
                    });
                } else { // 刷次操作
                    console.log("--------------2");
                    that.setState({
                        isLoadingTail: false,
                        isRefreshing: false,
                        dataSource: that.state.dataSource.cloneWithRows(cachedResults.items)
                    });
                }
            }else {
                if (page !== 0) { // 上拉加载更多操作
                    this.setState({
                        isRefreshing: false,
                        isLoadingTail: false,
                    });
                } else {
                    this.setState({ // 刷新操作
                        isRefreshing: false,
                        isLoadingTail: false,
                    });
                }
            }
            console.log("---------------"+this.state.isRefreshing);
            console.log("---------------"+this.state.isLoadingTail);

            }
        )
        //
        //
        //
        //
        //
        //
        //
        // Request.requestGetWithKey(GetRepairList, params, (result, key)=> {
        //     if (key !== cachedResults.tabIndex)return;
        //     if (result && result.code === 200) {
        //         var items = [];
        //         cachedResults.total = 0;
        //         if (result.data.current&&result.data.current !== 1) { // 加载更多操作
        //             items = cachedResults.items.slice();
        //             if (result.data&&result.data.records) {//&& result.data.records.length > 0
        //                 items = items.concat(result.data.records);
        //                 cachedResults.total = result.data.total;
        //                 cachedResults.pages = result.data.pages;
        //                 cachedResults.nextPage = result.data.current+1;
        //             } else {
        //
        //             }
        //
        //         } else { // 刷新操作
        //
        //             if (result.data&&result.data.records) {
        //                 items = result.data.records;
        //                 cachedResults.total = result.data.total;
        //                 cachedResults.pages = result.data.pages;
        //                 cachedResults.nextPage = result.data.current+1;
        //             } else {
        //
        //             }
        //         }
        //
        //         cachedResults.items = items; // 视频列表数据
        //
        //         //this.setState({dataSource:this.state.dataSource.cloneWithRows(result.data.records), dataList:result.data.records});
        //         if (page !== 0) { // 加载更多操作
        //             that.setState({
        //                 isLoadingTail: false,
        //                 isRefreshing: false,
        //                 dataSource: that.state.dataSource.cloneWithRows(cachedResults.items)
        //             });
        //         } else { // 刷次操作
        //             that.setState({
        //                 isLoadingTail: false,
        //                 isRefreshing: false,
        //                 dataSource: that.state.dataSource.cloneWithRows(cachedResults.items)
        //             });
        //         }
        //     } else {
        //         if (page !== 0) { // 上拉加载更多操作
        //             this.setState({
        //                 isRefreshing: false,
        //                 isLoadingTail: false,
        //             });
        //         } else {
        //             this.setState({ // 刷新操作
        //                 isRefreshing: false,
        //                 isLoadingTail: false,
        //             });
        //         }
        //     }
        // }, cachedResults.tabIndex);
    }

    getRepairList(){
        let repRepairInfo = {
                    page: 1,
                    limit: 10000,
                    deptId: global.deptId,
                    ownerId: global.userId,
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
                        if(cdTimeList!=null && cdTimeList.length>0){
                            cdTimeList.forEach(function(item){
                                if(item.repairId==repairId&&item.sendDeptId==sendDeptId&&item.sendUserId==sendUserId){
                                    cdInfo = item;
                                }
                            })
                        }
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
        var cdTimeListNew = [];
        var currentTime = moment();
        var newCuiDanInfo = {
            currentTime: currentTime,
            repairId:repairId,
            sendDeptId:sendDeptId,
            sendUserId:sendUserId,
        }
        if(cdTimeList!=null && cdTimeList.length>1){
            cdTimeListNew = cdTimeList;
        }
        cdTimeListNew.push(newCuiDanInfo);
        this.setState({cdTimeList:cdTimeListNew});
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
    _setOrderItemNew(record){
        console.log(record);
        return (
            <OrderItem  getRepairList={()=>this.getRepairList()}  type={2} getEvaluate={()=>this.getEvaluate(record,()=>this.getRepairList())} record={record} ShowModal = {(repairId,sendDeptId,sendUserId) => this._setModalVisible(repairId,sendDeptId,sendUserId)}/>
        );
    }

    _renderSeparatorView(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
        return (
            <View key={`${sectionID}-${rowID}`} style={styles.separator} />
        );
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
  _onRefresh = () => {
    this.setState({refreshing: true});
    this.getRepairList();
    this.setState({refreshing: false});
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
                            <RefreshListView
                                style={{flex:1, width:Dimens.screen_width,height:Dimens.screen_height-44*2-49}}
                                onEndReachedThreshold={10}
                                dataSource={this.state.dataSource}
                                // 渲染item(子组件)
                                renderRow={this._setOrderItemNew.bind(this)}
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
                        </View>
                  </Tab>
                  <Tab heading={'待评价('+this.state.tab2+')'} tabStyle={{backgroundColor:'#fff'}} activeTabStyle={{backgroundColor:'#fff',borderBottomWidth:2,borderColor:'#62c0c5'}} textStyle={{color:'#999',fontSize:16}} activeTextStyle={{color:'#62c0c5',fontWeight:"normal",fontSize:16}}>
                        <View  style={{backgroundColor:'#f8f8f8'}}>
                            <Row style={{height:40}}>
                                <Text style={{width:ScreenWidth,textAlign:'center',color:'#a7a7a7',marginTop:14,fontSize:12}}>{'-------共'+this.state.tab2+'条待评价工单-------'}</Text>
                            </Row>
                            <ScrollView
                                refreshControl={
                                  <RefreshControl
                                    refreshing={this.state.refreshing}
                                    onRefresh={this._onRefresh}
                                  />
                                }
                            >
                                {this._setOrderItem(this.state.recordList2,2,()=>this.getRepairList())}
                            </ScrollView>
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
                            <ScrollView
                                refreshControl={
                                  <RefreshControl
                                    refreshing={this.state.refreshing}
                                    onRefresh={this._onRefresh}
                                  />
                                }
                            >
                                {this._setOrderItem(this.state.recordList3,3,()=>this.getRepairList())}
                            </ScrollView>
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
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15,
        borderTopLeftRadius: 15,
        borderTopRightRadius:15,
        backgroundColor: 'white',
    },
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },

    buttonTop:{
        width:35,
        height:35,
        alignItems:'center',
        justifyContent:'center',
        textAlignVertical:'center',
        position: 'absolute',
        bottom: 70+49,
        right: 30,
        alignSelf: 'center'
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
        backgroundColor:'#eeeeee',height:1,width:(Dimens.screen_width-20),marginTop:0,marginLeft:20,
    },
    separator: {
        height: 1,
        backgroundColor: '#f6f6f6'
    },
    input_style:{
        paddingVertical: 0,marginTop:10, textAlignVertical:'top', textAlign:'left',backgroundColor: 'white',fontSize: 14,height:80, marginLeft:15,marginRight:15, paddingLeft:8,paddingRight:8,paddingTop:5,paddingBottom:5,
    },
});


module.exports=AllOrder;
