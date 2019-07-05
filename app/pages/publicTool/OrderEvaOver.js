import React, { Component } from 'react';
import {
    StyleSheet,
    Dimensions,
    Image,
    Alert,
    View,
    TouchableHighlight
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Content,Row,Col,Text,List,ListItem,Button,Item,Textarea } from 'native-base';
import axios from 'axios';
import Swiper from 'react-native-swiper';

/*
* 报修单评价页面 已评价模块封装
* */
let ScreenWidth = Dimensions.get('window').width;
class OrderEvaOver extends Component {
    //获取评价数据
    getCause(causes){
        var causeList = [];
        if(causes!=''){
            causeList = causes.causeList;
        }
        let listItems =(  causeList === null ? null : causeList.map((cause, index) =>
            <Text key={index} style={{backgroundColor:'#f8f8f8',borderWidth:1,borderColor:"#ddd",marginLeft:10,padding:3,color:'#555'}}>{cause.causeCtn}</Text>
        ))
        return listItems;
    }
    //图片轮播渲染
    getImageItem(fileMap){
        var imagesList = [];
        var listItems ="";
        if(fileMap!=null&&fileMap!=''&&fileMap.imagesCompleted!=null&&fileMap.imagesCompleted.length > 0){
            var imagesCompleted = fileMap.imagesCompleted;
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
                   dot={<View style={{backgroundColor: 'rgba(0,0,0,0.2)', width: 5, height: 5, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3}} />}
                   activeDot={<View style={{backgroundColor: '#fff', width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3}} />}
                   showsPagination={false} loop>
                    {this.getImageItem(this.props.repair.fileMap)}
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
                                {this.props.record.repairUserName}
                            </Text>
                            <Text style={{color:'#a1a1a1',paddingTop:5}}>
                                {this.props.record.deptName}
                            </Text>
                        </Col>
                    </Row>
                </Col>
                <Col style={{width:'30%',height:60}}>

                        {this.props.evaluate.satisfactionLevel==='1' &&
                        <LinearGradient
                                                    colors= {[ '#e9c11a','#f1a611','#fb8306']}
                                                    start={ {x: 0.3, y:0} }
                                                    end={ {x: 0.7, y:1} }
                                                    style={{height:35,flexDirection: 'row',alignItems: 'center',
                                                        justifyContent: 'center',borderRadius : 50,borderWidth:1,borderColor:'#c2c2c2'}}
                                                >
                            <Image style={{width:20,height:20, marginRight: 10}}
                                   source={require('../../image/ico_bmy_nor.png')}/>
                            <Text style={{color:'#999'}}>不满意</Text>
                        </LinearGradient>
                        }
                        {this.props.evaluate.satisfactionLevel==='2' &&
                        <LinearGradient
                                                    colors= {[ '#e9c11a','#f1a611','#fb8306']}
                                                    start={ {x: 0.3, y:0} }
                                                    end={ {x: 0.7, y:1} }
                                                    style={{height:35,flexDirection: 'row',alignItems: 'center',
                                                        justifyContent: 'center',borderRadius : 50,borderWidth:1,borderColor:'#c2c2c2'}}
                                                >
                            <Image style={{width:20,height:20, marginRight: 10}}
                                   source={require('../../image/ico_yb_nor.png')}/>
                            <Text style={{color:'#999'}}>一般</Text>
                        </LinearGradient>
                        }
                        {this.props.evaluate.satisfactionLevel==='3' &&
                        <LinearGradient
                                                    colors= {[ '#e9c11a','#f1a611','#fb8306']}
                                                    start={ {x: 0.3, y:0} }
                                                    end={ {x: 0.7, y:1} }
                                                    style={{height:35,flexDirection: 'row',alignItems: 'center',
                                                        justifyContent: 'center',borderRadius : 50,borderWidth:1,borderColor:'#c2c2c2'}}
                                                >
                            <Image style={{width:20,height:20, marginRight: 10}}
                                   source={require('../../image/ico_my_nor.png')}/>
                            <Text style={{color:'#999'}}>满意</Text>
                        </LinearGradient>
                        }
                </Col>
            </Row>
            <Col style={{justifyContent: "center"}}>
                    <Text style={{width:ScreenWidth,borderRadius:10,padding:10}}>
                        {this.props.evaluate.remark}
                    </Text>
                    <View style={{flexDirection:'row',flexWrap:'wrap',paddingBottom:10}}>
                        {this.getCause(this.props.evaluate)}
                    </View>

            </Col>
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
                <View style={{position: 'absolute',left:ScreenWidth-50,top:210,backgroundColor:'#545658',height:22,paddingLeft:2,width:40,borderRadius:10}}><Text style={{color:'#fff',paddingLeft:5}}>{this.props.num}/{this.props.sum}</Text></View>
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


module.exports=OrderEvaOver;