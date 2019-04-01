import React, { Component } from 'react';
import {StyleSheet, Dimensions, View, Image, Alert } from 'react-native';
import {  Input, Row, Container, Content, Header, Left, Body, Right, Button, Icon, Title, Text, List, ListItem, Thumbnail,Footer } from 'native-base';


let ScreenWidth = Dimensions.get('window').width;
let ScreenHeight = Dimensions.get('window').height;
class MyAddress extends Component {

    constructor(props) {
        super(props);
        this.state = {
        AddName: '',
        AddPhone: '',
        AddAdds: '',
        };
      }
    _changeAdds(name,phone,adds){
        this.setState({
            AddName: name,
            AddPhone: phone,
            AddAdds: adds
        })
    }
  render() {
    return (
      <Container>
        {/*<MyHeader/>*/}
        <Content style={{borderTopWidth: 2,borderColor:'#e1e1e1'}}>
            <MyMessage name={this.state.AddName} phone={this.state.AddPhone} adds={this.state.AddAdds}/>
            <Row style={{height:40,backgroundColor:'#f8f8f8'}}>
                <Text style={{width:ScreenWidth,textAlign:'center',color:'#a7a7a7',marginTop:14,fontSize:12}}>--------------切换以下历史地址--------------</Text>
            </Row>
            <Row>
              <List style={{width:ScreenWidth}}>
                  <Adds name='周良' phone='12388888888' adds='A机房C机架B群组-F203' changAdds={()=>this._changeAdds('周良','12388888888','A机房C机架B群组-F203')}/>
                  <Adds name='周良二' phone='12377777777' adds='B机房C机架B群组-F203' changAdds={()=>this._changeAdds('周良二','12377777777','B机房C机架B群组-F203')}/>
              </List>
            </Row>

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
            <Title style={stylesHeader.titleColor}>我的地址</Title>
          </Body>
          <Right></Right>
        </Header>
    );
  }
}


class MyMessage extends Component {//地址输入模块
  render() {
    return (
        <Content>
            <Row style={{height:42,borderBottomWidth: 2,borderColor:'#e1e1e1',marginLeft:16}}>
                <Text style={stylesBody.bodyFont}>报修人</Text><Input style={stylesBody.bodyInputFont}>{this.props.name}</Input>
            </Row>
            <Row style={{height:42,borderBottomWidth: 2,borderColor:'#e1e1e1',marginLeft:16}}>
                <Text style={stylesBody.bodyFont}>联系电话</Text><Input style={stylesBody.bodyInputFont}>{this.props.phone}</Input>
            </Row>
            <Row style={{height:42,marginLeft:16}}>
                <Text style={stylesBody.bodyFont}>报修位置</Text><Input style={stylesBody.bodyInputFont}>{this.props.adds}</Input>
            </Row>
        </Content>
    );
  }
}

class Adds extends Component {//历史地址模块
  render() {
    return (
            <ListItem>
              <Left>
                  <Content>
                      <Row>
                          <Text style={stylesBody.linkMan}>报修人:<Text style={stylesBody.linkMan}>{this.props.name}</Text></Text><Text style={{paddingLeft:40,fontSize:14,color:'#606060'}}>{this.props.phone}</Text>
                      </Row>
                      <Row>
                          <Text style={stylesBody.linkMan}>报修位置:<Text style={stylesBody.linkMan}>{this.props.adds}</Text></Text>
                      </Row>
                  </Content>
              </Left>
              <Right>
                  <Button rounded bordered style={stylesBody.buttonSim}
                    onPress = {this.props.changAdds}
                  >
                      <Text style={stylesBody.buttonFontSim}>切换</Text>
                  </Button>
              </Right>
            </ListItem>
    );
  }
}

class MySub extends Component {//提交按钮模块
  render() {
    return (
        <Footer style={{height:50,backgroundColor:'#6dc5c9'}}>
             <Button  style={{width:ScreenWidth,backgroundColor:'#6dc5c9',height:50}}
             >
                <Text style={{width:ScreenWidth,color:'#ffffff',fontSize:20,textAlign:'center'}}>确定</Text>
             </Button>
          </Footer>
    );
  }
}


const stylesHeader=StyleSheet.create({
       headerColor:{
           backgroundColor:'#fff',
       },
      headerBordy:{
            alignItems: 'center',
            marginLeft:100
       },
       titleColor:{
           color:'#000'
       },
});
const stylesBody=StyleSheet.create({
        bodyFont:{
            fontSize:14,
            color:'#9f9f9f',
            marginTop:13,
            width:80
        },
        bodyInputFont:{
            fontSize:14,
            color:'#606060',
        },
        bodyFonts:{
            fontSize:14,
            color:'#606060',
            marginTop:13,
        },
        buttonSim:{
            borderColor:'#83ced1',
            width:60,
            height:25,
        },
        buttonFontSim:{
            color:'#83ced1',
            fontSize:12
        },
        linkMan:{
            fontSize:14,
            color:'#606060',
        }
});

export default MyAddress;
// module.exports=MyAddress;
