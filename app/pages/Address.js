import React, { Component } from 'react';
import {StyleSheet, Alert, Image, TextInput, View} from 'react-native';
import {Row, Container, Content, Left, Right, Button, Text, List, ListItem ,Textarea} from 'native-base';
import MyFooter from '../components/MyFooter';
import AsyncStorage from '@react-native-community/async-storage';
import Notice from '../components/Notice';

class MyAddress extends Component {

    static navigationOptions = {
        headerTitle: '我的地址',
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
        const AddName = navigation.getParam('reporter', '');
        const AddPhone = navigation.getParam('phone', '');
        const AddAdds = navigation.getParam('address', '');
        this.state = {
            AddName: AddName,
            AddPhone: AddPhone,
            AddAdds: AddAdds,
            reporterList : [],
            showNotice : false,
            noticeText: '',

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



        // 是否电话号码
        isPhoneNumber = (phoneNumber) => {
            const reg = /^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/;
            return reg.test(phoneNumber);
        };

    saveReport(){
        console.log(this.state.AddName)
        if(this.state.AddName===undefined){
            this.setState({
                showNotice : true,
                noticeText: '姓名不允许为空',
            })
            return;
        }
        console.log(this.state.AddPhone)
        if(!this.isPhoneNumber(this.state.AddPhone)){
            this.setState({
                showNotice : true,
                noticeText: '请填写正确的手机号',
            })
            return;
        }
        console.log(this.state.AddAdds)
        if(this.state.AddAdds===undefined){
            this.setState({
                showNotice : true,
                noticeText: '地址不允许为空',
            })
            return;
        }

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


        // callback定义如下，三个参数： element:当前元素值；index：当前元素下标； array:当前数组
        function callback(element, index, array) {
            // callback函数必须返回true或者false，返回true保留该元素，false则不保留。
            return true || false;
        }
        const newreporterList1 = []

        for(let i in reporterList){
            let reporter = reporterList[i];

            if(reporter.name === info.name && reporter.phone === info.phone  && reporter.address === info.address) continue

            newreporterList1.push(reporter);

        }

        newreporterList1.splice(0,0,info);

        if(newreporterList1.length >=6){
            newreporterList1.pop()
        }


        this.setState({
            reporterList: newreporterList1,
        });
        //json转成字符串
        let jsonStr = JSON.stringify(newreporterList1);

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
            {this.state.showNotice ? <Notice text = {this.state.noticeText} /> : null}
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
            <Item ItemName={"报修人"} type={0} change = {( value) => this.props.changeName(value)} ItemValue={this.props.name}/>
            <Item ItemName={"联系电话"} type={1} change = {( value) => this.props.changePhone(value)} ItemValue={this.props.phone}/>
            <Item ItemName={"报修位置"} type={2}  change = {( value) => this.props.changeAdds(value)} ItemValue={this.props.address}/>
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
// class Item extends Component {
//
//         render() {
//             return(
//                 <View  style={{flexDirection:"row",borderBottomWidth: 2,borderColor:'#e1e1e1',marginLeft:16}}>
//                     <Text style={stylesBody.bodyFont}>{this.props.ItemName}</Text>
//                     <Textarea  maxLength={70}
//                                autoHeight="true"
//                                style={this.props.type === 2 ? stylesBody.bodyInputFontAdd:stylesBody.bodyInputFont}
//                                onChangeText={(text) => this.props.change(text)}
//                               value={this.props.ItemValue} >
//                     </Textarea>
//                 {this.props.type===2 &&
//                     <Image style={{width:20,height:20,marginTop:13,marginRight:10}} source={require("../image/ico_seh.png")}/>
//                 }
//
//                 </View>
//             )
//         }
//
// }

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
            flex:1,
            fontSize:14,
            color:'#606060',
        },
        bodyInputFontAdd:{
            // height: 60,
            flex:1,
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
