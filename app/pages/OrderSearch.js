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
    StyleSheet
} from 'react-native';
import {Row, Col, Container, Content, Text ,Button } from 'native-base';
import OrderItem from './publicTool/OrderItem';
import AsyncStorage from '@react-native-community/async-storage';
import Axios from '../util/Axios';



let ScreenWidth = Dimensions.get('window').width;
let dialogWidth = ScreenWidth-80;
class OrderSearch extends Component {

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
        recordListSearch : []
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
    getHistory(porterList){
        this.setState({
          reporterList: porterList
        });
    }
    _setSerachContext(context){
        this.setState({searchContext:context});
    }
    _setSerachShow(context,index){
        this.setState({searchType:true,recordListSearch:[],searchContext:context});
        this.saveReport(context,index);
        this._getOrders();
    }
    saveReport(context,index){

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
            <SearchItem key={index} getSearch={()=>this._setSerachShow(report,index)} searchContext={report}/>
        );
        return listItems;
    }

//搜索数据
    _getOrders(){
            let repRepairInfo = {
                        deptId: '1078386763486683138',
                        matterName:this.state.searchContext,
                     }
            var   url="/api/repair/request/list"
            var   data=repRepairInfo;

        Axios.GetAxios(url,data).then(
            (response) => {
                var records = response.data.records;
                this.setState({recordListSearch:records});
            }
        )
    }
//渲染页面
    _setOrderItem(searchContext){

        let recordList = this.state.recordListSearch;
        let listItems =(  recordList === null ? null : recordList.map((record, index) =>
            <OrderItem key={index} getRepairList={()=>this._getOrders()} type={3} record={record} getEvaluate={()=>this.getEvaluate(record,searchContext)} ShowModal = {(repairId,sendDeptId,sendUserId) => this._setModalVisible(repairId,sendDeptId,sendUserId)}/>
        ))
        return listItems;
    }
    getEvaluate(record,searchContext){
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
    _setModalVisible(repairId,sendDeptId,sendUserId) {
    //催单
    if(!this.state.modalVisible){
        let data = {
                  repairId: repairId,
                  sendDeptId: sendDeptId,
                  sendUserId: sendUserId
               }
        var url='/api/repair/request/remind';
        var headers={
                'Content-type': 'application/json',
            }
        Axios.PostAxios(url,data).then(
            (response) => {
                this.setState({modalVisible: true});
            }
        )
    }else{
        this.setState({modalVisible: false})
        }
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

  render() {
    return (
        <Container style={{backgroundColor:'#f8f8f8'}}>
            <Content>
                <Row>
                    <TouchableHighlight onPress={()=>{this.props.navigation.goBack(),this.props.navigation.state.params.callback()}} style={{width:'10%',height:50}}>
                        <Image style={{width:12,height:25,margin:13}} source={require("../image/navbar_ico_back.png")}/>
                    </TouchableHighlight>
                    <Row style={{width:'80%',backgroundColor:'#f4f4f4',borderRadius:25}}>
                        <Image style={{width:20,height:20,marginTop:15,marginLeft:10,marginRight:5}} source={require("../image/ico_seh.png")}/>
                        <TextInput underlineColorAndroid="transparent" placeholder="请输入单号或内容" style={{width:'90%',borderRadius:25,height:50,fontSize:16,backgroundColor:'#f4f4f4'}} onChangeText={(searchContext:searchContext) => this.setState({searchContext:searchContext})}>{this.state.searchContext}</TextInput>
                    </Row>
                    <Button transparent style={{height:50,backgroundColor:'#f8f8f8',borderWidth:0}} onPress={()=>this._setSerachShow(this.state.searchContext)}><Text style={{color:"#252525"}}>搜索</Text></Button>
                </Row>
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
                <Content>
                    {this.state.searchType==false &&
                        <View style={{width:'100%',flexDirection:'row',flexWrap:'wrap'}}>
                            {this.history()}
                        </View>
                    }
                    {this.state.searchType==true &&
                        <View style={{width:'100%',flexDirection:'row',flexWrap:'wrap'}}>
                            <Col>

                            {this._setOrderItem(this.state.searchContext)}
                            </Col>
                        </View>
                    }
                    <Modal
                        animationType={"slide"}
                        transparent={true}
                        visible={this.state.modalVisible}
                        onRequestClose={() => {
                                   alert("Modal has been closed.");
                                 }}
                    >
                        <MD Closer = {() => this._setModalVisible()} />
                    </Modal>
                </Content>
            </Content>
        </Container>
    );
  }
}

class SearchItem extends Component{
    render(){
        return (
            <Button style={{height:30,marginLeft:20,marginTop:20,backgroundColor:'#ccc',borderRadius:15}}
            onPress={this.props.getSearch}
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



module.exports=OrderSearch;
