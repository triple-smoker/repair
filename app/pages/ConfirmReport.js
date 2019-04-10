import React, { Component } from 'react';
import {StyleSheet, View, Image, TextInput} from 'react-native';
import { Container, Content,Text } from 'native-base';
import Reporter from '../components/Reporter';
import MyFooter from '../components/MyFooter';
import MultipleImagePicker from "../components/MultipleImagePicker";

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

        alert("提交成功");

    }


    render() {

        return (

            <Container  style={{backgroundColor: "#EEEEEE"}}>
                <Content>

                        <Text style={{color:'#a5a7ac',paddingTop:20,fontSize:15}}>请确认您的报修单</Text>
                        {/*<Text style={{color:'#3e3e3e',paddingLeft:10,paddingTop:13,fontSize:15}}>报修内容：<Text style={{color:'#737373',fontSize:15}}>{this.state.desc}</Text></Text>*/}
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
