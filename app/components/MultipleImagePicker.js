import React, {Component} from 'react';
import {View, TouchableOpacity, Image} from 'react-native';


export default class MultipleImagePicker extends Component {

    havaAdd(){
        let num = this.props.images.length
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
                        <TouchableOpacity onPress={()=> {this.props.toggleModal()}}>
                            <Image style={sle} source={require('../image/btn_xzbx.png')} />
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
    }

    render() {
        const readOnly = this.props.readOnly;
        return (
            <View style={this.props.style}>
                <View style={{flexWrap: 'wrap',flexDirection: 'row',}}>
                    {this.props.images ? this.props.images.map((image) =>
                                <PreImage key={image.index}
                                          readOnly = {readOnly}
                                  deleteImage={()=> {this.props.deleteImage(image.index)}}
                                  uri={image.uri} />) : null
                    }
                    {readOnly ? null : this.havaAdd()}
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


