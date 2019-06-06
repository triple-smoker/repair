import RNFetchBlob from 'rn-fetch-blob';

let dirs = RNFetchBlob.fs.dirs;
const defaultPath = dirs.DownloadDir + "/com.firstandroid/video/files/"

function fileVideoCache(uri,fileName, path = defaultPath){
    return RNFetchBlob.config({
        fileCache : true,
        // appendExt : 'mp4',
        // mime:'mp4',
        notification: true,
        path: path + fileName
    })
    .fetch('GET', uri)
}

function clearCache(){
    RNFetchBlob.fs.unlink(defaultPath).then(() => {

    });
}


export default {
    fileVideoCache,
    clearCache
}
