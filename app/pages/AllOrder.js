import React, { Component } from 'react';
import {
    Image,
    ImageBackground,
    Alert,
    Dimensions,
    StyleSheet,
    Modal,
    TouchableHighlight,
    TouchableOpacity,
    View,
    TextInput,
} from 'react-native';
import {  Footer,FooterTab,TabHeading,Item,Input,Button,Icon, Tabs, Tab , Col, Row, Container, Content, Header, Left, Body, Right, Text, List, ListItem, Thumbnail} from 'native-base';
import axios from 'axios';
import OrderType from './publicTool/OrderType'
import OrderItem from './publicTool/OrderItem';


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
       };
    }


    goBack(){
        const { navigate } = this.props.navigation;
        this.props.navigation.goBack();
    }
    _setTypeVisible() {
       this.setState({typeVisible: !this.state.typeVisible});
    }


    goSearch(){
        const { navigate } = this.props.navigation;
        navigate('OrderSearch')
    }

    onClose() {
       this.setState({modalVisible: false});
    }
    _setModalVisible(repairId,sendDeptId,sendUserId) {
    //催单
    if(!this.state.modalVisible){
        let data = {
                  repairId: repairId,
                  sendDeptId: sendDeptId,
                  sendUserId: sendUserId
               }
        axios({
            method: 'POST',
            url: 'http://47.102.197.221:8188/api/repair/request/remind',
            data: data,
            header:{
                'Content-type': 'application/json',
                'x-tenant-key':'Uf2k7ooB77T16lMO4eEkRg==',
                'rcId':'1055390940066893827',
                'Authorization':'5583be92-9de4-42cd-86c0-e704cba0fed6',
            }
        }).then(
            (response) => {
                this.setState({modalVisible: true});
            }
        ).catch((error)=> {
            console.log(error)
        });
    }else{
        this.setState({modalVisible: false})
        }
    }
    _setSearchVisible(visible) {
      this.setState({searchVisible: visible});
    }
//    切换tab页
    _getTabs(type){
        return (
        <View  style={{backgroundColor:'#f8f8f8'}}>
            <Row style={{height:40}}>
                {type==1 && this.state.searchVisible==true &&
                    <Text style={{width:ScreenWidth,textAlign:'center',color:'#a7a7a7',marginTop:14,fontSize:12}}>{'-------共'+this.state.tab1+'条维修中工单-------'}</Text>
                }
                {type==2 && this.state.searchVisible==true &&
                    <Text style={{width:ScreenWidth,textAlign:'center',color:'#a7a7a7',marginTop:14,fontSize:12}}>{'-------共'+this.state.tab2+'条待评价工单-------'}</Text>
                }
                {this.state.searchVisible==false &&
                    <Text style={{width:ScreenWidth,textAlign:'center',color:'#a7a7a7',marginTop:14,fontSize:12}}>{'-------共'+this.state.tab3+'条维修工单-------'}</Text>
                }
            </Row>
            <Content>
                {type==1 && this.state.searchVisible==true &&
                    <Col>
                        {this._getAllOrders(1)}
                        {this._setOrderItem(1)}
                    </Col>
                }
                {type==2 && this.state.searchVisible==true &&
                    <Col>
                        {this._getAllOrders(2)}
                        {this._setOrderItem(2)}
                    </Col>
                }
                {this.state.searchVisible==false &&
                    <Col>
                        {this._getAllOrders(3)}
                        {this._setOrderItem(3)}
                    </Col>
                }
            </Content>
        </View>
        )
    }
//获取列表数据
    _getAllOrders(type){

        let that = this;

        let repRepairInfo = {
                    page: 1,
                    limit: 100,
                    deptId: '1078386763486683138',
                    ownerId: '',
                    status: ''
                 }
        var url="";
        var data;
        var records1;
        var records2;
        var records3;
        if(type === 1){
            url="http://47.102.197.221:8188/api/repair/request/list/underway";

            data=repRepairInfo;
        };
        if(type === 2){
            url="http://47.102.197.221:8188/api/repair/request/list/evaluate"
            data=repRepairInfo;
            data.status='8';
        };
        if(type === 3){
            url="http://47.102.197.221:8188/api/repair/request/list"
            data=repRepairInfo;
        };
        axios({
            method: 'GET',
            url: url,
            data: data,
            headers:{
                'x-tenant-key':'Uf2k7ooB77T16lMO4eEkRg==',
                'rcId':'1055390940066893827',
                'Authorization':'5583be92-9de4-42cd-86c0-e704cba0fed6',
            }
        }).then(
            (response) => {
                if(type === 1&&this.state.recordList1.length===0){
                console.log("未完成订单：");
                console.log(response.data.data.records);
                    records1 = response.data.data.records;
                    this.setState({recordList1:records1,tab1:records1.length});
                }else if(type === 2&&this.state.recordList2.length===0){
                console.log("待评价订单："+response.data.data.records);
                    records2 =response.data.data.records;
                    this.setState({recordList2:records2,tab2:records2.length});
                }else if(type === 3&&this.state.recordList3.length===0){
                console.log("历史订单："+response.data.data.records);
                    records3 =response.data.data.records;
                    this.setState({recordList3:records3,tab3:records3.length});
                }
            }
        ).catch((error)=> {
            console.log(error)
        });

    }
    _setOrderItem(ty){
        let recordList = [];
        if(ty===1){
            recordList = this.state.recordList1;
        }else if(ty===2){
            recordList = this.state.recordList2;
        }else if(ty===3){
            recordList = this.state.recordList3;
        }
        let listItems =(  recordList === null ? null : recordList.map((record, index) =>
            <OrderItem key={index}  type={ty} getEvaluate={()=>this.getEvaluate(record)} record={record} ShowModal = {(repairId,sendDeptId,sendUserId) => this._setModalVisible(repairId,sendDeptId,sendUserId)}/>
        ))
        return listItems;
    }
    getEvaluate(record){
        const { navigate } = this.props.navigation;
        navigate('Evaluate', {
            record: record,
        })
    }

//报修导航
    newRepair(){
        this.setState({typeVisible: !this.state.typeVisible});
        const { navigate } = this.props.navigation;
        navigate('Repair')
    }


  render() {
    return (
      <Container>
        <Content>
            <Row>
                    <TouchableHighlight style={{width:'10%',height:50}} onPress={()=>this.goBack()}>
                        <Image style={{width:12,height:25,margin:13}} source={require("../image/navbar_ico_back.png")}/>
                    </TouchableHighlight>
                    <Button  onPress={()=>this.goSearch()} transparent style={{width:'75%',backgroundColor:'#f4f4f4',borderRadius:25}}>
                        <Row>
                            <Image style={{width:20,height:20,marginTop:5,marginLeft:10,marginRight:5}} source={require("../image/ico_seh.png")}/>
                            <Text style={{marginTop:5,fontSize:16,color:'#d0d0d0'}}>请输入单号或内容</Text>
                        </Row>
                    </Button>
                    <TouchableHighlight onPress={()=>this._setTypeVisible()} transparent style={{width:'15%',height:50,borderWidth:0,paddingTop:13,paddingLeft:5}}>
                        <Row>
                            <Image style={{width:20,height:20}} source={require("../image/navbar_ico_bx.png")}/>
                            <Text style={{color:"#252525"}}>报修</Text>
                        </Row>
                    </TouchableHighlight>
                    <OrderType goToRepair={()=>this.newRepair()} isShowModal={()=>this._setTypeVisible()} modalVisible = {this.state.typeVisible}/>
            </Row>
            {this.state.searchVisible==true&&
                <Tabs style={{backgroundColor:'#000'}}>
                  <Tab heading={'待维修('+this.state.tab1+')'} tabStyle={{backgroundColor:'#fff'}} activeTabStyle={{backgroundColor:'#fff',borderBottomWidth:2,borderColor:'#62c0c5'}} textStyle={{color:'#999',fontSize:16}} activeTextStyle={{color:'#62c0c5',fontWeight:"normal",fontSize:16}}>
                        {this._getTabs('1')}
                  </Tab>
                  <Tab heading={'待评价('+this.state.tab2+')'} tabStyle={{backgroundColor:'#fff'}} activeTabStyle={{backgroundColor:'#fff',borderBottomWidth:2,borderColor:'#62c0c5'}} textStyle={{color:'#999',fontSize:16}} activeTextStyle={{color:'#62c0c5',fontWeight:"normal",fontSize:16}}>
                        {this._getTabs('2')}
                  </Tab>
                </Tabs>
            }
            {this.state.searchVisible==false&&
                <Tabs style={{backgroundColor:'#000'}}>
                  <Tab heading={'历史维修('+this.state.tab3+')'} tabStyle={{backgroundColor:'#fff'}} activeTabStyle={{backgroundColor:'#fff',borderBottomWidth:2,borderColor:'#62c0c5'}} textStyle={{color:'#999',fontSize:16}} activeTextStyle={{color:'#62c0c5',fontWeight:"normal",fontSize:16}}>
                        {this._getTabs('3')}
                  </Tab>
                </Tabs>
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
        <Footer>
          <FooterTab style={{borderTopWidth:1,borderColor:'#e5e5e5'}}>
            <Button full style={{backgroundColor:'#fafafa'}} onPress={()=>this._setSearchVisible(true)} >
                <Col style={{justifyContent:'center'}}>
                    <Image
                        style={{width: 30,height:30}}
                        source={(this.state.searchVisible==true) ? require('../image/tab_ico_wdwx_pre.png'):require('../image/tab_ico_wdwx_nor.png')}
                    />
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
