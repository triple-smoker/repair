import React, {Component}from 'react';
import {
    Text,
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    Platform,
    PixelRatio
} from 'react-native';

let icon_back = require('../../res/home/icon_back.png');

import {getPropsData} from '../util/utils';
import * as Dimens from '../value/dimens';


/**
 *-------------标题栏-----------------
 *
 * centerText  ------------------标题文字
 * centerTextStyle ---------标题文字样式(为undefind,显示默认样式)
 *
 * rightText--------------------标题栏右边文字
 * rightPress---------------标题栏右边文字点击事件
 * rightImg----------------标题栏右边图片
 * rightImgPress---------标题栏右边图片点击事件
 * rightStyle
 * isShowLeftBackIcon  ----是否显示左边图片
 * leftPress------------标题栏左边点击事件(为空,点击返回上个页面,否则点击执行传过来的事件)
 *
 * backgroundColor-----背景色
 *
 *lineHeight--------分割线的高
 */

export default class TitleBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            centerText: getPropsData(this.props.centerText, ''),
            rightText: this.props.rightText,
            rightPress: this.props.rightPress,
            rightImg: this.props.rightImg,
            rightImgPress: this.props.rightImgPress,
            leftPress: this.props.leftPress,
            isShowLeftBackIcon: getPropsData(this.props.isShowLeftBackIcon, false),
            backgroundColor: getPropsData(this.props.backgroundColor, Dimens.color_bg_f9),
            centerTextStyle: this.props.centerTextStyle,
            lineHeight: getPropsData(this.props.lineHeight, Dimens.ruleSize),
            rightStyle : getPropsData(this.props.rightStyle, ''),
        }
    }

    /**
     * 点击返回icon事件
     * @private
     */
    _pressBackButton() {
        console.log('_pressBackButton');
        const {navigation} = this.props;

        if (navigation) {
            navigation.pop();
        }
    }

    render() {

        const {centerText, backgroundColor, isShowLeftBackIcon, leftPress
            ,rightText, rightPress, rightImg, rightImgPress, rightStyle,centerTextStyle, lineHeight,} = this.state;

        /** 左边图片*/
        let touchableOpacity = null;
        if(isShowLeftBackIcon) {
            touchableOpacity =
                <TouchableOpacity
                    style={styles.TouchableOpacityLeftText}
                    onPress={leftPress == undefined ? ()=> {this._pressBackButton()} : ()=> {
                        leftPress()} }>
                    <View style={{alignItems: 'center'}}>
                        <Image
                            style={styles.leftImage}
                            source={icon_back}/>
                    </View>
                </TouchableOpacity>
        }

        let text = null;
        if (rightText != null) {
            text = <TouchableOpacity style={styles.TouchableOpacityRightText} onPress={ ()=> {
                rightPress()
            } }>
                <View style={{alignItems: 'center'}}>
                    <Text style={styles.rightTxt}> {rightText}</Text>
                </View>
            </TouchableOpacity>


        }

        var image = null;
        if (rightImg != null) {
            image = <TouchableOpacity style={styles.TouchableOpacityRightImgview} onPress={ ()=> {
                rightImgPress()
            } }>
                <View style={{alignItems: 'center'}}>
                    <Image
                        style={{...styles.rightImage,...rightStyle}}
                        source={rightImg}/>

                </View>
            </TouchableOpacity>

        }


        let iOSTop = null;
        if (Dimens.isIOS) {
            iOSTop = <View style={{backgroundColor: backgroundColor, height: (Dimens.isIphoneX()?30:20)}}/>
        }

        return (
            <View >
                {iOSTop}
                <View style={{
                    height:44,
                    backgroundColor: backgroundColor,
                    borderBottomWidth: lineHeight,
                    borderBottomColor: Dimens.color_line_cc,
                }}>
                    <View style={styles.containerText}>
                        {touchableOpacity}
                        <Text style={[{
                            fontSize: 18,
                            color: Dimens.color_text_33
                        }, centerTextStyle]}>{centerText}</Text>
                        {text}
                        {image}
                    </View>

                </View>

            </View>
        );
    }

}

const styles = StyleSheet.create({
    containerText: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        height: 44,
    },
    TouchableOpacityLeftText: {
        position: 'absolute',
        left: 0,
        top: 8,
        bottom: 8,
        justifyContent: 'center',
    },
    leftImage: {
        width: 44,
        height: 44,
    },
    TouchableOpacityRightText: {
        position: 'absolute',
        right: 15,
        top: 8,
        bottom: 8,
        justifyContent: 'center',
    },

    TouchableOpacityRightImgview: {
        position: 'absolute',
        right: 0,
        top: 8,
        bottom: 8,
        justifyContent: 'center',
    },
    rightTxt: {
        fontSize: 15,
        color: Dimens.color_text_33,
    },
    rightImage: {
        width: 20,
        height: 20,
        marginRight: 20,
    },

})
