'use strict';
import React from 'react-native';

import axios from 'axios'
import {Toast} from "../component/Toast";
import AsyncStorage from "@react-native-community/async-storage";
// https://dev.jxing.com.cn/ http://10.144.4.2:9999/
export const HOST = 'https://dev.jxing.com.cn/';
export const XTenantKey = 'Uf2k7ooB77T16lMO4eEkRg==';
export const HospitalId = '1055390940066893827';

export const AuthToken     = 'api/auth/oauth/token';
export const GetUserInfo   = 'api/admin/user/login';
export const GetUserAddress  = 'api/basic/user/address/'

export const userOnWork = 'api/opcs/user/on_work/'; //员工打卡上班
export const userOffWork = 'api/opcs/user/off_work/'; //员工打卡下班
export const GetUserAtWork = 'api/opcs/user/at_work/'; //员工是否在岗
export const GetUserAtWorkByDeptId = 'api/opcs/user/at_work_dept/'; //根据部门查询员工是否在岗

export const GetRepairType = 'api/repair/repRepairType/list';//维修类型
export const GetRepairList = 'api/repair/service/list';//维修单列表
export const CancelPause   =  "api/repair/service/pause_recover/";//恢复
export const RepPause      =  "api/admin/sysCause/list/REP_PAUSE";//暂停原因
export const DoPause       =  "api/repair/service/pause";//暂停
export const RepTransfer   =  "api/admin/sysCause/list/REP_TRANSFERF";//转单原因
export const DoTransfer    =  "api/repair/service/transfer";//转单
export const DoOutsource   =  "api/repair/service/outsource";//转单 委外

export const listTagKeys   =  "api/admin/tag/listTagKeys/";  //通过分组类型获取标签
export const baseVendorList   =  "api/basic/baseVendor/list";  //通过分组类型获取标签


export const RepairDetail   =  "api/repair/service/detail/";//订单详情
export const GetDeptListByType   =  "api/basic/baseDept/getDeptListByType";//选择班组
export const GetUserListByDeptId   =  "api/basic/baseUser/getUserListByDeptId/";//选择人员
export const DispatchWork   =  "api/repair/dispatch/work";//执行派工
export const EvaluateCause   =  "api/repair/service/evaluate_cause/";//订单评价数据
export const RepairMatterList   =  "api/repair/repRepairType/getRepairMatterList";//维修类型

export const SaveRepairMatter   =  "api/repair/service/assistant/save";//提交维修

export const GetMaterialTypeTree   =  "api/warehouse/whseMaterialType/getMaterialTypeTree";//物料类型获取接口
export const QueryMaterialListByTypeId   =  "api/warehouse/whseMaterial/queryMaterialListByTypeId/";//  根据物料类型获取物料列表

export const SaveMaterial   =  "api/repair/service/material/save";//提交物料

export const RepairCommenced   =  "api/repair/service/commenced";//进入完工 开始任务
export const RepairCompleted   =  "api/repair/service/completed";//完工提交
export const ScanDetails  = "api/basic/baseEquipment/";//设备详情
export const ScanMsg = "api/basic/baseEquipment/scan/";//扫码获得设备信息
export const baseUser = 'api/basic/baseUser';//修改用户信息
export const Attr =  'api/basic/eqp/attr/';//设备属性

export const baseOptCert = 'api/basic/baseOptCert/';
// 获取我的关注
export const FollowList = 'api/opcs/follow/list/';
/**关注的 工单 科室 设备 用户 */ 
export const FollowWork = 'api/opcs/follow/work/';
export const FollowDept = 'api/opcs/follow/dept/';
export const FollowEqp = 'api/opcs/follow/eqp/';
export const FollowUser = 'api/opcs/follow/user/';
//查询科室 用户 
export const BaseDeptList =  'api/basic/baseDept/list';
export const BaseUserList =  'api/basic/baseUser/list';
//提交我的关注
export const addFollow =  'api/opcs/follow/post';
//https://dev.jxing.com.cn/api/auth/oauth/token?username=10001&password=BlvxyJFFYLcg7n2OB4G5uA%3D%3D&grant_type=password&scope=server
//'Content-Type': 'application/x-www-form-urlencoded'
//123456
export default class Request {



//  curl -X GET \
//  'https://dev.jxing.com.cn/api/auth/oauth/token?username=10001&password=BlvxyJFFYLcg7n2OB4G5uA%3D%3D&grant_type=password&scope=server' \
//  -H 'Authorization: Basic anhjbG91ZDpqeGNsb3Vk' \
//  -H 'cache-control: no-cache' \
//  -H 'x-tenant-key: Uf2k7ooB77T16lMO4eEkRg=='

static getUserToken(){
    AsyncStorage.getItem("logMsg", function (error, result) {
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
static requestGet(action, params, callback) {
	var url = HOST + action;
	var strParams = '';
	if (params) {
		url = url + '?';
		for (let [key, value] of params) {
	  		strParams = strParams + '&' + key + '=' + value;
		}

		url = url + strParams.substr(1, strParams.length) + '&grant_type=password&scope=server';
	}

    // let token = await global.storage.load({
    //     key:'token'
    // });
    var token = global.access_token;
    var headers = {
    			'Authorization': 'Basic anhjbG91ZDpqeGNsb3Vk',
    			'cache-control': 'no-cache',
				'Accept': 'application/json',
				'Content-Type':"application/json",
				'x-tenant-key': XTenantKey,
				'hospitalId'  : HospitalId,
			};
    if (token && token.length) {
        headers['Authorization'] = 'Bearer ' + token;
    }

    console.log('url: ' + url + ', headers: ' + JSON.stringify(headers));
	var fetchOptions = {
			method: 'GET',
			headers: headers,
     	};
    fetch(url, fetchOptions)
     .then((response) => response.json())
     .then((responseText) => {
     	// console.log('responseText: ' + JSON.stringify(responseText));
     	callback(responseText);
            if(responseText&&responseText.code===401){
                Request.getUserToken();
            }
     	//return JSON.parse(responseText);
     })
     .catch(error=>{
         console.log('error: ' + JSON.stringify(error));

         callback(JSON.stringify(error));
 	});//.done()
}
static requestGetWithKey(action, params, callback, key) {
	var url = HOST + action;
	var strParams = '';
	if (params) {
		url = url + '?';
		for (let [key, value] of params) {
	  		strParams = strParams + '&' + key + '=' + value;
		}

		url = url + strParams.substr(1, strParams.length) + '&grant_type=password&scope=server';
	}

    // let token = await global.storage.load({
    //     key:'token'
    // });
    var token = global.access_token;
    var headers = {
    			'Authorization': 'Basic anhjbG91ZDpqeGNsb3Vk',
    			'cache-control': 'no-cache',
				'Accept': 'application/json',
				'Content-Type':"application/json",
				'x-tenant-key': XTenantKey,
				'hospitalId'  : HospitalId,
			};
    if (token && token.length) {
        headers['Authorization'] = 'Bearer ' + token;
    }

    console.log('url: ' + url + ', headers: ' + JSON.stringify(headers));
	var fetchOptions = {
			method: 'GET',
			headers: headers,
     	};

    fetch(url, fetchOptions)
     .then((response) => response.json())
     .then((responseText) => {
     	// console.log('responseText: ' + JSON.stringify(responseText));
     	callback(responseText, key);
         if(responseText&&responseText.code===401){
             Request.getUserToken();
         }
     	//return JSON.parse(responseText);
     })
     .catch(error=>{
 		callback(JSON.stringify(error), key);
 	});//.done()
 }



static requestPost(action, params, callback) {
	var url = HOST+action;
    var token = global.access_token;
    var headers = {
                'Authorization': 'Basic anhjbG91ZDpqeGNsb3Vk',
                'cache-control': 'no-cache',
                'Accept': 'application/json',
                'Content-Type':"application/json",
                'x-tenant-key': XTenantKey,
                'hospitalId'  : HospitalId,
            };
    if (token && token.length) {
        headers['Authorization'] = 'Bearer ' + token;
    }

    console.log('url: ' + url + ', headers: ' + JSON.stringify(headers));
    console.log(params);
    var fetchOptions = {
            method: 'POST',
            headers: headers,
            body:JSON.stringify(params)
        };

     fetch(url, fetchOptions)
     .then((response) => response.json())
     .then((responseText) => {
        // console.log('responseText: ' + JSON.stringify(responseText));
     	callback(responseText);
         if(responseText&&responseText.code===401){
             Request.getUserToken();
         }
     })
     .catch(error=>{
 		callback(JSON.stringify(error));
 	});//.done();
 }

 static requestPut(action, params, callback) {
	var url = HOST+action;
    var token = global.access_token;
    var headers = {
                'Authorization': 'Basic anhjbG91ZDpqeGNsb3Vk',
                'cache-control': 'no-cache',
                'Accept': 'application/json',
                'Content-Type':"application/json",
                'x-tenant-key': XTenantKey,
                'hospitalId'  : HospitalId,
            };
    if (token && token.length) {
        headers['Authorization'] = 'Bearer ' + token;
    }

    console.log('url: ' + url + ', headers: ' + JSON.stringify(headers));
    console.log(params);
    var fetchOptions = {
            method: 'PUT',
            headers: headers,
            body:JSON.stringify(params)
        };
    fetch(url, fetchOptions)
    .then((response) => response.json())
    .then((responseText) => {
        // console.log('responseText: ' + JSON.stringify(responseText));
        callback(responseText);
        if(responseText&&responseText.code===401){
            Request.getUserToken();
        }
    })
    .catch(error=>{
        callback(JSON.stringify(error));
    });//.done();
 }

 static requestHttpEx(action, params, callback) {
 	fetch(HOST+action, {
 		method:'POST',
 		header:{
 			'Accept':"application/json",
 			'Content-Type':"application/json",
 			'x-tenant-key': XTenantKey,
 			'hospitalId'  : '',
 		},
 		body:JSON.stringify(data)
 	})
 	.then(response=>response.json())
 	.then(result=>{
 		callback(JSON.stringify(result));

 	})
 	.catch(error=>{
 		callback(JSON.stringify(error));
 	})
 }

static uploadFile(path, callback) {
    let formData = new FormData();
    var pos = path.lastIndexOf("/");
    let file = {type:'multipart/form-data', uri: path, name:path.substr(pos+1)};
    formData.append("file", file);
    var url = HOST+'api/opcs/oss/upload';
    var token = global.access_token;
    var headers = {
                'Authorization': 'Basic anhjbG91ZDpqeGNsb3Vk',
                'Content-Type':"multipart/form-data",
                'x-tenant-key': XTenantKey,
                'hospitalId'  : HospitalId,
            };
    if (token && token.length) {
        headers['Authorization'] = 'Bearer ' + token;
    }

    // console.log('url: ' + url + ', headers: ' + JSON.stringify(headers));
    var fetchOptions = {
            method: 'POST',
            headers: headers,
            body:formData
        };

    axios(url,{
        method:'POST',
        headers:headers,
        data:formData
    }).then((response)=>{
        callback(response)
    }).catch(
        error=>{
            callback(JSON.stringify(error))
        }
    )
 }

}

