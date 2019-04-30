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
import OrderPerson from './publicTool/OrderPerson';
import axios from 'axios';




let ScreenWidth = Dimensions.get('window').width;

let dataArrayA = [  { title: "概况", content: <OrderItem   type='0'/>}];
let dataArrayB = [  { title: "维修事项", content: <OrderPerson/> }];
let dataArrayC = [  { title: "物料", content: <OrderWuZi/> }];
let dataArrayD = [  { title: "评价", content: <OrderEva/> }];

class OrderEvaluate extends Component {//主页面
    constructor(props) {
       super(props);
       let thisRecord={
        createTime:1552362778000,
        deptId:"1083852071089426434",
        deptName:"行政总务",
        hours:314.8,
        isUrgent:"0",
        matterId:888881048,
        matterName:"A设备损坏（换设备、修设备）",
        ownerId:"1601500545875394402",
        ownerName:"周某",
        ownerVisited:null,
        repairDeptId:"1078641550383865857",
        repairDeptName:"维修总仓",
        repairId:"1105315716528799747",
        repairNo:"BX-190711100002",
        repairTelNo:null,
        repairUserId:"1078641974478331906",
        repairUserMobile:"1111123",
        repairUserName:"张三",
        repairVisited:null,
        status:"8",
        statusDesc:"待评价",
        telNo:"78888",
        updateTime:1552362814000
       }

       this.state = {
        thisRecord:thisRecord,
        causeIdList:[],
        causeRemark:[],
        personList:[],
        wuZiList:[],
        repair:[],
        dataArrayA : [  { title: "概况", content: <OrderItem type='4' record={thisRecord}/>}],
//        dataArrayB : [  { title: "维修事项", content: <OrderPerson/> }],
//        dataArrayC : [  { title: "物料", content: <OrderWuZi wuzi={wuZiList}/> }],
        dataArrayD : [  { title: "评价", content: <OrderEva setRemark={(remark)=>this.setRemark(remark)} chCause={(cause)=>this.chCause(cause)} clearCause={()=>this.clearCause()}/> }],
       };

       var   url="http://47.102.197.221:8188/api/repair/request/detail/1121506709878874114";
       var data = thisRecord.repairId;
           axios({
               method: 'GET',
               url: url,
               data: null,
               headers:{
                    'x-tenant-key':'Uf2k7ooB77T16lMO4eEkRg==',
                    'rcId':'1055390940066893827',
                    'Authorization':'e0b9843a-30e8-4043-ba31-41bed590ca8e',
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


    }
    getWuZiList(){
        return this.state.wuZiList;
    }

    static navigationOptions = {
        // header: null,
        headerTitle: '报修单评价',
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
                {(this.state.thisRecord.status==='8'|| this.state.thisRecord.status==='9') &&
                    <Accordion
                      dataArray={this.state.dataArrayD}
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
