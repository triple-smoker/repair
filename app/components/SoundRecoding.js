import React, {Component} from 'react';
import {View, Text, Image, TouchableNativeFeedback, DeviceEventEmitter,TouchableOpacity} from 'react-native';
import {getVoicePlayer}from './VoicePlayer'

class SoundRecoding extends Component {

    constructor(props){
        super(props);
        this.state={
            play : false,
            filepath : this.props.record.filePath
        }
    }
    // 新建通知的监听
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
                width: 30,
                height: 30,}}
				onPress={()=> this.props.show()}>
                <Image
                    style={{
                        width: 30,
                        height: 30,
                        marginLeft: 0,
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
                marginRight: '1.5%',
                alignItems:"center",
                paddingLeft:8
			}}>
                <View style={{flexDirection:"row",justifyContent:"flex-start",flex:1,alignItems:"center"}}>
                {this.props.readOnly ? null : this.recordButtom()}


                {this.state.filepath==='' ? null :
                    <TouchableNativeFeedback style={{left: 1}} onPress={() => {this.play()}}>
                        <View style={{ marginLeft: '1.5%'}}>
                            <VoiceImage play = {this.state.play}/>
                            <Text
                                style={{left: 160,top: 7,position: 'absolute',zIndex: 1}}
                            >{this.props.record.duration ? this.props.record.duration : 0}"</Text>
                            <Image
                                style={{width: 190, height: 35}}
                                source={require('../image/df1.png')}/>
                        </View>
                    </TouchableNativeFeedback>}
                {this.props.readOnly || this.state.filepath===''  ? null :
                    <TouchableNativeFeedback style={{
                        marginLeft: 5, flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems:"center",
                        flex:1,
                    }} onPress={() => {this.delete()}}>
                        <Image
                            style={{
                                marginTop: '1.2%',
                                marginLeft: 5, flexDirection: 'row',
                                justifyContent: 'center',
                                width: 13, height: 13}}
                            source={require('../image/delete-voice.png')}/>
                    </TouchableNativeFeedback>}
                </View>
			</View>
		);
	}
}

class VoiceImage extends Component {

    constructor(props){
        super(props);

        if(this.props.play){
            this.state={
                show2: true,
                show3: true
            }
        }else{
            this.state={
                show2: false,
                show3: false
            }
        }



    }

    se(){

        if(this.timer){
            return;
        }

        this.timer = setInterval(
            ()=>{
                if(this.state.show2){
                    if(this.state.show3){
                        this.setState({
                            show2: false,
                            show3: false
                        });
                        return;
                    }else {
                        this.setState({
                            show3: true
                        });
                        return;
                    }
                }else {
                    this.setState({
                        show2: true
                    });
                    return;
                }
            }, 500
        )
    }

    render(){

        if(this.props.play){
            this.se();
            return (
                <View>
                    <Image style={{left: 6,top: 13,position: 'absolute',width: 10, height: 10, zIndex: 1,}}
                           source={require('../image/voice-1.png')}/>
                    {!this.state.show2 ? null  : <Image style={{left: 13,top: 8,position: 'absolute',width: 10, height: 20, zIndex: 1,}}
                                                       source={require('../image/voice-2.png')}/>}
                    {!this.state.show3 ? null  : <Image style={{left: 20,top: 3,position: 'absolute',width: 10, height: 30, zIndex: 1,}}
                           source={require('../image/voice-3.png')}/> }
                </View>
            );
        }else {
            return(
                <View>
                    <Image style={{left: 6,top: 14,position: 'absolute',width: 8, height: 8, zIndex: 1,}}
                           source={require('../image/voice-1.png')}/>
                    <Image style={{left: 13,top: 9,position: 'absolute',width: 8, height: 16, zIndex: 1,}}
                                                        source={require('../image/voice-2.png')}/>
                    <Image style={{left: 20,top: 4,position: 'absolute',width: 8, height: 26, zIndex: 1,}}
                                                        source={require('../image/voice-3.png')}/>
                </View>
            )
        }

    }

}

export default SoundRecoding;
