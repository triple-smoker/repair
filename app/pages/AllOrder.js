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
import OrderType from './publicTool/OrderType';
import OrderItem from './publicTool/OrderItem';
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
    tabIndex:0,//待维修、待评价、历史订单、。。。。编码
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
            // typeVisible:false,
            searchVisible: true,
            tabIndex:0,
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
            tabLength0:0,//页头数据量记录
            tabLength1:0,//页头数据量记录
            tabLength2:0,//页头数据量记录
        };
    }
    componentDidMount() {
        cachedResults.tabIndex=0;
        this._fetchData(0);
    }
    componentWillReceiveProps(){
        cachedResults.tabIndex=0;
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
        //获取维修单数量
        Axios.GetAxios("/api/repair/request/list/page_total?deptId="+repRepairInfo.deptId).then(
            (response) => {
                if (response && response.code === 200) {
                    this.setState({tabLength0:response.data.page_total_underway,tabLength1:response.data.page_total_evaluate,tabLength2:response.data.page_total_history})
                }
            }
        );
        var url = "";
        if(cachedResults.tabIndex===0){
            url = "/api/repair/request/list/underway?page="+repRepairInfo.page+"&limit="+repRepairInfo.limit+"&deptId="+repRepairInfo.deptId;
        }
        if(cachedResults.tabIndex===1){
            url = "/api/repair/request/list/evaluate?page="+repRepairInfo.page+"&limit="+repRepairInfo.limit+"&deptId="+repRepairInfo.deptId;

        }
        if(cachedResults.tabIndex===2){
            url = "/api/repair/request/list?page="+repRepairInfo.page+"&limit="+repRepairInfo.limit+"&deptId="+repRepairInfo.deptId+"&status=9,10,11";
        }

        Axios.GetAxios(url).then(
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
                    //this.setState({dataSource:this.state.dataSource.cloneWithRows(result.data.records), dataList:result.data.records});
                    if (page !== 0) { // 加载更多操作
                        that.setState({
                            isLoadingTail: false,
                            isRefreshing: false,
                            dataSource: that.state.dataSource.cloneWithRows(cachedResults.items)
                        });
                    } else { // 刷次操作
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
            }
        )

    }

    goBack(){
        const { navigate } = this.props.navigation;
        navigate('MainPage');
    }
    // _setTypeVisible() {
    //     this.setState({typeVisible: !this.state.typeVisible});
    // }


    goSearch(getRepairList){
        const { navigate } = this.props.navigation;
        navigate('OrderSearch',{
            callback: (
                () => {
                    setTimeout(function(){
                        getRepairList();
                    },200)
                })
        })
    }

    onClose() {
        this.setState({modalVisible: false});
    }
//催单
    _setModalVisible(repairId) {

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
                                if(item.repairId==repairId&&item.userId==global.userId){
                                    cdInfo = item;
                                }
                            })
                        }
                        if(cdInfo==""){
                            this.gotoCuiDan(cdTimeList,repairId);
                        }else{
                            var oldTime = moment(cdInfo.currentTime);
                            var nowDate = moment();
                            var timeDiff = moment(nowDate.diff(oldTime)).minute();
                            if(timeDiff>30){
                                var cdTimeListNew = [];
                                cdTimeList.forEach(function(item){
                                    if(item.repairId==repairId&&item.userId==global.userId){
                                    }else{
                                        cdTimeListNew.push(item);
                                    }
                                })
                                this.gotoCuiDan(cdTimeListNew,repairId);
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
    gotoCuiDan(cdTimeList,repairId){
        var cdTimeListNew = [];
        var currentTime = moment();
        var newCuiDanInfo = {
            currentTime: currentTime,
            repairId:repairId,
            userId:global.userId
        }
        if(cdTimeList!=null && cdTimeList.length>0){
            cdTimeListNew = cdTimeList;
        }
        cdTimeListNew.push(newCuiDanInfo);
        this.setState({cdTimeList:cdTimeListNew});
        this.saveCdTime();
        var url= '/api/repair/request/remind';
        var data = {
            repairId: repairId,
            userId: global.userId
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

    _setOrderItemNew(record){
        var ty = cachedResults.tabIndex+1;
        return (
            <OrderItem  getRepairList={()=>this._fetchData(0)}  type={ty} getEvaluate={()=>this.getEvaluate(record,()=>this._fetchData(0))} record={record} ShowModal = {(repairId) => this._setModalVisible(repairId)}/>
        );
    }

    _renderSeparatorView(sectionID, rowID, adjacentRowHighlighted) {
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
                    },200)
                }
            ),
        })
    }

//报修导航
    newRepair(_fetchData){
        // this.setState({typeVisible: !this.state.typeVisible});
        const { navigate } = this.props.navigation;
        navigate('Repair',{
            // repairTypeId:repairTypeId,
            // repairMatterId:repairMatterId,
            // repairParentCn:repairParentCn,
            // repairChildCn:repairChildCn,
            callback: (
                () => {
                    setTimeout(function(){
                        _fetchData(0);
                    },200)
                })
        })
    }
    onPressTabItem(index){
        console.log(">>>>>>>>>>"+index);
        cachedResults.items = [];
        cachedResults.tabIndex = index;
        cachedResults.total = 0;
        cachedResults.pages = 0;
        cachedResults.nextPage = 1;
        this.setState({tabIndex:index, dataSource: this.state.dataSource.cloneWithRows(cachedResults.items)});
        this._fetchData(0);
    }


    render() {
        return (
            <View style={styles.container}>
                <View style={{height:44,backgroundColor:'white',justifyContent:'center', textAlignVertical:'center', flexDirection:'row',alignItems:'center', marginLeft:0, marginRight:0, marginTop:0,}}>
                    <TouchableHighlight style={{width:50,height:44,alignItems:"center",justifyContent:"center"}} onPress={()=>this.goBack()}>
                        <Image style={{width:21,height:37}} source={require("../image/navbar_ico_back.png")}/>
                    </TouchableHighlight>
                    <TouchableOpacity onPress={()=>this.goSearch(()=>this._fetchData(0))} style={{flex:1,height:30, marginRight:0,}}>
                        <View style={{flex:1, height:30,backgroundColor:'#f0f0f0',justifyContent:'center', flexDirection:'row',alignItems:'center', marginLeft:10, marginRight:5,
                            borderBottomRightRadius: 15,borderBottomLeftRadius: 15,borderTopLeftRadius: 15,borderTopRightRadius: 15,}}>

                            <Image source={require('../image/ico_seh.png')}
                                   style={{width:16,height:16,marginLeft:10}}/>
                            <Text style={{color:'#999',fontSize:14,marginLeft:5, flex:1}}>请输入单号或内容</Text>

                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>this.newRepair(()=>this._fetchData(0))} style={{width:60,flexDirection:'row'}}>
                        <Image style={{width:20,height:20,marginRight:2}} source={require('../image/navbar_ico_bx.png')} />
                        <Text style={{color:"#252525",fontSize:16}}>报修</Text>
                    </TouchableOpacity>
                </View>
                {this.state.tabIndex!=2&&
                <View style={{height:44,backgroundColor:'white',justifyContent:'center', textAlignVertical:'center', flexDirection:'row',alignItems:'center', marginLeft:0, marginRight:0, marginTop:0,}}>
                    <TouchableOpacity onPress={()=>{this.onPressTabItem(0)}} style={{alignItems:'center',textAlignVertical:'center', height:49, justifyContent:'center',flex:1}}>
                        <View style={{alignItems:'center',textAlignVertical:'center', height:49, justifyContent:'center',flex:1}}>
                            <Text style={{color:this.state.tabIndex===0 ?'#5ec4c8':'#999',fontSize:16, textAlign:'center', textAlignVertical:'center'}}>{"待维修("+this.state.tabLength0+")"}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{this.onPressTabItem(1)}} style={{alignItems:'center',textAlignVertical:'center', height:49, justifyContent:'center',flex:1}}>
                        <View style={{alignItems:'center',textAlignVertical:'center', height:49, justifyContent:'center',flex:1}}>
                            <Text style={{color:this.state.tabIndex===1 ?'#5ec4c8':'#999',fontSize:16, textAlign:'center', textAlignVertical:'center'}}>{"待评价("+this.state.tabLength1+")"}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                }
                {this.state.tabIndex===2&&
                <View style={{height:44,backgroundColor:'white',justifyContent:'center', textAlignVertical:'center', flexDirection:'row',alignItems:'center', marginLeft:0, marginRight:0, marginTop:0,}}>
                    <TouchableOpacity style={{alignItems:'center',textAlignVertical:'center', height:49, justifyContent:'center',flex:1}}>
                        <View style={{alignItems:'center',textAlignVertical:'center', height:49, justifyContent:'center',flex:1}}>
                            <Text style={{color:'#5ec4c8',fontSize:16, textAlign:'center', textAlignVertical:'center'}}>{"历史维修("+this.state.tabLength2+")"}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                }
                <Text style={{width:ScreenWidth,textAlign:'center',color:'#a7a7a7',margin:7,fontSize:12}}>{'-------共'+cachedResults.total+'条报修单-------'}</Text>
                {/*<OrderType goToRepair={(repairTypeId,repairMatterId,repairParentCn,repairChildCn)=>this.newRepair(repairTypeId,repairMatterId,repairParentCn,repairChildCn,()=>this.getRepairList())} isShowModal={()=>this._setTypeVisible()} modalVisible = {this.state.typeVisible}/>*/}
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
                <Modal
                    animationType={"slide"}
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() =>this._setModalVisible()}
                >
                    <MD Closer = {() => this._setModalVisible()} />
                </Modal>
                <View style={{height:44,backgroundColor:'white',justifyContent:'center', textAlignVertical:'center', flexDirection:'row',alignItems:'center',bottom:0}}>
                    <TouchableOpacity onPress={()=>{this.onPressTabItem(0)}} style={{alignItems:'center',textAlignVertical:'center', height:49, justifyContent:'center',flex:1}}>
                        <View style={{alignItems:'center',textAlignVertical:'center', height:49, justifyContent:'center',flex:1}}>
                            <Image
                                style={{width: 25,height:25}}
                                source={(this.state.tabIndex==0||this.state.tabIndex==1) ? require('../image/tab_ico_wdwx_pre.png'):require('../image/tab_ico_wdwx_nor.png')}
                            />
                            <Text style={{color:(this.state.tabIndex==0||this.state.tabIndex==1) ?'#5ec4c8':'#999',fontSize:10, textAlign:'center', textAlignVertical:'center'}}>当前报修</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{this.onPressTabItem(2)}} style={{alignItems:'center',textAlignVertical:'center', height:49, justifyContent:'center',flex:1}}>
                        <View style={{alignItems:'center',textAlignVertical:'center', height:49, justifyContent:'center',flex:1}}>
                            <Image
                                style={{width: 25,height:25}}
                                source={(this.state.tabIndex==0||this.state.tabIndex==1) ? require('../image/tab_ico_lswx_nor.png'):require('../image/tab_ico_lswx_pre.png')}
                            />
                            <Text style={{color:(this.state.tabIndex==0||this.state.tabIndex==1) ?'#999':'#5ec4c8',fontSize:10, textAlign:'center', textAlignVertical:'center'}}>历史报修</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>


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
