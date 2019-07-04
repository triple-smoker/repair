import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    ActivityIndicator
} from 'react-native';


import VideoPlayer from './VideoPlayer';
import AsyncStorage from '@react-native-community/async-storage';
import RNFetchBlob from '../util/RNFetchBlob';

let ScreenWidth = Dimensions.get('window').width;
class VideoPreview extends Component{

    //获取VideoPlayer组件模板元素
    onRef = (ref) => {
        this.videoPlayerRef = ref;
    }
  
    componentDidMount(){
        this.props.onRef(this);
    }
  
    setVideoCurrentTime = (e) =>{
      if(this.videoPlayerRef){
        this.videoPlayerRef.setVideoCurrentTime(0);
      }
    }
  
    constructor(props) {
        console.info("xxx")
        super(props);
        this.state = {
            videoPath: null,
            animating: true
        };
        console.info(this.props)
        this.getVideoFilePath(this.props.url,this.props.fileName);
    }
  
    getVideoFilePath(path,fileName){
        AsyncStorage.getItem('fileVideoCache', function (error,result) {
                if (error) {
                    console.log('读取失败')
                }else {
                    console.log('读取完成')
                    let fileVideo = JSON.parse(result) || {};
                    if(fileVideo != null && fileVideo[fileName]){
                        this.setState({
                            videoPath : fileVideo[fileName],
                            animating: false
                        })
                    }else{

                        console.info(path)
                        console.info(fileName)
                        RNFetchBlob.fileVideoCache(path,fileName).then((res) => {
                            fileVideo[fileName] = res.path()
                            //json转成字符串
                            let jsonStr = JSON.stringify(fileVideo);
                            AsyncStorage.setItem('fileVideoCache', jsonStr, function (error) {
                                if (error) {
                                    console.log('存储失败')
                                }else {
                                    console.log('存储完成')
                                }
                            })
                            this.setState({
                                videoPath : res.path(),
                                animating: false
                            })
                        }).catch((error) => {
                            console.info("存储失败" + error)
                        });
                    }
                }
            }.bind(this)
        )
    }
  
    render(){
        return (
            <View style={styles.slide}>
                {
                    this.state.videoPath == null ? <View style={styles.image}><Loading animating={this.state.animating}/></View>
                    : <VideoPlayer onRef={this.onRef} closeVideoPlayer={()=> {this.props.setModalVisible()}} uri={this.state.videoPath}></VideoPlayer> 
                }
                <View style={{position: 'relative',left:ScreenWidth-70,top:-40,backgroundColor:'#545658',height:22,paddingLeft:2,width:40,borderRadius:10}}><Text style={{color:'#fff',paddingLeft:5}}>{this.props.num}/{this.props.sum}</Text></View>
            </View>
        )
    }
  }
  
  
  const Loading = (loading) =>{
  
      return(
          <View style={styles.wrapper}>
            <View style={styles.box}>
              <ActivityIndicator 
                animating={loading.animating}
                color='white'
                size='large'
              />
            </View>
          </View>
      )
  }
  
  
  
const styles=StyleSheet.create({
    image: {
        width:ScreenWidth,
        flex: 1,
    },
        slide: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
    wrapper:{
        justifyContent:'center',
        alignItems:'center',
        position:'absolute',
        height:Dimensions.get('window').height,
        width:Dimensions.get('window').width,
        zIndex:10,
      },
    box:{
        paddingVertical:12,
        paddingHorizontal:20,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:6
    },
  })
module.exports = VideoPreview;