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
import Axios from '../util/Axios';




let ScreenWidth = Dimensions.get('window').width;


class OrderEvaluate extends Component {//主页面

    static navigationOptions = {
        // header: null,
        headerTitle: '报修单详情',
        headerBackImage: (<Image resizeMode={'contain'} style={{width: 38, height: 60}} source={require('../image/navbar_ico_back.png')} />),
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
       const thisRecord = navigation.getParam('record', '');

       this.state = {
        thisRecord:thisRecord,
        causeIdList:[],
        causeRemark:[],
        personList:[],
        wuZiList:[],
        repair:"",
        evaluate:'',
        satisfactionLevel:'',
        dataArrayA : [  { title: "概况", content: <OrderItem type='4' record={thisRecord}/>}],
//        dataArrayE : [  { title: "评价", content: <OrderEvaOver record={thisRecord}/>}],
//        dataArrayB : [  { title: "维修事项", content: <OrderPerson/> }],
//        dataArrayC : [  { title: "物料", content: <OrderWuZi wuzi={wuZiList}/> }],
        dataArrayD : [  { title: "评价",  content: <OrderEva record={thisRecord} getSatisfactionLevel={(visible)=>this.getSatisfactionLevel(visible)} setRemark={(remark)=>this.setRemark(remark)} chCause={(cause)=>this.chCause(cause)} clearCause={()=>this.clearCause()}/> }],
       };
//       获取评价页面数据块
       var   url="/api/repair/request/detail/"+thisRecord.repairId;
//       var data = thisRecord.repairId;
        Axios.GetAxios(url).then(
            (response) => {
                var repair =  response.data;
                console.log("评价==================");
                console.log(repair);
                this.setState({
                    repair : repair,
                    wuZiList : repair.materialList,
                    personList : repair.itemPersonList
                })
            }
        )


//       获取评价选项
       var   url="/api/repair/service/evaluate_cause/"+this.state.thisRecord.repairId;
        Axios.GetAxios(url).then(
            (response) => {
                var evaluate = response.data;
                this.setState({
                    evaluate:evaluate,
                });
            }
        )
    }

//不满意、一般、满意
    getSatisfactionLevel(visible){
        this.setState({satisfactionLevel:visible});
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
        var temp = 0;
        causeList.forEach((item)=>{
            if(cause.causeId === item){
                temp = 1;
            }
        })
        if(temp === 0 ){
            causeList.push(cause.causeId);
        }
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
    goToAllOrders(){
        this.props.navigation.state.params.callback();
        this.props.navigation.goBack();
    }
    render() {
    return (
        <Container>
            {/*<MyHeader/>*/}
            <Content style={{ backgroundColor: "white" }}>
                {this.state.thisRecord.status==='8' &&
                    <Accordion
                      dataArray={[{ title: "评价",  content: <OrderEva record={this.state.thisRecord} repair={this.state.repair} getSatisfactionLevel={(visible)=>this.getSatisfactionLevel(visible)} setRemark={(remark)=>this.setRemark(remark)} chCause={(cause)=>this.chCause(cause)} clearCause={()=>this.clearCause()}/> }]}
                      animation={true}
                      expanded={true}
                      renderHeader={this._renderHeader}
                      renderContent={this._renderContent}
                      expanded={0}
                    />
                }
                {this.state.thisRecord.status==='9' &&
                <Accordion
                    dataArray={[{ title: "评价", content: <OrderEvaOver evaluate={this.state.evaluate} repair={this.state.repair} record={this.state.thisRecord}/>}]}
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
                  dataArray={[{ title: "维修事项", content: <OrderPerson repair={this.state.repair} person={this.state.personList}/> }]}
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
            </Content>
            {this.state.thisRecord.status==='8' &&
                <MySub goToAllOrders={()=>this.goToAllOrders()} satisfactionLevel={this.state.satisfactionLevel} repairId={this.state.thisRecord.repairId} remark={this.state.causeRemark} causeIds={this.state.causeIdList}/>
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
    constructor(props){
        super(props);
        this.state = {
            goToAllOrders:false
        };
    }
    submitEvaluate(repairId,remark,causeIds,satisfactionLevel,goToAllOrders){
       var   url="/api/repair/request/evaluate";
       var data = {
            repairId:repairId,
            remark:remark,
            satisfactionLevel:satisfactionLevel,
            causeIds:causeIds,
            userId:global.userId,
       };
        Axios.PostAxios(url,data).then(
            (response) => {
                ()=>goToAllOrders();
            }
        )
    }


  render() {
    return (
        <Footer style={{height:50,backgroundColor:'#6dc5c9',marginTop:10}}>
             <Button  style={{width:ScreenWidth,backgroundColor:'#6dc5c9',height:50}}
             onPress={()=>{this.submitEvaluate(this.props.repairId,this.props.remark,this.props.causeIds,this.props.satisfactionLevel,this.props.goToAllOrders())}}
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
