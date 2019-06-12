import React, {Component} from 'react';
import {View,Text, Image,TouchableNativeFeedback} from 'react-native';
import VoicePlayer from './VoicePlayer'

class SoundRecoding extends Component {

    constructor(props){
        super(props);
        this.state={
            play : false
        }

    }
    //新建通知的监听
    componentDidMount() {
        this.voicePlayer = new VoicePlayer();
    }

    play(){
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
        this.props.recordCallBack({})
    }
	render(){
		return(
			<View style={{
				marginLeft: '1.5%',
				height: 40,
                flexDirection: 'row',
                backgroundColor: "#ffffff",
                paddingLeft:3
			}}>
                {this.props.readOnly ? null : this.recordButtom()}
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
				</TouchableNativeFeedback>
                <TouchableNativeFeedback style={{left: 1,justifyContent: 'center',flexDirection:'column'}} onPress={() => {this.delete()}}>
                        <Image
                            style={{justifyContent: 'center',flexDirection:'column',width: 26, height: 26}}
                            source={require('../image/delete-voice.png')}/>
                </TouchableNativeFeedback>
			</View>
		);
	}
}

export default SoundRecoding;
