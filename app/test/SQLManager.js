import React, { Component } from 'react';



class SQLManager extends Component {
    //创建表sql（inspect_job）
    createInspectJob(){
        var createInspectJobSql  =  'CREATE TABLE IF NOT EXISTS inspect_job(' +
            'ID varchar(255) PRIMARY KEY,'+
            'JOB_NAME varchar(255) DEFAULT NULL ,'+
            'JOB_CODE varchar(255) DEFAULT NULL ,'+
            'PARENT_MAN_ID varchar(64) DEFAULT NULL ,'+
            'JOB_EXEC_TEAM_ID varchar(255) DEFAULT NULL ,'+
            'JOB_KIND varchar(255) DEFAULT NULL ,'+
            'JOB_TIME_RATE varchar(255) DEFAULT NULL ,'+
            'VER_NBR varchar(255) DEFAULT NULL ,'+
            'ACTION_TYPE varchar(255) DEFAULT NULL ,'+
            'STATUS_CD tinyint(1) DEFAULT NULL ,'+
            'STATUS_DATE datetime DEFAULT CURRENT_TIMESTAMP ,'+
            'CREATE_STAFF bigint(20) DEFAULT NULL ,'+
            'CREATE_DATE datetime DEFAULT CURRENT_TIMESTAMP ,'+
            'UPDATE_DATE datetime DEFAULT NULL ,'+
            'UPDATE_STAFF bigint(20) DEFAULT NULL) ';
        return createInspectJobSql;
    }
    //创建表sql（equipment_ref_item）
    createEquipmentRefItem(){
        var createEquipmentRefItemSql  =  'CREATE TABLE IF NOT EXISTS equipment_ref_item(' +
            'ID varchar(255) PRIMARY KEY,'+
            'EQUIPMENT_OBJ_CODE varchar(255) DEFAULT NULL ,'+
            'ITEM_CODE varchar(255) DEFAULT NULL ,'+
            'ORD_LEVEL int(11) DEFAULT NULL ,'+
            'TABLE_TYPE tinyint(1) DEFAULT NULL ,'+
            'VER_NBR varchar(255) DEFAULT NULL ,'+
            'ACTION_TYPE varchar(255) DEFAULT NULL ,'+
            'STATUS_CD tinyint(1) DEFAULT NULL ,'+
            'STATUS_DATE datetime DEFAULT CURRENT_TIMESTAMP ,'+
            'CREATE_STAFF bigint(20) DEFAULT NULL ,'+
            'CREATE_DATE datetime DEFAULT CURRENT_TIMESTAMP ,'+
            'UPDATE_STAFF bigint(20) DEFAULT NULL ,'+
            'UPDATE_DATE datetime DEFAULT CURRENT_TIMESTAMP )';
        return createEquipmentRefItemSql;
    }
    //创建表sql（inspect_equipment_type_conf）
    createInspectEquipmentTypeConf(){
        var createInspectEquipmentTypeConfSql  =  'CREATE TABLE IF NOT EXISTS inspect_equipment_type_conf(' +
            'ID varchar(255) PRIMARY KEY,'+
            'OBJ_CODE varchar(255) DEFAULT NULL ,'+
            'EQUIPMENT_OBJ_ID varchar(255) DEFAULT NULL ,'+
            'ACTION_TYPE varchar(255) DEFAULT NULL ,'+
            'VER_NBR varchar(255) DEFAULT NULL ,'+
            'STATUS_CD tinyint(1) DEFAULT NULL ,'+
            'STATUS_DATE datetime DEFAULT CURRENT_TIMESTAMP ,'+
            'CREATE_STAFF bigint(20) DEFAULT NULL ,'+
            'CREATE_DATE datetime DEFAULT CURRENT_TIMESTAMP ,'+
            'UPDATE_STAFF bigint(20) DEFAULT NULL ,'+
            'UPDATE_DATE datetime DEFAULT CURRENT_TIMESTAMP )';
        return createInspectEquipmentTypeConfSql;
    }
    //创建表sql（inspect_item_conf）
    createInspectItemConf(){
        var createInspectItemConfSql  =  'CREATE TABLE IF NOT EXISTS inspect_item_conf(' +
            'ID varchar(255) PRIMARY KEY, ' +
            'ITEM_CODE  varchar(255) DEFAULT NULL, ' +
            'ITEM_NAME  varchar(255) DEFAULT NULL, ' +
            'ITEM_FORMAT  text, ' +
            'ITEM_RESULT_SET  text, ' +
            'ITEM_LEVEL  tinyint(1) DEFAULT 0, ' +
            'VER_NBR  varchar(255) DEFAULT NULL, ' +
            'ACTION_TYPE  varchar(255) DEFAULT NULL, ' +
            'STATUS_CD  tinyint(1) DEFAULT 1, ' +
            'STATUS_DATE  datetime DEFAULT CURRENT_TIMESTAMP,' +
            'CREATE_STAFF  bigint(20) DEFAULT NULL, ' +
            'CREATE_DATE  datetime DEFAULT CURRENT_TIMESTAMP, ' +
            'UPDATE_STAFF  bigint(20) DEFAULT NULL , ' +
            'UPDATE_DATE  datetime DEFAULT CURRENT_TIMESTAMP )';
        return createInspectItemConfSql;
    }
    //创建表sql（inspect_job_manager）
    createInspectJobManager(){
        var createInspectJobManagerSql  =  'CREATE TABLE IF NOT EXISTS inspect_job_manager(' +
            'ID varchar(255) PRIMARY KEY, ' +
            'MAN_CODE varchar(255) DEFAULT NULL ,'+
            'JOB_CODE varchar(255) DEFAULT NULL ,'+
            'OBJ_TYPE tinyint(1) DEFAULT NULL ,'+
            'OBJ_ID varchar(255) DEFAULT NULL ,'+
            'SYNC_INSP_SITE tinyint(1) DEFAULT NULL ,'+
            'TASK_TYPE tinyint(1) DEFAULT 1 ,'+
            'ACTION_TYPE varchar(255) DEFAULT NULL ,'+
            'VER_NBR varchar(255) DEFAULT NULL ,'+
            'STATUS_CD tinyint(1) DEFAULT NULL ,'+
            'STATUS_DATE datetime DEFAULT CURRENT_TIMESTAMP ,'+
            'CREATE_STAFF bigint(20) DEFAULT NULL ,'+
            'CREATE_DATE datetime DEFAULT CURRENT_TIMESTAMP ,'+
            'UPDATE_STAFF bigint(20) DEFAULT NULL ,'+
            'UPDATE_DATE datetime DEFAULT CURRENT_TIMESTAMP )';
        return createInspectJobManagerSql;
    }
    //创建表sql（job_exec_time）
    createJobExecTime(){
        var createJobExecTimeSql  =  'CREATE TABLE IF NOT EXISTS job_exec_time(' +
            'ID varchar(255) PRIMARY KEY, ' +
            'JOB_EXEC_CODE varchar(255) DEFAULT NULL ,'+
            'JOB_CODE varchar(255) DEFAULT NULL ,'+
            'EXEC_CODE_TYPE tinyint(1) DEFAULT NULL ,'+
            'EXEC_CODE varchar(255) DEFAULT NULL ,'+
            'EXEC_START_TIME varchar(255) DEFAULT NULL ,'+
            'EXEC_END_TIME varchar(255) DEFAULT NULL ,'+
            'EXEC_NBR int(11) DEFAULT NULL ,'+
            'ACTION_TYPE varchar(255) DEFAULT NULL ,'+
            'VER_NBR varchar(255) DEFAULT NULL ,'+
            'STATUS_CD tinyint(1) DEFAULT NULL ,'+
            'STATUS_DATE datetime DEFAULT CURRENT_TIMESTAMP ,'+
            'CREATE_STAFF bigint(20) DEFAULT NULL ,'+
            'CREATE_DATE datetime DEFAULT CURRENT_TIMESTAMP ,'+
            'UPDATE_DATE datetime DEFAULT CURRENT_TIMESTAMP ,'+
            'UPDATE_STAFF bigint(20) DEFAULT NULL)';
        return createJobExecTimeSql;
    }
    //创建表sql（man_ref_item）
    createManRefItem(){
        var createManRefItemSql  =  'CREATE TABLE IF NOT EXISTS man_ref_item(' +
            'ID varchar(255) PRIMARY KEY, ' +
            'MAN_CODE varchar(255) DEFAULT NULL ,'+
            'ITEM_CODE varchar(255) DEFAULT NULL ,'+
            'ORD_LEVEL int(11) DEFAULT NULL ,'+
            'TABLE_TYPE varchar(255) DEFAULT NULL ,'+
            'VER_NBR varchar(255) DEFAULT NULL ,'+
            'ACTION_TYPE varchar(255) DEFAULT NULL ,'+
            'STATUS_CD tinyint(1) DEFAULT NULL ,'+
            'STATUS_DATE datetime DEFAULT CURRENT_TIMESTAMP ,'+
            'CREATE_STAFF bigint(20) DEFAULT NULL ,'+
            'CREATE_DATE datetime DEFAULT CURRENT_TIMESTAMP ,'+
            'UPDATE_STAFF bigint(20) DEFAULT NULL ,'+
            'UPDATE_DATE datetime DEFAULT CURRENT_TIMESTAMP )';
        return createManRefItemSql;
    }
    //创建表sql（t_base_equipment_type）
    createTBaseEquipmentType(){
        var createTBaseEquipmentTypeSql  =  'CREATE TABLE IF NOT EXISTS t_base_equipment_type(' +
            'equipment_type_id varchar(255) PRIMARY KEY, ' +
            'equipment_type_name varchar(256) DEFAULT NULL, ' +
            'parent_id bigint(20) DEFAULT NULL,' +
            'sort int(11) DEFAULT NULL,' +
            'create_time datetime DEFAULT NULL,' +
            'update_time datetime DEFAULT NULL,' +
            'app_name varchar(50) DEFAULT NULL,' +
            'tenant_code varchar(20) DEFAULT NULL,' +
            'curr_user varchar(50) DEFAULT NULL,' +
            'customer_id bigint(20) DEFAULT NULL,' +
            'delete_flag varchar(2) DEFAULT 0)';
        return createTBaseEquipmentTypeSql;
    }
    //创建表sql（t_base_equipment）
    createTBaseEquipment(){
        var createTBaseEquipmentSql  =  'CREATE TABLE IF NOT EXISTS t_base_equipment(' +
            'equipment_id varchar(255) PRIMARY KEY, ' +
            'equipment_name varchar(30) DEFAULT NULL, '+
            'model varchar(64) DEFAULT NULL,'+
            'install_date datetime DEFAULT NULL,'+
            'start_use_date datetime DEFAULT NULL,'+
            'end_use_date datetime DEFAULT NULL,'+
            'use_years tinyint(4) DEFAULT NULL,'+
            'discard_time datetime DEFAULT NULL,'+
            'start_guarant_date datetime DEFAULT NULL,'+
            'end_guarant_date datetime DEFAULT NULL,'+
            'brand varchar(30) DEFAULT NULL,'+
            'brand_id bigint(20) DEFAULT NULL , '+
            'manufacturer varchar(32) DEFAULT NULL,'+
            'bar_code varchar(64) DEFAULT NULL,'+
            'sequence_no varchar(64) DEFAULT NULL,'+
            'asset_code varchar(64) DEFAULT NULL,'+
            'rated_capacity varchar(10) DEFAULT NULL,'+
            'voltage_level varchar(10) DEFAULT NULL, '+
            'threshold varchar(10) DEFAULT NULL,'+
            'size varchar(10) DEFAULT NULL,'+
            'weight varchar(10) DEFAULT NULL,'+
            'original_place varchar(128) DEFAULT NULL,'+
            'responsible_person bigint(20) DEFAULT NULL,'+
            'owner bigint(20) DEFAULT NULL, '+
            'cost_center varchar(32) DEFAULT NULL,'+
            'vendor_name varchar(30) DEFAULT NULL, '+
            'equipment_type_id bigint(20) NOT NULL, '+
            'equipment_type varchar(20) DEFAULT NULL, '+
            'install_location varchar(128) DEFAULT NULL,'+
            'exotic_flag tinyint(4) DEFAULT 0,'+
            'qualify_desc varchar(300) DEFAULT NULL,'+
            'memo varchar(300) DEFAULT NULL,'+
            'status varchar(2) DEFAULT NULL,'+
            'create_time datetime DEFAULT NULL,'+
            'update_time datetime DEFAULT NULL,'+
            'app_name varchar(50) DEFAULT NULL,'+
            'tenant_code varchar(50) DEFAULT NULL,'+
            'curr_user varchar(20) DEFAULT NULL,'+
            'customer_id bigint(20) DEFAULT NULL,'+
            'delete_flag varchar(2) DEFAULT NULL)';
        return createTBaseEquipmentSql;
    }




    //新增数据sql
    insertData(job,tablename){
        var key = "";
        var val = "";
        for(var sx in job){
            if(job[sx]!=null&&job[sx]!=''){
                key = key+"'"+sx+"'"+",";
                val = val+"'"+job[sx]+"'"+",";
            }
        }
        var sql = "REPLACE INTO "+tablename;
        var key = '(' + key.substr(0,key.length-1) +')';
        var val = '(' + val.substr(0,val.length-1) +')';
        var insertInspectJobSql = sql + key + " values" + val;

        return insertInspectJobSql;
    }
    //删除sql
    deleteInspectJob(ID,tableName){
        var deleteSql = "";
        if(tableName==="t_base_equipment"){
            deleteSql = "delete from t_base_equipment where equipment_id = "+job.equipment_id;
        }else if(tableName==="t_base_equipment_type"){
            deleteSql = "delete from t_base_equipment_type where equipment_type_id = "+job.equipment_type_id;
        }else{
            deleteSql = "delete from "+tableName+" where ID = "+ID;
        }

        return deleteSql;
    }
    //删表sql
    dropTable(tableName){
        var dropSql = "drop table "+tableName;
        return dropSql;
    }

    //修改sql
    updateDate(job,tablename){

        var vals = "";
        for(var sx in job){
            if(job[sx]!=null&&job[sx]!=''){
                vals = vals+sx+"='"+job[sx]+"',";
            }
        }
        var sql = "UPDATE "+tablename+" set";
        var val = vals.substr(0,val.length-1);
        var key = "";
        if(tablename==="t_base_equipment"){
            key = "where equipment_id = "+job.equipment_id;
        }else if(tablename==="t_base_equipment_type"){
            key = "where equipment_type_id = "+job.equipment_type_id;
        }else{
            key = "where ID = "+job.ID;
        }

        var insertSql = sql + val + key;

        return insertSql;
    }




    render(){
        return null;
    }



}

export default SQLManager;