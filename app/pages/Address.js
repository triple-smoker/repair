import React, { Component } from 'react';
import {StyleSheet,Alert} from 'react-native';
import {  Input, Row, Container, Content, Left, Right, Button, Text, List, ListItem} from 'native-base';
import MyFooter from '../components/MyFooter';


class MyAddress extends Component {

    static navigationOptions = {
        headerTitle: '我的地址',
        headerBackImage: (<Image resizeMode={'contain'} style={{width: 12, height: 25}} source={require('../image/navbar_ico_back.png')} />),
        headerStyle: {
            elevation: 0,
        },

    };

    constructor(props) {
        super(props);

        const { navigation } = this.props;
        const AddName = navigation.getParam('reporter', '');
        const AddPhone = navigation.getParam('phone', '');
        const AddAdds = navigation.getParam('address', '');
        this.state = {
            AddName: AddName,
            AddPhone: AddPhone,
            AddAdds: AddAdds,
            reporterList : [],
        };

        AsyncStorage.getItem('reporterInfoHistory',function (error, result) {

                if (error) {
                    // alert('读取失败')
                }else {
                    console.log('------------------------');
                    console.log(result);
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

    _changeAdds(name,phone,adds){
        this.setState({
            AddName: name,
            AddPhone: phone,
            AddAdds: adds
        })
    }


    saveReport(){

        let key = 'reporterInfoHistory';

        let reporterList = this.state.reporterList;
        let info = {
            name : this.state.AddName,
            phone : this.state.AddPhone,
            address : this.state.AddAdds
        };


        if(reporterList === null){
            reporterList = new Array()
        }

        reporterList.splice(0,0,info);

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


        this.props.navigation.state.params.callback(info);
        this.props.navigation.goBack();

    }

    /**
     * 保存输入
     * @returns {*}
     */
    changeName(value){
        // Alert.alert(value.toString());
        console.log(value)
        this.setState({
            AddName : value,
        })
    }
    changePhone(value){
        // Alert.alert(value);
        this.setState({
            AddPhone : value,
        })
    }
    changeAdds(value){
        // Alert.alert(value);
        this.setState({
            AddAdds : value,
        })
    }


    history(){
        const reporterList = this.state.reporterList;
        const listItems =  reporterList === null ? null : reporterList.map((report, index) =>
            <Adds key={index} name={report.name} phone={report.phone} address={report.address}
                  changAdds={()=>this._changeAdds(report.name,report.phone,report.address)}/>
        );
        return listItems;
    }

  render() {
    return (
      <Container>
        <Content style={{borderTopWidth: 2,borderColor:'#e1e1e1'}}>
            <MyMessage
                changeName = {(value) => this.changeName(value)}
                changePhone = {(value) => this.changePhone(value)}
                changeAdds = {(value) => this.changeAdds(value)}
                name={this.state.AddName} phone={this.state.AddPhone} address={this.state.AddAdds}/>
            <Row style={{height:40,backgroundColor:'#f8f8f8'}}>
                <Text style={{width: '100%',textAlign:'center',color:'#a7a7a7',marginTop:14,fontSize:12}}>--------------切换以下历史地址--------------</Text>
            </Row>
            {this.history()}
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
            <Item ItemName={"报修人"} change = {( value) => this.props.changeName(value)} ItemValue={this.props.name}/>
            <Item ItemName={"联系电话"} change = {( value) => this.props.changePhone(value)} ItemValue={this.props.phone}/>
            <Item ItemName={"报修位置"}  change = {( value) => this.props.changeAdds(value)} ItemValue={this.props.address}/>
        </Content>
    );
  }
}

const Item = ({ItemName , ItemValue, change}) => (
    <Row style={{height:42,borderBottomWidth: 2,borderColor:'#e1e1e1',marginLeft:16}}>
        <Text style={stylesBody.bodyFont}>{ItemName}</Text>
        <TextInput style={stylesBody.bodyInputFont}
                   onChangeText={(text) => change(text)}
                   value={ItemValue} />
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
            height: 40,
            // borderColor: 'gray',
            // borderWidth: 1,
            width: '75%',
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
