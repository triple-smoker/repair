import React, {Component} from 'react';

import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    Platform, Image, TouchableNativeFeedback,
} from 'react-native';

import Sound from 'react-native-sound';
import {AudioRecorder, AudioUtils} from 'react-native-audio';
import Modal from "react-native-modal";

class Recorde extends Component {

    state = {
        visibleModal: false,
        showImage : true,
        currentTime: 0.0,
        recording: false,
        paused: false,
        stoppedRecording: false,
        finished: false,
        audioPath: AudioUtils.DocumentDirectoryPath + '/test.aac',
        hasPermission: undefined,
    };

    prepareRecordingPath(audioPath){
        AudioRecorder.prepareRecordingAtPath(audioPath, {
            SampleRate: 22050,
            Channels: 1,
            AudioQuality: "Low",
            AudioEncoding: "aac",
            AudioEncodingBitRate: 32000
        });
    }

    componentDidMount() {
        AudioRecorder.requestAuthorization().then((isAuthorised) => {
            this.setState({ hasPermission: isAuthorised });

            if (!isAuthorised) return;

            this.prepareRecordingPath(this.state.audioPath);

            AudioRecorder.onProgress = (data) => {
                this.setState({currentTime: Math.floor(data.currentTime)});
            };

            AudioRecorder.onFinished = (data) => {
                // Android callback comes in the form of a promise instead.
                if (Platform.OS === 'ios') {
                    this._finishRecording(data.status === "OK", data.audioFileURL, data.audioFileSize);
                }
            };
        });
    }


    async _stop() {
        if (!this.state.recording) {
            console.warn('Can\'t stop, not recording!');
            return;
        }

        this.setState({stoppedRecording: true, recording: false, paused: false});

        try {
            const filePath = await AudioRecorder.stopRecording();

            if (Platform.OS === 'android') {
                this._finishRecording(true, filePath);
            }
            return filePath;
        } catch (error) {
            console.error(error);
        }
    }

    async _play() {
        if (this.state.recording) {
            await this._stop();
        }

        // These timeouts are a hacky workaround for some issues with react-native-sound.
        // See https://github.com/zmxv/react-native-sound/issues/89.
        setTimeout(() => {
            var sound = new Sound(this.state.audioPath, '', (error) => {
                if (error) {
                    console.log('failed to load the sound', error);
                }
            });

            setTimeout(() => {
                sound.play((success) => {
                    if (success) {
                        console.log('successfully finished playing');
                    } else {
                        console.log('playback failed due to audio decoding errors');
                    }
                });
            }, 100);
        }, 100);
    }

    async _record() {
        this.showImagetimer = setInterval(() => {
            this.setState(
                {
                    showImage : !this.state.showImage
                }
            )
        }, 800);
        if (this.state.recording) {
            console.warn('Already recording!');
            return;
        }

        if (!this.state.hasPermission) {
            console.warn('Can\'t record, no permission granted!');
            return;
        }

        if(this.state.stoppedRecording){
            this.prepareRecordingPath(this.state.audioPath);
        }

        this.setState({recording: true, paused: false});

        try {
            const filePath = await AudioRecorder.startRecording();
        } catch (error) {
            console.error(error);
        }
    }
    setModalVisible() {
        this.setState({ visibleModal: !this.state.visibleModal });
    }

    _finishRecording(didSucceed, filePath, fileSize) {
        this.setState({ finished: didSucceed });
        let record = {
            filePath : filePath,
            duration : this.state.currentTime
        }
        this.props.recordCallBack(record);
        console.log(`Finished recording of duration ${this.state.currentTime} seconds at path: ${filePath} and size of ${fileSize || 0} bytes`);
    }

    render(){
        return(<View>
                <Modal
                    style={{alignItems: 'center',}}
                    isVisible={this.state.visibleModal}
                    swipeDirection="down"
                    onBackdropPress={() => this.setModalVisible()}>

                    <View style={{ bottom : '32%',flex: 1,flexDirection: 'row',alignItems: 'center',justifyContent: 'center',}}>
                        {!this.state.showImage ? null: <Image
                            style={{marginLeft: 10, marginRight: 10}}
                            source={require('../image/duan.png')}/>}
                        <Image
                            style={{marginLeft: 10, marginRight: 10}}
                            source={require('../image/chang.png')}/>
                        <Text style={styles.duration} >0:{this.state.currentTime>9 ? this.state.currentTime : '0'+this.state.currentTime}</Text>
                        <Image
                            style={{marginLeft: 10, marginRight: 10}}
                            source={require('../image/chang.png')}/>
                        {!this.state.showImage ? null: <Image
                            style={{marginLeft: 10, marginRight: 10}}
                            source={require('../image/duan.png')}/> }
                    </View>
                </Modal>
                <TouchableNativeFeedback
                    onPressIn={() => {this._record(), this.setState({active : true}),this.setModalVisible()}}
                    onPressOut={() => {this._stop(), this.setState({active : false}),this.setModalVisible()}}>
                    <Image
                        style={{
                            marginRight: 'auto',
                            marginLeft: 'auto',
                            width:'75%',
                            resizeMode:'contain'
                        }}
                        source={require('../image/azsh-1.png') }/>
                </TouchableNativeFeedback>
                <Text style={styles.write}>最大录制时长一分钟</Text>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    duration: {
        color: '#fff',
        fontSize: 72,
    },
    write: {
        color: '#fff',
    },
});
export default Recorde;
