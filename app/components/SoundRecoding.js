import React, {Component} from 'react';
import {View,Text, Image, Platform, TouchableNativeFeedback,StyleSheet} from 'react-native';
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
		visibleModal: false,
		active : false,
		showImage: true,
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
					style={{alignItems: 'center',}}
					isVisible={this.state.visibleModal}
					swipeDirection="down"
					onBackdropPress={() => this.setModalVisible()}>

					<View style={{flex: 1,flexDirection: 'row',alignItems: 'center',justifyContent: 'center',}}>

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

					<TouchableNativeFeedback
						onPressIn={() => {this.record(), this.setState({active : true})}}
						onPressOut={() => {this.stop(), this.setState({active : false}),this.setModalVisible()}}>
						{this.activeImage()}

					</TouchableNativeFeedback>
					<Text style={styles.write}>最大录制时长一分钟</Text>
				</Modal>

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
export default SoundRecoding;
