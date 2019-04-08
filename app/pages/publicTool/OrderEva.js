import React, { Component } from 'react';
import {
    StyleSheet,
    Dimensions,
    Image,
    Alert,
    View
} from 'react-native';
import Swiper from 'react-native-swiper';
import { Content,Row,Col,Text,List,ListItem,Button,Item,Textarea } from 'native-base';



let ScreenWidth = Dimensions.get('window').width;
class OrderEva extends Component {
    constructor(props) {
       super(props);
       this.state = {
        btTitle:'',
        btColor: 0,
        bttTextA:'',
        bttTextB:'',
        bttTextC:'',
        bttTextD:'',
        bttTextE:'',
        bttTextF:'',
        bttColorA:true,
        bttColorB:true,
        bttColorC:true,
        bttColorD:true,
        bttColorE:true,
        bttColorF:true,
       };
    }
    _change(btnum){
        this.setState({ btColor:btnum});
        if(btnum==1){
            this.setState({btTitle:'（请选择不满意的地方）'});
            bttTextA='到场太慢';
            bttTextB='未完全维修';
            bttTextC='态度差';
            bttTextD='维修后现场很乱';
            bttTextE='修好后不通知';
            bttTextF='沟通困难';
        };
        if(btnum==2){
            this.setState({btTitle:'（请选择您觉得一般的地方）'});
            bttTextA='速度一般';
            bttTextB='礼貌一般';
            bttTextC='维修一般';
            bttTextD='穿戴一般';
            bttTextE='水平一般';
            bttTextF='仪表一般';
        };
        if(btnum==3){
            this.setState({btTitle:'（请选择满意的地方）'});
            bttTextA='快速准时';
            bttTextB='礼貌热情';
            bttTextC='维修完好';
            bttTextD='穿戴工装';
            bttTextE='风雨无阻';
            bttTextF='仪表整洁';
        };
        this.setState({
            bttTextA:bttTextA,
            bttTextB:bttTextB,
            bttTextC:bttTextC,
            bttTextD:bttTextD,
            bttTextE:bttTextE,
            bttTextF:bttTextF,
            bttColorA:true,
            bttColorB:true,
            bttColorC:true,
            bttColorD:true,
            bttColorE:true,
            bttColorF:true,
        })
    }
    _changebtA(){
        this.setState({ bttColorA: !this.state.bttColorA});
    }
    _changebtB(){
        this.setState({ bttColorB: !this.state.bttColorB});
    }
    _changebtC(){
        this.setState({ bttColorC: !this.state.bttColorC});
    }
    _changebtD(){
        this.setState({ bttColorD: !this.state.bttColorD});
    }
    _changebtE(){
        this.setState({ bttColorE: !this.state.bttColorE});
    }
    _changebtF(){
        this.setState({ bttColorF: !this.state.bttColorF});
    }
  render() {
    return (
        <Content>
            <Row>

                <Swiper height={240}
                  onMomentumScrollEnd={(e, state, context) => console.log('index:', state.index)}
                  dot={<View style={{backgroundColor: 'rgba(0,0,0,.2)', width: 5, height: 5, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3}} />}
                  activeDot={<View style={{backgroundColor: '#000', width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3}} />}
                  paginationStyle={{
                    bottom: -23, left: null, right: 10
                  }} loop>
                    <ImageItem num='1' sum='3' imageurl='https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1554368276452&di=dfa6ac0f1342c8ec5e443861ad6f60c7&imgtype=0&src=http%3A%2F%2Fstatic.open-open.com%2Fnews%2FuploadImg%2F20160113%2F20160113102614_405.png'/>
                    <ImageItem num='2' sum='3' imageurl='https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1554368276452&di=dfa6ac0f1342c8ec5e443861ad6f60c7&imgtype=0&src=http%3A%2F%2Fstatic.open-open.com%2Fnews%2FuploadImg%2F20160113%2F20160113102614_405.png'/>
                    <ImageItem num='3' sum='3' imageurl='https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1554368276452&di=dfa6ac0f1342c8ec5e443861ad6f60c7&imgtype=0&src=http%3A%2F%2Fstatic.open-open.com%2Fnews%2FuploadImg%2F20160113%2F20160113102614_405.png'/>
                </Swiper>
            </Row>
            <Row style={{padding:15,borderBottomWidth:1,borderColor:'#e4e4e4'}}>
                <Col style={{width:'70%',height:60}}>
                    <Row>
                        <Image
                            style={{width: 60,height:60}}
                            source={require('../../resource/assets/user_wx.png')}
                        />
                        <Col style={{paddingLeft:12,paddingTop:5}}>
                            <Text style={{color:'#252525'}}>
                                马云
                            </Text>
                            <Text style={{color:'#a1a1a1',paddingTop:5}}>
                                城南维修班组
                            </Text>
                        </Col>
                    </Row>
                </Col>
                <Col style={{width:'30%',height:60}}>
                    <Text style={{color:'#2092eb',marginTop:30}}>
                        好评率 95%
                    </Text>
                </Col>
            </Row>
            <Row style={{justifyContent: "space-between",padding:15}}>
              <Button bordered block rounded Button style={{width:'28%',height:35,backgroundColor:(this.state.btColor==1) ? '#efac13':'#fff',borderColor:(this.state.btColor==1) ? '#efac13':'#c2c2c2'}} onPress={()=>this._change(1)}><Text style={{color:(this.state.btColor==1) ? '#fff':'#999'}}>不满意</Text></Button>
              <Button bordered block rounded Button style={{width:'28%',height:35,backgroundColor:(this.state.btColor==2) ? '#efac13':'#fff',borderColor:(this.state.btColor==2) ? '#efac13':'#c2c2c2'}} onPress={()=>this._change(2)}><Text style={{color:(this.state.btColor==2) ? '#fff':'#999'}}>一般</Text></Button>
              <Button bordered block rounded Button style={{width:'28%',height:35,backgroundColor:(this.state.btColor==3) ? '#efac13':'#fff',borderColor:(this.state.btColor==3) ? '#efac13':'#c2c2c2'}} onPress={()=>this._change(3)}><Text style={{color:(this.state.btColor==3) ? '#fff':'#999'}}>满意</Text></Button>
            </Row>
            <Row style={{justifyContent: "center",padding:5}}>
                <Text style={{color:'#a7a7a7',fontSize:12}}>{this.state.btTitle}</Text>
            </Row>
            {this.state.btColor!=0 &&
            <Col style={{justifyContent: "space-between",padding:15}}>
                <Row style={{justifyContent: "space-between"}}>
                  <Button bordered block Button style={{width:'28%',height:35,backgroundColor:(this.state.bttColorA==true) ? '#fff':'#e1f0fd',borderColor:(this.state.bttColorA==true) ? '#c2c2c2':'#50a9ef'}} onPress={()=>this._changebtA()}><Text style={{fontSize:12,color:(this.state.bttColorA==true) ? '#343434':'#369ced'}}>{this.state.bttTextA}</Text></Button>
                  <Button bordered block Button style={{width:'28%',height:35,backgroundColor:(this.state.bttColorB==true) ? '#fff':'#e1f0fd',borderColor:(this.state.bttColorB==true) ? '#c2c2c2':'#50a9ef'}} onPress={()=>this._changebtB()}><Text style={{fontSize:12,color:(this.state.bttColorB==true) ? '#343434':'#369ced'}}>{this.state.bttTextB}</Text></Button>
                  <Button bordered block Button style={{width:'28%',height:35,backgroundColor:(this.state.bttColorC==true) ? '#fff':'#e1f0fd',borderColor:(this.state.bttColorC==true) ? '#c2c2c2':'#50a9ef'}} onPress={()=>this._changebtC()}><Text style={{fontSize:12,color:(this.state.bttColorC==true) ? '#343434':'#369ced'}}>{this.state.bttTextC}</Text></Button>
                </Row>
                <Row style={{justifyContent: "space-between",paddingTop:17}}>
                  <Button bordered block Button style={{width:'28%',height:35,backgroundColor:(this.state.bttColorD==true) ? '#fff':'#e1f0fd',borderColor:(this.state.bttColorD==true) ? '#c2c2c2':'#50a9ef'}} onPress={()=>this._changebtD()}><Text style={{fontSize:12,color:(this.state.bttColorD==true) ? '#343434':'#369ced'}}>{this.state.bttTextD}</Text></Button>
                  <Button bordered block Button style={{width:'28%',height:35,backgroundColor:(this.state.bttColorE==true) ? '#fff':'#e1f0fd',borderColor:(this.state.bttColorE==true) ? '#c2c2c2':'#50a9ef'}} onPress={()=>this._changebtE()}><Text style={{fontSize:12,color:(this.state.bttColorE==true) ? '#343434':'#369ced'}}>{this.state.bttTextE}</Text></Button>
                  <Button bordered block Button style={{width:'28%',height:35,backgroundColor:(this.state.bttColorF==true) ? '#fff':'#e1f0fd',borderColor:(this.state.bttColorF==true) ? '#c2c2c2':'#50a9ef'}} onPress={()=>this._changebtF()}><Text style={{fontSize:12,color:(this.state.bttColorF==true) ? '#343434':'#369ced'}}>{this.state.bttTextF}</Text></Button>
                </Row>
            </Col>
            }
            <Row style={{justifyContent: "center"}}>
                    <Textarea bordered rowSpan={5} maxLength={150}  placeholder="亲，请输入您的评价和建议..."  style={{width:ScreenWidth-30,height:90}} />
            </Row>
        </Content>
    );
  }
}

const stylesImage =StyleSheet.create({
  container: {
    flex: 1
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  image: {
    width:ScreenWidth,
    flex: 1
  }
})

class ImageItem extends Component{
    render(){
        return (
            <View style={stylesImage.slide}>
                <Image resizeMode='stretch' style={stylesImage.image} source={{uri:this.props.imageurl}} />
                <View style={{position: 'absolute',left:5,top:10,backgroundColor:'#545658',height:26,width:66}}><Text style={{color:'#fff',paddingLeft:5}}>维修后</Text></View>
                <View style={{position: 'absolute',left:ScreenWidth-60,top:210,backgroundColor:'#545658',height:22,paddingLeft:2,width:40,borderRadius:10}}><Text style={{color:'#fff',paddingLeft:5}}>{this.props.num}/{this.props.sum}</Text></View>
            </View>
        )
    }
}





module.exports=OrderEva;