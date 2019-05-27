import React, { Component } from 'react';
import {
  AppRegistry,
  Dimensions,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  TouchableOpacity,
  Image,
  DeviceEventEmitter
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import BaseComponent from '../../../base/BaseComponent'
import * as Dimens from '../../../value/dimens';
import Permissions from 'react-native-permissions';
import { toastShort } from '../../../util/ToastUtil';
import Palette from '../../../component/Palette';
import { captureScreen, captureRef } from "react-native-view-shot";

export default class TakePicture extends BaseComponent {
  //构造函数
  constructor(props) {
      super(props);
      this.state = {
            imagePtath: null,
            isCaptrue: false,
            isEditable: false,
            cameraType: RNCamera.Constants.Type.back
      };
  }

  componentDidMount() {

    Permissions.request('storage', { type: 'always' }).then(response => {
        //console.log(response);
        //toastShort(response);
    })

    // Permissions.check('storage', { type: 'always' }).then(response => {
    //     console.log(response);
    //     toastShort(response);
    // })

  }


  savePic() {
    var that = this;
    if (this.state.isEditable) {
        captureRef(this.refs.capture_pic, {
            format: "jpg",
            quality: 0.8,
            result: "tmpfile",
            snapshotContentContainer: false
        }).then(
            uri => {
                console.log("uri "+uri);
                DeviceEventEmitter.emit('Event_Take_Photo', uri);
                that.naviGoBack(that.props.navigation);
            },
            error => console.error("Oops, snapshot failed", error)
        );
    } else {

        DeviceEventEmitter.emit('Event_Take_Photo', this.state.imagePtath);
        this.naviGoBack(this.props.navigation);
    }

  }

  reset() {
    this.setState({imagePtath:null, isCaptrue:false,isEditable:false});
  }

  editor() {
    this.setState({isEditable:true});
  }

  //渲染
  render() {
    if (this.state.isCaptrue) {
        var palette = null;
        if (this.state.isEditable) {
            palette = <Palette
                    width={Dimens.screen_width}
                    height={Dimens.screen_height}
                    startX={0}
                    startY={0}
                    ref = 'palette'
                    position = {true}
                    />
        }

        return (
            <View style={styles.container}>
                <View ref = 'capture_pic' style={{flex: 1, flexDirection: 'row', backgroundColor:'#fff'}}>
                  <Image source={{uri:this.state.imagePtath}} style={{width:Dimens.screen_width, height:Dimens.screen_height,marginRight:0,marginTop:0, }}/>
                  {palette}
                </View>
                <TouchableOpacity onPress={()=>this.reset()} style={{width:60,height:60,right:Dimens.screen_width-60-35,bottom:25, position: 'absolute',}}>
                  <Image source={require('../../../../res/repair/photo_btn_back.png')} style={{width:60,height:60,}}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>this.editor()} style={{ width:28,height:24,right:Dimens.screen_width/2-14,bottom:25+18, position: 'absolute',}}>
                  <Image source={require('../../../../res/repair/photo_ico_bj.png')} style={{width:28,height:24,}}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>this.savePic()} style={{ width:60,height:60,right:35,bottom:25, position: 'absolute',}}>
                  <Image source={require('../../../../res/repair/photo_btn_ok.png')} style={{width:60,height:60,}}/>
                </TouchableOpacity>
            </View>
          );
    }

    return (
      <View style={styles.container}>
        <RNCamera
          ref={(cam) => {
            this.camera = cam;
          }}
          style={styles.preview}
          type={this.state.cameraType}
          >


              {({ camera, status, recordAudioPermissionStatus }) => {
                  if (status !== 'READY') return <PendingView />;
                  return (
                      <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
                          <TouchableOpacity onPress={() => this.takePicture(camera)} style={styles.capture}>
                              <Text style={{ fontSize: 14 }}> SNAP </Text>
                          </TouchableOpacity>
                      </View>
                  );
              }}
        <View style = {{flex: 0, flexDirection: 'row', justifyContent: 'space-between',}}>
        <TouchableOpacity onPress={()=>this.naviGoBack(this.props.navigation)}>
            <Image source={require('../../../../res/repair/ic_photo_close.png')} style={{width:20,height:25,marginLeft:15,marginTop:15, }}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>this.switchCamera()}>
            <Image source={require('../../../../res/repair/ic_photo_change.png')} style={{width:30,height:25,marginRight:15,marginTop:15, }}/>
        </TouchableOpacity>
        </View>
        <View style = {{flex: 0, alignItems:'center',}}>
          <Text style={{color:'#ffffff',fontSize:14,}} >请拍摄照片</Text>
          <TouchableOpacity onPress={()=>this.takePicture()} >
            <Image source={require('../../../../res/repair/ic_photo_captrue.png')} style={{width:90,height:90, marginTop:10, marginBottom:10}}/>
        </TouchableOpacity>
        </View>
        </RNCamera>

      </View>
    );
  }

  //切换前后摄像头
  switchCamera() {
    var state = this.state;
    if(state.cameraType === RNCamera.Constants.Type.back) {
      state.cameraType = RNCamera.Constants.Type.front;
    }else{
      state.cameraType = RNCamera.Constants.Type.back;
    }
    this.setState(state);
  }

  //拍摄照片
  takePicture() {
    var that = this;
    this.camera.capture()
      .then(function(data){
        //alert("拍照成功！图片保存地址：\n"+data.path);
        console.log("data.path: "+data.path);

        that.setState({imagePtath:data.path, isCaptrue:true});
      })
      .catch(err => console.error(err));
  }
}

const styles = StyleSheet.create({
  buttonSwitch:{
      width:35,
      height:35,
      alignItems:'center',
      justifyContent:'center',
      textAlignVertical:'center',
      position: 'absolute',
      bottom: 70,
      right: 30,
      alignSelf: 'center'
    },
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  preview: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  toolBar: {
    width: 200,
    margin: 40,
    backgroundColor: '#000000',
    justifyContent: 'space-between',

  },
  button: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40,
  }
});
