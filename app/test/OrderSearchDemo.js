import React, { Component } from 'react';
import {
    Dimensions,
    View,
    Alert,
    TextInput,
    TouchableHighlight,
    TouchableOpacity,
    Image,
    Modal,
    StyleSheet,
    ListView
} from 'react-native';
import {Row, Col, Container, Content, Text ,Button } from 'native-base';
import OrderItem from '../pages/publicTool/OrderItem';
import AsyncStorage from '@react-native-community/async-storage';
import Axios from '../util/Axios';
import moment from "moment";
import BaseComponent from '../js/base/BaseComponent';
import RefreshListView from '../js/component/RefreshListView'
import * as Dimens from '../js/value/dimens';


let cachedResults = {
    nextPage: 1, // 下一页
    items: [], // listview 数据
    total: 0, // 总数
    pages:0,
    context:'',
};
let ScreenWidth = Dimensions.get('window').width;
let dialogWidth = ScreenWidth-80;
class OrderSearch extends BaseComponent {

    static navigationOptions = {
        header : null
    };

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            searchContext: '',
            searchType: false,
            reporterList : [],
            recordListSearch : [],
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
        AsyncStorage.getItem('searchItemHistory',function (error, result) {

                if (error) {
                    // alert('读取失败')
                }else {
                    let porterList = JSON.parse(result);
                    this.getHistory(porterList);

                    // alert('读取完成')
                }

            }.bind(this)
        )
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
            matterName:cachedResults.context,
        }
        console.log(repRepairInfo);
        var url="/api/repair/request/list?page="+repRepairInfo.page+"&limit="+repRepairInfo.limit+"&deptId="+repRepairInfo.deptId+"&matterName="+repRepairInfo.matterName;
        Axios.GetAxios(url).then(
            (response) => {
                console.log(">>>>>>>>>>>>>>>>>>>>>>>>>");
                console.log(response);
                if (response && response.code === 200) {
                    console.log(response);
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
    getHistory(porterList){
        this.setState({
            reporterList: porterList
        });
    }
    _setSerachShow(context){
        cachedResults.context=context;
        this.setState({searchType:true,recordListSearch:[],searchContext:context});
        this.saveReport(context);
        console.log(this.state.searchContext)
        // this._getOrders(context);
        this._fetchData(0);
    }
    saveReport(context){

        let key = 'searchItemHistory';

        let reporterList = this.state.reporterList;


        if(reporterList === null){
            reporterList = new Array()
        }
        var temp = [];
//        reporterList.splice(index,1,context);
        for(var i = 0 ; i < reporterList.length;i++){
            if(context === reporterList[i]){
                temp.splice(0,0,i)
            }
        }
        for(var j = 0 ; j < temp.length;j++){
            reporterList.splice(temp[j],1);
        }

        if(context != null && context != ''){
            reporterList.splice(0,0,context);
        }

        if(reporterList.length >=6){
            reporterList.pop()
        }


        this.setState({
            reporterList: reporterList,
        });
        //json转成字符串
        let jsonStr = JSON.stringify(reporterList);

        //存储
        AsyncStorage.setItem(key, jsonStr, function (error) {

            if (error) {
                console.log('存储失败')
            }else {
                console.log('存储完成')
            }
        })
    }

    history(){
        const reporterList = this.state.reporterList;
        const listItems =  reporterList === null ? null : reporterList.map((report, index) =>
            <SearchItem key={index} getSearch={(context)=>this._setSerachShow(context)} searchContext={report}/>
        );
        return listItems;
    }



    //渲染页面
    _setOrderItemNew(record){

        return <OrderItem getRepairList={()=>this._fetchData(0)} type={3} record={record} getEvaluate={()=>this.getEvaluate(record)} ShowModal = {(repairId,sendDeptId,sendUserId) => this._setModalVisible(repairId,sendDeptId,sendUserId)}/>;
    }
    getEvaluate(record){
        const { navigate } = this.props.navigation;
        navigate('Evaluate', {
            record: record,
            callback: (
                () => {
                    let repRepairInfo = {
                        deptId: '1078386763486683138',
                        matterName:this.state.searchContext,
                        limit:10000,
                    }
                    var   url="/api/repair/request/list?deptId="+repRepairInfo.deptId+"&matterName="+repRepairInfo.matterName+"&limit="+repRepairInfo.limit;
                    var   data=repRepairInfo;
                    Axios.GetAxios(url).then(
                        (response) => {
                            var records = response.data.records;
                            this.setState({recordListSearch:records});
                        }
                    )
                }
            )
        })
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

//   清理历史纪录
    clearHistory(){
        let key = 'searchItemHistory';
        var reporterList = [];
        this.setState({reporterList:[]});
        //json转成字符串
        let jsonStr = JSON.stringify(reporterList);

        //存储
        AsyncStorage.setItem(key, jsonStr, function (error) {

            if (error) {
                console.log('清除失败')
            }else {
                console.log('清除成功')
            }
        })
    }
    _renderSeparatorView(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
        return (
            <View key={`${sectionID}-${rowID}`} style={styles.separator} />
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{height:44,backgroundColor:'white',justifyContent:'center', textAlignVertical:'center', flexDirection:'row',alignItems:'center', marginLeft:0, marginRight:0, marginTop:0,}}>
                    <TouchableHighlight style={{width:50,height:44,justifyContent:"center",alignItems:"center"}} onPress={()=>{this.props.navigation.goBack(),this.props.navigation.state.params.callback()}}>
                        <Image style={{width:21,height:37}} source={require("../image/navbar_ico_back.png")}/>
                    </TouchableHighlight>
                    <View style={{flex:1, height:40,backgroundColor:'#f0f0f0',justifyContent:'center', flexDirection:'row',alignItems:'center', marginLeft:10, marginRight:5,
                        borderBottomRightRadius: 20,borderBottomLeftRadius: 20,borderTopLeftRadius: 20,borderTopRightRadius: 20,}}>

                        <Image source={require('../image/ico_seh.png')}
                               style={{width:16,height:16}}/>
                        <TextInput underlineColorAndroid="transparent" placeholder="请输入单号或内容" style={{width:'90%',height:40,fontSize:14,backgroundColor:'#f4f4f4'}} onChangeText={(searchContext) => this.setState({searchContext:searchContext})}>{this.state.searchContext}</TextInput>

                    </View>
                    <TouchableOpacity onPress={()=>this._setSerachShow(this.state.searchContext)} style={{width:60,flexDirection:'row'}}>
                        <Text style={{color:"#252525"}}>搜索</Text>
                    </TouchableOpacity>
                </View>
                <Row style={{height:50,paddingTop:20,paddingLeft:20}}>
                    <Text style={{color:'#919191',fontSize:14}}>
                        最近搜索
                    </Text>
                    <TouchableHighlight  style={{marginLeft:'77%'}} onPress={()=>this.clearHistory()}>
                        <Image style={{width:15,height:18}}
                               source={require("../image/ico_del.png")}
                        />
                    </TouchableHighlight>
                </Row>
                {this.state.searchType==false &&
                <View style={{width:'100%',flexDirection:'row',flexWrap:'wrap'}}>
                    {this.history()}
                </View>
                }
                {this.state.searchType==true &&
                <View style={{width:'100%',flexDirection:'row',flexWrap:'wrap'}}>
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
                }
                <Modal
                    animationType={"slide"}
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() =>this._setModalVisible()}
                >
                    <MD Closer = {() => this._setModalVisible()} />
                </Modal>
            </View>

    );
    }
}

class SearchItem extends Component{
    render(){
        return (
            <Button style={{height:30,marginLeft:20,marginTop:20,backgroundColor:'#ccc',borderRadius:15}}
                    onPress={()=>this.props.getSearch(this.props.searchContext)}
            >
                <Text style={{color:'#555'}}>{this.props.searchContext}</Text>
            </Button>
        )
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


module.exports=OrderSearch;
