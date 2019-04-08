import React, {Component} from 'react';
import {View, TouchableOpacity, Image, StyleSheet} from 'react-native';


export default class MultipleImagePicker extends Component {

    render() {
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
            // backgroundColor: '#EEEEEE',
        };

        // let uri = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1553852941108&di=2e17890f24b6b435263d21e1f791c405&imgtype=0&src=http%3A%2F%2Fpic.51yuansu.com%2Fpic3%2Fcover%2F01%2F01%2F65%2F58de76399714b_610.jpg'
        return (
            <View style={{backgroundColor: '#fff',}}>
                <View style={{flexWrap: 'wrap',flexDirection: 'row',}}>
                    {this.props.images ? this.props.images.map((image) =>
                                <PreImage key={image.index}
                                  deleteImage={()=> {this.props.deleteImage(image.index)}}
                                  uri={image.uri} />) : null
                    }
                    <View style={s}>
                        <View style={style}>
                            <TouchableOpacity onPress={()=> {this.props.toggleModal()}}>
                                <Image style={sle} source={require('../image/btn_xzbx.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

            </View>
        );
    }

}
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
};


