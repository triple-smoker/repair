import React, { Component } from 'react';
import {
    Text,
    View,
    Button
} from 'react-native';
import SQLite from './SQLite';
import {CheckSqLite,SelectFirstCheck} from './CheckSqLite';
import Axios from '../../util/Axios';
import AsyncStorage from '@react-native-community/async-storage';



// var sqLite = new SQLite();
// var checkSqLite = new CheckSqLite();
var db;
const tabs = [
    "inspect_job",
    "equipment_ref_item",
    "inspect_equipment_type_conf",
    "inspect_item_conf",
    "inspect_job_manager",
    "job_exec_time",
    "man_ref_item",
    "t_base_equipment_type",
    "t_base_equipment",
    "daily_report",
    "daily_task",
    "r_building_floor",
    "r_floor_room",
    "t_base_building",
    "t_base_place",
    "t_base_room",
    "t_base_floor",
    "t_base_equipment",
    "t_base_equipment",
    "t_base_equipment",
]
export default class SQLiteDemo extends Component{
    constructor(props) {
        super(props);
        this.state = {
            ID : '',
            JOB_NAME : '',
            JOB_CODE : '',
            PARENT_MAN_ID : '',
            JOB_EXEC_TEAM_ID : '',
            JOB_KIND : '',
            JOB_TIME_RATE : '',
            VER_NBR : '',
            ACTION_TYPE : '',
            STATUS_CD : '',
            STATUS_DATE : '',
            CREATE_STAFF : '',
            CREATE_DATE : '',
            UPDATE_DATE : '',
            UPDATE_STAFF : '',
        };
    }

    // componentDidMount(){
    //     //关闭数据库
    //     sqLite.close();
    // }
    componentWillMount(){
        var sqLiteTimeTemp = "0"
        //开启数据库
        if(!db){
            db = SQLite.open();
        }
        //建表
        // sqLite.createTable();
        AsyncStorage.getItem('sqLiteTimeTemp',function (error, result) {

                if (error) {
                    // alert('读取失败')
                }else {
                    var sqlTime = JSON.parse(result);
                    if(sqlTime != null && sqlTime != ""){
                        sqLiteTimeTemp = sqlTime;
                    }
                    console.log(">>>>>>>>>>>>")
                    console.log(sqLiteTimeTemp)
                    //数据同步接口条用
                    // var url = "/api/generaloperation/portal/batchSynchronization/ModulesName?time="+sqLiteTimeTemp+"&modulesName=xunjian";
                    Axios.GetAxiosSQLite(sqLiteTimeTemp).then(
                        (response)=>{
                            // console.log("++++++++");
                            // console.log(response);
                            if(Array.isArray(response.data)&&response.data.length>1){
                                let key = 'sqLiteTimeTemp';
                                //json转成字符串
                                let jsonStr = JSON.stringify(response.data[0]);
                                //存储
                                AsyncStorage.setItem(key, jsonStr, function (error) {

                                    if (error) {
                                        console.log('存储失败')
                                    }else {
                                        console.log('存储完成')
                                    }
                                })
                                var dates = response.data[1];
                                // console.log("++"+response.data[1]);
                                for(var tableName in dates){
                                    //删除数据
                                    // sqLite.dropTable(tableName);
                                    if(dates[tableName]!=null&&dates[tableName].length>0){

                                        // console.log("=="+dataJson);
                                        SQLite.insertData(dates[tableName],tableName);
                                        // console.log(dates[tableName]);
                                    }

                                }

                            }
                            console.log("++"+JSON.stringify(response));

                        }
                    );
                    alert('读取完成')
                }
            }.bind(this)
        )








    }


    dropTable(){
        tabs.forEach((tabName)=>{
            SQLite.dropTable(tabName);
        })
        //存储
        AsyncStorage.setItem("sqLiteTimeTemp", "", function (error) {

            if (error) {
                console.log('存储失败')
            }else {
                console.log('存储完成')
            }
        })
        // sqLite.dropTable("inspect_job");
        // sqLite.dropTable("equipment_ref_item");
        // sqLite.dropTable("inspect_equipment_type_conf");
        // sqLite.dropTable("inspect_item_conf");
        // sqLite.dropTable("inspect_job_manager");
        // sqLite.dropTable("job_exec_time");
        // sqLite.dropTable("man_ref_item");
        // sqLite.dropTable("t_base_equipment_type");
        // sqLite.dropTable("t_base_equipment");
        // sqLite.dropTable("daily_report");
        // sqLite.dropTable("daily_task");
        // sqLite.dropTable("r_building_floor");
        // sqLite.dropTable("r_floor_room");
        // sqLite.dropTable("t_base_building");
        // sqLite.dropTable("t_base_place");
        // sqLite.dropTable("t_base_room");
        // sqLite.dropTable("t_base_floor");
        // sqLite.dropTable("t_base_equipment");
        // sqLite.dropTable("t_base_equipment");
        // sqLite.dropTable("t_base_equipment");
        console.log("//////")
    };
    getTable(tableName){
        //查询
        db.transaction((tx)=>{
            tx.executeSql("select * from "+tableName, [],(tx,results)=>{
                var len = results.rows.length;
                for(let i=0; i<len; i++){
                    var user = results.rows.item(i);
                    console.log("<<<<<<<<<<<<<<<"+tableName);
                    console.log(user);
                }
            });
        },(error)=>{
            console.log(error);
        });
    }
    selectFirstCheck(){
        // var a = SelectFirstCheck;
        // console.log("++"+a);
        //查询
        db.transaction((tx)=>{
            // var a = CheckSqLite.selectFirstCheck;
            console.log("++++++++++");
            var sql ="select b.ITEM_NAME,b.ITEM_FORMAT,b.ITEM_RESULT_SET " +
                "from inspect_item_conf b, man_ref_item mri where mri.STATUS_CD=1 and " +
                "b.STATUS_CD=1 and mri.ITEM_CODE=b.ITEM_CODE and " +
                "mri.MAN_CODE=201906261561538593183";
            tx.executeSql(sql, [],(tx,results)=>{
                var len = results.rows.length;
                console.log(len)
                for(let i=0; i<len; i++){
                    var user = results.rows.item(i);
                    // console.log("<<<<<<<<<<<<<<<"+tableName);
                    console.log(user);
                }
            });
        },(error)=>{
            console.log(error);
        });
    }


    render(){
        return (
            <View>
                <Button style={{width:50,height:30,backgroundColor:"#000"}} title="selectFirstCheck" onPress={()=>this.selectFirstCheck()}/>
                <Button style={{width:50,height:30,backgroundColor:"#000"}} title="删表" onPress={()=>this.dropTable()}/>
                {/*<Button style={{width:50,height:30,backgroundColor:"#000"}} title="查inspect_job" onPress={()=>this.getTable("inspect_job")}/>*/}
                {/*<Button style={{width:50,height:30,backgroundColor:"#000"}} title="查equipment_ref_item" onPress={()=>this.getTable("equipment_ref_item")}/>*/}
                {/*<Button style={{width:50,height:30,backgroundColor:"#000"}} title="查inspect_equipment_type_conf" onPress={()=>this.getTable("inspect_equipment_type_conf")}/>*/}
                <Button style={{width:50,height:30,backgroundColor:"#000"}} title="查inspect_item_conf" onPress={()=>this.getTable("inspect_item_conf")}/>
                <Button style={{width:50,height:30,backgroundColor:"#000"}} title="查inspect_job_manager" onPress={()=>this.getTable("inspect_job_manager")}/>
                {/*<Button style={{width:50,height:30,backgroundColor:"#000"}} title="查job_exec_time" onPress={()=>this.getTable("job_exec_time")}/>*/}
                <Button style={{width:50,height:30,backgroundColor:"#000"}} title="查man_ref_item" onPress={()=>this.getTable("man_ref_item")}/>
                {/*<Button style={{width:50,height:30,backgroundColor:"#000"}} title="查t_base_equipment_typeb" onPress={()=>this.getTable("t_base_equipment_type")}/>*/}
                {/*<Button style={{width:50,height:30,backgroundColor:"#000"}} title="查t_base_equipment" onPress={()=>this.getTable("t_base_equipment")}/>*/}
                {/*<Button style={{width:50,height:30,backgroundColor:"#000"}} title="查daily_report" onPress={()=>this.getTable("daily_report")}/>*/}
                <Button style={{width:50,height:30,backgroundColor:"#000"}} title="查daily_task" onPress={()=>this.getTable("daily_task")}/>
                {/*<Button style={{width:50,height:30,backgroundColor:"#000"}} title="查r_building_floor" onPress={()=>this.getTable("r_building_floor")}/>*/}
                {/*<Button style={{width:50,height:30,backgroundColor:"#000"}} title="查r_floor_room" onPress={()=>this.getTable("r_floor_room")}/>*/}
                {/*<Button style={{width:50,height:30,backgroundColor:"#000"}} title="查t_base_building" onPress={()=>this.getTable("t_base_building")}/>*/}
                {/*<Button style={{width:50,height:30,backgroundColor:"#000"}} title="查t_base_place" onPress={()=>this.getTable("t_base_place")}/>*/}
                {/*<Button style={{width:50,height:30,backgroundColor:"#000"}} title="查t_base_room" onPress={()=>this.getTable("t_base_room")}/>*/}
                {/*<Button style={{width:50,height:30,backgroundColor:"#000"}} title="查t_base_room" onPress={()=>this.getTable("t_base_room")}/>*/}

                <Text>
                    {this.state.ID}
                </Text>
                <Text>
                    {this.state.JOB_NAME}
                </Text>
                <Text>
                    {this.state.JOB_CODE}
                </Text>
                <Text>
                    {this.state.PARENT_MAN_ID}
                </Text>
                <Text>
                    {this.state.JOB_EXEC_TEAM_ID}
                </Text>
                <Text>
                    {this.state.JOB_KIND}
                </Text>
                <Text>
                    {this.state.JOB_TIME_RATE}
                </Text>
                <Text>
                    {this.state.VER_NBR}
                </Text>
                <Text>
                    {this.state.ACTION_TYPE}
                </Text>
                <Text>
                    {this.state.STATUS_CD}
                </Text>
                <Text>
                    {this.state.STATUS_DATE}
                </Text>
                <Text>
                    {this.state.CREATE_STAFF}
                </Text>
                <Text>
                    {this.state.CREATE_DATE}
                </Text>
                <Text>
                    {this.state.UPDATE_DATE}
                </Text>
                <Text>
                    {this.state.UPDATE_STAFF}
                </Text>

            </View>
        );
    }
}
