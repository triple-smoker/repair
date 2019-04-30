import React, { Component } from 'react';
import {
    StyleSheet,
    Dimensions,
} from 'react-native';
import { Content,Row,Col,Text,List,ListItem } from 'native-base';



let ScreenWidth = Dimensions.get('window').width;
class WuZi extends Component {
    constructor(props) {
       super(props);
       this.state={
        totalPrice:0
       }
    }

    _getWuZi(wuZiList){
        var itemList = [];
        itemList = wuZiList;

        let listItems =(  itemList === null ? null : itemList.map((wuZi, index) =>
            <WuziItem key={index} name={wuZi.materialName} num={wuZi.qty} price={wuZi.total} remark={'螺口：e27；品牌：飞利浦'}/>
        ))
        return listItems;
    }
//获取总价
    getTotalPrice(wuZiList){
        var itemList = [];
        itemList = wuZiList;
        var totalPrice = 0;
        itemList.forEach(function(item){
            totalPrice = totalPrice + item.total;
        });
        return totalPrice;
    }


  render() {
    return (
        <Content>
            <Row style={{borderBottomWidth:1,borderColor:'#dedede',paddingLeft:20,paddingTop:10,height:40,paddingRight:20}}>
                <Col style={{width:'60%'}}><Text style={{color:'#313131',fontSize:14}}>名称</Text></Col>
                <Col style={{width:'25%'}}><Text style={{color:'#313131',fontSize:14}}>数量</Text></Col>
                <Col style={{width:'15%'}}><Text style={{color:'#313131',fontSize:14}}>价格</Text></Col>
            </Row>
            <Col style={{borderBottomWidth:1,borderColor:'#dedede'}}>
                {this._getWuZi(this.props.wuzi)}
            </Col>
            <Row style={{borderBottomWidth:1,borderColor:'#dedede',paddingLeft:20,paddingTop:10,height:40,paddingRight:20}}>
                <Col style={{width:'80%'}}><Text style={{color:'#313131',fontSize:16}}>合计</Text></Col>
                <Col style={{width:'20%'}}><Text style={{color:'#e95b5b',fontSize:16}}>{'￥'+this.getTotalPrice(this.props.wuzi)}</Text></Col>
            </Row>
        </Content>
    );
  }
}

class WuziItem extends Component{
    render(){
        return (
            <Row style={{width:'100%',borderBottomWidth:1,borderColor:'#e0e0e0',height:60,paddingLeft:20,paddingRight:20}}>
                <Col style={{width:'60%',backgroundColor:'#fff',paddingTop:14}}>
                    <Text style={{color:'#313131',fontSize:14}}>{this.props.name}</Text>
                    <Text style={{color:'#9a9a9a',fontSize:12}}>{this.props.remark}</Text>
                </Col>
                <Col style={{width:'23%',backgroundColor:'#fff',paddingTop:18}}>
                    <Text style={{color:'#313131',fontSize:14}}>× {this.props.num}</Text>
                </Col>
                <Col style={{width:'17%',backgroundColor:'#fff',paddingTop:18}}>
                    <Text style={{color:'#313131',fontSize:14}}>￥ {this.props.price}</Text>
                </Col>
            </Row>
        )
    }
}



module.exports=WuZi;