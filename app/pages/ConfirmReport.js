import React, { Component } from 'react';
import {Image, TextInput, TouchableHighlight, TouchableOpacity, View, BackHandler,Platform} from 'react-native';
import { Container, Content,Text } from 'native-base';
import Reporter from '../components/Reporter';
import MyFooter from '../components/MyFooter';
import MultipleImagePicker from "../components/MultipleImagePicker";
import axios from 'axios';
import SoundRecoding from '../components/SoundRecoding';
import Axios from '../util/Axios';
import { toastShort } from '../js/util/ToastUtil';
import OrderType from "./RepairScreen";
// import LoadingUtil from "../util/LoadingUtil";
import { ProcessingManager } from 'react-native-video-processing';

import Loading from 'react-native-easy-loading-view';

class ConfirmReport extends Component {

    /**
     * 标题配置
     * @type {{headerBackImage: *, headerTitle: string, headerStyle: {elevation: number}}}
     */
    static navigationOptions = {
        header : null
    };
    // static navigationOptions = {
    //     // header: null,
    //     headerTitle: '报修单确认',
    //     headerBackImage: (<Image resizeMode={'contain'} style={{width: 38, height: 60}} source={require('../image/navbar_ico_back.png')} />),
    //     headerStyle: {
    //         elevation: 0,
    //     },
    //     headerRight: (<View />),
    //     headerTitleStyle: {
    //         flex:1,
    //         textAlign: 'center'
    //     }
    // };

    constructor(props){

        super(props);
        const { navigation } = this.props;
        const repairTypeId = navigation.getParam('repairTypeId', '');
        const repairMatterId = navigation.getParam('repairMatterId', '');
        const repairParentCn = navigation.getParam('repairParentCn', '');
        const repairChildCn = navigation.getParam('repairChildCn', '');
        const report = navigation.getParam('reporter');
        const images = navigation.getParam('images');
        const voices = navigation.getParam('voices', '');
        const desc = navigation.getParam('desc');
        const isScan = navigation.getParam('isScan', '');
        const equipmentId = navigation.getParam('equipmentId', '');
        const equipmentName = navigation.getParam('equipmentName', '');
        this.state = {
            repairTypeId : repairTypeId,
            repairMatterId : repairMatterId,
            repairParentCn : repairParentCn,
            repairChildCn : repairChildCn,
            images : images,
            desc : desc,
            report : report,
            voices : voices,
            imagesRequest : [],
            voicesRequest :[],
            videosRequest : [],
            isUpLoad: false,
            isScan : isScan,
            equipmentId : equipmentId,
            equipmentName : equipmentName,
        }



    }


    componentDidMount() {

        //取消报修单提交
        if (Platform.OS === 'android') {
            BackHandler.addEventListener("back", ()=> clearInterval(this.timer));
        }

    }

    async UpLoad(path, name) {
        let pos = path.lastIndexOf("/");
        let file = {type:'multipart/form-data', uri: path, name:path.substr(pos+1)};
        const apiToken = global.access_token;
        let formData = new FormData();
        // let file = {type: 'multipart/form-data', uri: path, name: name};
        formData.append("file",file);
        const url = 'https://dev.jxing.com.cn/api/opcs/oss/upload'
        let res = await axios(url,{
            method:'POST',
            headers:{
                'Content-Type':'multipart/form-data',
                'hospitalId': '1055390940066893827',
                'x-tenant-key':'Uf2k7ooB77T16lMO4eEkRg==',
                'Authorization': `Bearer ${apiToken}`,
            },
            data:formData,
        })

        return res.data
    }

    sb(){
        Loading.showHud();
        if(this.state.isUpLoad){
            toastShort('正在提交');
            return;
        }

        this.setState({
            isUpLoad : true,
        })

        let imagesRequest = [];
        let videoRequest = [];

        try {
            let images = this.state.images;
            const compressOptions = {
                width: 720,
                height: 1280,
                bitrateMultiplier: 3,
                saveToCameraRoll: true, // default is false, iOS only
                saveWithCurrentDate: true, // default is false, iOS only
                minimumBitrate: 300000,
            };

            for(let i = 0; i<images.length; i++){
                let image = images[i];
                if(image.type==='video'){
                    ProcessingManager.compress(image.uri, compressOptions) // like VideoPlayer compress options
                        .then((data) => {
                            let s  = this.UpLoad(data.source, 'image'+ i + '.jpg')
                            s.then(
                                (s)=> {
                                    console.log(s);
                                    let imageLoad = {
                                        "filePath":s.fileDownloadUri,
                                        "fileName":s.originalName,
                                        "fileBucket":s.bucketName,
                                        "fileType": s.fileType,
                                        "fileHost":s.fileHost,
                                    }
                                    videoRequest.push(imageLoad)
                                    this.setState({videosRequest : videoRequest,})
                                }
                            );
                        });
                    continue;
                }else {
                    let s  = this.UpLoad(image.uri, 'image'+ i + '.jpg')
                    s.then(
                        (s)=> {
                            console.log(s);
                            let imageLoad = {
                                "filePath":s.fileDownloadUri,
                                "fileName":s.originalName,
                                "fileBucket":s.bucketName,
                                "fileType": s.fileType,
                                "fileHost":s.fileHost,
                            }
                            imagesRequest.push(imageLoad)
                            this.setState({imagesRequest : imagesRequest})
                        }
                    );
                }
            }
        } catch (err) {
            clearInterval(this.timer);
        }

        let voicesRequest = [];

        try {
            let voice = this.state.voices;
            if('' === voice.filePath){
                console.log('无语音文件上传');
            }else{
                let img = this.UpLoad('file://'+voice.filePath, 'voice.mp3');
                img.then((s)=> {
                        let voice = {
                            "filePath":s.fileDownloadUri,
                            "fileName":s.originalName,
                            "fileBucket":s.bucketName,
                            "fileType": s.fileType,
                            "fileHost":s.fileHost,
                        }
                        voicesRequest.push(voice)
                        this.setState({voicesRequest : voicesRequest,})
                    }
                );
            }
        } catch (err) {
            console.log(err)
            clearInterval(this.timer);
        }

        this.timer = setInterval(
            () => {
                if(this.state.images.length === this.state.imagesRequest.length + this.state.videosRequest.length){
                    if(1 === this.state.voicesRequest.length){
                        this.submit();
                    }
                    if('' === this.state.voices.filePath){
                        this.submit();
                    }
                }
            } , 1500);

        setTimeout(
            ()=>
            {
                if(this.state.images.length !== this.state.imagesRequest.length + this.state.videosRequest.length){
                    Loading.dismiss();
                    toastShort('提交失败，请检查后重试！');
                    clearInterval(this.timer)

                }
            }, 60*1000
        )

    }




    /**
     * 提交信息，生成新的报修单
     * @returns {Promise<void>}
     */
    submit(){

        clearInterval(this.timer);

        let repRepairInfo = {
            repairTypeId : this.state.repairTypeId,
            //报修通通三级目录暂时不传
            // repairMatterId : this.state.repairMatterId,
            buildingId: "1077448886292463618",
            floorId: "1077448886544121857",
            roomId: "1081114930919952386",
            inpatientWardId: "1078214053129289730",
            matterName: this.state.desc,
            isUrgent:0,
            hopeRepairTime: "2019-01-10",
            detailAdress: this.state.report.address,
            deptId: global.deptId,
            telNo: this.state.report.phone,
            ownerId: global.userId,
            ownerName: this.state.report.reporter,
            imagesRequest : this.state.imagesRequest,
            voicesRequest : this.state.voicesRequest,
            videosRequest : this.state.videosRequest,
        };

        if(this.state.isScan == true){
            repRepairInfo['isScan'] = this.state.isScan;
            repRepairInfo['equipmentId'] = this.state.equipmentId;
            repRepairInfo['equipmentName'] = this.state.equipmentName;
        }

        console.log(repRepairInfo)

        Axios.PostAxios(
            '/api/repair/request/checkin',
            repRepairInfo,
        ).then(
            (res) => {
                Loading.dismiss();
                console.log(res);
                toastShort('提交成功');
                const { navigate } = this.props.navigation;
                navigate('AllOrder',{data:res});
            }
        )
    }
    goBack(){
        const { navigate } = this.props.navigation;
        this.props.navigation.goBack();
    }

    render() {
        return (
            <Container  style={{backgroundColor: "#EEEEEE"}}>
                <View style={{height:44,backgroundColor:'white',justifyContent:'center', textAlignVertical:'center', flexDirection:'row',alignItems:'center', marginLeft:0, marginRight:0, marginTop:0,}}>
                    <TouchableHighlight style={{width:50,height:44,alignItems:"center",justifyContent:"center"}} onPress={()=>{this.goBack();clearInterval(this.timer);}}>
                        <Image style={{width:21,height:37}} source={require("../image/navbar_ico_back.png")}/>
                    </TouchableHighlight>
                    <TouchableOpacity style={{flex:1,height:30, marginRight:0,}}>
                        <View style={{flex:1,justifyContent:'center',alignItems:'center',height:30,fontWeight:"600"}}>
                            <Text style={{color:'#555',fontSize:18,marginLeft:5, flex:1}}>报修确认</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={{width:60}}/>
                </View>
                <Content>
                    <Text style={{color:'#a5a7ac',paddingTop:20,fontSize:15,marginLeft:"1.5%",}}>请确认您的报修单</Text>

                    <TextInput style={{color: '#000', textAlignVertical: 'top',paddingLeft:10, backgroundColor: "#ffffff" , marginLeft: '1.5%', marginRight: '1.5%',}}
                               multiline = {true}
                               numberOfLines = {4}
                               value={this.state.desc}
                               editable = {false}
                    />
                    <View style={{paddingBottom:5,paddingTop:5,flex:1,flexDirection:"row",paddingLeft:5,paddingRight:8,backgroundColor:"#fff",marginLeft: '1.5%',marginRight: '1.5%',justifyContent:"space-between"}}>
                        {/*<View style={{flex:1}}/>*/}
                        <RepairTypeMk
                            repairType={this.state.repairParentCn+"/"+this.state.repairChildCn}
                            deleteType={()=>this.deleteType()}
                            readOnly={true}
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
                    {this.state.voices.filePath == '' ? null : <SoundRecoding readOnly={true} record={this.state.voices}/>}
                    <Reporter
                        name={this.state.report.reporter}
                        phone={this.state.report.phone}
                        adds={this.state.report.address}
                        readOnly = {true}
                    />
                    <MultipleImagePicker
                        images={this.state.images}
                        readOnly = {true}
                        style={{backgroundColor: "#fff"  ,marginLeft: '1.5%', marginRight: '1.5%',}}
                    />
                </Content>
                <Loading
                    ref={(view)=>{Loading.loadingDidCreate(view)}} // 必须调用
                    top={86} // 如果需要在loading或者hud的时候可以点击导航上面的按钮，建议根据自己导航栏具体高度来设置。如果不需要点击可以不设置
                    offsetY={-150} // 默认loading 和 hud 会在 去掉top之后高度的中间，如果觉得位置不太合适，可以通着offsetY来调整
                />
                <MyFooter submit={() => this.sb()} value='确定'/>

            </Container>
        );
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
                {this.props.readOnly !==true &&
                <TouchableOpacity onPress={() => this.props.deleteType()}>
                    <View style={{width: 1, backgroundColor: "#D9D9D9", height: 31}}/>
                    <Text style={{color: "#FF0000", fontSize: 14, width: 20, textAlign: "center"}}>
                        ×
                    </Text>
                </TouchableOpacity>
                }
            </View>)
        }
        if(this.props.repairType === "/" && this.props.readOnly !==true){
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

module.exports=ConfirmReport;
