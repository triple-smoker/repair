import React, {Component} from 'react';
import {View, TouchableOpacity, Image, TouchableNativeFeedback, Text, Alert, StyleSheet} from 'react-native';
import {ListItem} from "native-base";
import Modal from "react-native-modal";
import ImagePicker from 'react-native-image-crop-picker';
import ImagePickers from 'react-native-image-picker';
import Video from 'react-native-video';
import ImgPreview from './ImgPreview';
class MultipleImagePicker extends Component {

    constructor(props){
        super(props);
        this.state = {
            images: [],
            visibleModal: false,
            PicMsg:{
                visible:false,
                index:0 
             }
        }
    }

    /**
     * 拍摄视频，限时30秒
     */
    selectVideoTapped() {
        const options = {
            mediaType: 'video',
            videoQuality: 'medium',
            durationLimit: 30
        };

        ImagePickers.launchCamera(options, (response) => {
            response.type = 'video';

            let image = {
                path : response.path,
                type : 'video',
            }
            let images = [];
            images.push(image);
            this.appendImage(images);
            if (response.didCancel) {
                console.log('User cancelled video picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                this.setState({
                    videoSource: response.uri,
                });
            }
        });
    }

    /**
     * 控制弹出框展示
     */
    toggleModal = () =>
        this.setState({ visibleModal: !this.state.visibleModal });

    /**
     * 相机拍摄图片
     * @param cropping
     * @param mediaType
     */
    pickSingleWithCamera(){
        ImagePicker.openCamera({
        }).then(image => {
            console.log('received image', image);

            let im = {
                path : image.path,
                type : 'image',
            }

            let images = [];
            images.push(im);
            this.appendImage(images);
            this.setState({ visibleModal: false })
        }).catch(e => alert(e));
        this.uploadImages();
    }

    /**
     * 新增图片
     * @param images
     */
    appendImage(images){
        console.log(images);
        let imagesList = this.state.images;
        let num = imagesList.length ;
        for(let i in images){
            let index = parseInt(num) +parseInt(i)
            console.log(index);
            if( index <6){
                let image = images[i];
                imagesList.push({index: index, uri: image.path,type: image.type}) ;
            }
        }
        this.setState({
            images: imagesList
        });
        if(parseInt(num) + images.length >6){
            Alert.alert("最多添加6张");
        }
        this.uploadImages();

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
        // this.uploadImages();
        this.props.imageCallback(imagesList);
    }

    /**
     * 文件系统选择图片
     */
    pickMultiple() {
        ImagePicker.openPicker({
            multiple: true,
            waitAnimationEnd: false,
            includeExif: true,
            forceJpg: true,
        }).then(images => {
            //将选择的图片加入到列表

            this.appendImage(images);
            this.setState({ visibleModal: false });
            this.uploadImages();
        }).catch(e => alert(e));
    }


    /**
     * 向上传递图片列表
     * @returns {*}
     */
    uploadImages(){
        this.props.imageCallback(this.state.images);
    }
    /**
     * 传递图片index 
     * */ 
    largerView(ff,index){  
        this.setModalVisible(index)
    }
    /** 
     * 显示图片详情
     * */ 
    setModalVisible= (index = 0)=> {
        this.setState({ 
            PicMsg:{
                visible: !this.state.PicMsg.visible,
                index:index
            }
        })   
    }

    render() {
        const readOnly = this.props.readOnly;
        return (
            <View style={this.props.style}>
                <View style={{flexWrap: 'wrap',flexDirection: 'row',}}>
                    {this.props.images ? this.props.images.map((image) =>
                                <PreView
                                    key={image.index}
                                    readOnly = {readOnly}
                                    deleteImage={()=> {this.deleteImage(image.index)}}
                                    largerView={() => {this.largerView(this.props.images,image.index)}}
                                    uri={image.uri}
                                    type={image.type}/>) : null
                    }
                    {readOnly ? null : <HavaAdd images={this.props.images} onPress = {()=> this.toggleModal()} />}
                </View>

                <Modal onBackdropPress={() => this.toggleModal()} isVisible={this.state.visibleModal}>
                    <View style={styles.modalContent}>
                        <RenderModal item='相册' onPress={() => this.pickMultiple()} />
                        <RenderModal item='拍照' onPress={() => this.pickSingleWithCamera()} />
                        <RenderModal item="摄像" onPress={() => this.selectVideoTapped()} />
                    </View>
                </Modal>
                <ImgPreview
                   PicMsg={this.state.PicMsg}
                   setModalVisible={this.setModalVisible}
                   imagesRequest={this.props.images}></ImgPreview> 
            </View>
        );
    }

}

const RenderModal = (props) => {
    return (
        <TouchableNativeFeedback onPress={() =>props.onPress()}>
            <ListItem >
                <Text>{props.item}</Text>
            </ListItem>
        </TouchableNativeFeedback >
    )
};


const PreVideo  = (video) => {
    return (
        <Video source={{uri: video.uri}}
               style={{position: 'absolute',
                   top: 0,
                   left: 0,
                   bottom: 0,
                   right: 0
               }}
               rate={1}
               paused={true}
               volume={1}
               muted={false}
               resizeMode={'cover'}
               onError={e => console.log(e)}
               onLoad={load => console.log(load)}
               repeat={true} />
    );
}

const PreView = (props) => {
    let uri = '../image/delete.png'
    const readOnly = props.readOnly;

    return (
        <View key={props.index} style={styles.pre}>
            {readOnly ? null : (
                <TouchableOpacity  style={styles.iconStyle} onPress={props.deleteImage}>
                    <Image style={styles.iconStyle} source={require(uri)} />
                </TouchableOpacity>
            )}

            {props.type === 'video' ?
                <PreVideo uri={props.uri}/> :
                <TouchableOpacity onPress={props.largerView}>
                    <Image style={styles.imageStyle} 
                       source={{uri: props.uri}} />
                </TouchableOpacity>
            }
        </View>
    );
};


const styles = StyleSheet.create({
    imageStyle : {
        width: 120,
        height: 120,
    },
    pre : {
        justifyContent: 'center',
        alignItems: 'center',
        width: 130,
        height: 130,
    },
    iconStyle : {
        position: 'absolute',
        width: 25,
        height: 25,
        right: 5,
        top: 5,
        zIndex: 1,
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

const HavaAdd = (props) => {
    let num = props.images.length;
    if(num<6){
        const style = {
            justifyContent: 'center',
            alignItems: 'center',
            width: 120,
            height: 120,
            backgroundColor: '#EEEEEE',
        };
        const sle = {
            justifyContent: 'center',
            alignItems: 'center',
            width: 50,
            height: 50,
        };
        return (
            <View style={styles.pre} >
                <View style={style}>
                    <TouchableOpacity onPress={() => props.onPress()}>
                        <Image style={sle} source={require('../image/btn_xzbx.png')} />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }else {
        return null;
    }



};
export default MultipleImagePicker;

