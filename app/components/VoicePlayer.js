import Sound from 'react-native-sound';

export default class VoicePlayer{

    constructor(){
        this.isPlaying=false;
        this.voicePath = '';
    }

    voice(path,callback){
        if(this.isPlaying){
            return '正在播放！'
        }
        this.isPlaying=true;
        // this.playing(path,callback);

        console.log(path)
        this.voicePath = path;
        this.playing(path,callback)
        // setTimeout(() => {
        //     this.sound = new Sound(path, '', (error) => {
        //         if (error) {
        //             console.log('failed to load the sound', error);
        //         }
        //     });
        //
        //     setTimeout(() => {
        //         this.sound.play((success) => {
        //             if (success) {
        //                 console.log('successfully finished playing');
        //                 callback();
        //                 this.isPlaying=false
        //             } else {
        //                 console.log('playback failed due to audio decoding errors');
        //             }
        //         });
        //     }, 100);
        // }, 100);
    }


    stop(callback){

        this.sound.stop(
            (success)=> {
                callback();
                console.log('stop');
                this.isPlaying = false;
            }
        )
    }
    /**
     * 播放录音
     * @returns {Promise<void>}
     */
    playing(path,callback) {
        console.log(path)
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
}
