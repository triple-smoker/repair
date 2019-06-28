import React, { Component } from 'react';
import {Image, TextInput, TouchableHighlight, TouchableOpacity, View} from 'react-native';
import { Container, Content,Text } from 'native-base';
import Reporter from '../components/Reporter';
import MyFooter from '../components/MyFooter';
import MultipleImagePicker from "../components/MultipleImagePicker";
import axios from 'axios';
import SoundRecoding from '../components/SoundRecoding';
import Axios from '../util/Axios';
import { toastShort } from '../js/util/ToastUtil';
import OrderType from "./RepairScreen";

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

        console.log('上传图片列表');

        console.log(this.state.images)

        let imagesRequest = [];
        let videoRequest = [];

        try {
            let images = this.state.images;

            for(let i = 0; i<images.length; i++){
                let image = images[i];
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

                        console.log('上传成功');
                        console.log(imageLoad);

                        if(image.type==='video'){

                            videoRequest.push(imageLoad)

                            this.setState(
                                {
                                    videosRequest : videoRequest,
                                }
                            )
                        }else{
                            imagesRequest.push(imageLoad)

                            this.setState(
                                {
                                    imagesRequest : imagesRequest,
                                    // imagesNum : this.state.imagesNum + 1
                                }
                            )
                        }


                    }

                );




            }
        } catch (err) {
            clearInterval(this.timer);
            console.log('上传失败')
            console.log(err)
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
                        this.setState(
                            {
                                voicesRequest : voicesRequest,
                                // voicesNum : this.state.voicesNum + 1
                            }
                        )
                    }
                );
            }


        } catch (err) {
            console.log(err)
            clearInterval(this.timer);
        }

        this.timer = setInterval(
            () => {
                console.log('this.state.voices.filePath :  '+this.state.voices.filePath);
                console.log('this.state.voicesRequest.length :  '+this.state.voicesRequest.length);
                console.log('this.state.images.length :  '+this.state.images.length);
                console.log('this.state.imagesRequest.length :  '+this.state.imagesRequest.length);
                console.log('this.state.videosRequest.length :  '+this.state.videosRequest.length);
                if(this.state.images.length === this.state.imagesRequest.length + this.state.videosRequest.length){
                    if(1 === this.state.voicesRequest.length){
                        this.submit();
                    }
                    if('' === this.state.voices.filePath){
                        this.submit();
                    }
                }
            } , 1500
        )

        setTimeout(
            ()=>
            {
                if(this.state.images.length !== this.state.imagesRequest.length + this.state.videosRequest.length){
                    Loading.dismiss();
                    toastShort('提交失败，请检查后重试！');
                    clearInterval(this.timer)

                }
            }, 45*1000
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
                    <TouchableHighlight style={{width:50,height:44,alignItems:"center",justifyContent:"center"}} onPress={()=>this.goBack()}>
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
                    {this.state.repairParentCn !=null && this.state.repairParentCn != "" && this.state.repairChildCn !=null && this.state.repairChildCn != "" &&
                        <Text style={{backgroundColor:"#fff",flex:1,color:"#aaa", paddingLeft:10,marginLeft:'1.5%',fontSize:14,alignItems:"center",height:20}}>
                            {this.state.repairParentCn}/{this.state.repairChildCn}
                        </Text>
                    }
                    {this.state.isScan == true &&
                        <Text style={{backgroundColor:"#fff",flex:1,color:"#aaa", paddingLeft:10,marginLeft:'1.5%',fontSize:14,alignItems:"center",height:20}}>
                            {this.state.equipmentName}
                        </Text>
                    }
                    <TextInput style={{color: '#000', textAlignVertical: 'top',paddingLeft:10, backgroundColor: "#ffffff" , marginLeft: '1.5%', marginRight: '1.5%',}}
                               multiline = {true}
                               numberOfLines = {4}
                               value={this.state.desc}
                               editable = {false}
                    />
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

                    // loadingDefaultText={''} // loading动画的文字
                    // loadingTextStyle={{ fontSize : 16, color: 'red' }} // loading动画文字的样式
                    // loadingImage={require('./screen/loading_2.gif')} // loading动画是显示的gif
                    // loadingImageStyle={{ width : 100, height : 100 }} // gif 图片样式

                    // hudStyle={{ width : 150, height : 150 }} // hud的全局样式
                    // hudBackgroundColor={'red'} // hud全局背景色
                    // hudDefaultText={'努力加载中...'} // hud默认全局文字
                    // hudTextStyle={{ fontSize : 16, color: 'red' }} // 文字样式
                    // activityIndicatorSize={'small'} // hud上面的圈圈 small or large
                    // activityIndicatorColor={'red'} // hud上面圈圈的颜色
                    // hudCustomImage={require('./screen/loading_2.gif')} // 自定义hud上面的圈圈显示，可以把转的圈圈替换为gif
                    // hudImageStyle={{ width : 50, height : 50 }} // 自定义hud图片的样式
                />
                <MyFooter submit={() => this.sb()} value='确定'/>

            </Container>
        );
    }
}


module.exports=ConfirmReport;
