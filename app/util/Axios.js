import axios from 'axios'
import { Alert } from 'react-native'
import AsyncStorage from "@react-native-community/async-storage";
import Request, {AuthToken} from "../js/http/Request";
//请求拦截器

axios.interceptors.request.use(

    function(config) {
        // const apiToken = global.userToken;
        const apiToken = global.access_token;
        console.log(apiToken);
        // 添加响应头等等设置
        let headers = {
            'hospitalId': '1055390940066893827',
            'x-tenant-key':'Uf2k7ooB77T16lMO4eEkRg==',
            'Authorization': `Bearer ${apiToken}`,
            // 'Authorization': `Bearer 89db0128-fd66-47d5-be0a-b327a339bae8`,
        };
        if (config.headers) {
            config.headers = {
                ...headers,
                ...config.headers
            }
        }
        return config
    },
    function(error) {
        return Promise.reject(error) // 请求出错
    }
)


//返回拦截器
axios.interceptors.response.use(
    function(response) {
        if (response.status != 200) {
            let { retMsg } = response.data.data
            // 服务端出现了一些问题的情况下
            Alert.alert('错误', '请求出错，请联系客服！')
            // 等等按钮事件
            return Promise.reject(retMsg)
        } else {
            // 服务端一切正常 返回data数据
            return response.data
        }
    },
    function(error) {
        return Promise.reject(error)
    }
)
// const apiToken = '24cea760-7884-433f-877d-b3778dab4209';
const defaultData = {};
const postUrl = 'https://dev.jxing.com.cn';
function PostAxios(url = '', data = defaultData,headers={} ) {
    return axios({
        method: 'POST',
        url : postUrl + url,
        data,
        headers,
    }).catch(function (error) {
        if(error.toString().search("401")!=-1){
            getUserToken();
        };
    })
}

const getUrl = 'https://dev.jxing.com.cn';
function GetAxios(url = '', data = defaultData, ) {
    return axios({
        method: 'GET',
        url : getUrl + url,
        data,

    }).catch(function (error) {
        if(error.toString().search("401")!=-1){
            getUserToken();
        };
    })
}

function GetAxiosSQLite(sqLiteTimeTemp, data = defaultData, ) {
console.log(">>>>>>");
console.log('http://47.102.197.221:4008/portal/batchSynchronization/ModulesName?time='+sqLiteTimeTemp+"&modulesName=xunjian");
    return axios({
        method: 'GET',
        url : 'http://47.102.197.221:4008/portal/batchSynchronization/ModulesName?time='+sqLiteTimeTemp+"&modulesName=xunjian",
        data,

    })
}
function PostAxiosUpPorter(url = '' , data = defaultData, ) {
    return axios({
        method: 'POST',
        url : url,
        data,
    })
}
function GetAxiosUpPorter(url = '') {
    return axios({
        method: 'POST',
        url : url,
    })
}


function UpLoad(path) {
    let formData = new FormData();
    let file = {type: 'multipart/form-data', uri: path, name: 'image.png'};
    formData.append("file",file);
    const url = 'https://dev.jxing.com.cn/api/opcs/oss/upload'
    axios(url,{
        method:'POST',
        data:formData,
        }).catch(function (error) {
        if(error.toString().search("401")!=-1){
            getUserToken();
        };
    })
    }

function getUserToken(){
    AsyncStorage.getItem("logInfo", function (error, result) {
        // console.log('uinfo: result = ' + result + ', error = ' + error);
        if (error) {
            console.log('读取失败')
        } else {
            if (result) {
                var logInfo = JSON.parse(result);
                var params = new Map();
                params.set('username', logInfo.username);
                params.set('password', logInfo.password);
                global.access_token = null;
                AsyncStorage.setItem('token', '', function (error) {
                    if (error) {
                        console.log('error: save error');
                    }
                });
                Request.requestGet(AuthToken, params, (result)=> {
                    if (result && result.access_token) {
                        global.access_token = result.access_token;
                        AsyncStorage.setItem('token', result.access_token, function (error) {
                            if (error) {
                                console.log('error: save error');
                            } else {
                                console.log('save: access_token = ' + result.access_token);
                            }
                        });
                    }
                });


            }

        }
    })

}

export default {
    PostAxios,
    GetAxios,
    GetAxiosSQLite,
    PostAxiosUpPorter,
    GetAxiosUpPorter,
    UpLoad
}
