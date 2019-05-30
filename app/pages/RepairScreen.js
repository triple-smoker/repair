import React from "react";
import {Container, Content , Text} from 'native-base';
import MultipleImagePicker from "../components/MultipleImagePicker";
import Reporter from '../components/Reporter';
import Notice from '../components/Notice';
import SoundRecoding from '../components/SoundRecoding';
import MyFooter from '../components/MyFooter';
import {TextInput ,Image, View} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import Record from '../components/Record'
import Recorde from "../components/Recorde";

export default class RepairScreen extends React.Component {

    /**
     * 页面顶部导航栏配置
     * @type
     */
    static navigationOptions = {
        headerTitle: '新增报修',
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
        const repairParentCn = navigation.getParam('repairParentCn', '');
        const repairChildCn = navigation.getParam('repairChildCn', '');
        this.state = {
            repairTypeId : repairTypeId,
            repairMatterId : repairMatterId,
            repairParentCn : repairParentCn,
            repairChildCn : repairChildCn,
            images: [],
            visibleModal: false,
            showNotice: false,
            showVoice: false,
            errorTxt:'',
            desc : '',
            record : {
                filePath : '',
            }
        }


        AsyncStorage.getItem('reporterInfoHistory',function (error, result) {
                if (error) {

                }else {
                    let porterList = JSON.parse(result);

                    if( porterList!=null && porterList.length>0 ){
                        let reporter = porterList[0]
                        this.setState({
                            reporter: reporter.name,
                            phone: reporter.phone,
                            address: reporter.address,
                        });
                    }

                }
            }.bind(this)
        )

    }

    componentDidMount(){
        console.log(this.props)
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
            // console.log(content)
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
        // let images = this.state.images;
        // if(images.length === 0){
        //     this.setState({
        //         showNotice: true,
        //     });
        //     return;
        // }
        const repairInfo = {
            repairTypeId : this.state.repairTypeId,
            repairMatterId : this.state.repairMatterId,
            voices : this.state.record,
            images: this.state.images,
            desc : this.state.desc,
            reporter : {
                reporter: this.state.reporter,
                phone: this.state.phone,
                address: this.state.address
            }
        };
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

    getNew(){
        if(this.state.showVoice){
            return <Recorde recordCallBack = {(record)=>this.recordCallBack(record)} />
        }else {
            return null
        }

    }


    render() {
        return (
            <Container style={{backgroundColor: "#EEEEEE"}}>
                <Content >
                    {this.state.showNotice ? <Notice text = {this.state.errorTxt} /> : null}
                    <Text style={{flex:1,color:"#666",marginLeft:'1.5%',fontSize:16,alignItems:"center",height:18}}>
                        {this.state.repairParentCn}/{this.state.repairChildCn}
                    </Text>
                    <TextInput style={{textAlignVertical: 'top', backgroundColor: "#ffffff" , marginTop : '1.5%', marginLeft: '1.5%', marginRight: '1.5%',}}
                               multiline = {true}
                               numberOfLines = {4}
                               onChangeText={(text) => this.setState({desc : text})}
                               value={this.state.desc}
                               placeholder={"我的报修内容..."}
                    />
                    <SoundRecoding show={() => this.setState({showVoice : true})} record={this.state.record}/>
                    <MultipleImagePicker
                        navigation={this.props.navigation}
                        imageCallback = {(images)=> this.imageCallback(images)}
                        images={this.state.images}
                        style={{backgroundColor: "#fff" ,marginTop: '1.5%', marginLeft: '1.5%', marginRight: '1.5%',}}
                    />
                    <View style={{borderColor: '#000', width: '100%',height: 1, border: 0.5, marginLeft: '1.5%', marginRight: '1.5%',}}/>
                    <Reporter name={this.state.reporter} phone={this.state.phone} adds={this.state.address} changAdds={()=>this.changeReporter()}/>
                    {/*<Record recordCallBack = {(record)=>this.recordCallBack(record)}></Record>*/}

                    {/*{this.state.showVoice ? <Recorde recordCallBack = {(record)=>this.recordCallBack(record)} />: null}*/}
                    <Recorde show = {this.state.showVoice} recordCallBack = {(record)=>this.recordCallBack(record)} />
                    {/*{this.getNew()}*/}

                </Content>
                <MyFooter submit={() => this.submit()} value='提交'/>

            </Container>

        );
    }


}



