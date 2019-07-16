//SQLite.js
import React, { Component } from 'react';



// export const SelectFirstCheck = "SELECT"
// +" distinct(dt.id),dt.JOB_CODE,dt.exec_start_time,dt.exec_end_time,"
// +" dt.JOB_EXEC_TEAM_ID,ij.JOB_NAME,mri.TABLE_TYPE"
// +" FROM"
// +" daily_task as dt LEFT outer JOIN inspect_job as ij ON dt.job_code=ij.job_code"
// +" LEFT outer JOIN inspect_job_manager as ijm ON ij.job_code=ijm.job_code"
// +" LEFT outer JOIN man_ref_item as mri ON ijm.MAN_CODE= mri.MAN_CODE"
// +" WHERE"
// +" dt.exec_end_time >= '"+newDateString+"'"
// +" AND dt.JOB_EXEC_TEAM_ID LIKE '%"+deptId+"%' AND mri.TABLE_TYPE in(0,1,2)";



export default class CheckSqLite extends Component {

    //巡检首页
    selectFirstCheck(deptId,newDateString){
        return "SELECT"
            +" distinct(dt.id),dt.JOB_CODE,dt.job_exec_code,dt.code,dt.exec_start_time,dt.exec_end_time,dt.exec_code_type,"
            +" dt.JOB_EXEC_TEAM_ID,ij.JOB_NAME,mri.TABLE_TYPE"
            +" FROM"
            +" daily_task as dt LEFT outer JOIN inspect_job as ij ON dt.job_code=ij.job_code"
            +" LEFT outer JOIN inspect_job_manager as ijm ON ij.job_code=ijm.job_code"
            +" LEFT outer JOIN man_ref_item as mri ON ijm.MAN_CODE= mri.MAN_CODE"
            +" WHERE"
            +" dt.exec_end_time >= '"+newDateString+"'"
            +" AND dt.JOB_EXEC_TEAM_ID LIKE '%"+deptId+"%' AND mri.TABLE_TYPE in(0,1,2) and ij.status_cd =1 and ijm.status_cd=1 and "
            +" mri.status_cd=1 order by dt.exec_end_time asc";
    }
    //保养首页
    selectFirstCheckKeep(deptId,newDateString){
        return "SELECT"
            +" distinct(dt.id),dt.JOB_CODE,dt.job_exec_code,dt.code,dt.exec_start_time,dt.exec_end_time,dt.exec_code_type,"
            +" dt.JOB_EXEC_TEAM_ID,ij.JOB_NAME,mri.TABLE_TYPE"
            +" FROM"
            +" daily_task as dt LEFT outer JOIN inspect_job as ij ON dt.job_code=ij.job_code"
            +" LEFT outer JOIN inspect_job_manager as ijm ON ij.job_code=ijm.job_code"
            +" LEFT outer JOIN man_ref_item as mri ON ijm.MAN_CODE= mri.MAN_CODE"
            +" WHERE"
            +" dt.exec_end_time >= '"+newDateString+"'"
            +" AND dt.JOB_EXEC_TEAM_ID LIKE '%"+deptId+"%' AND mri.TABLE_TYPE=3 and ij.status_cd =1 and ijm.status_cd=1 and "
            +" mri.status_cd=1 order by dt.exec_end_time asc";
    }
    //巡检二级页面 type=0
    selectSecondCheckZero(jobCode){
        return "SELECT" +
            " b.install_location," +
            " b.equipment_id," +
            " b.equipment_name," +
            " b.equipment_type_id," +
            " a.MAN_CODE," +
            " a.OBJ_ID" +
            " FROM" +
            " t_base_equipment b, inspect_job_manager a where b.equipment_type_id = a.OBJ_ID" +
            " and a.OBJ_TYPE=0 and a.JOB_CODE = '"+jobCode+"' and a.status_cd=1";
    }
    //巡检二级页面-场所
    selectSecondCheckPlace(jobCode){
        return " SELECT " +
            " b.ID, " +
            " b.PLACE_FLAG, " +
            " b.PLACE_NAME as equipment_name, " +
            " b.PLACE_ID as equipment_id, " +
            " b.PLACE_TYPE_ID as equipment_type_id, " +
            " b.PLACE_TYPE_NAME as install_location, " +
            " a.MAN_CODE, " +
            " a.OBJ_ID " +
            " FROM " +
            " t_base_place b, " +
            " inspect_job_manager a " +
            " WHERE " +
            " b.PLACE_TYPE_ID = a.OBJ_ID " +
            " AND a.JOB_CODE ='"+jobCode+"'" +
            " AND a.status_cd = 1 AND b.STATUS_CD = 1";
    }
    //巡检二级页面 type=1
    selectSecondCheckOne(jobCode){
        return "SELECT" +
            " a.OBJ_ID,a.MAN_CODE" +
            " FROM" +
            " inspect_job_manager a where a.OBJ_TYPE=1 and a.JOB_CODE = '"+jobCode+"' and a.STATUS_CD =1";
    }
    //巡检二级页面 设备详情
    selectSecondCheckEquipment(equipmentId,jobCode){
        return "select a.MAN_CODE,b.install_location, b.equipment_id, b.equipment_name, " +
            "b.equipment_type_id FROM t_base_equipment as b , " +
            "inspect_job_manager as a where a.JOB_CODE='"+jobCode+"' and b.equipment_id='"+equipmentId+"' " +
            "and a.OBJ_ID like '%"+equipmentId+"%'  and a.status_cd=1 and a.OBJ_TYPE=1";
    }
    //巡检三级页面
    selectThirdCheck(manCode){
        return "select b.ID,b.ITEM_NAME,b.ITEM_FORMAT,b.ITEM_RESULT_SET,b.ITEM_CODE " +
            "from inspect_item_conf b, man_ref_item mri where " +
            "mri.STATUS_CD=1 and " +
            "b.STATUS_CD=1 and " +
            "mri.ITEM_CODE=b.ITEM_CODE " +
            "and mri.MAN_CODE='"+manCode+"'";
    }

    //提交报表-建表
    // createAutoUp()
    // {
    //     var createAutoUpSql = "CREATE TABLE IF NOT EXISTS auto_up("
    //         + "code varchar(255),"
    //         + "dailyTaskCode varchar(255),"
    //         + "equipmentId varchar(255),"
    //         + "equipmentTypeId varchar(255),"
    //         + "execEndTime varchar(255),"
    //         + "execStartTime varchar(255),"
    //         + "fillDate varchar(255),"
    //         + "itemCode varchar(255),"
    //         + "itemResultSet varchar(255),"
    //         + "jobCode varchar(255),"
    //         + "jobExecCode varchar(255),"
    //         + "manCode varchar(255),"
    //         + "reportBy varchar(255),"
    //         + "reportDate varchar(255),"
    //         + "resultDesc varchar(255),"
    //         + "status varchar(255)"
    //         + ')';
    //     return createAutoUpSql;
    // }




}