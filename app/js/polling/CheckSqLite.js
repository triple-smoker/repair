//SQLite.js
import React, { Component } from 'react';


const newDate = new Date().format("YYYY-MM-dd 00:00:00");
const newDateString = new Date(newDate).getTime();
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
    selectFirstCheck(deptId){
        return "SELECT"
            +" distinct(dt.id),dt.JOB_CODE,dt.exec_start_time,dt.exec_end_time,dt.exec_code_type,"
            +" dt.JOB_EXEC_TEAM_ID,ij.JOB_NAME,mri.TABLE_TYPE"
            +" FROM"
            +" daily_task as dt LEFT outer JOIN inspect_job as ij ON dt.job_code=ij.job_code"
            +" LEFT outer JOIN inspect_job_manager as ijm ON ij.job_code=ijm.job_code"
            +" LEFT outer JOIN man_ref_item as mri ON ijm.MAN_CODE= mri.MAN_CODE"
            +" WHERE"
            +" dt.exec_end_time >= '"+newDateString+"'"
            +" AND dt.JOB_EXEC_TEAM_ID LIKE '%"+deptId+"%' AND mri.TABLE_TYPE in(0,1,2) and ij.status_cd =1 and ijm.status_cd=1 and "
            +" mri.status_cd=1";
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
    //巡检二级页面 type=1
    selectSecondCheckOne(jobCode){
        return "SELECT" +
            " a.OBJ_ID" +
            " FROM" +
            " inspect_job_manager a where a.OBJ_TYPE=1 and a.JOB_CODE = '"+jobCode+"';";
    }
    //巡检二级页面 设备详情
    selectSecondCheckEquipment(equipmentId){
        return "select b.install_location," +
            " b.equipment_id," +
            " b.equipment_name," +
            " b.equipment_type_id FROM " +
            " t_base_equipment as b , inspect_job_manager as a where b.equipment_type_id = a.OBJ_ID " +
            " and b.equipment_id="+equipmentId+" and a.status_cd=1 and a.OBJ_TYPE=0";
    }
    //巡检三级页面
    selectThirdCheck(manCode){
        return "select b.ITEM_NAME,b.ITEM_FORMAT,b.ITEM_RESULT_SET " +
            "from inspect_item_conf b, man_ref_item mri where mri.STATUS_CD=1 and " +
            "b.STATUS_CD=1 and mri.ITEM_CODE=b.ITEM_CODE " +
            "and mri.MAN_CODE="+manCode+"";
    }




}