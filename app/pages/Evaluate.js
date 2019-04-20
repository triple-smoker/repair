import React, { Component } from 'react';
import {
    StyleSheet,
    Dimensions,
    Image,
} from 'react-native';
import { Container, Content,
    Header,Left,Button,Body,Title,Right,Icon,
    Row,Col,Accordion,View,Text,Footer} from 'native-base';
import OrderItem from './publicTool/OrderItem';
import OrderWuZi from './publicTool/OrderWuZi';
import OrderEva from './publicTool/OrderEva';
import OrderPerson from './publicTool/OrderPerson';




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
        dataArrayA : [  { title: "概况", content: <OrderItem type='4' record={thisRecord}/>}],
        dataArrayB : [  { title: "维修事项", content: <OrderPerson/> }],
        dataArrayC : [  { title: "物料", content: <OrderWuZi/> }],
        dataArrayD : [  { title: "评价", content: <OrderEva/> }],
       };
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
                  dataArray={this.state.dataArrayB}
                  animation={true}
                  expanded={true}
                  renderHeader={this._renderHeader}
                  renderContent={this._renderContent}
                  expanded={0}
                />
                <Accordion
                  dataArray={this.state.dataArrayC}
                  animation={true}
                  expanded={true}
                  renderHeader={this._renderHeader}
                  renderContent={this._renderContent}
                  expanded={0}
                />
                <Accordion
                  dataArray={this.state.dataArrayD}
                  animation={true}
                  expanded={true}
                  renderHeader={this._renderHeader}
                  renderContent={this._renderContent}
                  expanded={0}
                />
            </Content>
            <MySub/>
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
  render() {
    return (
        <Footer style={{height:50,backgroundColor:'#6dc5c9',marginTop:10}}>
             <Button  style={{width:ScreenWidth,backgroundColor:'#6dc5c9',height:50}}

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
