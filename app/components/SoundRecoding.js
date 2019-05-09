import React, {Component} from 'react';
import {View,Text, Image,TouchableHighlight} from 'react-native';
import Sound from "react-native-sound";

class SoundRecoding extends Component {


    /**
     * 播放录音
     * @returns {Promise<void>}
     */
    async _play() {

        console.log('00000000000')

        // These timeouts are a hacky workaround for some issues with react-native-sound.
        // See https://github.com/zmxv/react-native-sound/issues/89.
        setTimeout(() => {
            var sound = new Sound(this.props.record.filePath, '', (error) => {
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

	recordButtom(){
	    return(
            <TouchableHighlight style={{
                width: 35,
                height: 35,}}
				onPress={()=> this.props.show()}>
                <Image
                    style={{
                        width: 35,
                        height: 35
                    }}
                    source={require('../image/btn_yy.png')}/>
            </TouchableHighlight>
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
				<TouchableHighlight style={{left: 9}} onPress={() => {this._play()}}>
                    <View >
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
				</TouchableHighlight>
			</View>
		);
	}
}

export default SoundRecoding;
