import React, { Component } from 'react';
import {Image, TextInput, View, Alert} from 'react-native';
import { Container, Content,Text } from 'native-base';
import Reporter from '../components/Reporter';
import MyFooter from '../components/MyFooter';
import MultipleImagePicker from "../components/MultipleImagePicker";
import axios from 'axios';
import SoundRecoding from '../components/SoundRecoding';
import Axios from '../util/Axios';
import { toastShort } from '../js/util/ToastUtil';

import Request from '../../../http/Request';

class ConfirmReport extends Component {

    /**
     * 标题配置
     * @type {{headerBackImage: *, headerTitle: string, headerStyle: {elevation: number}}}
     */
    static navigationOptions = {
        // header: null,
        headerTitle: '报修单确认',
        headerBackImage: (<Image resizeMode={'contain'} style={{width: 12, height: 25}} source={require('../image/navbar_ico_back.png')} />),
        headerStyle: {
            elevation: 0,
        },
        headerRight: (<View />),
        headerTitleStyle: {
            flex:1,
            textAlign: 'center'
        }
    };

    constructor(props){

        super(props);
        const { navigation } = this.props;
        const repairTypeId = navigation.getParam('repairTypeId', '');
        const repairMatterId = navigation.getParam('repairMatterId', '');
        const report = navigation.getParam('reporter');
        const images = navigation.getParam('images');
        const voices = navigation.getParam('voices', '');
        const desc = navigation.getParam('desc');
        this.state = {
            repairTypeId : repairTypeId,
            repairMatterId : repairMatterId,
            images : images,
            desc : desc,
            report : report,
            voices : voices,
            imagesRequest : [],
            voicesRequest :[],
            videosRequest : [],
            isUpLoad: false,
        }



    }
    //
    // async UpLoad(path, name) {
    //     let pos = path.lastIndexOf("/");
    //     let file = {type:'multipart/form-data', uri: path, name:path.substr(pos+1)};
    //     const apiToken = global.access_token;
    //     let formData = new FormData();
    //     // let file = {type: 'multipart/form-data', uri: path, name: name};
    //     formData.append("file",file);
    //     const url = 'https://dev.jxing.com.cn/api/opcs/oss/upload'
    //     let res = await axios(url,{
    //         method:'POST',
    //         headers:{
    //             'Content-Type':'multipart/form-data',
    //             'hospitalId': '1055390940066893827',
    //             'x-tenant-key':'Uf2k7ooB77T16lMO4eEkRg==',
    //             'Authorization': `Bearer ${apiToken}`,
    //         },
    //         data:formData,
    //     })
    //
    //     return res.data
    // }

    sb(){

        if(this.state.isUpLoad){
            Alert.alert('正在提交！')
        }

        this.setState({
            isUpLoad : true,
        })

        console.log('上传图片列表');

        console.log(this.state.images)

        let imagesRequest = [];
        try {
            let images = this.state.images;

            for(let i = 0; i<images.length; i++){
                let image = images[i];
                Request.uploadFile(path, (s)=> {
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
                        let videoRequest = [];
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
                })

            }
        } catch (err) {
            console.log('上传失败')
            console.log(err)
        }

        let voicesRequest = [];


        let voice = this.state.voices;
        if(voice.filePath != ''){
            Request.uploadFile('file://'+voice.filePath, (s)=> {
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
            })
        }

            // let img = this.UpLoad('file://'+voice.filePath, 'voice.mp3');


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


    }




    /**
     * 提交信息，生成新的报修单
     * @returns {Promise<void>}
     */
    submit(){



        clearInterval(this.timer);

        let repRepairInfo = {
            repairTypeId : this.state.repairTypeId,
            repairMatterId : this.state.repairMatterId,
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
        };

        console.log(repRepairInfo)

        Axios.PostAxios(
            '/api/repair/request/checkin',
           repRepairInfo,
        ).then(
            (res) => {
                console.log(res);
                toastShort('提交成功');
                const { navigate } = this.props.navigation;
                navigate('AllOrder',{data:res});
            }
        )
    }

    render() {
        return (
            <Container  style={{backgroundColor: "#EEEEEE"}}>
                <Content>
                    <Text style={{color:'#a5a7ac',paddingTop:20,fontSize:15}}>请确认您的报修单</Text>
                    <TextInput style={{color: '#000', textAlignVertical: 'top', backgroundColor: "#ffffff" , marginTop : '1.5%', marginLeft: '1.5%', marginRight: '1.5%',}}
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
                <MyFooter submit={() => this.sb()} value='确定'/>

            </Container>
        );
    }
}


module.exports=ConfirmReport;
