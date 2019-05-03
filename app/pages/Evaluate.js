import React, { Component } from 'react';
import {
    StyleSheet,
    Dimensions,
    Image,
    Alert
} from 'react-native';
import { Container, Content,
    Header,Left,Button,Body,Title,Right,Icon,
    Row,Col,Accordion,View,Text,Footer} from 'native-base';
import OrderItem from './publicTool/OrderItem';
import OrderWuZi from './publicTool/OrderWuZi';
import OrderEva from './publicTool/OrderEva';
import OrderEvaOver from './publicTool/OrderEvaOver';
import OrderPerson from './publicTool/OrderPerson';
import axios from 'axios';




let ScreenWidth = Dimensions.get('window').width;


class OrderEvaluate extends Component {//主页面

    static navigationOptions = {
        // header: null,
        headerTitle: '报修单详情',
        headerBackImage: (<Image resizeMode={'contain'} style={{width: 12, height: 25}} source={require('../image/navbar_ico_back.png')} />),
        headerStyle: {
            elevation: 0,
        },
        headerRight: (<View />),
        headerTitleStyle: {
            flex:1,
            textAlign: 'center'
        }
    };

    constructor(props) {
       super(props);
       const { navigation } = this.props;
//       const thisRecord = navigation.getParam('record', '');
       const thisRecord = {
       buildingId: "1078386477644865537",
       buildingName: "后勤大楼",
       createTime: 1556534148000,
       deptId: "1078386763486683138",
       deptName: "测试",
       detailAddress: "后勤大楼/2F/后勤总务房间2-001",
       fileMap: [],
       floorId: "1078650044340199426",
       floorName: "2F",
       hours: 95.6,
       inpatientWardId: null,
       inpatientWardName: null,
       isUrgent: null,
       matterId: 888881022,
       matterName: "测试房灯不亮",
       ownerId: "1601500545875394402",
       ownerName: "admin",
       ownerVisited: null,
       repairDeptId: "1078553297945321474",
       repairDeptName: "木工班",
       repairId: "1121506709878874114",
       repairNo: "BX-191191800004",
       repairTelNo: null,
       repairUserId: "1078635426402230274",
       repairUserMobile: "123445645646456",
       repairUserName: "王龙",
       repairVisited: null,
       roomId: "1078650104872394754",
       roomName: "后勤总务房间2-001",
       sequence: null,
       status: "9",
       statusDesc: "待评价",
       telNo: "86786767",
       updateTime: 1556605515000,
       }

       this.state = {
        thisRecord:thisRecord,
        causeIdList:[],
        causeRemark:[],
        personList:[],
        wuZiList:[],
        repair:[],
        evaluate:'',
        dataArrayA : [  { title: "概况", content: <OrderItem type='4' record={thisRecord}/>}],
//        dataArrayE : [  { title: "评价", content: <OrderEvaOver record={thisRecord}/>}],
//        dataArrayB : [  { title: "维修事项", content: <OrderPerson/> }],
//        dataArrayC : [  { title: "物料", content: <OrderWuZi wuzi={wuZiList}/> }],
        dataArrayD : [  { title: "评价", content: <OrderEva setRemark={(remark)=>this.setRemark(remark)} chCause={(cause)=>this.chCause(cause)} clearCause={()=>this.clearCause()}/> }],
       };
//       获取评价选项
       var   url="http://47.102.197.221:8188/api/repair/request/detail/1121506709878874114";
       var data = thisRecord.repairId;
           axios({
               method: 'GET',
               url: url,
               data: null,
               headers:{
                    'x-tenant-key':'Uf2k7ooB77T16lMO4eEkRg==',
                    'rcId':'1055390940066893827',
                    'Authorization':'18b0384b-0f0b-42cc-a715-5fcb23ea5948',
               }
           }).then(
               (response) => {
                    var repair =  response.data.data;
                    this.setState({
                        repair : repair,
                        wuZiList : repair.materialList,
                        personList : repair.itemPersonList
                    })
               }
           ).catch((error)=> {
               console.log(error)
           });

//       获取评价选项
       var   url="http://47.102.197.221:8188/api/repair/service/evaluate_cause/"+this.state.thisRecord.repairId;
           axios({
               method: 'GET',
               url: url,
               data: null,
                headers:{
                    'x-tenant-key':'Uf2k7ooB77T16lMO4eEkRg==',
                    'rcId':'1055390940066893827',
                    'Authorization':'5ee52285-3af9-4a61-a400-a3743b501da9',
                }
           }).then(
               (response) => {
                    var evaluate = response.data.data;
                    this.setState({
                        evaluate:evaluate,
                    });
               }
           ).catch((error)=> {
               console.log(error)
           });
    }




    getWuZiList(){
        return this.state.wuZiList;
    }


    //清空满意不满意原因
    clearCause(){
        this.setState({causeIdList:[]})
    }
    //满意不满意原因
    chCause(cause){
        var causeList = this.state.causeIdList;
        causeList.push(cause.causeId);
        this.setState({causeIdList:causeList})
    }
    //评价原因
    setRemark(remark){
        this.setState({causeRemark:remark});
    }

    _renderHeader(item, expanded) {
    return (
      <View style={{
        borderTopWidth:1,
        borderColor:'#fff',
        flexDirection: "row",
        padding: 10,
        alignItems: "center" ,
        backgroundColor: "#f8f8f8" }}>
      {expanded
                ? <Image style={{ width: 18,height:18 }} source={require('../image/collapse_02.png')} />
                : <Image style={{ width: 18,height:18 }} source={require('../image/collapse_01.png')} />}
      <Text style={{color:'#6b6b6b'}}>
          {" "}{item.title}
        </Text>
      </View>
    );
    }
    _renderContent(item) {
      return (
        <Content>
            {item.content}
        </Content>
      );
    }
    render() {
    return (
        <Container>
            {/*<MyHeader/>*/}
            <Content style={{ backgroundColor: "white" }}>
                {this.state.thisRecord.status==='8' &&
                    <Accordion
                      dataArray={this.state.dataArrayD}
                      animation={true}
                      expanded={true}
                      renderHeader={this._renderHeader}
                      renderContent={this._renderContent}
                      expanded={0}
                    />
                }
                <Accordion
                  dataArray={this.state.dataArrayA}
                  animation={true}
                  expanded={true}
                  renderHeader={this._renderHeader}
                  renderContent={this._renderContent}
                  expanded={0}
                />
                <Accordion
                  dataArray={[{ title: "维修事项", content: <OrderPerson person={this.state.personList}/> }]}
                  animation={true}
                  expanded={true}
                  renderHeader={this._renderHeader}
                  renderContent={this._renderContent}
                  expanded={(this.state.thisRecord.status==='8')?true:0}
                />
                <Accordion
                  dataArray={[{ title: "物料", content: <OrderWuZi wuzi={this.state.wuZiList}/> }]}
                  animation={true}
                  expanded={true}
                  renderHeader={this._renderHeader}
                  renderContent={this._renderContent}
                  expanded={0}
                />
                {this.state.thisRecord.status==='9' &&
                    <Accordion
                      dataArray={[{ title: "评价", content: <OrderEvaOver evaluate={this.state.evaluate} record={this.state.thisRecord}/>}]}
                      animation={true}
                      expanded={true}
                      renderHeader={this._renderHeader}
                      renderContent={this._renderContent}
                      expanded={0}
                    />
                }
            </Content>
            {this.state.thisRecord.status==='8' &&
                <MySub repairId={this.state.thisRecord.repairId} remark={this.state.causeRemark} causeIds={this.state.causeIdList}/>
            }
        </Container>
    );
    }
}


class MyHeader extends Component {//head模块
  render() {
    return (
        <Header style={stylesHeader.headerColor}>
          <Left>
            <Button transparent>
              <Icon name='arrow-back'  style={{color:'#000'}}/>
            </Button>
          </Left>
          <Body style={stylesHeader.headerBordy}>
            <Title style={stylesHeader.titleColor}>报修单评价</Title>
          </Body>
          <Right></Right>
        </Header>
    );
  }
}


class MySub extends Component {//提交按钮模块

    submitEvaluate(repairId,remark,causeIds){
       var   url="http://10.145.196.107:8082/api/repair/repair/evaluate";
       var data = {
            repairId:repairId,
            remark:remark,
            causeIds:causeIds
       };
           axios({
               method: 'POST',
               url: url,
               data: data,
           }).then(
               (response) => {
                      Alert.alert("提交成功");
               }
           ).catch((error)=> {
               console.log(error)
           });
    }


  render() {
    return (
        <Footer style={{height:50,backgroundColor:'#6dc5c9',marginTop:10}}>
             <Button  style={{width:ScreenWidth,backgroundColor:'#6dc5c9',height:50}}
             onPress={()=>this.submitEvaluate(this.props.repairId,this.props.remark,this.props.causeIds)}
             >
                <Text style={{width:ScreenWidth,color:'#ffffff',fontSize:20,textAlign:'center'}}>提交</Text>
             </Button>
          </Footer>
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


module.exports=OrderEvaluate;
