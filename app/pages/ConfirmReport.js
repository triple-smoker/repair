import React, { Component } from 'react';
import {Image, TextInput, View} from 'react-native';
import { Container, Content,Text } from 'native-base';
import Reporter from '../components/Reporter';
import MyFooter from '../components/MyFooter';
import MultipleImagePicker from "../components/MultipleImagePicker";
import axios from 'axios';

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
        const report = navigation.getParam('reporter');
        const images = navigation.getParam('images');
        const desc = navigation.getParam('desc');
        this.state = {
            images : images,
            desc : desc,
            report : report,
        }
    }

    submit(){

        let repRepairInfo = {
            repairTypeId: '',
            buildingId: '',
            floorId: '',
            roomId: '',
            rcAreaId: '',
            repairMatterId: '',
            matterName: this.state.desc,
            isUrgent: 0,
            hopeRepairTime: '',
            detailAdress: this.state.report.address,
            deptId: '',
            telNo: this.state.report.phone,
            ownerId: '',
            ownerName: '',
        }

        axios({
            method: 'POST',
            url: 'http://10.145.196.107:8082/api/repair/repRepairInfo',
            data: repRepairInfo,
        }).then(
            (response) => {
                console.log('----------------');
                console.log(response);
            }
        ).catch((error)=> {
            console.log('================');
            console.log(error)
        });

        alert("提交成功");
        const { navigate } = this.props.navigation;
        navigate('Home');

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
                <MyFooter submit={() => this.submit()} value='确定'/>

            </Container>
        );
    }
}


module.exports=ConfirmReport;
