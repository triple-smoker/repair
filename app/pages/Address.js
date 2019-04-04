import React, { Component } from 'react';
import {StyleSheet,Alert} from 'react-native';
import {  Input, Row, Container, Content, Left, Right, Button, Text, List, ListItem} from 'native-base';
import MyFooter from '../components/MyFooter';


class MyAddress extends Component {

    static navigationOptions = {
        headerTitle: '我的地址',
    };

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

    saveReport(){

        // Alert.alert('1234');

        let info = {
            name : this.state.AddName,
            phone : this.state.AddPhone,
            address : this.state.AddAdds
        };

        this.props.navigation.state.params.callback(info);
        this.props.navigation.goBack();
        // this.props.navigation.goBack();
        // const { navigate } = this.props.navigation;

        // navigate('Repair',reporter);
    }

  render() {
    return (
      <Container>
        <Content style={{borderTopWidth: 2,borderColor:'#e1e1e1'}}>
            <MyMessage name={this.state.AddName} phone={this.state.AddPhone} address={this.state.AddAdds}/>
            <Row style={{height:40,backgroundColor:'#f8f8f8'}}>
                <Text style={{width: '100%',textAlign:'center',color:'#a7a7a7',marginTop:14,fontSize:12}}>--------------切换以下历史地址--------------</Text>
            </Row>
            <Row>
              <List style={{width: '100%'}}>
                  <Adds name='周良' phone='12388888888' address='A机房C机架B群组-F203' changAdds={()=>this._changeAdds('周良','12388888888','A机房C机架B群组-F203')}/>
                  <Adds name='周良二' phone='12377777777' address='B机房C机架B群组-F203' changAdds={()=>this._changeAdds('周良二','12377777777','B机房C机架B群组-F203')}/>
              </List>
            </Row>

        </Content>
          <MyFooter submit={() => this.saveReport()} value='确定'/>
      </Container>
    );
  }
}

class MyMessage extends Component {//地址输入模块
  render() {
    return (
        <Content>
            <Item ItemName={"报修人"} ItemValue={this.props.name}/>
            <Item ItemName={"联系电话"} ItemValue={this.props.phone}/>
            <Item ItemName={"报修位置"} ItemValue={this.props.address}/>
        </Content>
    );
  }
}

const Item = ({ItemName , ItemValue}) => (
    <Row style={{height:42,borderBottomWidth: 2,borderColor:'#e1e1e1',marginLeft:16}}>
        <Text style={stylesBody.bodyFont}>{ItemName}</Text><Input style={stylesBody.bodyInputFont}>{ItemValue}</Input>
    </Row>
    );

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
                          <Text style={stylesBody.linkMan}>报修位置:<Text style={stylesBody.linkMan}>{this.props.address}</Text></Text>
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
