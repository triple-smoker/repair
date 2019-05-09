import React, {Component} from 'react';
import {AudioRecorder, AudioUtils} from "react-native-audio";
import {Image, StyleSheet, Platform, Text, TouchableNativeFeedback, View} from "react-native";
import Modal from "react-native-modal";

class Record extends Component{
    state = {
        currentTime: 0.0,
        recording: false,
        paused: false,
        stoppedRecording: false,
        finished: false,
        audioPath: AudioUtils.DocumentDirectoryPath + '/voice.acc',
        hasPermission: undefined,
        visibleModal: false,
        active : false,
        showImage: true,
    };

    setModalVisible() {
        this.setState({ visibleModal: !this.state.visibleModal });
    }

    componentDidMount() {
        AudioRecorder.requestAuthorization().then((isAuthorised) => {
            this.setState({ hasPermission: isAuthorised });
            if (!isAuthorised) return;
            this.prepareRecordingPath(this.state.audioPath);
            AudioRecorder.onProgress = (data) => {
                this.setState({currentTime: Math.floor(data.currentTime)});
            };

        });
    }

    prepareRecordingPath(audioPath){
        AudioRecorder.prepareRecordingAtPath(audioPath,{ AudioEncoding: 'acc',});
    }

    /**
     * 停止录音
     * @returns {Promise<void>}
     */
    async stop() {
        clearInterval(this.showImagetimer);
        this.timer && clearTimeout(this.timer);
        if (!this.state.recording) {
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

    /**
     * 开始录音
     * @returns {Promise<void>}
     */
    async record() {
        this.showImagetimer = setInterval(() => {
            this.setState(
                {
                    showImage : !this.state.showImage
                }
            )
        }, 800);
        this.timer = setTimeout(() => {
            this.stop();
        }, 1000*60);
        if (this.state.recording) {
            return;
        }
        if (!this.state.hasPermission) {
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

    _finishRecording(didSucceed, filePath, fileSize) {
        this.setState({ finished: didSucceed });
        let record = {
            filePath : filePath,
            duration : this.state.currentTime
        }
        this.props.recordCallBack(record);
        console.log(`Finished recording of duration ${this.state.currentTime} seconds at path: ${filePath} and size of ${fileSize || 0} bytes`);
    }

    activeImage(){
        let icon = this.state.active ? require('../image/azsh-1.png') : require('../image/azsh-0.png');
        return <Image
            style={{
                top: -40,
                width:'75%',
                resizeMode:'contain'
            }}
            source={icon}/>
    }

    onPressIn(){
        console.log('onPressIn')
    }
    onPressOut(){
        console.log('onPressOut')
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
                            source={require('../image/duan.png')}/> }

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
                    onPressIn={() => {this.record(), this.setState({active : true}),this.setModalVisible()}}
                    onPressOut={() => {this.stop(), this.setState({active : false}),this.setModalVisible()}}>
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
export default Record;
