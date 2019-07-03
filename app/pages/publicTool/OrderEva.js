import React, { Component } from 'react';
import {
    StyleSheet,
    Dimensions,
    Image,
    Alert,
    View,
    TouchableHighlight
} from 'react-native';
import Swiper from 'react-native-swiper';
import LinearGradient from 'react-native-linear-gradient';
import { Content,Row,Col,Text,List,ListItem,Button,Item,Textarea } from 'native-base';
import Axios from '../../util/Axios';
import CauseBtn from './CauseBtn';

/*
* 报修单评价页面 评价操作模块组件封装
*
* */
let ScreenWidth = Dimensions.get('window').width;
class OrderEva extends Component {
    constructor(props) {
       super(props);
       this.state = {
        btTitle:'',
        btColor: 0,
        reMark:'',
        bttArray:[],
        bttArrayBmy:[],
        bttArrayYb:[],
        bttArrayMy:[],
       };
//       获取评价选项
       var   url="/api/repair/service/evaluate_cause/list";
        Axios.GetAxios(
            url
        ).then(
             (response) => {
                       var dicts = response.data;
                       var bttArrayBmy = [];
                       var bttArrayYb = [];
                       var bttArrayMy = [];
                       dicts.forEach(function(dict){
                            if(dict.dictValue==1){
                                dict.causeList.forEach(function(cause){
                                        let newCause = {causeCtn:cause.causeCtn,causeId:cause.causeId,showType:false};
                                        bttArrayBmy.push(newCause);
                                    })
                                }
                            if(dict.dictValue==2){
                                dict.causeList.forEach(function(cause){
                                        let newCause = {causeCtn:cause.causeCtn,causeId:cause.causeId,showType:false};
                                        bttArrayYb.push(newCause);
                                    })
                                }
                            if(dict.dictValue==3){
                                dict.causeList.forEach(function(cause){
                                        let newCause = {causeCtn:cause.causeCtn,causeId:cause.causeId,showType:false};
                                        bttArrayMy.push(newCause);
                                    })
                                }
                       });
                       this.setState({
                              bttArrayBmy : bttArrayBmy,
                              bttArrayYb : bttArrayYb,
                              bttArrayMy : bttArrayMy,
                       })
                 }
         )

    }
    //评价选项点击切换提示语
    _change(btnum){
        this.setState({ btColor:btnum});
        var bttArrayBmy = this.state.bttArrayBmy;
        var bttArrayYb = this.state.bttArrayYb;
        var bttArrayMy = this.state.bttArrayMy;
        if(btnum==1){
                bttArrayYb = this.clearShow(bttArrayYb);
                bttArrayMy = this.clearShow(bttArrayMy);
                this.setState({btTitle:'（请选择不满意的地方）',bttArrayYb:bttArrayYb,bttArrayMy:bttArrayMy});
        }
        if(btnum==2){
                bttArrayBmy = this.clearShow(bttArrayBmy);
                bttArrayMy = this.clearShow(bttArrayMy);
                this.setState({btTitle:'（请选择您觉得一般的地方）',bttArrayBmy:bttArrayBmy,bttArrayMy:bttArrayMy});
        }
        if(btnum==3){
                bttArrayYb = this.clearShow(bttArrayYb);
                bttArrayBmy = this.clearShow(bttArrayBmy);
                this.setState({btTitle:'（请选择满意的地方）',bttArrayYb:bttArrayYb,bttArrayBmy:bttArrayBmy});
        }
    }
    //评价选项点击切换按钮
    changeCause(cause){
        var bttArrayBmy = this.state.bttArrayBmy;
        var bttArrayYb = this.state.bttArrayYb;
        var bttArrayMy = this.state.bttArrayMy;
        var bmy = 0; var yb = 0 ;var my = 0;
        bttArrayBmy.forEach(function(causeItem){
            if(causeItem.causeId===cause.causeId){
               causeItem.showType = !causeItem.showType;
               bmy=1;
               };
        });
        bttArrayYb.forEach(function(causeItem){
            if(causeItem.causeId===cause.causeId){
               causeItem.showType = !causeItem.showType;
               yb=1;
               };
        });
        bttArrayMy.forEach(function(causeItem){
            if(causeItem.causeId===cause.causeId){
               causeItem.showType = !causeItem.showType;
               my=1;
               };
        });
        if(bmy==1){
        this.setState({bttArrayBmy:bttArrayBmy})}
        if(yb==1){
        this.setState({bttArrayYb:bttArrayYb})}
        if(my==1){
        this.setState({bttArrayMy:bttArrayMy})}
    }
    clearShow(arrayCause){
        arrayCause.forEach(function(causeItem){
             causeItem.showType = false;
         });
         return arrayCause;
    }
    //获取评价子按钮
    getCause(chCause){
        var causeList = [];
        if(this.state.btColor===1){
             causeList= this.state.bttArrayBmy;
        }
        if(this.state.btColor===2){
             causeList = this.state.bttArrayYb;
        }
        if(this.state.btColor===3){
             causeList = this.state.bttArrayMy;
        }
        let listItems =(  causeList === null ? null : causeList.map((cause, index) =>
            <CauseBtn key={index} cause={cause} chCause={chCause} changeCause={(cause)=>this.changeCause(cause)}/>
        ))
        return listItems;
    }
    //评价按钮渲染
    getImageItem(repair){
        var imagesList = [];
        var listItems ="";
        if(repair!=null&&repair!=''){
            var imagesCompleted = repair.fileMap.imagesCompleted;
            imagesList = imagesCompleted;
            var sum = imagesList.length;
            listItems =(  imagesList === null ? null : imagesList.map((image, index) =>
                <ImageItem key={index} num={index+1} sum={sum} imageurl={image.filePath}/>
            ))
        }else{
            listItems =<View style={{width:"100%",height:"100%",backgroundColor:'#ccc',justifyContent:'center',alignItems:"center"}}><Text style={{color:'#666',fontSize:16}}>暂无图片</Text></View>
        }

        return listItems;
    }


  render() {
    return (
        <Content>
            <Row>
                <Swiper height={240}
                  onMomentumScrollEnd={(e, state, context) => console.log('index:', state.index)}
                  dot={<View style={{backgroundColor: 'rgba(0,0,0,.2)', width: 5, height: 5, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3}} />}
                  activeDot={<View style={{backgroundColor: '#000', width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3}} />}
                  showsPagination={false} loop>
                    {this.getImageItem(this.props.repair)}
                </Swiper>
            </Row>
            <Row style={{padding:15,borderBottomWidth:1,borderColor:'#e4e4e4'}}>
                <Col style={{width:'70%',height:60}}>
                    <Row>
                        <Image
                            style={{width: 60,height:60}}
                            source={require('../../image/user_wx.png')}
                        />
                        <Col style={{paddingLeft:12,paddingTop:5}}>
                            <Text style={{color:'#252525'}}>
                                {this.props.record!=''&&
                                this.props.record.repairUserName}
                            </Text>
                            <Text style={{color:'#a1a1a1',paddingTop:5}}>
                                {this.props.record!=''&&
                                this.props.record.deptName}
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
            <TouchableHighlight
                style={{width:'30%'}}
                underlayColor="#fff"
                      onPress={()=>{this._change(1),this.props.clearCause(),this.props.getSatisfactionLevel('1')}}>
                <LinearGradient
                    colors= {[(this.state.btColor==1) ? '#e9c11a':'#fff',(this.state.btColor==1) ?  '#f1a611':'#fff',(this.state.btColor==1) ?  '#fb8306':'#fff']}
                    start={ {x: 0.3, y:0} }
                    end={ {x: 0.7, y:1} }
                    style={{height:35,flexDirection: 'row',alignItems: 'center',
                        justifyContent: 'center',borderRadius : 50,borderWidth:1,borderColor:(this.state.btColor==1) ? '#fff':'#c2c2c2'}}
                >
                    <Image style={{width:20,height:20, marginRight: 10}}
                           source={(this.state.btColor==1) ? require('../../image/ico_bmy_pre.png'): require('../../image/ico_bmy_nor.png')}/>
                    <Text style={{color:(this.state.btColor==1) ? '#fff':'#999'}}>不满意</Text>

                </LinearGradient>
             </TouchableHighlight>
            <TouchableHighlight
                style={{width:'30%'}}
                underlayColor="#fff"
                      onPress={()=>{this._change(2),this.props.clearCause(),this.props.getSatisfactionLevel('2')}}>
                <LinearGradient
                    colors= {[(this.state.btColor==2) ? '#e9c11a':'#fff',(this.state.btColor==2) ?  '#f1a611':'#fff',(this.state.btColor==2) ?  '#fb8306':'#fff']}
                    start={ {x: 0.3, y:0} }
                    end={ {x: 0.7, y:1} }
                    style={{height:35,flexDirection: 'row',alignItems: 'center',
                        justifyContent: 'center',borderRadius : 50,borderWidth:1,borderColor:(this.state.btColor==2) ? '#fff':'#c2c2c2'}}
                >
                    <Image style={{width:20,height:20, marginRight: 10}}
                           source={(this.state.btColor==2) ? require('../../image/ico_yb_pre.png'):require('../../image/ico_yb_nor.png')}/>
                    <Text style={{color:(this.state.btColor==2) ? '#fff':'#999'}}>一般</Text>

                </LinearGradient>
             </TouchableHighlight>
            <TouchableHighlight
                style={{width:'30%'}}
                underlayColor="#fff"
                      onPress={()=>{this._change(3),this.props.clearCause(),this.props.getSatisfactionLevel('3')}}>
                <LinearGradient
                    colors= {[(this.state.btColor==3) ? '#e9c11a':'#fff',(this.state.btColor==3) ?  '#f1a611':'#fff',(this.state.btColor==3) ?  '#fb8306':'#fff']}
                    start={ {x: 0.3, y:0} }
                    end={ {x: 0.7, y:1} }
                    style={{height:35,flexDirection: 'row',alignItems: 'center',
                        justifyContent: 'center',borderRadius : 50,borderWidth:1,borderColor:(this.state.btColor==3) ? '#fff':'#c2c2c2'}}
                >
                    <Image style={{width:20,height:20, marginRight: 10}}
                           source={(this.state.btColor==3) ? require('../../image/ico_my_pre.png'):require('../../image/ico_my_nor.png')}/>
                    <Text style={{color:(this.state.btColor==3) ? '#fff':'#999'}}>满意</Text>

                </LinearGradient>
             </TouchableHighlight>
            </Row>
            <Row style={{justifyContent: "center",padding:5}}>
                <Text style={{color:'#a7a7a7',fontSize:12}}>{this.state.btTitle}</Text>
            </Row>
            {this.state.btColor!=0 &&
            <View style={{flexDirection:'row',flexWrap:'wrap',paddingLeft:17,paddingBottom:13}}>
                   {this.getCause(this.props.chCause)}
            </View>
            }
            <Row style={{justifyContent: "center",marginBottom:10}}>
                    <Textarea bordered rowSpan={5} maxLength={150} onChangeText={(remark)=>{this.setState({reMark:remark}),this.props.setRemark(remark)}}  placeholder="亲，请输入您的评价和建议..."  style={{width:ScreenWidth-30,height:90,borderRadius:10}}>
                        {this.state.reMark}
                    </Textarea>
            </Row>
        </Content>
    );
  }
}
//图片轮播
class ImageItem extends Component{
    render(){
        return (
            <View style={stylesImage.slide}>
                <Image resizeMode='contain' style={stylesImage.image} source={{uri:this.props.imageurl}} />
                <View style={{position: 'absolute',left:5,top:10,backgroundColor:'#545658',height:26,width:66}}><Text style={{color:'#fff',paddingLeft:5}}>维修后</Text></View>
                <View style={{position: 'absolute',left:ScreenWidth-60,top:210,backgroundColor:'#545658',height:22,paddingLeft:2,width:40,borderRadius:10}}><Text style={{color:'#fff',paddingLeft:5}}>{this.props.num}/{this.props.sum}</Text></View>
            </View>
        )
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







module.exports=OrderEva;
