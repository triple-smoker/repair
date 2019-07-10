import React, {Component} from 'react';

import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    Platform, Image, TouchableNativeFeedback, DeviceEventEmitter,
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
        DeviceEventEmitter.emit('Add_Voice', filePath);
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


                    {this.props.show ? <TouchableNativeFeedback
                        onPressIn={() => {this._record(), this.setState({active : true}),this.setModalVisible()}}
                        onPressOut={() => {this._stop(), this.setState({active : false}),this.setModalVisible()}}>
                        <Image
                            style={{
                                position: 'absolute',
                                bottom:0,
                                left:"12%",
                                right:"12%",
                                width:'75%',
                                resizeMode:'contain'
                            }}
                            source={require('../image/azsh-1.png') }/>
                    </TouchableNativeFeedback>: null}




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
