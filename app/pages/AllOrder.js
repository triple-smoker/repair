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
import {  Footer,FooterTab,TabHeading,Item,Input,Button,Icon,ScrollableTab, Tabs, Tab , Col, Row, Container, Content, Header, Left, Body, Right, Text, List, ListItem, Thumbnail} from 'native-base';

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
       searchVisible: true
       };
    }
    onClose() {
       this.setState({modalVisible: false});
    }
    _setModalVisible(visible) {
      this.setState({modalVisible: !this.state.modalVisible});
    }
    _setSearchVisible(visible) {
      this.setState({searchVisible: visible});
    }
    _getTabs(type){
        return (
        <View  style={{backgroundColor:'#f8f8f8'}}>
            <Row style={{height:40}}>
                {type==1 && this.state.searchVisible==true &&
                    <Text style={{width:ScreenWidth,textAlign:'center',color:'#a7a7a7',marginTop:14,fontSize:12}}>-------共N条维修中工单-------</Text>
                }
                {type==2 && this.state.searchVisible==true &&
                    <Text style={{width:ScreenWidth,textAlign:'center',color:'#a7a7a7',marginTop:14,fontSize:12}}>-------共N条待评价工单-------</Text>
                }
                {this.state.searchVisible==false &&
                    <Text style={{width:ScreenWidth,textAlign:'center',color:'#a7a7a7',marginTop:14,fontSize:12}}>-------共N条维修工单-------</Text>
                }
            </Row>
            <Content>
                {type==1 && this.state.searchVisible==true &&
                    <Col>
                        <OrderItem   type={type} ShowModal = {() => this._setModalVisible()}/>
                    </Col>
                }
                {type==2 && this.state.searchVisible==true &&
                    <Col>
                        <OrderItem   type={type}/>
                    </Col>
                }
                {this.state.searchVisible==false &&
                    <Col>
                        <OrderItem   type={1}/>
                        <OrderItem   type={2}/>
                        <OrderItem   type={3}/>
                    </Col>
                }
            </Content>
        </View>
        )
    }


  render() {
    return (
      <Container>
        <Content>
            <Row>
                    <TouchableHighlight style={{width:'10%',height:50}}>
                        <Image style={{width:12,height:25,margin:13}} source={require("../image/navbar_ico_back.png")}/>
                    </TouchableHighlight>
                    <Button  transparent style={{width:'75%',backgroundColor:'#f4f4f4',borderRadius:25}}>
                        <Row>
                            <Image style={{width:20,height:20,marginTop:5,marginLeft:10,marginRight:5}} source={require("../image/ico_seh.png")}/>
                            <Text style={{marginTop:5,fontSize:16,color:'#d0d0d0'}}>请输入单号或内容</Text>
                        </Row>
                    </Button>
                    <TouchableHighlight transparent style={{width:'15%',height:50,borderWidth:0,paddingTop:13,paddingLeft:5}}>
                        <Row>
                            <Image style={{width:20,height:20}} source={require("../image/navbar_ico_bx.png")}/>
                            <Text style={{color:"#252525"}}>报修</Text>
                        </Row>
                    </TouchableHighlight>
            </Row>
            {this.state.searchVisible==true&&
                <Tabs style={{backgroundColor:'#000'}}>
                  <Tab heading='维修中' tabStyle={{backgroundColor:'#fff'}} activeTabStyle={{backgroundColor:'#fff',borderBottomWidth:2,borderColor:'#62c0c5'}} textStyle={{color:'#999'}} activeTextStyle={{color:'#62c0c5'}}>
                        {this._getTabs('1')}
                  </Tab>
                  <Tab heading='待评价' tabStyle={{backgroundColor:'#fff'}} activeTabStyle={{backgroundColor:'#fff',borderBottomWidth:2,borderColor:'#62c0c5'}} textStyle={{color:'#999'}} activeTextStyle={{color:'#62c0c5'}}>
                        {this._getTabs('2')}
                  </Tab>
                </Tabs>
            }
            {this.state.searchVisible==false&&
                <Tabs style={{backgroundColor:'#000'}}>
                  <Tab heading='历史维修' tabStyle={{backgroundColor:'#fff'}} activeTabStyle={{backgroundColor:'#fff',borderBottomWidth:2,borderColor:'#62c0c5'}} textStyle={{color:'#999'}} activeTextStyle={{color:'#62c0c5'}}>
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
                        <View style={{paddingRight:40,paddingTop:20}}>
                             <Image
                              style={{marginLeft:20,width: dialogWidth,height:300}}
                              source={require('../image/cuidan.png')}
                            />
                        </View>
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
