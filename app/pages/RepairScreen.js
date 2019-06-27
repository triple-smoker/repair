import React from "react";
import {Container, Content , Text} from 'native-base';
import MultipleImagePicker from "../components/MultipleImagePicker";
import Reporter from '../components/Reporter';
import Notice from '../components/Notice';
import SoundRecoding from '../components/SoundRecoding';
import MyFooter from '../components/MyFooter';
import {TextInput, Image, View, DeviceEventEmitter, TouchableOpacity, TouchableHighlight} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import Recorde from "../components/Recorde";
import OrderType from "./publicTool/OrderType";
import RepairType from "./publicTool/RepairType"
import Request, { GetUserAddress } from "../js/http/Request";

export default class RepairScreen extends React.Component {

    /**
     * 页面顶部导航栏配置
     * @type
     */
    static navigationOptions = {
        header : null
    };
    // static navigationOptions = ({ navigation, navigationOptions }) =>{
    //     return {
    //         headerTitle: '新增报修',
    //         //headerBackImage: (<Image resizeMode={'contain'} style={{width: 38, height: 60}} source={require('../image/navbar_ico_back.png')} />),
    //         headerStyle: {
    //             elevation: 0,
    //         },
    //         headerRight: (<TouchableOpacity
    //             onPress= {()=>{
    //                 alert("123");
    //             }}>
    //             <Text style={{fontSize:12,color:"#666",width:50}}>类型</Text>
    //             <OrderType goToRepair={(repairTypeId,repairMatterId,repairParentCn,repairChildCn)=>this.newRepair(repairTypeId,repairMatterId,repairParentCn,repairChildCn)} isShowModal={()=>this._setTypeVisible()} modalVisible = {this.state.typeVisible}/>
    //         </TouchableOpacity>),
    //         headerTitleStyle: {
    //             flex:1,
    //             textAlign: 'center'
    //         },
    //         headerLeft:(<TouchableOpacity
    //             onPress= {()=>{
    //                 if(navigation.state.params.isScan && navigation.state.params.isScan == true){
    //                     navigation.navigate("MainPage");
    //                 }else{
    //                     navigation.goBack();
    //                 }
    //             }}>
    //             <Image resizeMode={'contain'} style={{width: 38, height: 60,marginLeft:5}} source={require('../image/navbar_ico_back.png')} />
    //         </TouchableOpacity>)
    //
    //     }
    // };

    constructor(props){

        console.log(props);

        super(props);
        const { navigation } = this.props;
        
        // const repairTypeId = navigation.getParam('repairTypeId', '');
        // const repairMatterId = navigation.getParam('repairMatterId', '');
        // const repairParentCn = navigation.getParam('repairParentCn', '');
        // const repairChildCn = navigation.getParam('repairChildCn', '');
        const isScan = navigation.getParam('isScan', '');
        const equipmentId = navigation.getParam('equipmentId', '');
        const equipmentName = navigation.getParam('equipmentName', '');
        this.state = {
            repairTypeId : "",
            repairMatterId : "",
            repairParentCn : "",
            repairChildCn : "",
            isScan : isScan,
            equipmentId : equipmentId,
            equipmentName : equipmentName,
            images: [],
            visibleModal: false,
            showNotice: false,
            showVoice: false,
            errorTxt:'',
            desc : '',
            record : {
                filePath : '',
            },
            typeVisible:false,
        }


        AsyncStorage.getItem('uinfo',function (error, result) {
                if (error) {

                }else {
                    let loginUserInfo = JSON.parse(result);

                    if(loginUserInfo != null){
                        var reporter = loginUserInfo.userName;
                        var address = '';
                        Request.requestGet(GetUserAddress + loginUserInfo.userId, null, (result) => {
                            if (result && result.code === 200) {
                                var info = result.data[0]

                                result.data.forEach(element => {
                                    if(element.isDefault == '1'){
                                        info = element;
                                    }
                                });


                                if(info){
                                    reporter = info.userName;
                                    address = info.buildingName + info.floorName + info.roomName
                                }

                                this.setState({
                                    reporter: reporter,
                                    phone: loginUserInfo.telNo,
                                    address: address
                                });
                            }
                        });

                        
                    }

                    // if( porterList!=null && porterList.length>0 ){
                    //     let reporter = porterList[0]
                    //     this.setState({
                    //         reporter: reporter.name,
                    //         phone: reporter.phone,
                    //         address: reporter.address,
                    //     });
                    // }

                }
            }.bind(this)
        )

    }

    componentDidMount(){
        this.eventListener = DeviceEventEmitter.addListener('Add_Photo', (images) => {
            console.log('componentDidMount Add_Photo : ' + images );

            this.imageCallback(images);
            // that.uploadFile(param);
        });
    }
    //报修类型
    _setTypeVisible() {
        this.setState({typeVisible: !this.state.typeVisible});
    }
    //报修导航
    newRepair(repairTypeId,repairMatterId,repairParentCn,repairChildCn){
        this.setState({typeVisible: !this.state.typeVisible,
            repairTypeId : repairTypeId,
            repairMatterId : repairMatterId,
            repairParentCn : repairParentCn,
            repairChildCn : repairChildCn,
        });
        // const { navigate } = this.props.navigation;
        // navigate('Repair',{
        //     repairTypeId:repairTypeId,
        //     repairMatterId:repairMatterId,
        //     repairParentCn:repairParentCn,
        //     repairChildCn:repairChildCn,
        //     callback: (
        //         () => {
        //
        //         })
        // })

    }

    /**
     * 判断字符是否为空的方法
     * */

		isEmpty(obj){
			if(typeof obj == "undefined" || obj == null || obj == ""){
					return true;
			}else{
					return false;
			}
        }
    /**
     * 判断错误内容
     * */
        judgeContent(obj){
            let content =  obj;
            if(this.isEmpty(content.desc) && this.isEmpty(content.voices.filePath)){
                this.setState({
                    showNotice: true,
                    errorTxt:'报修内容不能为空'
                });
                return false;
            }else if(this.isEmpty(content.reporter.phone) ||
                                this.isEmpty(content.reporter.reporter) ||
                                this.isEmpty(content.reporter.address)){
                this.setState({
                    showNotice: true,
                    errorTxt:'报修人信息不能为空'
                });
                return false;
            }else if(content.images.length == 0){
                this.setState({
                    showNotice: true,
                    errorTxt:'请您上传或拍摄报修照片'
                });
                return false;
            }else{
                this.setState({
                    showNotice: false,
                    errorTxt:''
                });
                return true;
            }
	    }

    submit(){

        let repairInfo = {
            repairTypeId : this.state.repairTypeId,
            repairMatterId : this.state.repairMatterId,
            repairParentCn : this.state.repairParentCn,
            repairChildCn : this.state.repairChildCn,
            voices : this.state.record,
            images: this.state.images,
            desc : this.state.desc,
            reporter : {
                reporter: this.state.reporter,
                phone: this.state.phone,
                address: this.state.address
            }
        };

        if(this.state.isScan == true){
            repairInfo['isScan'] = this.state.isScan;
            repairInfo['equipmentId'] = this.state.equipmentId;
            repairInfo['equipmentName'] = this.state.equipmentName;
        }

        if(this.judgeContent(repairInfo) == false){
            return;
        }
        console.log('提交参数')
        console.log(repairInfo)
        const { navigate } = this.props.navigation;
        navigate('Confirm', repairInfo);

    }

    /**
     * 修改联系人
     */
    changeReporter(){
        const { navigate } = this.props.navigation;
        navigate('Address', {
            reporter: this.state.reporter,
            phone: this.state.phone,
            address: this.state.address,
            callback: (
                (info) => {
                    this.setState(
                        {
                            reporter: info.name,
                            phone: info.phone,
                            address: info.address,
                        }
                    )
                }
            )
        })
    };


    recordCallBack(record){
        this.setState({
            record : record,
            showVoice : false
        })

    }
    imageCallback(images){
        console.log('pickImageList' + images);
        this.setState({
            images : images
        })
    }
    goBack(){
        const { navigate } = this.props.navigation;
        this.props.navigation.goBack();
    }

    render() {
        return (
            <Container style={{backgroundColor: "#EEEEEE"}}>
                <View style={{height:44,backgroundColor:'white',justifyContent:'center', textAlignVertical:'center', flexDirection:'row',alignItems:'center', marginLeft:0, marginRight:0, marginTop:0,}}>
                    <TouchableHighlight style={{width:50,height:44,alignItems:"center",justifyContent:"center"}} onPress={()=>this.goBack()}>
                        <Image style={{width:21,height:37}} source={require("../image/navbar_ico_back.png")}/>
                    </TouchableHighlight>
                    <TouchableOpacity style={{flex:1,height:30, marginRight:0,}}>
                        <View style={{flex:1,justifyContent:'center',alignItems:'center',height:30,fontWeight:"600"}}>
                            <Text style={{color:'#555',fontSize:18,marginLeft:5, flex:1}}>新增报修</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>this._setTypeVisible()} style={{width:60,flexDirection:'row'}}>
                        <Text style={{color:"#666",fontSize:12}}>类型</Text>
                    </TouchableOpacity>
                    {/* <OrderType goToRepair={(repairTypeId,repairMatterId,repairParentCn,repairChildCn)=>this.newRepair(repairTypeId,repairMatterId,repairParentCn,repairChildCn)} 
                                isShowModal={()=>this._setTypeVisible()} 
                                modalVisible = {this.state.typeVisible}/> */}


                     <RepairType goToRepair={(repairTypeId,repairMatterId,repairParentCn,repairChildCn)=>this.newRepair(repairTypeId,repairMatterId,repairParentCn,repairChildCn)} 
                                isShowModal={()=>this._setTypeVisible()} 
                                modalVisible = {this.state.typeVisible}/>
                </View>
                <Content >
                    {this.state.showNotice ? <Notice text = {this.state.errorTxt} /> : null}
                    <View style={{height:"1.5%"}}/>
                    {this.state.repairParentCn !=null && this.state.repairParentCn != "" && this.state.repairChildCn !=null && this.state.repairChildCn != "" &&
                        <Text style={{backgroundColor:"#fff",flex:1,color:"#aaa", paddingLeft:10,marginLeft:'1.5%',fontSize:14,alignItems:"center",height:20}}>
                            {this.state.repairParentCn}/{this.state.repairChildCn}
                        </Text>
                    }
                    {
                        this.state.isScan == true && 
                        <Text style={{backgroundColor:"#fff",flex:1,color:"#aaa", paddingLeft:10,marginLeft:'1.5%',fontSize:14,alignItems:"center",height:20}}>
                            {this.state.equipmentName}
                        </Text>
                    }
                    <TextInput style={{textAlignVertical: 'top', backgroundColor: "#ffffff" , marginLeft: '1.5%', paddingLeft:10, marginRight: '1.5%',}}
                               multiline = {true}
                               numberOfLines = {4}
                               onChangeText={(text) => this.setState({desc : text})}
                               value={this.state.desc}
                               placeholder={"我的报修内容..."}
                    />
                    <SoundRecoding show={() => this.setState({showVoice : true})}
                                   recordCallBack = {(record)=>this.recordCallBack(record)}
                                   record={this.state.record}/>
                    <MultipleImagePicker
                        navigation={this.props.navigation}
                        imageCallback = {(images)=> this.imageCallback(images)}
                        images={this.state.images}
                        style={{backgroundColor: "#fff" ,marginTop: '1.5%', marginLeft: '1.5%', marginRight: '1.5%',}}
                    />
                    <View style={{borderColor: '#000', width: '100%',height: 1, border: 0.5, marginLeft: '1.5%', marginRight: '1.5%',}}/>
                    <Reporter name={this.state.reporter} phone={this.state.phone} adds={this.state.address} changAdds={()=>this.changeReporter()}/>
                    <Recorde show = {this.state.showVoice} recordCallBack = {(record)=>this.recordCallBack(record)} />

                </Content>
                <MyFooter submit={() => this.submit()} value='提交'/>

            </Container>

        );
    }


}



