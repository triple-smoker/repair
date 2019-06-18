

import React, { Component } from 'react';
import {
    View,
    Text,
    BackAndroid,
    TouchableOpacity,
    Image,
    StyleSheet,
    InteractionManager,
    TextInput,
    Dimensions,
    DeviceEventEmitter,
    Modal
} from 'react-native';
import {Loading} from '../../component/Loading'
import { Radio ,List,ListItem } from 'native-base';
import TitleBar from '../../component/TitleBar';
import BaseComponent from '../../base/BaseComponent'
import Request, {ScanDetails,baseUser,GetUserInfo} from '../../http/Request';
import * as Dimens from '../../value/dimens';
import { toastShort } from '../../util/ToastUtil';
import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from 'react-native-image-crop-picker';
var newName = ''
var newTel  = ''
let ScreenWidth = Dimensions.get('window').width;
let ScreenHeight = Dimensions.get('window').height;
export default class MyData extends BaseComponent {
    static navigationOptions = {
        header: null,
    };
    constructor(props){
        super(props);
        this.state={
            theme:this.props.theme,
            userData:null,
            name:'',
            nameShow:false,
            telShow:false,
            sexShow:false,
            images: [],
            visibleModal:false,
            imagePath0:null,
            imageUrl0:null,
        }
    }
    componentDidMount() {
        var that = this;
        this.loadDetail();
        this.eventListener = DeviceEventEmitter.addListener('Event_Take_Photo', (param) => {
            console.log('componentDidMount Event_Take_Photo : ' + param + ", imagePos : " );
            that.setState({imagePath0:param,});
            

            that.uploadFile(param);
        });
    }
    componentWillReceiveProps(nextProps) {
        this.loadDetail();
    }
    loadDetail() {
        var that = this;
        AsyncStorage.getItem('uinfo',function (error, result) {
            if(error){
                console.log(error)
                return
            }else{
                var userInfo =  JSON.parse(result);
                that.setState({userData:userInfo});
                console.log(userInfo)
            }
        })
    }
    uploadFile(path) {
        // Loading.show();
        var that = this;
        console.log(path)
        Request.uploadFile(path, (result)=> {
            console.log('path')
            console.log(path)
            console.log('result')
            console.log(JSON.stringify(result))
            if (result && result.code === 200) {
                that.setState({imageUrl0:JSON.stringify(result.data), });
                // Loading.hidden();
                this.updatePortrait(result.data.fileDownloadUri)
            } 
      });
    }
    updatePortrait(Msg){
        Request.requestPut(baseUser,{
            headImgId:Msg,
            userId : this.state.userData.userId
        }, (result)=> {
            if (result && result.code === 200 && result.data == true) {
                this.fetchUserInfo();
            } else {
            
            }
        })
    }
    _edit(type){
        console.log(type)
        var that = this;
        if(type == 'username'){
            that.setState({nameShow:!that.state.nameShow})
        }else if(type == 'tel'){
            that.setState({telShow:!that.state.telShow})
        }else if(type == 'sex'){
            that.setState({sexShow:!that.state.sexShow})
        }
    }
    modification(type,Msg,oldMsg){
        var that = this;
        if(type == 'username'){
            if(Msg == oldMsg){
                toastShort('请修改名称');
                this._edit(type);
                return;
            }else if(this.isEmpty(Msg)){
                toastShort('姓名不能为空');
                this._edit(type);
                return;
            }else{
                console.log('修改')
                Request.requestPut(baseUser,{
                    userName:Msg,
                    userId : this.state.userData.userId
                }, (result)=> {
                    if (result && result.code === 200 && result.data == true) {
                        this.fetchUserInfo();
                        this._edit(type)
                    } else {
                    
                    }
                })
            }
        }else if(type == 'tel'){
            console.log(type)
            if(Msg == oldMsg){
                toastShort('请修改手机号');
                this._edit(type)
                return;
            }else if(this.isEmpty(Msg)){
                console.log('未修改')
                toastShort('联系方式不能为空');
                this._edit(type)
                return;
            }else{
                console.log('修改')
                if(!this.isPhoneNumber(Msg)){
                    toastShort('请填写正确的联系方式');
                    return
                }
                Request.requestPut(baseUser,{
                    telNo:Msg,
                    userId : this.state.userData.userId
                }, (result)=> {
                    if (result && result.code === 200 && result.data == true) {
                        this.fetchUserInfo();
                        this._edit(type)
                    } else {
                    
                    }
                })
            }
        }
    }
    isEmpty(obj){
        if(typeof obj == "undefined" || obj == null || obj == ""){
                return true;
        }else{
                return false;
        }
    }
    TextInputModule(domType,txt,type){
       if(domType == 'input'){
           return <TextInput
                    style={{height: 40, minWidth: 50,borderColor: 'gray', padding: 0,}}
                    numberOfLines={1}
                    underlineColorAndroid="#aaaaaa"
                    placeholderTextColor="#aaaaaa"
                    placeholder={txt}
                    onChangeText={(text) => {
                        if(type == 'username'){
                            newName = text;
                        }else if(type == 'tel'){
                            newTel = text
                        }
                    }}/>
       }else if(domType == 'text'){
           return <Text  style={{color:'#737373'}}>{txt}</Text>
       }  
    }

    checkSex(type,oldType){
        console.log(type+':'+oldType)
        if(type != oldType){
            Request.requestPut(baseUser,{
                gender : type,
                userId : this.state.userData.userId
            }, (result)=> {
                console.log(result)
                if (result && result.code === 200 && result.data == true) {
                    this.fetchUserInfo();
                    this._edit('sex')
                } else {
                
                }
            })
        }
        
    }
    onTake() {
        //this.routeToPage(this.props.navigator, 'OrderDetail');
        this.toggleModal()
        const {navigation} = this.props;
        InteractionManager.runAfterInteractions(() => {
                        navigation.navigate('TakePicture',{
                        theme:this.theme
                    })
        });
      }
    pickMultiple() {
        ImagePicker.openPicker({
            multiple: true,
            waitAnimationEnd: false,
            includeExif: true,
            forceJpg: true,
            mediaType: 'photo',
        }).then(images => {
            //将选择的图片加入到列表

            console.log('pickimage : ' +  images);
            this.updatePortrait(images)
        }).catch();
    } 
    // 是否电话号码
    isPhoneNumber(phoneNumber){
        const reg = /^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/;
        return reg.test(phoneNumber);
    };
    render() {
        var  userData = this.state. userData;
        if (userData) {
            var headerImg = userData.headImgId;
            var workNumber = userData.workNumber;
            var  deptName = userData.deptAddresses[0].deptName
            var userName = userData.userName;
            var gender = userData.gender;
            var telNo = userData.telNo;
        }
        
        var editImg = require('../../../res/login/edit.png');
        var successImg =  require('../../../res/login/success.png');
        return (  
          <View style={styles.container}>
          <TitleBar
          centerText={'个人资料'}
          isShowLeftBackIcon={true}
          navigation={this.props.navigation}
          leftPress={() => this.naviGoBack(this.props.navigation)} 
          />
          
            <View style={{...styles.input_center_bg,borderTopLeftRadius: 45,borderBottomLeftRadius: 45,}}>
                <View style={{flexDirection: 'row',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                lineHeight:45,
                                height:45,
                                marginLeft:0,
                                marginRight:0,
                                paddingRight: 15,}}>
                {headerImg ? <Image style={{height:45,width:45,borderRadius:45}} source={{uri:headerImg}}/> : <Image style={{height:45,width:45,borderRadius:45}} source={require('../../../res/repair/user_wx.png')}/>}
                    <TouchableOpacity onPress={()=>this.toggleModal()}>
                    <Text style={{fontSize:16,marginLeft:20, textDecorationLine:'underline',}}>
                        更换头像
                    </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.input_center_bg}>
                <View style={styles.case}>
                    <Text style={{fontSize:16}}>
                        姓名
                    </Text>
                    <View style={{flexDirection:'row',justifyContent:'flex-end',alignItems: 'center',}}>
             
                        {
                            this.state.nameShow ? this.TextInputModule('input',userName,'username') : this.TextInputModule('text',userName)
                        }

                        {
                            this.state.nameShow ? 
                            <TouchableOpacity onPress={()=>{this.modification('username',newName,userName)}}>
                                <Image style={{height:20,width:19,marginLeft:5}} source={successImg}/>
                            </TouchableOpacity> :
                            <TouchableOpacity onPress={()=>{this._edit('username')}}>
                                <Image style={{height:20,width:19,marginLeft:5}} source={editImg}/>
                            </TouchableOpacity> 
                             
                        }   
                    
                   
                    </View>
                    
                </View>
            </View>

            <View style={styles.input_center_bg}>
                
                <View style={styles.case}>
                    <Text style={{fontSize:16}}>
                        性别
                    </Text>
                    <View style={{flexDirection:'row',justifyContent:'flex-end',alignItems: 'center',}}>
                    
                    {
                        this.state.sexShow   ?  <View style={{flexDirection:'row',justifyContent:'flex-end',alignItems: 'center',}}>
                                                    <Radio onPress={()=>this.checkSex(1,gender)}  color={"#737373"}
                                                            selectedColor={"#737373"} selected={gender == 1}></Radio><Text>男</Text>
                                                    <Radio onPress={()=>this.checkSex(0,gender)}  color={"#737373"}
                                                            selectedColor={"#737373"} selected={gender == 0}></Radio><Text>女</Text>
                                                </View> : 
                                                <View style={{flexDirection:'row',justifyContent:'flex-end',alignItems: 'center',}}>
                                                    <Text  style={{color:'#737373'}}>{gender == 1 ? '男' : '女'}</Text>
                                                    <TouchableOpacity onPress={()=>{this._edit('sex')}}>
                                                        <Image style={{height:20,width:19,marginLeft:5}} source={require('../../../res/login/edit.png')}/>
                                                    </TouchableOpacity>
                                                </View>
                        }
                    
                    
                 
                    
                    
                    </View>
                    
                </View>
               
            </View>
            <View style={styles.input_center_bg}>
                
                <View style={styles.case}>
                    <Text style={{fontSize:16}}>
                        联系方式
                    </Text>
                    <View style={{flexDirection:'row',justifyContent:'flex-end',alignItems: 'center',}}>
                        {
                            this.state.telShow ? this.TextInputModule('input',telNo,'tel') : this.TextInputModule('text',telNo)
                        }

                        {
                            this.state.telShow ? 
                            <TouchableOpacity onPress={()=>{this.modification('tel',newTel,telNo)}}>
                                <Image style={{height:20,width:19,marginLeft:5}} source={successImg}/>
                            </TouchableOpacity> :
                            <TouchableOpacity onPress={()=>{this._edit('tel')}}>
                                <Image style={{height:20,width:19,marginLeft:5}} source={editImg}/>
                            </TouchableOpacity> 
                             
                        }  

                        
                    </View>
                </View>
               
            </View>
       
            <View style={styles.input_center_bg}>
                
                <View style={styles.case}>
                    <Text style={{fontSize:16}}>
                        工号
                    </Text>
                    <View>
                    <Text style={{color:'#999',marginRight:24}}>{workNumber}</Text>
                   
                    </View>
                </View>
               
            </View>
            <View style={styles.input_center_bg}>
                
                <View style={styles.case}>
                    <Text style={{fontSize:16}}>
                        部门
                    </Text>
                    <View>
                    <Text  style={{color:'#999',marginRight:24}}>{deptName}</Text>
                   
                    </View>
                </View>
               
            </View>
            <Modal 
                onRequestClose={()=>this.toggleModal()}
                transparent={true}
                animationType={'slide'}
                visible={this.state.visibleModal}
                >
                    <TouchableOpacity style={{flex:1}} onPress={()=>this.toggleModal()}>

                    
                        <View style={{position:'relative',flex:1,backgroundColor:'rgba(0,0,0,0.5)'}}>
                            <View style={{position:'absolute',bottom:0,backgroundColor:'999'}}>
                                <TouchableOpacity onPress={()=>this.pickMultiple()} >
                                <View style={styles.box}>
                                    <Text style={{color:'black',fontSize:15}}>从相册中选择照片</Text>
                                </View>
                                </TouchableOpacity>
                                <View style={styles.line} />
                                <TouchableOpacity onPress={()=>this.onTake()}>
                                <View style={styles.box}>
                                    <Text style={{color:'black',fontSize:15}}>拍照</Text>
                                </View>
                                </TouchableOpacity>
                                <View style={styles.line} />
                                <TouchableOpacity onPress={()=>this.toggleModal()}>
                                <View style={{...styles.box,marginTop:5}}>
                                    <Text style={{color:'black',fontSize:15}}>取消</Text>
                                </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    
                    </TouchableOpacity>
            </Modal>
            </View>
    )
}
toggleModal = () =>
        this.setState({ visibleModal: !this.state.visibleModal });

       
fetchUserInfo() {
    var that = this;
    Request.requestGet(GetUserInfo, null, (result)=> {
        if (result && result.code === 200) {
            global.uinfo = result.data;
            AsyncStorage.setItem('uinfo', JSON.stringify(result.data), function (error) {
                //console.log('uinfo: error' + error);
                if (error) {
                   console.log('error: save error' + JSON.stringify(error));
                } else {
                   //console.log('save: uinfo = ' + JSON.stringify(result.data));
                }

            });
            this.loadDetail();
        }

    });
}

}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
    case:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        lineHeight:45,
        height:45,
        marginLeft:0,
        marginRight:0,
        paddingLeft: 20,
        paddingRight: 15,
    },
    box:{
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor:'white',
        alignItems: 'center',marginLeft:0,marginRight:0,marginTop:0,marginBottom: 0,
        height:50
    },
    input_center_bg:{
        overflow:'hidden',
        backgroundColor: '#f0f0f0',
        marginTop:10,
        marginLeft:14,
        marginRight:14,
        borderRadius:5,
        borderColor: '#d0d0d0',
        borderWidth: 1,
    },
    input_item:{
        flexDirection:'row',height:40,alignItems:'center',marginTop:0,
    },
    input_style:{
        fontSize: 15,height:40,textAlign: 'left',textAlignVertical:'center',flex:1,marginLeft:0
    },
    line:{
        backgroundColor:'#eeeeee',height:1,width:(Dimens.screen_width),marginTop:0,
    },
});