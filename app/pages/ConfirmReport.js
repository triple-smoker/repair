import React, { Component } from 'react';
import {
    StyleSheet,
    Dimensions,
    View,
    Image,
} from 'react-native';
import { Grid, Col, Row, Container, Content, Header, Left, Body, Right, Button, Icon, Title, Text, List, ListItem, Thumbnail,Footer } from 'native-base';
// import Reporter from "./RepairScreen";
import Reporter from '../components/Reporter';

let ScreenWidth = Dimensions.get('window').width;
let ScreenHeight = Dimensions.get('window').height;
class ConfirmReport extends Component {

    constructor(props){
        super(props);
        this.state = {
            reporter: "周良",
            phone: "13888888888",
            address: "A机房C机架B群组-F203",
        }
    }

    static navigationOptions = {
        // header: null,
        headerTitle: '报修单确认',
        headerBackImage: (<Image resizeMode={'contain'} style={{width: 12, height: 25}} source={require('../image/navbar_ico_back.png')} />),
        headerStyle: {
            elevation: 0,
        },
    };

    render() {
        return (
            <Container>
                {/*<Header style={stylesHeader.headerColor}>*/}
                    {/*<Left>*/}
                        {/*<Button transparent>*/}
                            {/*<Icon name='arrow-back'  style={{color:'#000'}}/>*/}
                        {/*</Button>*/}
                    {/*</Left>*/}
                    {/*<Body style={stylesHeader.headerBordy}>*/}
                    {/*<Title style={stylesHeader.titleColor}>报修单确认</Title>*/}
                    {/*</Body>*/}
                    {/*<Right></Right>*/}
                {/*</Header>*/}
                <Grid style={stylesBody.bodyBlank}>
                    <Row style={{height:55,marginLeft:13}}>
                        <Text style={{color:'#a5a7ac',paddingTop:20,fontSize:15}}>请确认您的报修单</Text>
                    </Row>
                    <Row style={{marginRight:13,marginLeft:13,backgroundColor: '#ffffff',height:90}}>
                        <Text style={{color:'#3e3e3e',paddingLeft:10,paddingTop:13,fontSize:15}}>报修内容：<Text style={{color:'#737373',fontSize:15}}>F210机器内网网络不通~</Text></Text>
                    </Row>
                    {/*<Row style={{marginRight:13,marginLeft:13,backgroundColor: '#ffffff',marginTop:12,height:60}}>*/}
                        {/*<Content>*/}
                            {/*<Row>*/}
                                {/*<Text style={stylesBody.linkMan}>报修人:<Text style={stylesBody.linkMan}>周良</Text></Text><Text style={{paddingLeft:40,fontSize:14,color:'#606060'}}>13888888888</Text>*/}
                            {/*</Row>*/}
                            {/*<Row>*/}
                                {/*<Text style={stylesBody.linkMan}>报修位置:<Text style={stylesBody.linkMan}>A机房C机架B群组-F203</Text></Text>*/}
                            {/*</Row>*/}
                        {/*</Content>*/}
                    {/*</Row>*/}

                    <Reporter name={this.state.reporter} phone={this.state.phone} adds={this.state.address} changAdds={()=>this.changeReporter()}/>


                    <Content style={{marginTop:12,marginLeft:13}}>
                        <Row>
                            <Image
                                style={{width: 140, height: 140}}
                                source={{uri: 'http://ckimg.baidu.com/course/2016-10/21/808aa8fc57ab3684ab75bec1489473e2.jpg'}}
                            />
                            <Image
                                style={{width: 140, height: 140,marginLeft:16}}
                                source={{uri: 'http://ckimg.baidu.com/course/2016-10/21/808aa8fc57ab3684ab75bec1489473e2.jpg'}}
                            />
                            <Image
                                style={{width: 140, height: 140,marginLeft:16}}
                                source={{uri: 'http://ckimg.baidu.com/course/2016-10/21/808aa8fc57ab3684ab75bec1489473e2.jpg'}}
                            />
                        </Row>
                        <Row style={{paddingTop:12}}>
                            <Image
                                style={{width: 140, height: 140}}
                                source={{uri: 'http://ckimg.baidu.com/course/2016-10/21/808aa8fc57ab3684ab75bec1489473e2.jpg'}}
                            />
                            <Image
                                style={{width: 140, height: 140,marginLeft:16}}
                                source={{uri: 'http://ckimg.baidu.com/course/2016-10/21/808aa8fc57ab3684ab75bec1489473e2.jpg'}}
                            />
                            <Image
                                style={{width: 140, height: 140,marginLeft:16}}
                                source={{uri: 'http://ckimg.baidu.com/course/2016-10/21/808aa8fc57ab3684ab75bec1489473e2.jpg'}}
                            />
                        </Row>
                    </Content>
                    <Footer style={{height:50,backgroundColor:'#6dc5c9'}}>
                        <Button  style={{width:ScreenWidth,backgroundColor:'#6dc5c9',height:50}}

                        >
                            <Text style={{width:ScreenWidth,color:'#ffffff',fontSize:20,textAlign:'center'}}>确定</Text>
                        </Button>
                    </Footer>


                </Grid>
            </Container>
        );
    }
}

const stylesHeader=StyleSheet.create({
    headerColor:{
        backgroundColor:'#fff'
    },
    headerBordy:{
        alignItems: 'center',
        marginLeft:100
    },
    titleColor:{
        color:'#000'
    },
});


const stylesBody=StyleSheet.create({
    bodyBlank:{
        backgroundColor:'#f8f8f8',
    },
    bodyFont:{
        fontSize:15,
    },
    linkMan:{
        fontSize:14,
        color:'#606060',
    }
});


// export default ConfirmReport;
module.exports=ConfirmReport;
