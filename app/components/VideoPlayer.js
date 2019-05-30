import { Content } from 'native-base';
import React, { Component } from 'react';
import { Dimensions, Image, Modal, Slider, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Video from 'react-native-video';

const screenWidth = Dimensions.get('window').width;

function formatTime(second) {
    let i = 0, s = parseInt(second);
    if (s > 60) {
        i = parseInt(s / 60);
        s = parseInt(s % 60);
    }
    // 补零
    let zero = function (v) {
        return (v >> 0) < 10 ? "0" + v : v;
    };
    return [zero(i), zero(s)].join(":");
}

/**
 * 视频播放
 */
class VideoPlayer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            videoWidth: screenWidth,
            showVideoControl: false, // 是否显示视频控制组件
            isPlaying: false,        // 视频是否正在播放    ----paused ture 暂停  false播放
            currentTime: 0,        // 视频当前播放的时间
            duration: 0,           // 视频的总时长
            playFromBeginning: false, // 是否从头开始播放
            modalVisible: true,   //是否显示视频组件
            isFullScreen: false,     // 当前是否全屏显示
        };
    }

    render() {

        return (
            <View style={styles.container} onLayout={this._onLayout}>
                <Video
                    ref={(ref) => this.videoPlay = ref}
                    source={{uri:this.props.uri}}
                    style={styles.videoNormalFrame} 
                    rate={1.0}
                    volume={1.0}
                    muted={false}
                    paused={!this.state.isPlaying}
                    resizeMode={'contain'}
                    playWhenInactive={false}
                    playInBackground={false}
                    ignoreSilentSwitch={'ignore'}
                    progressUpdateInterval={250.0}
                    onLoad={this._onLoaded}
                    onProgress={this._onProgressChanged}
                    onEnd={this._onPlayEnd}
                />
                <TouchableWithoutFeedback onPress={() => { this.hideControl() }}>
                    <View
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            backgroundColor: this.state.isPlaying ? 'transparent' : 'rgba(0, 0, 0, 0.2)',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                        {
                            this.state.isPlaying ? null :
                            <TouchableWithoutFeedback onPress={() => { this.onPressPlayButton() }}>
                                <Image
                                    style={styles.playButton}
                                    source={require('../image/icon_video_play.png')}
                                />
                            </TouchableWithoutFeedback>
                        }
                        {
                            this.state.showVideoControl && this.state.isPlaying ?
                            <TouchableWithoutFeedback onPress={() => { this.onPressPlayButton() }}>
                                <Image
                                    style={styles.playButton}
                                    source={require('../image/icon_video_pause.png')}
                                />
                            </TouchableWithoutFeedback> : null
                        }
                    </View>
                </TouchableWithoutFeedback>
                {
                    this.state.showVideoControl ?
                    <View>
                        
                        <TouchableOpacity style={styles.header} onPress={this.props.closeVideoPlayer}>
                        {/* <TouchableOpacity style={styles.header} onPress={() => { this._setModalVisible() }}> */}
                            <Image style={styles.shrinkControl} source={require('../image/mesbox_close@2.png')}/>
                        </TouchableOpacity>
                    </View> : null
                }
                {
                    this.state.showVideoControl ?
                    <View style={[styles.control, { width: this.state.videoWidth }]}>
                        <Text style={styles.time}>{formatTime(this.state.currentTime)}</Text>
                        <Slider
                            style={{ flex: 1 }}
                            maximumTrackTintColor={'#999999'}   
                            minimumTrackTintColor={'#00c06d'}
                            thumbImage={require('../image/icon_video_slider.png')}
                            value={this.state.currentTime}
                            minimumValue={0}
                            maximumValue={this.state.duration}
                            onValueChange={(currentTime) => { this.onSliderValueChanged(currentTime) }}
                        />
                        <Text style={styles.time}>{formatTime(this.state.duration)}</Text>
                    </View> : null
                }
            </View>
        );
    }

    /// -------Video组件回调事件-------

    _onLoaded = (data) => {
        console.log('视频加载完成');
        this.setState({
            duration: data.duration,
        });
    };

    _onProgressChanged = (data) => {
        if (this.state.isPlaying) {
            this.setState({
                currentTime: data.currentTime,
            })
        }
    };

    _onPlayEnd = () => {
        console.log('视频播放结束');
        this.videoPlay.seek(0);
        this.setState({
            currentTime: 0,
            isPlaying: false,
            playFromBeginning: true
        });
    };

    ///-------控件点击事件-------

    /// 控制播放器工具栏的显示和隐藏
    hideControl() {
        if (this.state.showVideoControl) {
            this.setState({
                showVideoControl: false,
            })
        } else {
            this.setState(
                {
                    showVideoControl: true,
                },
                // 5秒后自动隐藏工具栏
                () => {
                    setTimeout(
                        () => {
                            this.setState({
                                showVideoControl: false
                            })
                        }, 5000
                    )
                }
            )
        }
    }

    /// 点击了播放器正中间的播放按钮
    onPressPlayButton() {
        if (this.state.playFromBeginning) {
            this.setState({
                playFromBeginning: false,
            }); 
        }
        this.setState({
            isPlaying: !this.state.isPlaying,
        });
    }

    /// 进度条值改变
    onSliderValueChanged(currentTime) {
        this.videoPlay.seek(currentTime);
        this.setState({
            currentTime: currentTime
        })
    }

    /// 屏幕旋转时宽高会发生变化，可以在onLayout的方法中做处理，比监听屏幕旋转更加及时获取宽高变化
    _onLayout = (event) => {
        //获取根View的宽高
        let {width, height} = event.nativeEvent.layout;

        // 一般设备横屏下都是宽大于高，这里可以用这个来判断横竖屏
        let isLandscape = (width > height);
        if (isLandscape){
            this.setState({
                videoWidth: width,
                isFullScreen: true,
            })
        } else {
            this.setState({
                videoWidth: width,
                isFullScreen: false,
            })
        }
    };

    _setModalVisible() {
        this.setState({
            currentTime: 0,
            modalVisible: !this.state.modalVisible 
        });
    }

    componentDidMount(){
        this.props.onRef(this)
    }

    setVideoCurrentTime = (time) => {
        this.videoPlay.seek(time);
        this.setState({
            currentTime: time || 0,
            isPlaying: false,
        })
    }
}

// 样式
const styles = StyleSheet.create({
    imageStyle : {
        width: 120,
        height: 120,
    },
    container: {
        flex: 1,
        backgroundColor: 'black',
        marginBottom: -20,
        marginTop: 10
    },
    videoNormalFrame: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    playIcon: {
        width: 50,
        height: 50,
    },
    playButton: {
        width: 75,
        height: 75,
    },
    time: {
        fontSize: 12,
        color: 'white',
        marginLeft: 10,
        marginRight: 10
    },
    control: {
        flexDirection: 'row',
        height: 44,
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        position: 'absolute',
        bottom: 0,
        left: 0
    },
    header: {
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        position: 'absolute',
        top: 0,
        right: 0
    },
    shrinkControl: {
        width: 40,
        height: 40,
        marginTop: 5,
        marginRight: 5,
    },
});
module.exports = VideoPlayer;
