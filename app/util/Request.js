'use strict';
import React, {Alert} from 'react-native';
import axios from "axios";


export const HOST = 'https://dev.jxing.com.cn/';
export const XTenantKey = 'Uf2k7ooB77T16lMO4eEkRg==';
export const HospitalId = '1055390940066893827';

export const AuthToken     = 'api/auth/oauth/token';
export const GetUserInfo   = 'api/admin/user/login';

export const GetRepairType = 'api/repair/repRepairType/list';//维修类型
export const GetRepairList = 'api/repair/service/list';//维修单列表
export const CancelPause   =  "api/repair/service/pause_recover/";//恢复
export const RepPause      =  "api/admin/sysCause/list/REP_PAUSE";//暂停原因
export const DoPause       =  "api/repair/service/pause";//暂停
export const RepTransfer   =  "api/admin/sysCause/list/REP_TRANSFERF";//转单原因
export const DoTransfer    =  "api/repair/service/transfer";//转单

export const RepairDetail   =  "api/repair/service/detail/";//订单详情
export const GetDeptListByType   =  "api/basic/baseDept/getDeptListByType";//选择班组
export const GetUserListByDeptId   =  "api/basic/baseUser/getUserListByDeptId/";//选择人员
export const DispatchWork   =  "api/repair/dispatch/work";//执行派工
export const EvaluateCause   =  "api/repair/service/evaluate_cause/";//订单评价数据
export const RepairMatterList   =  "api/repair/repRepairType/getRepairMatterList";//维修类型

export const SaveRepairMatter   =  "api/repair/service/assistant/save";//提交维修

export const GetMaterialTypeTree   =  "api/warehouse/whseMaterialType/getMaterialTypeTree";//物料类型获取接口
export const QueryMaterialListByTypeId   =  "api/warehouse/whseMaterial/queryMaterialListByTypeId/";//  根据物料类型获取物料列表

export const SaveMaterial   =  "api/repair/service/material/save";//

export const RepairCommenced   =  "api/repair/service/commenced";//进入完工
export const RepairCompleted   =  "api/repair/service/completed";//完工提交

axios.interceptors.request.use(

    function(config) {
        // const apiToken = global.userToken;
        const apiToken = global.access_token;
        // 添加响应头等等设置
        let headers = {
            'hospitalId': global.hospitalId,
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

export default class Request {

    static requestGet(action, params, callback) {
        let url = HOST + action;
        let strParams = '';
        if (params) {
            url = url + '?';
            for (let [key, value] of params) {
                strParams = strParams + '&' + key + '=' + value;
            }
            url = url + strParams.substr(1, strParams.length) + '&grant_type=password&scope=server';
        }
        axios({
            method: 'GET',
            url : url,
            headers,
        }).then( (response) => {
            callback(response);
            }
        ).catch(
            error=>{
                callback(JSON.stringify(error));
            }
        )
    }
    static requestGetWithKey(action, params, callback, key) {
        let url = HOST + action;
        let strParams = '';
        if (params) {
            url = url + '?';
            for (let [key, value] of params) {
                strParams = strParams + '&' + key + '=' + value;
            }

            url = url + strParams.substr(1, strParams.length) + '&grant_type=password&scope=server';
        }

        axios({
            method: 'GET',
            url : url,
            headers,
        }).then( (response) => {
                callback(response, key);
            }
        ).catch(
            error=>{
                callback(JSON.stringify(error),key);
            }
        )
    }


    static requestPost(action, params, callback) {
        let url = HOST+action;
        return axios({
            method: 'POST',
            url : url,
            data,
            headers,
        }).then( (response) => {
                callback(response);
            }
        ).catch(
            error=>{
                callback(JSON.stringify(error));
            }
        )
    }


    static uploadFile(filePath, callback) {
        let formData = new FormData();
        let pos = filePath.lastIndexOf("/");
        let file = {type:'multipart/form-data', uri: filePath, name:filePath.substr(pos+1)};
        formData.append("file", file);
        let url = HOST+'api/opcs/oss/upload';
        axios(url,{
            method:'POST',
            data:formData,
        }).then( (response) => {
                callback(response);
            }
        ).catch(
            error=>{
                callback(JSON.stringify(error));
            }
        )

    }

}

