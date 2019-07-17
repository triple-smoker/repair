import Sound from 'react-native-sound';

let voicePlayer;
export function getVoicePlayer(){

    if(!voicePlayer){
        voicePlayer = new VoicePlayer()
    }
    console.log(voicePlayer);
    return voicePlayer;
}

export class VoicePlayer{

    constructor(){
        this.isPlaying=false;
        this.voicePath = '';
    }

    voice(path,callback){

        if(this.isPlaying){
            this.stop();
            if(this.voicePath === path){
                this.isPlaying=false;
                return;
            }
        }
        this.isPlaying=true;
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
                        callback(true);
                        this.isPlaying=false
                    } else {
                        callback(false);
                        console.log('playback failed due to audio decoding errors');
                    }
                });
            }, 1500);
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
