

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
    ScrollView,
    TextInput,
    Modal
} from 'react-native';

import TitleBar from '../../../component/TitleBar';
import * as Dimens from '../../../value/dimens';
// import AddOption from './AddOption';
import MaterielList from './MaterielList';
import TakePhotos from './TakePhotos';
import Palette from '../../../component/Palette';
import Request, {RepairCompleted, RepairDetail} from '../../../http/Request';

import { captureScreen, captureRef } from "react-native-view-shot";
import {Toast} from '../../../component/Toast'
import {Loading} from '../../../component/Loading'
import BaseComponent from '../../../base/BaseComponent'

var hours = '';
var moneyBen = '';
var moneyRen = '';
var reson = '';
var way = '';
var userNo = '';
export default class FinishWork extends BaseComponent {

    constructor(props){
        super(props);
        this.state={
            theme:this.props.theme,
            modalVisible:false,
            repairId:props.repairId,
            signatureData:null,
            detaiData:null,
        }
    }

    componentDidMount() {
        this.loadDetail();
    }

loadDetail() {
    var that = this;
    Request.requestGet(RepairDetail+this.state.repairId, null, (result)=> {
        if (result && result.code === 200) {
            that.setState({detaiData:result.data});
        } else {
          
        }
    });
}


  addOption() {
        const {navigation} = this.props;
        InteractionManager.runAfterInteractions(() => {
                // navigator.push({
                //     component: AddOption,
                //     name: 'AddOption',
                //     params:{
                //         theme:this.theme
                //     }
                // });
                navigation.navigate('AddOption',{theme:this.theme})
        });
  }


  completed(signatureData) {

    var that = this;
    var itemPersonList = [];
    var materials = [];
    var imagesCompleted = [];
    var imagesSignature = [];
    
    var processList = this.state.detaiData.processList;
    for (var i = 0; i < processList.length; i++) {
        var item = processList[i];
        let person = {assistantId: '', repairItemId:'', itemPercentage:'', personType:'', };
        itemPersonList.push(person);
    }

    var materialList = this.state.detaiData.materialList;
    for (var i = 0; i < materialList.length; i++) {
        var item = materialList[i];
        let m = {qty: item.qty, materialId:item.materialId, unitPrice:item.unitPrice};
        materials.push(m);
    }

    //var signatureData = this.state.signatureData;
    let m = {filePath: signatureData.fileDownloadUri, fileName:signatureData.fileName, fileBucket:signatureData.bucketName,
            fileType: 'image/jpeg', fileHost:signatureData.fileHost, flowType:1,};
    imagesSignature.push(m);

    var imageUrl = global.imageUrl1;
    if (imageUrl) {
        let image = {filePath: imageUrl.fileDownloadUri, fileName:imageUrl.fileName, fileBucket:imageUrl.bucketName,
            fileType: 'image/jpeg', fileHost:imageUrl.fileHost, flowType:1,};
        imagesCompleted.push(image);
    }
    
    imageUrl = global.imageUrl2;
    if (imageUrl) {
        let image = {filePath: imageUrl.fileDownloadUri, fileName:imageUrl.fileName, fileBucket:imageUrl.bucketName,
            fileType: 'image/jpeg', fileHost:imageUrl.fileHost, flowType:1,};
        imagesCompleted.push(image);
    }

    imageUrl = global.imageUrl3;
    if (imageUrl) {
        let image = {filePath: imageUrl.fileDownloadUri, fileName:imageUrl.fileName, fileBucket:imageUrl.bucketName,
            fileType: 'image/jpeg', fileHost:imageUrl.fileHost, flowType:1,};
        imagesCompleted.push(image);
    }

    let params = {
        repairId:that.state.repairId,
        userId:global.uinfo.userId,
        signatureWorkNo:userNo,
        malfunction:reson,
        repairWay:way,
        remark: '',
        itemPersonList:itemPersonList,
        materials:materials,
        imagesCompleted:imagesCompleted,
        imagesSignature:imagesSignature,
    };

    Loading.show();
    Request.requestPost(RepairCompleted, params, (result)=> {
        Loading.hidden();
        if (result && result.code === 200) {
            DeviceEventEmitter.emit('Event_Refresh_Detail', 'Event_Refresh_Detail');

            // that.routeToPage(that.props.navigator, global.from);
            that.routeToPage(that.props.navigation, global.from);
        } else {
            Toast.show('操作失败，请重试');
        }
    });
  }




renderMaterialItem(data, i) {
    var that = this;
    return (
    <View >
        <View style={{backgroundColor:'white', paddingTop:10, paddingBottom:10, textAlignVertical:'center',marginLeft:15, marginRight:15, flexDirection:'row',alignItems:'center',}}>
            <View style={{}} >
            <Text style={{color:'#333',fontSize:14,  marginLeft:10,}}>{data.materialName}</Text>
            <Text style={{color:'#999',fontSize:12,  marginLeft:10,marginTop:1,}}>规格：{data.spec}；品牌：{data.brand}</Text>
            </View>
            <View style={{justifyContent:'flex-end',flexDirection:'row',alignItems:'center', flex:1}}>
                    <Text style={{color:'#666',fontSize:14, height:40, textAlignVertical:'center', marginLeft:5,marginRight:10,}}>x{data.qty}</Text>          
            </View>
        </View>
        <View style={{backgroundColor:'#eeeeee',height:1,width:(Dimens.screen_width-30), marginLeft:15, marginRight:15,}} />
    </View>
    );
}

  

  render() {
    var startY = (Dimens.screen_height-490)/2+40;
    var materialView = null;
    var uri0 = null;
    var matterName = null;
    if (this.state.detaiData && this.state.detaiData.materialList && this.state.detaiData.materialList.length > 0) {
            matterName = this.state.detaiData.matterName;
            uri0 = this.state.detaiData.fileMap.imagesStarted[0].filePath;
            var materialList = this.state.detaiData.materialList;
            var total = 0;
            for (var i = 0; i < materialList.length; i++) {
                var item = materialList[i];
                total = total + item.unitPrice*item.qty;
            }

            var list = materialList.map((item, i)=>this.renderMaterialItem(item, i));
            materialView = <View><View style={{backgroundColor:'white', height:40, textAlignVertical:'center',marginTop:15,marginLeft:15, marginRight:15, flexDirection:'row',alignItems:'center',}}>
                                <Text style={{color:'#999',fontSize:15, height:40, width:60, textAlignVertical:'center', marginLeft:10,}}>物料</Text>
                           </View>
                           <View style={{backgroundColor:'#eeeeee',height:1,width:(Dimens.screen_width-30), marginLeft:15, marginRight:15,}} />
                           {list}
                           <View style={{backgroundColor:'white', height:40, justifyContent:'flex-end',textAlignVertical:'center',marginLeft:15, marginRight:15, flexDirection:'row',alignItems:'center',}}>
                                <Text style={{color:'#333',fontSize:16, height:40, textAlignVertical:'center', marginLeft:5,}}>合计</Text>
                                <Text style={{color:'#EA6060',fontSize:14, height:40, marginLeft:20,textAlignVertical:'center', marginRight:10,}}>¥{total}</Text>
                           </View></View>

    }

    var uri1 = global.imageUrl1?global.imageUrl1.fileDownloadUri:null;
    var uri2 = global.imageUrl2?global.imageUrl2.fileDownloadUri:null;
    var uri3 = global.imageUrl3?global.imageUrl3.fileDownloadUri:null;
    
    return (
      <View style={styles.container}>
      <TitleBar
      centerText={'完工'}
      isShowLeftBackIcon={true}
      navigation={this.props.navigation}
      />
      <ScrollView horizontal={false} indicatorStyle={'white'} showsVerticalScrollIndicator={true} style={{height:Dimens.screen_height-40-64, width:Dimens.screen_width,flex:1}}>
        <Text style={{color:'#909399',fontSize:15, height:40, justifyContent:'flex-start',textAlignVertical:'center',paddingLeft:15,marginTop:5,}}>维修事项：{matterName}</Text>
        <View style={{backgroundColor:'white', height:40, textAlignVertical:'center',marginLeft:15, marginRight:15, flexDirection:'row',alignItems:'center',}}>
            <Text style={{color:'#999',fontSize:14, height:40, width:70, textAlignVertical:'center', marginLeft:10,}}>维修工时</Text>
            <TextInput style={{color:'#333',fontSize:14, height:40, width:150, marginLeft:10,textAlignVertical:'center'}} 
                placeholder="请输入工时" placeholderTextColor="#aaaaaa" underlineColorAndroid="transparent" numberOfLines={1}
                onChangeText={(text) => {
                    hours = text;
                }}/>
            <View style={{justifyContent:'flex-end',flexDirection:'row',alignItems:'center', flex:1}}>
                    <Text style={{color:'#666',fontSize:14, height:40, textAlignVertical:'center', marginLeft:5,marginRight:10,}}>小时</Text>
                                
            </View>
        </View>
        <View style={styles.line} />
        <View style={{backgroundColor:'white', height:40, textAlignVertical:'center',marginLeft:15, marginRight:15, flexDirection:'row',alignItems:'center',}}>
            <Text style={{color:'#999',fontSize:14, height:40, width:70,textAlignVertical:'center', marginLeft:10,}}>维修成本</Text>
            <TextInput style={{color:'#333',fontSize:14, height:40, width:150, marginLeft:10,textAlignVertical:'center'}} 
                placeholder="请输入成本" placeholderTextColor="#aaaaaa" underlineColorAndroid="transparent" numberOfLines={1}
                onChangeText={(text) => {
                    moneyBen = text;
                }}/>
            <View style={{justifyContent:'flex-end',flexDirection:'row',alignItems:'center', flex:1}}>
                   <Text style={{color:'#666',fontSize:14, height:40, textAlignVertical:'center', marginLeft:5,marginRight:10,}}>元</Text>
                                
            </View>
        </View>
        <View style={styles.line} />
        <View style={{backgroundColor:'white', height:40, textAlignVertical:'center',marginLeft:15, marginRight:15, flexDirection:'row',alignItems:'center',}}>
            <Text style={{color:'#999',fontSize:14, height:40, width:70, textAlignVertical:'center', marginLeft:10,}}>人工费</Text>
            <TextInput style={{color:'#333',fontSize:14, height:40, width:150, marginLeft:10,textAlignVertical:'center'}} 
                placeholder="请输入人工费" placeholderTextColor="#aaaaaa" underlineColorAndroid="transparent" numberOfLines={1}
                onChangeText={(text) => {
                    moneyRen = text;
                }}/>
            <View style={{justifyContent:'flex-end',flexDirection:'row',alignItems:'center', flex:1}}>
                    <Text style={{color:'#666',fontSize:14, height:40, textAlignVertical:'center', marginLeft:5,marginRight:10,}}>元</Text>
                                
            </View>
        </View>
        <View style={styles.line} />
        <View style={{backgroundColor:'white', height:40, justifyContent:'flex-end',textAlignVertical:'center',marginLeft:15, marginRight:15, flexDirection:'row',alignItems:'center',}}>
            <Text style={{color:'#333',fontSize:16, height:40, textAlignVertical:'center', marginLeft:5,}}>合计</Text>
            <Text style={{color:'#EA6060',fontSize:14, height:40, marginLeft:20,textAlignVertical:'center', marginRight:10,}}>¥0</Text>
            
        </View>

        {materialView}

        <View style={{flexDirection:'row',alignItems:'center',marginLeft:15,marginRight:15,marginTop:10,}} >
            <View style={{alignItems:'center',flex:1}} >
                <Image source={{uri:uri0}} style={{width:70,height:70,}}/>
                <Text style={{color:'#999',fontSize:14, marginTop:10, textAlign:'center'}}>维修前</Text>
            </View>

            <Image source={require('../../../../res/repair/list_ico_wxxq.png')} style={{width:20,height:20,marginLeft:10,}}/>
            <View style={{alignItems:'center',flex:1, marginLeft:10,}} >
                <Image source={{uri:uri1}} style={{width:70,height:70,}}/>
                <Text style={{color:'#999',fontSize:14, marginTop:10, textAlign:'center'}}>旧物料</Text>
            </View>

            <View style={{alignItems:'center',flex:1, marginLeft:10,}} >
                <Image source={{uri:uri2}} style={{width:70,height:70,}}/>
                <Text style={{color:'#999',fontSize:14, marginTop:10, textAlign:'center'}}>新物料</Text>
            </View>
            <View style={{alignItems:'center',flex:1, marginLeft:10,}} >
                <Image source={{uri:uri3}} style={{width:70,height:70,}}/>
                <Text style={{color:'#999',fontSize:14, marginTop:10, textAlign:'center'}}>完工后</Text>
            </View>
        </View>

        <View style={{backgroundColor:'white', height:40, textAlignVertical:'center',marginLeft:15, marginRight:15, marginTop:15, flexDirection:'row',alignItems:'center',}}>
            <Text style={{color:'#999',fontSize:14, height:40, width:70, textAlignVertical:'center', marginLeft:10,}}>故障原因</Text>
            <TextInput style={{color:'#333',fontSize:14, height:40, width:150, marginLeft:10,textAlignVertical:'center'}} 
                placeholder="请输入故障原因" placeholderTextColor="#aaaaaa" underlineColorAndroid="transparent" numberOfLines={1}
                onChangeText={(text) => {
                    reson = text;
                }}/>
            
        </View>
        <View style={styles.line} />
        <View style={{backgroundColor:'white', height:40, textAlignVertical:'center',marginLeft:15, marginRight:15, flexDirection:'row',alignItems:'center',}}>
            <Text style={{color:'#999',fontSize:14, height:40, width:70,textAlignVertical:'center', marginLeft:10,}}>维修方法</Text>
            <TextInput style={{color:'#333',fontSize:14, height:40, width:150, marginLeft:10,textAlignVertical:'center'}} 
                placeholder="请输入维修方法" placeholderTextColor="#aaaaaa" underlineColorAndroid="transparent" numberOfLines={1}
                onChangeText={(text) => {
                    way = text;
                }}/>
            
        </View>
        <View style={styles.line} />
        <View style={{backgroundColor:'white', height:40, textAlignVertical:'center',marginLeft:15, marginRight:15, flexDirection:'row',alignItems:'center',}}>
            <Text style={{color:'#999',fontSize:14, height:40, width:70, textAlignVertical:'center', marginLeft:10,}}>工号</Text>
            <TextInput style={{color:'#333',fontSize:14, height:40, width:150, marginLeft:10,textAlignVertical:'center'}} 
                placeholder="请输入工号" placeholderTextColor="#aaaaaa" underlineColorAndroid="transparent" numberOfLines={1}
                 value = {global.uinfo.workNumber?global.uinfo.workNumber:''}
                onChangeText={(text) => {
                    userNo = text;
                }}/>
            
        </View>
        <View style={{width:Dimens.screen_width,height:120}} />
    </ScrollView>
    <Text onPress={()=>this.signup()} style={styles.button}>签字确认</Text>

    <Modal
            animationType={"none"}
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {}}
        >

        <View style={styles.modelStyle}>
            <View style={[styles.popupStyle, {marginTop:(Dimens.screen_height-490)/2,}]}>
                <Text style={{fontSize:16,color:'#333',marginLeft:0,marginTop:10,textAlign:'center',width:Dimens.screen_width-50, height:40}}>签字确认</Text>
                <View style={{backgroundColor:'#eeeeee',height:1,width:(Dimens.screen_width-50),}} />
                <Palette
                    width={Dimens.screen_width-50}
                    height={400}
                    startX={25}
                    startY={startY}
                    ref = 'palette'
                    />

                <View style={{backgroundColor:'transparent', flexDirection:'row',textAlignVertical:'center',alignItems:'center',}}>
                    <Text onPress={()=>this.cancel()} style={{borderBottomLeftRadius: 15,textAlignVertical:'center',backgroundColor:'#EFF0F1', color:'#333',fontSize:16, height:40, textAlign:'center', flex:1}}>取消</Text>
                    <Text onPress={()=>this.submit()} style={{borderBottomRightRadius: 15,textAlignVertical:'center',backgroundColor:'#E1E4E8', color:'#333',fontSize:16, height:40, textAlign:'center', flex:1}}>确定</Text>
                </View>
            </View>
        </View>
    </Modal> 


    </View>
    ) 
    }


    uploadFile(path) {
        var that = this;
        Request.uploadFile(path, (result)=> {
    
            if (result && result.code === 200) {
              
                that.setState({signatureData:result.data, modalVisible:false});
                that.completed(result.data);
            } else {
              
                Toast.show('上传失败，请重试');
            }
      });
    }


    cancel() {
        this.setState({modalVisible:false});
       
    }

    submit() {
        if (!this.refs.palette.isWrite()) {
            this.setState({modalVisible:false});
            Toast.show('请先签名');
            return;
        }

        captureRef(this.refs.palette, {
            format: "jpg",
            quality: 0.8,
            result: "tmpfile",
            snapshotContentContainer: false
        }).then(
            uri => {
                console.log("uri "+uri);
                this.uploadFile(uri);
            },
            error => console.error("Oops, snapshot failed", error)
        );

    }

    signup() {

        // if (hours === '') {
        //     Toast.show('请输入工时');
        //     return;
        // }
        // if (moneyBen === '') {
        //     Toast.show('请输入成本');
        //     return;
        // }
        // if (moneyRen === '') {
        //     Toast.show('请输入人工费');
        //     return;
        // }
        // if (reson === '') {
        //     Toast.show('请输入故障原因');
        //     return;
        // }
        // if (way === '') {
        //     Toast.show('请输入维修方法');
        //     return;
        // }
        // if (userNo === '') {
        //     Toast.show('请输入工号');
        //     return;
        // }

        this.setState({modalVisible:true});
    }
}


const styles = StyleSheet.create({
    modelStyle:{
        flex: 1,
        width:Dimens.screen_width,
        height:Dimens.screen_height,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    popupStyle:{
        marginLeft:25,
        width:Dimens.screen_width-50,
        height:480,
        backgroundColor: 'white',
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15,
        borderTopLeftRadius: 15,
        borderTopRightRadius:15, 
        backgroundColor: 'white',
    },
    container: {
        flex: 1,
        backgroundColor: '#f6f6f6',
    },

    welcome:{
        color:'#123456',

    },
    line:{
        backgroundColor:'#eeeeee',height:1,width:(Dimens.screen_width-30),marginTop:0,marginLeft:15,
    },
    button:{
        width:Dimens.screen_width,
        height:46,
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
    images:{
        height:160,
        width: Dimens.screen_width,
    }
});