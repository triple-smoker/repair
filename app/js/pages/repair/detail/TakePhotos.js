import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    DeviceEventEmitter,
    Dimensions,
    InteractionManager,
    TouchableOpacity,
    ListView,
    Modal,

} from 'react-native';

import TitleBar from '../../../component/TitleBar';
import * as Dimens from '../../../value/dimens';

// import FinishWork from './FinishWork';
// import TakePicture from './TakePicture'
import Request, {RepairCommenced} from '../../../http/Request';
import BaseComponent from '../../../base/BaseComponent'
import {Loading} from '../../../component/Loading'
import {Toast} from '../../../component/Toast'

var imagePos = -1;
export default class TakePhotos extends BaseComponent {
    static navigationOptions = {
        header: null,
    };
    constructor(props){
        super(props);
        this.state={
            imagePath0:null,
            imagePath1:null,
            imagePath2:null,
            imagePath3:null,
            imageUrl1:null,
            imageUrl2:null,
            imageUrl3:null,
            repairId:props.navigation.state.params.repairId,
            theme:this.props.theme,
            step:props.navigation.state.params.step
            
        }
    }


    componentDidMount() {
        var that = this;
        this.eventListener = DeviceEventEmitter.addListener('Event_Take_Photo', (param) => {
            console.log('componentDidMount Event_Take_Photo : ' + param + ", imagePos : " + imagePos);
            if(imagePos === 0){
                that.setState({imagePath0:param,});
            }else if (imagePos === 1) {
                that.setState({imagePath1:param, });
            } else if (imagePos === 2) {
                that.setState({imagePath2:param, });
            } else if (imagePos === 3) {
                that.setState({imagePath3:param, });
            }

            that.uploadFile(param);
        });

    }


    componentWillUnmount() {
        global.imageUrl0 = null;
        global.imageUrl1 = null;
        global.imageUrl2 = null;
        global.imageUrl3 = null;
        Loading.hidden();
        if(this.eventListener){
            this.eventListener.remove();
        }
    }

    uploadFile(path) {
        Loading.show();
        var that = this;
        Request.uploadFile(path, (result)=> {
            console.log('path')
            console.log(path)
            console.log('result')
            console.log(result)
            if (result && result.code === 200) {
                if(imagePos === 0){
                    global.imageUrl0 = result.data;
                    that.setState({imageUrl0:JSON.stringify(result.data), });
                }else if (imagePos === 1) {
                    global.imageUrl1 = result.data;
                    that.setState({imageUrl1:JSON.stringify(result.data), });
                } else if (imagePos === 2) {
                    global.imageUrl2 = result.data;
                    that.setState({imageUrl2:JSON.stringify(result.data), });
                } else if (imagePos === 3) {
                    global.imageUrl3 = result.data;
                    that.setState({imageUrl3:JSON.stringify(result.data), });
                }

                Loading.hidden();
            } 
      });
    }

  onTake(index) {
    //this.routeToPage(this.props.navigator, 'OrderDetail');
    imagePos = index;
    const {navigation} = this.props;
    InteractionManager.runAfterInteractions(() => {
                    navigation.navigate('TakePicture',{
                    theme:this.theme
                })
    });
  }



  _onSure() {
        
        // if (!global.imageUrl1) {
        //     Toast.showLong('请拍旧物件照片');
        //     return;
        // }

        // if (!global.imageUrl2) {
        //     Toast.showLong('请拍新物件照片');
        //     return;
        // }

        // if (!global.imageUrl3) {
        //     Toast.showLong('请拍摄维修后照片');
        //     return;
        // }
        const {navigation} = this.props;
        if(this.state.step === 2){
            InteractionManager.runAfterInteractions(() => {
                navigation.navigate('FinishWork',{
                        theme:this.theme,
                        repairId:this.state.repairId
                })
            });
        }else if(this.state.step === 1){
            var imagesStarted = [];
            var filePath= null;
            let obj = {};
            var data = {}
            if (global.imageUrl0) {
                var item = global.imageUrl0
                obj = {
                    filePath : item.fileDownloadUri,
                    fileName : item.fileName,
                    bucketName : item.bucketName,
                    fileType : item.fileType,
                    fileHost : item.fileHost
                }
                data = {
                    "filePath":obj.filePath,
                    "fileName":obj.fileName,
                    "fileBucket":obj.bucketName,
                    "fileType": obj.fileType,
                    "fileHost": obj.fileHost
                }
                imagesStarted.push(data);
            }else{
                imagesStarted.push({})
            }  
            let params = {
                repairId:this.state.repairId,
                userId:global.uinfo.userId,
                imagesStarted:imagesStarted,
            };
            console.log(params)
            Request.requestPost(RepairCommenced, params, (result)=> {
                console.log(result)
                if (result && result.code === 200) {
                    this.props.navigation.navigate('MainPage',{
                        code : result.code
                    })
                } else {
                
                }
            });
        }
        
        
  }

  render() {
    var imageSource0 = this.state.imagePath0 ? {uri:this.state.imagePath0} : require('../../../../res/repair/ico_wgpz.png');
    var imageSource1 = this.state.imagePath1 ? {uri:this.state.imagePath1} : require('../../../../res/repair/ico_wgpz.png');
    var imageSource2 = this.state.imagePath2 ? {uri:this.state.imagePath2} : require('../../../../res/repair/ico_wgpz.png');
    var imageSource3 = this.state.imagePath3 ? {uri:this.state.imagePath3} : require('../../../../res/repair/ico_wgpz.png');
    var TakePictureStep = this.state.step ? this.state.step : 1;
    var contentList = null;
    if(TakePictureStep == 2){
        contentList = <View style={{flexDirection:'row', width:Dimens.screen_width, flex:1}}>
                        <View style={{width:Dimens.screen_width/2, flex:1}}> 
                            <Text style={{fontSize:25,color:'#333',marginLeft:25,marginTop:55,}}>01/</Text>
                            <Text style={{fontSize:15,color:'#333',marginLeft:25,marginTop:11,}}>请拍摄旧物件照片</Text>
                            <Image source={require('../../../../res/repair/line_wg.png')} style={{width:2,height:74,marginTop:5,marginLeft:55,}}/>

                            <Text style={{fontSize:25,color:'#333',marginLeft:25,marginTop:5,}}>02/</Text>
                            <Text style={{fontSize:15,color:'#333',marginLeft:25,marginTop:11,}}>请拍摄新物件照片</Text>
                            <Image source={require('../../../../res/repair/line_wg.png')} style={{width:2,height:74,marginTop:5,marginLeft:55,}}/>

                            <Text style={{fontSize:25,color:'#333',marginLeft:25,marginTop:5,}}>03/</Text>
                            <Text style={{fontSize:15,color:'#333',marginLeft:25,marginTop:11,}}>请拍摄维修后照片</Text>
                        
                        </View>

                        <View style={{width:Dimens.screen_width/2, flex:1}}>
                            <TouchableOpacity onPress={()=>{this.onTake(1)}} style={styles.action}>
                                <Image source={imageSource1} style={{width:70,height:55,}}/>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>{this.onTake(2)}} style={styles.action}>
                                <Image source={imageSource2} style={{width:70,height:55,}}/>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>{this.onTake(3)}} style={styles.action}>
                                <Image source={imageSource3} style={{width:70,height:55,}}/>
                            </TouchableOpacity>
                        </View>
                    </View>
    }else if(TakePictureStep == 1){
        contentList = <View style={{flexDirection:'row', width:Dimens.screen_width, flex:1}}>
                        <View style={{width:Dimens.screen_width/2, flex:1}}> 
                            <Text style={{fontSize:25,color:'#333',marginLeft:25,marginTop:55,}}>01/</Text>
                            <Text style={{fontSize:15,color:'#333',marginLeft:25,marginTop:11,}}>请拍摄维修前照片</Text> 
                        </View>

                        <View style={{width:Dimens.screen_width/2, flex:1}}>
                            <TouchableOpacity onPress={()=>{this.onTake(0)}} style={styles.action}>
                                <Image source={imageSource0} style={{width:70,height:55,}}/>
                            </TouchableOpacity>
                        </View>
                    </View>
    }
    return (
      <View style={styles.container}>
        <TitleBar
            centerText={this.props.navigation.state.params.title}
            isShowLeftBackIcon={true}
            navigation={this.props.navigation}
        />

        {contentList}

        <Text onPress={()=>this._onSure()} style={styles.button}>提交</Text>
      </View>
    )

}

}


const styles = StyleSheet.create({

  container: {
        flex: 1,
        backgroundColor: '#f6f6f6',
    },
    line:{
        backgroundColor:'#eeeeee',height:1,width:(Dimens.screen_width-15),marginTop:0,marginLeft:15,
    },
   action: {marginLeft:15, marginTop:30,width:120,height:120,backgroundColor: '#eee',alignItems:'center',
    justifyContent:'center',textAlignVertical:'center',borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,borderTopLeftRadius: 15,borderTopRightRadius:15, borderWidth:1, borderColor:'#eee'},
  button:{
    width:Dimens.screen_width,
    height:50,
    color:'#ffffff',
    fontSize:18,
    textAlign:'center',
    backgroundColor: '#5ec4c8',
    alignItems:'center',
    justifyContent:'center',
    textAlignVertical:'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignSelf: 'center'
  },

});