

import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ListView,
    Platform,
    BackHandler
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import TitleBar from '../../component/TitleBar';
import BaseComponent from '../../base/BaseComponent'
import * as Dimens from '../../value/dimens';
import RefreshListView from '../../component/RefreshListView';
import Request, {messageRecordList} from '../../http/Request';


let cachedResults = {
    nextPage: 1, // 下一页
    items: [], // listview 数据(视频列表)
    total: 0, // 总数
    pages: 0
};
export default class workOrderInform extends BaseComponent {
    static navigationOptions = {
        header: null,
    };
    constructor(props){
        super(props);
        const { navigation } = this.props;
        const workOrderNotify = navigation.getParam('workOrderNotify', []);
        console.info(workOrderNotify)
        this.state={
            theme : this.props.theme,
            workOrderNotify : workOrderNotify,
            isConnected: false,
            dataSource : new ListView.DataSource({
                rowHasChanged: (r1, r2)=> {
                    if (r1 !== r2) {
                    } else {
                        console.log("相等=");
                    }
                    return true//r1.isSelected !== r2.isSelected;
                }
            }),
            isLoadingTail: false,
            isRefreshing: false
        }
    }

    componentDidMount(){
        this.loadDataSource();

        //监听物理返回键
        if (Platform.OS === 'android') {
            BackHandler.addEventListener("back", this.onBackClicked);
        }
    }

    //卸载前移除物理监听
    componentWillUnmount() {
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener("back", this.onBackClicked);
        }
    }

    //BACK物理按键监听
    onBackClicked = () => {
        this.props.navigation.state.params.callback();
        this.props.navigation.goBack();
        return true;
    }

    loadDataSource(){
        var that = this;
        NetInfo.fetch().then(state => {
            console.info("网络：" + state.isConnected)
            if(state.isConnected){
                that.setState({
                    isConnected : true
                });
                that._fetchData(0);
            }else{
                var dataSource = that.state.workOrderNotify.reverse();
                that.setState({
                    isLoadingTail: false,
                    isRefreshing: false,
                    dataSource: that.state.dataSource.cloneWithRows(dataSource),
                    isConnected : false
                });
                cachedResults.items = dataSource;
            }
        });
    }

    _fetchData(page){
        if(!this.state.isConnected){
            return;
        }
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
            // 初始 nextPage
            cachedResults.nextPage = 1;
        }
        let params = {
            userId: global.userId,
            page: cachedResults.nextPage,
            rows: 10
        };
        console.log(params);

        Request.requestPost(messageRecordList, params, (result)=> {
            console.info(result);
            if (result && result.code === 200) {
                var items = [];
                cachedResults.total = 0;
                if (result.data.current&&result.data.current !== 1) { // 加载更多操作
                    items = cachedResults.items.slice();
                    if (result.data&&result.data.records) {//&& result.data.records.length > 0
                        items = items.concat(result.data.records);
                        cachedResults.total = result.data.total;
                        cachedResults.pages = result.data.pages;
                        cachedResults.nextPage = result.data.current + 1;
                    } else {
        
                    }
                }else { // 刷新操作

                    if (result.data&&result.data.records) {
                        items = result.data.records;
                        cachedResults.total = result.data.total;
                        cachedResults.pages = result.data.pages;
                        cachedResults.nextPage = result.data.current + 1;
                    } else {
        
                    }
                }
      
                cachedResults.items = items; // 视频列表数据
                
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
            } else {
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
        });
    }

    onPressItem(data){
        data.recordAlreadyRead = 1;
    }
    
    renderWorkOrderMessage(data){
        // var tipStatus = <View style={{position:'absolute',top:0,right:-7,height:5,width:5,borderRadius:5,backgroundColor:'red'}}></View>;
        return (
             <PreMessage data={data} isConnected={this.state.isConnected} workOrderNotify={this.state.workOrderNotify} />
        )
    }

    _renderSeparatorView(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
        return (
            <View key={`${sectionID}-${rowID}`} style={styles.separator} />
        );
    }
    
    render() {
        return (
          <View style={styles.container}>
            <TitleBar
                centerText={'工单通知'}
                isShowLeftBackIcon={true}
                navigation={this.props.navigation}
                leftPress={() => (this.naviGoBack(this.props.navigation),this.props.navigation.state.params.callback())}
            />

            {/* <ListView
                initialListSize={1}
                dataSource={this.state.dataSource}
                renderRow={(item) => this.renderWorkOrderMessage(item)}
                style={{backgroundColor:'white',flex:1,height:300}}
                onEndReachedThreshold={10}
                enableEmptySections={true}
                renderSeparator={(sectionID, rowID, adjacentRowHighlighted) =>this._renderSeparatorView(sectionID, rowID, adjacentRowHighlighted)}
            /> */}
            <RefreshListView
                style={{flex:1, width:Dimens.screen_width,height:Dimens.screen_height-44}}
                onEndReachedThreshold={10}
                dataSource={this.state.dataSource}
                // 渲染item(子组件)
                renderRow={this.renderWorkOrderMessage.bind(this)}
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
    )
}
onChange(val) {
    this.setState({
        pushStatus : val
    })
    console.log(this.state.pushStatus)
  }
}


class PreMessage extends Component{
    constructor(props){
        super(props);
        const{ data, isConnected, workOrderNotify} = this.props
        this.state={ 
            data: data,
            isConnected: isConnected,
            workOrderNotify: workOrderNotify,
            alreadyReadFlag : false
        }
    }

    onPressItem(){
        this.setState({
            alreadyReadFlag: true
        })
    }

    render(){
        var tipStatus = null;

        if(this.state.isConnected){
            this.state.workOrderNotify.find(element => {
                if(element.recordAlreadyRead === 0 && element.recordId == this.state.data.recordId && !this.state.alreadyReadFlag){
                    tipStatus = <View style={{position:'absolute',top:0,right:-7,height:5,width:5,borderRadius:5,backgroundColor:'red'}}></View>;
                }
            });
        }else if(this.state.data.recordAlreadyRead === 0 && !this.state.alreadyReadFlag){
            tipStatus = <View style={{position:'absolute',top:0,right:-7,height:5,width:5,borderRadius:5,backgroundColor:'red'}}></View>;
        }

        return(
            <TouchableOpacity onPress={()=>this.onPressItem()} style={{flex:1, backgroundColor:'white'}}>
                <View style={styles.input_center_bg}>
                    <View style={styles.title}>
                        <View style={{flexDirection: 'row',justifyContent:'flex-start'}}>
                            <Text style={{fontSize:16,color:'#404040'}}>
                                {this.state.data.title}
                            </Text>
                            {tipStatus}
                        </View>
                        <Text style={{fontSize:14,color:'#7f7f7f'}}>
                            {this.state.isConnected === true ? new Date(this.state.data.createTime).format("yyyy-MM-dd hh:mm:ss") : this.state.data.createTime}
                        </Text>
                    </View>
                    <View style={styles.line} />
                    <View style={styles.content}>
                        <Text style={{fontSize:15,color:'#404040'}}>
                            {this.state.isConnected === true ? JSON.parse(this.state.data.content).msg : this.state.data.content.msg}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#f6f6f6',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
    title:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        lineHeight:45,
        height:45,
        marginLeft:0,
        marginRight:0,
        paddingLeft: 10,
        paddingRight: 10,
    },
    content:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        lineHeight:45,
        height:45,
        marginLeft:0,
        marginRight:0,
        paddingLeft: 10,
        paddingRight: 10,
    },
    input_center_bg:{
        overflow:'hidden',
        backgroundColor: 'white',
        marginTop:10,
        marginLeft:10,
        marginRight:10,
        borderRadius:5,
        borderColor: '#d0d0d0',
        borderWidth: 1,

    },
    input_center_bg2:{
        overflow:'hidden',
        backgroundColor: '#f5f5f5',
        marginTop:10,
        marginLeft:10,
        marginRight:10,
        borderRadius:5,
        borderColor: '#d0d0d0',
        borderWidth: 1,

    },
    input_item:{
        flexDirection:'row',height:40,alignItems:'center',marginTop:0,
    },
    input_style:{
        fontSize: 15,height:40,textAlign: 'left',textAlignVertical:'center',flex:1,marginLeft:0
    },
    line:{
        backgroundColor:'#d0d0d0',height:1,width:(Dimens.screen_width-40),marginTop:0,marginLeft:10
    },
});