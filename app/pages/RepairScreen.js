
import React from "react";
import {Container, Content, Textarea, ListItem} from 'native-base';
import MultipleImagePicker from "../components/MultipleImagePicker";
import Reporter from '../components/Reporter';
import Notice from '../components/Notice';
import SoundRecoding from '../components/SoundRecoding';
import MyFooter from '../components/MyFooter';

import Axios from '../util/Axios';

import {TextInput ,Image, View} from "react-native";

export default class RepairScreen extends React.Component {

    /**
     * 页面顶部导航栏配置
     * @type {{headerRight: *, borderBottomWidth: number, headerTitle: string}}
     */
    static navigationOptions = {
        // header: null,
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

        this.state = {
            images: [],
            visibleModal: false,
            showNotice: false,
            desc : '',
            record : {
                filePath : '',
            }
        }
    }



    submit(){

        let images = this.state.images;
        if(images.length === 0){
            this.setState({
                showNotice: true,
            });
            return;
        }

        // alert(this.state.desc);

        const repairInfo = {
            images: this.state.images,
            desc : this.state.desc,
            reporter : {
                reporter: this.state.reporter,
                phone: this.state.phone,
                address: this.state.address
            }
        };

        const { navigate } = this.props.navigation;
        navigate('Confirm', repairInfo);

    }



    /**
     * 修改联系人
     */
    changeReporter(){

       // let reporter = {
       //          reporter: this.state.reporter,
       //          phone: this.state.phone,
       //          address: this.state.address
       //  }

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
            record : record
        })
    }
    imageCallback(images){
        this.setState({
            images : images
        })
    }

    render() {
        return (
            <Container style={{backgroundColor: "#EEEEEE"}}>
                <Content >
                    {this.state.showNotice ? <Notice /> : null}
                    <TextInput style={{textAlignVertical: 'top', backgroundColor: "#ffffff" , marginTop : '1.5%', marginLeft: '1.5%', marginRight: '1.5%',}}
                               multiline = {true}
                               numberOfLines = {4}
                               onChangeText={(text) => this.setState({desc : text})}
                               value={this.state.desc}
                               placeholder={"我的报修内容..."}
                    />
                    <SoundRecoding recordCallBack = {(record)=>this.recordCallBack(record)}/>
                    <MultipleImagePicker
                        imageCallback = {(images)=> this.imageCallback(images)}
                        images={this.state.images}
                        style={{backgroundColor: "#fff" ,marginTop: '1.5%', marginLeft: '1.5%', marginRight: '1.5%',}}
                    />
                    <View style={{borderColor: '#000', width: '100%',height: 1, border: 0.5, marginLeft: '1.5%', marginRight: '1.5%',}}/>
                    <Reporter name={this.state.reporter} phone={this.state.phone} adds={this.state.address} changAdds={()=>this.changeReporter()}/>
                </Content>
                <MyFooter submit={() => this.submit()} value='提交'/>

            </Container>

        );
    }


}



