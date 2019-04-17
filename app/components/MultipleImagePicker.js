import React, {Component} from 'react';
import {View, TouchableOpacity, Image, TouchableNativeFeedback, Text, Alert, StyleSheet} from 'react-native';
import {ListItem} from "native-base";
import Modal from "react-native-modal";
import ImagePicker from 'react-native-image-crop-picker';

class MultipleImagePicker extends Component {

    constructor(props){
        super(props);
        this.state = {
            images: [],
            visibleModal: false
        }
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
            let images = [];
            images.push(image);
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
        this.uploadImages();
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

    render() {
        const readOnly = this.props.readOnly;
        return (
            <View style={this.props.style}>
                <View style={{flexWrap: 'wrap',flexDirection: 'row',}}>
                    {this.props.images ? this.props.images.map((image) =>
                                <PreImage key={image.index}
                                          readOnly = {readOnly}
                                  deleteImage={()=> {this.deleteImage(image.index)}}
                                  uri={image.uri} />) : null
                    }
                    {readOnly ? null : <HavaAdd images={this.props.images} onPress = {()=> this.toggleModal()} />}
                </View>

                <Modal isVisible={this.state.visibleModal}>
                    <View style={styles.modalContent}>
                        <RenderModal item='相册' onPress={() => this.pickMultiple()} />
                        <RenderModal item='拍照' onPress={() => this.pickSingleWithCamera()} />
                        <RenderModal item="取消" onPress={() => this.toggleModal()} />
                    </View>
                </Modal>

            </View>
        );
    }

}

const HavaAdd = (props) => {
    let num = props.images.length;
    if(num<6){
        const s = {
            justifyContent: 'center',
            alignItems: 'center',
            width: 130,
            height: 130,
        };
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
            <View style={s}   >
                <View style={style}>
                    <TouchableOpacity onPress={() => props.onPress()}>
                        <Image style={sle} source={require('../image/btn_xzbx.png')} />
                    </TouchableOpacity>
                </View>
            </View>
        )
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


const PreImage = (props) => {
    let uri = 'https://timgsa.baidu.com/timg?image&quality=80&size=b10000_10000&sec=1553929315&di=9a1db93ed5aecc160de77b1eb8e240d8&src=http://bpic.588ku.com/element_origin_min_pic/00/98/05/4456f33204e5f1f.jpg'
    const style = {
        width: 120,
        height: 120,
    };
    const s = {
        justifyContent: 'center',
        alignItems: 'center',
        width: 130,
        height: 130,
    };

    const icon = {
        position: 'absolute',
        width: 25,
        height: 25,
        right: 5,
        top: 5,
        zIndex: 1,
    };

    const readOnly = props.readOnly;

    return (
        <View key={props.index} style={s}>

            {readOnly ? null : (
                <TouchableOpacity  style={icon} onPress={props.deleteImage}>
                    <Image style={icon} source={{uri: uri}} />
                </TouchableOpacity>
            )}
                <Image style={style} source={{uri: props.uri}} />
        </View>
        );
};
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


export default MultipleImagePicker;

