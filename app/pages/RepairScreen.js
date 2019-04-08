
import React from "react";
import {Container, Content, Button, ListItem} from 'native-base';
import { TextareaItem } from "@ant-design/react-native";
import MultipleImagePicker from "../components/MultipleImagePicker";
import Reporter from '../components/Reporter';
import Notice from '../components/Notice';
import MyFooter from '../components/MyFooter';
import Modal from "react-native-modal";
import ImagePicker from 'react-native-image-crop-picker';
import {StyleSheet,Alert, Text, TouchableNativeFeedback,Image, View} from "react-native";


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
    };

    constructor(props){
        super(props);

        this.state = {
            images: [],
            visibleModal: false,
        }
    }

    toggleModal = () =>
        this.setState({ visibleModal: !this.state.visibleModal });


    submit(){

        const { navigate } = this.props.navigation;

        navigate('Confirm');

    }

    /**
     * 相机拍摄图片
     * @param cropping
     * @param mediaType
     */
    pickSingleWithCamera(){
        ImagePicker.openCamera({
        }).then(image => {
            console.log('received image', image);
            let images = [];
            images.push(image);
            this.appendImage(images);
            this.setState({ visibleModal: false })
        }).catch(e => alert(e));
    }

    /**
     * 新增图片
     * @param images
     */
    appendImage(images){

        let imagesList = this.state.images;
        let num = imagesList.length == null ? 0 : imagesList.length ;
        images.map((i, index) => {
            imagesList.push({index: num+index, uri: i.path, width: i.width, height: i.height, mime: i.mime}) ;
        });
        this.setState({
            images: imagesList
        });
        console.log('++++++++++++++');
        console.log(this.state.images);
    }

    /**
     * 删除图片
     */
    deleteImage(index){

        console.log("index: "+ index);

        let images = this.state.images;
        let imagesList = [];
        let num = 0;
        for (let i = 0; i <images.length ; i++) {
            let image = images[i];
            if(image.index === index){
                continue;
            }
            image.index = num;
            imagesList.push(image);
            num++;
        }
        this.setState({
            images : imagesList
        });

    }

    /**
     * 文件系统选择图片
     */
    pickMultiple() {
        // let that = this;
        ImagePicker.openPicker({
            multiple: true,
            waitAnimationEnd: false,
            includeExif: true,
            forceJpg: true,
        }).then(images => {
            //将选择的图片加入到列表
            this.appendImage(images);
            this.setState({ visibleModal: false })
        }).catch(e => alert(e));
    }


    changeReporter(){

        const { navigate } = this.props.navigation;
        navigate('Address', {
            callback: (
                (info) => {
                    // Alert.alert('I am back!',info.name);
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

    renderModalContent = () => (
        <View style={styles.modalContent}>
            <TouchableNativeFeedback onPress={() =>this.pickMultiple()}>
                <ListItem >
                    <Text>相册</Text>
                </ListItem>
            </TouchableNativeFeedback >
            <TouchableNativeFeedback onPress={() =>this.pickSingleWithCamera()}>
                <ListItem >
                    <Text>拍照</Text>
                </ListItem>
            </TouchableNativeFeedback >
            <TouchableNativeFeedback onPress={() => this.setState({ visibleModal: false })}>
                <ListItem >
                    <Text>取消</Text>
                </ListItem>
            </TouchableNativeFeedback >
        </View>
    );

    render() {
        return (
            <Container style={{backgroundColor: "#EEEEEE"}}>
                <Content >
                    <Notice />
                    <TextareaItem rows={6} placeholder="我的报修内容..." />
                    <MultipleImagePicker
                        images={this.state.images}
                        toggleModal = {()=> this.toggleModal()}
                        deleteImage = {(index)=> this.deleteImage(index)}
                        style={{backgroundColor: '#fff',}}
                    />
                    <View style={{borderColor: '#000', width: '100%',height: 1, border: 0.5}}/>
                    <Reporter name={this.state.reporter} phone={this.state.phone} adds={this.state.address} changAdds={()=>this.changeReporter()}/>
                </Content>
                <MyFooter submit={() => this.submit()} value='提交'/>

                <Modal isVisible={this.state.visibleModal}>
                    {this.renderModalContent()}
                </Modal>

            </Container>

        );
    }


}
const styles = StyleSheet.create({

    button: {
        backgroundColor: "lightblue",
        padding: 12,
        margin: 16,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        borderColor: "rgba(0, 0, 0, 0.1)",
    },
    modalContent: {
        backgroundColor: "white",
        padding: 22,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        borderColor: "rgba(0, 0, 0, 0.1)",
    },
    bottomModal: {
        justifyContent: "flex-end",
        margin: 0,
    },

});


