import Sound from 'react-native-sound';

export default class VoicePlayer{

    constructor(){
        this.isPlaying=false;
        this.voicePath = '';
    }

    voice(path,callback){

        if(this.isPlaying){
            this.stop();
            if(this.voicePath === path){
                return;
            }
        }
        this.isPlaying=true;
        console.log(path)
        this.voicePath = path;
        setTimeout(() => {
            this.sound = new Sound(path, '', (error) => {
                if (error) {
                    console.log('failed to load the sound', error);
                }
            });

            setTimeout(() => {
                this.sound.play((success) => {
                    if (success) {
                        console.log('successfully finished playing');
                        callback();
                        this.isPlaying=false
                    } else {
                        console.log('playback failed due to audio decoding errors');
                    }
                });
            }, 100);
        }, 100);
    }


    stop(callback){
        this.sound.stop(
            ()=> {
                this.sound.release()
                this.isPlaying = false;
                if(callback){
                    callback();
                }
            }
        )
    }

}
