import React, {Component} from 'react';
import {View, Text, Image, TouchableNativeFeedback, DeviceEventEmitter} from 'react-native';
import {getVoicePlayer}from './VoicePlayer'

class SoundRecoding extends Component {

    constructor(props){
        super(props);
        this.state={
            play : false,
            filepath : ''
        }

    }
    新建通知的监听
    componentDidMount() {

        this.eventListener = DeviceEventEmitter.addListener('Add_Voice', (voice) => {
            console.log(voice)
            this.setState({filepath : voice})
        });

    }

    play(){
        this.voicePlayer = new getVoicePlayer();
        if(this.state.play){
            this.voicePlayer.stop(
                ()=>{
                    console.log('停止成功')
                    this.setState({play: false});
                }
            );

        }else {
            this.setState({play: true});
            this.voicePlayer.voice(this.props.record.filePath, ()=>{
                console.log('播放完成')
                this.setState({play: false});
            });
        }
    }

	recordButtom(){
	    return(
            <TouchableNativeFeedback style={{
                width: 35,
                height: 35,}}
				onPress={()=> this.props.show()}>
                <Image
                    style={{
                        width: 35,
                        height: 35,
                        marginLeft: 4,
                    }}
                    source={require('../image/btn_yy.png')}/>
            </TouchableNativeFeedback>
        )
    }

    delete(){
        this.setState({filepath : ''})
        this.props.recordCallBack({})
    }
	render(){

        console.log(this.props.record.filePath)

		return(
			<View style={{
				marginLeft: '1.5%',
				height: 40,
                flexDirection: 'row',
                backgroundColor: "#ffffff",
                paddingLeft:8
			}}>
                {this.props.readOnly ? null : this.recordButtom()}


                {this.state.filepath==='' ? null :
                    <TouchableNativeFeedback style={{left: 1}} onPress={() => {this.play()}}>
                        <View style={{ marginLeft: '1.5%'}}>
                            <Image
                                style={{left: 15,top: 7,position: 'absolute',width: 20, height: 20, zIndex: 1}}
                                source={require('../image/os.png')}/>
                            <Text
                                style={{left: 160,top: 7,position: 'absolute',zIndex: 1}}
                            >{this.props.record.duration ? this.props.record.duration : 0}"</Text>
                            <Image
                                style={{width: 190, height: 35}}
                                source={require('../image/df1.png')}/>
                        </View>
                    </TouchableNativeFeedback>}
                {this.state.filepath==='' ? null :
                    <TouchableNativeFeedback style={{
                        marginLeft: 13, flexDirection: 'row',
                        justifyContent: 'center'
                    }} onPress={() => {this.delete()}}>
                        <Image
                            style={{
                                marginTop: '1.2%',
                                marginLeft: 13, flexDirection: 'row',
                                justifyContent: 'center',
                                width: 26, height: 26}}
                            source={require('../image/delete-voice.png')}/>
                    </TouchableNativeFeedback>}



			</View>
		);
	}
}

export default SoundRecoding;
