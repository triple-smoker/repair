import React, { Component } from 'react';
import {Container, Content , Text , Button} from 'native-base';
import MultipleImagePicker from "../components/MultipleImagePicker";
import Reporter from '../components/Reporter';
import Notice from '../components/Notice';
import SoundRecoding from '../components/SoundRecoding';
import MyFooter from '../components/MyFooter';
import {
    TextInput,
    Image,
    View,
    DeviceEventEmitter,
    TouchableOpacity,
    TouchableHighlight,
    ScrollView,
    Platform, BackHandler,
} from "react-native";
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
        const tableType = navigation.getParam('tableType', '');
        const repairContent = navigation.getParam('repairContent', '');
        const replaceName = navigation.getParam('replaceName', '');
        const stateInfo = navigation.getParam('stateInfo', '');
        this.state = {
            repairTypeId : "",
            repairMatterId : "",
            repairParentCn : "",
            repairChildCn : "",
            isScan : isScan,
            equipmentId : equipmentId,
            equipmentName : equipmentName,
            tableType : tableType,
            repairContent : repairContent,
            replaceName : replaceName,
            stateInfo : stateInfo,
            images: [],
            visibleModal: false,
            showNotice: false,
            showVoice: false,
            errorTxt:'',
            desc : (tableType!=='')?repairContent:'',
            record : {
                filePath : '',
            },
            typeVisible:false,
            deptName : '',
            address : (tableType!==''&&tableType==="2")?replaceName:'',
        }


        AsyncStorage.getItem('uinfo',function (error, result) {
                if (error) {

                }else {
                    let loginUserInfo = JSON.parse(result);
                    console.log("++++++++++");
                    console.log(loginUserInfo)
                    if(loginUserInfo != null){
                        var reporter = loginUserInfo.userName;
                        var address = '';
                        Request.requestGet(GetUserAddress + loginUserInfo.userId, null, (result) => {
                            if (result && result.code === 200) {
                                console.log(result)
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
                                    address: (this.state.address==='')?address:this.state.address,
                                    deptName: loginUserInfo.deptAddresses[0].deptName
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
    componentWillReceiveProps(nextProps){
        setTimeout(
            () => {
                this.loadDetail()
            }, 200)

        this.setState({
            repairTypeId : "",
            repairMatterId : "",
            repairParentCn : "",
            repairChildCn : "",
            voices : "",
            images: [],
            desc : "",
            record : {
                filePath : '',
            },
        });

    }
    componentWillUnmount() {

    }
    loadDetail(){
        const { navigation } = this.props;
        let isScan = navigation.getParam('isScan', '');
        let equipmentId = navigation.getParam('equipmentId', '');
        let equipmentName = navigation.getParam('equipmentName', '');
        if(isScan != null && isScan !== ''){
            this.setState({
                isScan : isScan,
                equipmentId : equipmentId,
                equipmentName : equipmentName,
            })
        }
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
	//维修类型删除
    deleteType(){
            this.setState({
                repairTypeId : "",
                repairMatterId : "",
                repairParentCn : "",
                repairChildCn : "",
            })
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
            stateInfo : this.state.stateInfo,
            reporter : {
                reporter: this.state.reporter,
                phone: this.state.phone,
                address: this.state.address
            },
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
            deptName: this.state.deptName,
            callback: (
                (info) => {
                    console.log(info)
                    this.setState(
                        {
                            reporter: info.name,
                            phone: info.phone,
                            address: info.address,
                            deptName : info.deptName
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
    changeDesc(descText,typeData){
        this.setState({desc:descText,repairTypeId : typeData.repairTypeId,
            repairMatterId : typeData.repairMatterId,
            repairParentCn : typeData.repairParentCn,
            repairChildCn : typeData.repairChildCn,});
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
                    <View style={{width:60}}/>
                    {/*<TouchableOpacity onPress={()=>this._setTypeVisible()} style={{width:60,flexDirection:'row'}}>*/}
                        {/*<Text style={{color:"#666",fontSize:12}}>类型</Text>*/}
                    {/*</TouchableOpacity>*/}
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
                    <QuicklyContent changeDesc={(descText,typeData)=>this.changeDesc(descText,typeData)}/>
                    {/*{this.state.repairParentCn !=null && this.state.repairParentCn != "" && this.state.repairChildCn !=null && this.state.repairChildCn != "" &&*/}
                        {/*<Text style={{backgroundColor:"#fff",flex:1,color:"#aaa", paddingLeft:10,marginLeft:'1.5%',fontSize:14,alignItems:"center",height:20}}>*/}
                            {/*{this.state.repairParentCn}/{this.state.repairChildCn}*/}
                        {/*</Text>*/}
                    {/*}*/}
                    <TextInput style={{textAlignVertical: 'top', backgroundColor: "#ffffff" , marginLeft: '1.5%', paddingLeft:10, marginRight: '1.5%',}}
                               multiline = {true}
                               numberOfLines = {4}
                               onChangeText={(text) => {this.setState({desc : text})}}
                               value={this.state.desc}
                               placeholder={"我的报修内容..."}
                    />
                    <View style={{paddingBottom:5,paddingTop:5,flex:1,flexDirection:"row",paddingLeft:8,paddingRight:5,backgroundColor:"#fff",marginLeft: '1.5%',marginRight: '1.5%',justifyContent:"space-between"}}>
                        {/*<View style={{flex:1}}/>*/}
                        <RepairTypeMk
                            repairType={this.state.repairParentCn+"/"+this.state.repairChildCn}
                            deleteType={()=>this.deleteType()}
                            selectType={()=>this._setTypeVisible()}
                        />
                        {this.state.isScan === true &&
                        <View style={{flexDirection:"row",justifyContent:"flex-end",height:30,alignItems:"center",marginLeft: '1.5%',marginRight: '1.5%',backgroundColor:"#fff",}}>
                            <Text style={{color:"#aaa",fontSize:14,alignItems:"center"}}>
                                {"*"+this.state.equipmentName+"*"}
                            </Text>
                        </View>
                        }
                    </View>
                    <SoundRecoding show={() => this.setState({showVoice : true})}
                                   recordFilepath = {this.state.record.filePath}
                                   recordCallBack = {(record)=>this.recordCallBack(record)}
                                   record={this.state.record}

                    />
                    <MultipleImagePicker
                        navigation={this.props.navigation}
                        imageCallback = {(images)=> this.imageCallback(images)}
                        images={this.state.images}
                        style={{backgroundColor: "#fff" ,marginTop: '1.5%', marginLeft: '1.5%', marginRight: '1.5%',}}
                    />
                    <View style={{borderColor: '#000', width: '100%',height: 1, border: 0.5, marginLeft: '1.5%', marginRight: '1.5%',}}/>
                    <Reporter deptName={this.state.deptName} name={this.state.reporter} phone={this.state.phone} adds={this.state.address} changAdds={()=>this.changeReporter()}/>

                </Content>
                <Recorde show = {this.state.showVoice} disShow={()=>{this.setState({showVoice:false})}} recordCallBack = {(record)=>this.recordCallBack(record)} />
                <MyFooter submit={() => this.submit()} value='提交'/>

            </Container>

        );
    }


}
class QuicklyContent extends Component {
    constructor(props){
        super(props);
        this.state = {
            causeList : [],
        }
    }
    componentDidMount(){
        this.getCauseList();
    }
    getCauseList(){
        this.setState({
            causeList:[
                {
                    causeId:"1",
                    causeCtn:"快捷",
                    showType:false,
                    typeData:{
                        repairTypeId : "",
                        repairMatterId : "",
                        repairParentCn : "父类①",
                        repairChildCn : "子类①",
                    }
                },{
                    causeId:"2",
                    causeCtn:"快捷方",
                    showType:false,
                    typeData:{
                        repairTypeId : "",
                        repairMatterId : "",
                        repairParentCn : "父类②",
                        repairChildCn : "子类②",
                    }
                },{
                    causeId:"3",
                    causeCtn:"快捷方式",
                    showType:false,
                    typeData:{
                        repairTypeId : "",
                        repairMatterId : "",
                        repairParentCn : "父类③",
                        repairChildCn : "子类③",
                    }
                },{
                    causeId:"4",
                    causeCtn:"方式方式",
                    showType:false,
                    typeData:{
                        repairTypeId : "",
                        repairMatterId : "",
                        repairParentCn : "父类④",
                        repairChildCn : "子类④",
                    }
                },{
                    causeId:"5",
                    causeCtn:"快捷方",
                    showType:false,
                    typeData:{
                        repairTypeId : "",
                        repairMatterId : "",
                        repairParentCn : "父类⑤",
                        repairChildCn : "子类⑤",
                    }
                },{
                    causeId:"6",
                    causeCtn:"快捷",
                    showType:false,
                    typeData:{
                        repairTypeId : "",
                        repairMatterId : "",
                        repairParentCn : "父类⑥",
                        repairChildCn : "子类⑥",
                    }
                },
            ]
        })
    }
    //取消原因按钮渲染
    _getCauseItem(){
        let causeList = this.state.causeList;
        let listItems =(  causeList === null ? null : causeList.map((cause, index) =>
            <Button key={index} onPress={()=>this.changeCause(cause,(descText,typeData)=>this.props.changeDesc(descText,typeData))}  style={{borderColor:(cause.showType===false)?'#efefef':'#7db4dd',backgroundColor:(cause.showType===false)?'#fff':'#ddeaf3',borderWidth:1,marginRight:15,paddingLeft:10,paddingRight:10,height:30,marginTop:8}}>
                <Text style={{color:(cause.showType===false)?'#a1a1a3':'#70a1ca'}}>{cause.causeCtn}</Text>
            </Button>
        ))
        return listItems;
    }
    //取消原因变更
    changeCause(visible,changeDesc){
        let causeList = this.state.causeList;
        causeList.forEach(function(cause){
            if(cause.causeId === visible.causeId){
                cause.showType=!cause.showType;
                if(cause.showType){
                    changeDesc(cause.causeCtn,cause.typeData);
                }else{
                    changeDesc("",{repairTypeId : "",
                        repairMatterId : "",
                        repairParentCn : "",
                        repairChildCn : ""});
                }
            }else{
                cause.showType=false;
            }
        });
        this.setState({causeList:causeList});
    }
    render() {
        return (
            <View style={{flexDirection:'row',flexWrap:'wrap',paddingBottom:8,marginLeft: '1.5%',marginRight: '1.5%',}}>
                {this._getCauseItem()}
            </View>
            )
    }
}
class RepairTypeMk extends Component {
    constructor(props){
        super(props);
    }
    render() {
            if(this.props.repairType !== "/"){
            return (<View style={{
                flexDirection: "row",
                flexWrap: 'wrap',
                backgroundColor: "#F9F9F9",
                height: 30,
                borderRadius: 15,
                borderWidth: 1,
                borderColor: "#D9D9D9",
                justifyContent: "flex-end",
                alignItems: "center",
                marginRight:3
            }}>

                <Text style={{color: "#61C0C5", textAlign: "center", fontSize: 14, marginLeft: 3, marginRight: 3}}>
                    {"#"+this.props.repairType}
                </Text>
                <View style={{width: 1, backgroundColor: "#D9D9D9", height: 31}}/>
                {this.props.readOnly !==true &&
                <TouchableOpacity onPress={() => this.props.deleteType()}>
                    <Text style={{color: "#FF0000", fontSize: 14, width: 20, textAlign: "center"}}>
                        ×
                    </Text>
                </TouchableOpacity>
                }
            </View>)
            }
            if(this.props.repairType === "/"){
                return (<View style={{
                flexDirection: "row",
                flexWrap: 'wrap',
                backgroundColor: "#F9F9F9",
                height: 30,
                borderRadius: 15,
                borderWidth: 1,
                borderColor: "#D9D9D9",
                justifyContent: "flex-end",
                alignItems: "center",
                marginRight:3
            }}>
                <TouchableOpacity onPress={()=>this.props.selectType()}>
                    <Text style={{color: "#8C8C8C", textAlign: "center", fontSize: 14, marginLeft: 3, marginRight: 3}}>
                        #类型选择
                    </Text>
                </TouchableOpacity>
            </View>)
            }
    }
}



