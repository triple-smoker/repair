import React, { Component } from 'react';
import {
    Dimensions,
    View,
    Alert,
    TextInput,
    TouchableHighlight,
    Image
} from 'react-native';
import {Row, Col, Container, Content, Text ,Button } from 'native-base';
import OrderItem from './publicTool/OrderItem';
import AsyncStorage from '@react-native-community/async-storage';



let ScreenWidth = Dimensions.get('window').width;
class OrderSearch extends Component {

    static navigationOptions = {
       header : null
    };

    constructor(props) {
        super(props);
        this.state = {
        searchContext: '',
        searchType: false,
        reporterList : [],
        };
        AsyncStorage.getItem('searchItemHistory',function (error, result) {

                if (error) {
                    // alert('读取失败')
                }else {
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
    _setSerachContext(context){
        this.setState({searchContext:context});
    }
    _setSerachShow(context,index){
        this.setState({searchType:true});
        this.setState({searchContext:context});
        this.saveReport(context,index);
    }
    saveReport(context,index){

        let key = 'searchItemHistory';

        let reporterList = this.state.reporterList;


        if(reporterList === null){
            reporterList = new Array()
        }
        var temp = [];
//        reporterList.splice(index,1,context);
        for(var i = 0 ; i < reporterList.length;i++){
            if(context === reporterList[i]){
                temp.splice(0,0,i)
            }
        }
        for(var j = 0 ; j < temp.length;j++){
            reporterList.splice(temp[j],1);
        }

        reporterList.splice(0,0,context);

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
    }

    history(){
        const reporterList = this.state.reporterList;
        const listItems =  reporterList === null ? null : reporterList.map((report, index) =>
            <SearchItem key={index} getSearch={()=>this._setSerachShow(report,index)} searchContext={report}/>
        );
        return listItems;
    }



  render() {
    return (
        <Container style={{backgroundColor:'#f8f8f8'}}>
            <Content>
                <Row>
                    <TouchableHighlight onPress={()=>this.props.navigation.goBack()} style={{width:'10%',height:50}}>
                        <Image style={{width:12,height:25,margin:13}} source={require("../image/navbar_ico_back.png")}/>
                    </TouchableHighlight>
                    <Row style={{width:'80%',backgroundColor:'#f4f4f4',borderRadius:25}}>
                        <Image style={{width:20,height:20,marginTop:15,marginLeft:10,marginRight:5}} source={require("../image/ico_seh.png")}/>
                        <TextInput underlineColorAndroid="transparent" placeholder="请输入单号或内容" style={{width:'90%',borderRadius:25,height:50,fontSize:16,backgroundColor:'#f4f4f4'}} onChangeText={(searchContext) => this.setState({searchContext})}>{this.state.searchContext}</TextInput>
                    </Row>
                    <Button transparent style={{height:50,backgroundColor:'#f8f8f8',borderWidth:0}} onPress={()=>this._setSerachShow(this.state.searchContext)}><Text style={{color:"#252525"}}>搜索</Text></Button>
                </Row>
                {this.state.searchType==false &&
                    <View style={{width:'100%',flexDirection:'row',flexWrap:'wrap'}}>
                        {this.history()}
                    </View>
                }
                {this.state.searchType==true &&
                    <View style={{width:'100%',flexDirection:'row',flexWrap:'wrap'}}>
                        <Col>
                            <OrderItem   type={1}/>
                            <OrderItem   type={2}/>
                        </Col>
                    </View>
                }

            </Content>
        </Container>
    );
  }
}

class SearchItem extends Component{
    render(){
        return (
            <Button style={{height:30,marginLeft:20,marginTop:20,backgroundColor:'#ccc',borderRadius:15}}
            onPress={this.props.getSearch}
            >
                <Text style={{color:'#555'}}>{this.props.searchContext}</Text>
            </Button>
        )
    }
}



module.exports=OrderSearch;
