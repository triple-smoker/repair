import axios from 'axios'
import { Alert } from 'react-native'
//请求拦截器

axios.interceptors.request.use(

    function(config) {
        // const apiToken = global.userToken;
        const apiToken = global.access_token;
        // 添加响应头等等设置
        let headers = {
            'hospitalId': '1055390940066893827',
            'x-tenant-key':'Uf2k7ooB77T16lMO4eEkRg==',
            'Authorization': `Bearer ${apiToken}`,
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
    })
}

const getUrl = 'http://47.102.197.221:8188';
function GetAxios(url = '', data = defaultData, ) {

    return axios({
        method: 'GET',
        url : getUrl + url,
        data,

    })
}

function GetAxiosSQLite(sqLiteTimeTemp, data = defaultData, ) {
console.log(">>>>>>");
console.log('http://10.144.4.44:8080/portal/synchronism?time='+sqLiteTimeTemp);
    return axios({
        method: 'GET',
        url : 'http://10.144.4.44:8080/portal/synchronism?time='+sqLiteTimeTemp,
        data,

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
        })
    }

export default {
    PostAxios,
    GetAxios,
    GetAxiosSQLite,
    UpLoad
}
