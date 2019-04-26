import React, {Component} from 'react';
import {View,Text, Image, Platform, TouchableNativeFeedback} from 'react-native';
import Modal from "react-native-modal";
import {AudioRecorder, AudioUtils} from "react-native-audio";
import Sound from "react-native-sound";


class SoundRecoding extends Component {
	state = {
		currentTime: 0.0,
		recording: false,
		paused: false,
		stoppedRecording: false,
		finished: false,
		audioPath: AudioUtils.DocumentDirectoryPath + '/test.aac',
		hasPermission: undefined,
		visibleModal: false
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

	/**
	 * 停止录音
	 * @returns {Promise<void>}
	 */
	async stop() {
		this.timer && clearTimeout(this.timer);
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

	/**
	 * 播放录音
	 * @returns {Promise<void>}
	 */
	async play() {
		if (this.state.recording) {
			await this.stop();
		}

		setTimeout(() => {
			let sound = new Sound(this.state.audioPath, '', (error) => {
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

	/**
	 * 开始录音
	 * @returns {Promise<void>}
	 */
	async record() {

		console.log('开始录制！');
		this.timer = setTimeout(() => {
			this.stop();
			console.warn('录制时长最大60s!')
		}, 5000);
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

	_finishRecording(didSucceed, filePath, fileSize) {
		this.setState({ finished: didSucceed });
		let record = {
			filePath : filePath,
			duration : this.state.currentTime
		}
		this.props.recordCallBack(record);
		console.log(`Finished recording of duration ${this.state.currentTime} seconds at path: ${filePath} and size of ${fileSize || 0} bytes`);
	}

	setModalVisible() {
		this.setState({ visibleModal: !this.state.visibleModal });
	}

	recordButtom(){
	    return(
            <TouchableNativeFeedback style={{
                width: 35,
                height: 35,}}
				onPress={()=> this.setModalVisible()}>
                <Image
                    style={{
                        width: 35,
                        height: 35
                    }}
                    source={require('../image/btn_yy.png')}/>
            </TouchableNativeFeedback>
        )
    }


	render(){
		return(
			<View style={{
				marginLeft: '1.5%',
				height: 40,
				flexDirection: 'row',
                backgroundColor: "#ffffff",
			}}>
                {this.props.readOnly ? null : this.recordButtom()}
				<TouchableNativeFeedback style={{left: 9}} onPress={() => {this.play()}}>
                    <View >
                        <Image
                            style={{left: 15,top: 7,position: 'absolute',width: 20, height: 20, zIndex: 1}}
                            source={require('../image/os.png')}/>
                        <Text
                            style={{left: 160,top: 7,position: 'absolute',zIndex: 1}}
                        >{this.state.currentTime}"</Text>
                        <Image
                            style={{width: 190, height: 35}}
                            source={require('../image/df1.png')}/>
                    </View>
				</TouchableNativeFeedback>

				<Modal
					style={{
						top: 170,
						alignItems: 'center',}}
					isVisible={this.state.visibleModal}
					swipeDirection="down"
					onBackdropPress={() => this.setModalVisible()}>
					<TouchableNativeFeedback
						onPressIn={() => {this.record()}}
						onPressOut={() => {this.stop()}}>
						<Image
							style={{
								width:'75%',
								resizeMode:'contain'
							}}
							source={require('../image/azsh.png')}/>
					</TouchableNativeFeedback>
				</Modal>

			</View>
		);
	}
}

export default SoundRecoding;
