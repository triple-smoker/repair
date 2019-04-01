import React, {Component} from 'react';
import { TouchableHighlight,Text,View,TouchableOpacity, Image,Modal} from 'react-native';
import { Flex } from '@ant-design/react-native';
import ImagePicker from 'react-native-image-crop-picker'


export default class MultipleImagePicker extends Component {

    constructor() {
        super();
        this.state = {
            images: [],
            modalVisible: false,
        };
    }

    /**
     * 相机拍摄图片
     * @param cropping
     * @param mediaType
     */
    pickSingleWithCamera(cropping){
        ImagePicker.openCamera({
            cropping: cropping,
            width: 500,
            height: 500,
            includeExif: true,
            mediaType : 'photo',

        }).then(image => {
            console.log('received image', image);
            this.setState({
                image: {uri: image.path, width: image.width, height: image.height, mime: image.mime},
            });
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
        console.log(this.state.images);
    }

    /**
     * 删除图片
      */
    deleteImage(index){

        const images = this.state.images;

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

        console.log(imagesList);
        this.setState({
            images : imagesList
        })

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
        }).catch(e => alert(e));
    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    render() {
        const style = {
            width: 120,
            height: 120,
        };

        let uri = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1553852941108&di=2e17890f24b6b435263d21e1f791c405&imgtype=0&src=http%3A%2F%2Fpic.51yuansu.com%2Fpic3%2Fcover%2F01%2F01%2F65%2F58de76399714b_610.jpg'

        return (
            <View >
                <Flex wrap="wrap" justify="start">
                    {this.state.images ? this.state.images.map((image) => <PreImage key={image.index} deleteImage={()=> {this.deleteImage(image.index)}} uri={image.uri} />): null}
                    <TouchableOpacity onPress={() => { this.setModalVisible(true);}}>
                        {/*<TouchableOpacity onPress={this.onButtonClick2} onPress={this.pickMultiple.bind(this)}>*/}
                        <Image style={style} source={{uri: uri}} />
                    </TouchableOpacity>
                </Flex>

                <Modal
                    animationType={'slide'}
                    transparent={true}
                    visible={this.state.modalVisible}
                >
                    <View style={{  width: '85%', height: '30%', marginTop: 22 }}>
                        <View>
                            <Text>Hello World!</Text>
                            <TouchableHighlight
                                onPress={() => {
                                    this.setModalVisible(!this.state.modalVisible);
                                }}
                            >
                                <Text>Hide Modal</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </Modal>


            </View>
        );
    }

}
const PreImage = (props: any) => {
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
        // backgroundColor: '#d0efef',
    };

    const icon = {
        position: 'absolute',
        width: 25,
        height: 25,
        right: 5,
        top: 5,
        zIndex: 1,
    };

    return (
        <View key={props.index} style={s}>
            <TouchableOpacity  style={icon} onPress={props.deleteImage}>
                <Image style={icon} source={{uri: uri}} />
            </TouchableOpacity>
                <Image style={style} source={{uri: props.uri}} />
        </View>
        );
}
