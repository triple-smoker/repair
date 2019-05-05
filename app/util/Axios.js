import axios from 'axios'
import { Alert } from 'react-native'
//请求拦截器
axios.interceptors.request.use(

    function(config) {
        const apiToken = '6c7cf948-bdf9-4bde-8fea-f1256183f388';
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
            Alert.alert('温馨提示', retMsg)
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

const defaultData = {};
const postUrl = 'https://dev.jxing.com.cn';
function PostAxios(url = '', data = defaultData, headers = {}) {
    return axios({
        method: 'POST',
        url : postUrl + url,
        data,
        headers
    })
}

const getUrl = 'http://47.102.197.221:8188';
function GetAxios(url = '', data = defaultData, headers = {}) {
    return axios({
        method: 'GET',
        url : getUrl + url,
        data,
        headers,
    })
}

function UpLoad(path){
    // 创建一个formData（虚拟表单）
    const formData = new FormData();
    const file = {type: 'multipart/form-data', uri: path};
    formData.append('file', file);
    axios(
        {method : 'post'},
        {url : 'https://dev.jxing.com.cn/api/opcs/oss/upload'},
        {data: formData},
        {headers : {
            'content-type' : 'multipart/form-data',
            }
        }
    );


};

export default {
    PostAxios,
    GetAxios,
    UpLoad
}
