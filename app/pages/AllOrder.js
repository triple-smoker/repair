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
import {  TabHeading,Item,Input,Button,Icon,ScrollableTab, Tabs, Tab , Col, Row, Container, Content, Header, Left, Body, Right, Text, List, ListItem, Thumbnail} from 'native-base';

import Tab1 from './OrderOne';
import Tab2 from './OrderTwo';



let ScreenWidth = Dimensions.get('window').width;
let dialogWidth = ScreenWidth-80;
class AllOrder extends Component {

    static navigationOptions = {
        header: null,
    };

    constructor(props) {
       super(props);
       this.state = { modalVisible: false};
    }
    onClose() {
       this.setState({modalVisible: false});
    }
    _setModalVisible(visible) {
      this.setState({modalVisible: !this.state.modalVisible});
    }


  render() {
    return (
      <Container>
        <MyHeader/>
        <Content>
            <Tabs style={{backgroundColor:'#000'}}>
              <Tab heading='维修中' tabStyle={{backgroundColor:'#fff'}} activeTabStyle={{backgroundColor:'#fff',borderBottomWidth:2,borderColor:'#62c0c5'}} textStyle={{color:'#999'}} activeTextStyle={{color:'#62c0c5'}}>
                <Tab1  type='1' ShowModal = {() => this._setModalVisible()}/>
              </Tab>
              <Tab heading='待评价' tabStyle={{backgroundColor:'#fff'}} activeTabStyle={{backgroundColor:'#fff',borderBottomWidth:2,borderColor:'#62c0c5'}} textStyle={{color:'#999'}} activeTextStyle={{color:'#62c0c5'}}>
                <Tab2  type='2'/>
              </Tab>
            </Tabs>
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
                         <ImageBackground
                          style={{width: dialogWidth,height:300}}
                          source={require('../resource/assets/12dc7f63ef891861a679be8027c70f3.png')}
                        />
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
