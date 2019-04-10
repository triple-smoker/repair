
import React from "react";
import {Container, Content, Textarea, ListItem} from 'native-base';
import MultipleImagePicker from "../components/MultipleImagePicker";
import Reporter from '../components/Reporter';
import Notice from '../components/Notice';
import MyFooter from '../components/MyFooter';
import Modal from "react-native-modal";
import ImagePicker from 'react-native-image-crop-picker';
import {StyleSheet, TextInput ,Alert, Text, TouchableNativeFeedback,Image, View} from "react-native";


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
            showNotice: false,
            desc : '',
        }
    }

    toggleModal = () =>
        this.setState({ visibleModal: !this.state.visibleModal });


    submit(){

        let images = this.state.images;
        if(images.length === 0){
            this.setState({
                showNotice: true,
            });
            return;
        }

        alert(this.state.desc);

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
        let num = imagesList.length ;

        for(let i in images){
            console.log( parseInt(num) + parseInt(i));
            if( parseInt(num) +parseInt(i) <6){
                let image = images[i];
                imagesList.push({index: num+i, uri: image.path, width: image.width, height: image.height, mime: image.mime}) ;
            }
        }
        this.setState({
            images: imagesList
        });
        if(parseInt(num) + images.length >6){
            Alert.alert("最多添加6张");
        }

    }

    /**
     * 删除图片
     */
    deleteImage(index){

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
            maxFiles: 6,
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

    /**
     * 修改联系人
     */
    changeReporter(){
        const { navigate } = this.props.navigation;
        navigate('Address', {
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


    handleChange(event) {
        alert(event.target.value);
        this.setState({desc: event.target.value});
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
                    {/*<Textarea value={this.state.desc} onChange={this.handleChange.bind(this)} style={{backgroundColor: "#ffffff" , marginTop : '1.5%', marginLeft: '1.5%', marginRight: '1.5%',}} rowSpan={6} placeholder="我的报修内容..." />*/}
                    <MultipleImagePicker
                        images={this.state.images}
                        toggleModal = {()=> this.toggleModal()}
                        deleteImage = {(index)=> this.deleteImage(index)}
                        style={{backgroundColor: "#fff" ,marginTop: '1.5%', marginLeft: '1.5%', marginRight: '1.5%',}}
                    />
                    <View style={{borderColor: '#000', width: '100%',height: 1, border: 0.5, marginLeft: '1.5%', marginRight: '1.5%',}}/>
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


