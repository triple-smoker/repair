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
        if(this.showImagetimer){
            clearInterval(this.showImagetimer);
        }
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
            if(this.state.currentTime>=30){
                this._stop();
                this.setState({active : false});
                this.setModalVisible();
                clearInterval(this.showImagetimer);
            }
        }, 1000);
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

                    <View style={{ flexDirection: 'row',alignItems: 'center',justifyContent: 'center',}}>
                        {!this.state.showImage ? null: <Image
                            style={{marginLeft: 0, marginRight: 10,height:60,resizeMode:'contain'}}
                            source={require('../image/duan.png')}/>}
                        <Image
                            style={{marginLeft: 30, marginRight: 30,height:90,resizeMode:'contain'}}
                            source={require('../image/chang.png')}/>
                        <Text style={styles.duration} >{this.state.currentTime>9 ? this.state.currentTime : '0'+this.state.currentTime}</Text>
                        <Image
                            style={{marginLeft: 30, marginRight: 30,height:90,resizeMode:'contain'}}
                            source={require('../image/chang.png')}/>
                        {!this.state.showImage ? null: <Image
                            style={{marginLeft: 10, marginRight: 0,height:60,resizeMode:'contain'}}
                            source={require('../image/duan.png')}/> }
                    </View>
                    <View style={{height:30,marginTop:20,marginBottom:5}}>
                    {this.state.currentTime >=20 &&
                        <Text style={{color:"#fff",fontSize: 20}}>您还可以录制{30-this.state.currentTime}秒</Text>
                    }
                    </View>
                    <Text style={{color:"#900b05",fontSize: 16,fontWeight:"bold"}}>松开屏幕停止录音</Text>
                    <View style={{height:"24%"}}/>


                </Modal>


                    {this.props.show ? <TouchableNativeFeedback
                        onPressIn={() => {this._record(), this.setState({active : true}),this.setModalVisible()}}
                        onPressOut={() => {this._stop(), this.setState({active : false}),this.setModalVisible()}}>
                        <Image
                            style={{
                                position: 'absolute',
                                bottom:50,
                                left:"20%",
                                right:"20%",
                                width:'60%',
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
        fontSize: 120,
    },
    write: {
        color: '#fff',
    },
});
export default Recorde;
