import React, { Component } from 'react';
import {
    StyleSheet,
    Dimensions,
    View,
    Image
} from 'react-native';
import { Content,Row,Col,Text,List,ListItem } from 'native-base';
import * as Progress from 'react-native-progress';



let ScreenWidth = Dimensions.get('window').width;
class Person extends Component {

    _getIcon(person){
        var itemList = [];
        personList = person;
        let listItems = [];
        for( var i = 0; i<personList.length;i++ ){
            if(i==0){
            listItems.push(
                    <Image key={i}
                        style={{width: 38,height:38}}
                        source={require('../../image/user_wx.png')}
                    />
                )
            }else{
            listItems.push(<IconAutoItem num={i} key={i}/>);
            }
        }
        return listItems;
    }

    _getPerson(person){
        var itemList = [];
        personList = person;
        console.log(person);
        let listItems =(  itemList === null ? null : personList.map((per, index) =>
                    <PersonItem key={index} name={per.assistantName} num={per.itemPercentage}/>
        ))
        return listItems;
    }

  render() {
    return (
        <Content style={{padding:15}}>
            <Col style={{height:55,borderBottomWidth:1,borderBottomColor:'#dedede'}}>
                <Text style={{color:'#2b2b2b',fontSize:14}}>维修类别：<Text style={{color:'#4b4b4b',fontSize:13}}>{this.props.repair.parentTypeName+"/"+this.props.repair.repairTypeName}</Text></Text>
                <Text style={{color:'#2b2b2b',fontSize:14}}>维修事项：<Text style={{color:'#4b4b4b',fontSize:13}}>{this.props.repair.matterName}</Text></Text>
            </Col>
            <Row>
                <Col style={{width:'20%',paddingTop:18,paddingLeft:18}}>
                    {this._getIcon(this.props.person)}
                </Col>
                <Col style={{width:'80%',paddingTop:17}}>
                    {this._getPerson(this.props.person)}
                </Col>
            </Row>
        </Content>
    );
  }
}

class PersonItem extends Component {//head模块
  render() {
    return (
        <Content style={{height:70}}>
            <Row>
                <Text style={{width:"27%",color:'#262626'}}>{this.props.name}</Text><Text style={{color:'#262626'}}>13888888888</Text>
            </Row>
            <Row>
                <Text style={{width:"27%",color:'#9a9a9a'}}>维修占比</Text>
                <Progress.Bar
                  color='#3595ec'
                  borderWidth={0}
                  unfilledColor='#dedede'
                  width={170}
                  style={{marginTop:10,height:5}}
                  progress={this.props.num/100}//占比
                />
                <Text style={{marginLeft:15,color:'#3996ec'}}>{this.props.num+'%'}</Text>
            </Row>
        </Content>
    );
  }
}
class IconAutoItem extends Component {
  render() {
    return (
        <View style={{paddingLeft:9}}>
            {this.props.num===1 &&
                <View style={{marginLeft:9,height:40,width:2,backgroundColor:'#a2acd8'}}></View>
            }
            {this.props.num!=1 &&
                <View style={{marginLeft:9,height:51,width:2,backgroundColor:'#a2acd8'}}></View>
            }
            <Image
                style={{width: 20,height:20}}
                source={require('../../image/steps_xzr.png')}
            />
        </View>
    );
  }
}



module.exports=Person;