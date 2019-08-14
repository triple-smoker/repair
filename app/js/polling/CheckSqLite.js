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
    selectFirstCheck(deptId,newDateString,equipmentId){
        return (equipmentId !== null && equipmentId !=="")? "SELECT"
            +" DISTINCT(dt.id),"
            +" dt.JOB_CODE,"
            +" dt.job_exec_code,"
            +" dt.CODE,"
            +" dt.exec_start_time,"
            +" dt.exec_end_time,"
            +" dt.exec_code_type,"
            +" dt.JOB_EXEC_TEAM_ID,"
            +" ij.JOB_NAME,"
            +" mri.TABLE_TYPE,"
            +" ij.VER_NBR"
            +" FROM"
            +" daily_task AS dt"
            +" LEFT OUTER JOIN job_exec_time AS jet ON dt.job_exec_code = jet.JOB_EXEC_CODE"
            +" LEFT OUTER JOIN inspect_job AS ij ON jet.VER_NBR = ij.VER_NBR"
            +" LEFT OUTER JOIN inspect_job_manager AS ijm ON ij.JOB_CODE = ijm.JOB_CODE"
            +" LEFT OUTER JOIN man_ref_item AS mri ON ijm.MAN_CODE = mri.MAN_CODE"
            +" WHERE"
            +" dt.exec_end_time >= '"+newDateString+"'"
            +" AND dt.JOB_EXEC_TEAM_ID LIKE '%"+deptId+"%'"
            +" AND mri.TABLE_TYPE IN (0, 1, 2)"
            +" AND ijm.OBJ_ID LIKE '%"+equipmentId+"%'"
            +" ORDER BY"
            +" dt.exec_end_time ASC"
            :
            "SELECT"
            +" DISTINCT(dt.id),"
            +" dt.JOB_CODE,"
            +" dt.job_exec_code,"
            +" dt.CODE,"
            +" dt.exec_start_time,"
            +" dt.exec_end_time,"
            +" dt.exec_code_type,"
            +" dt.JOB_EXEC_TEAM_ID,"
            +" ij.JOB_NAME,"
            +" mri.TABLE_TYPE,"
            +" ij.VER_NBR"
            +" FROM"
            +" daily_task AS dt"
            +" LEFT OUTER JOIN job_exec_time AS jet ON dt.job_exec_code = jet.JOB_EXEC_CODE"
            +" LEFT OUTER JOIN inspect_job AS ij ON jet.VER_NBR = ij.VER_NBR"
            +" LEFT OUTER JOIN inspect_job_manager AS ijm ON ij.JOB_CODE = ijm.JOB_CODE"
            +" LEFT OUTER JOIN man_ref_item AS mri ON ijm.MAN_CODE = mri.MAN_CODE"
            +" WHERE"
            +" dt.exec_end_time >= '"+newDateString+"'"
            +" AND dt.JOB_EXEC_TEAM_ID LIKE '%"+deptId+"%'"
            +" AND mri.TABLE_TYPE IN (0, 1, 2)"
            +" ORDER BY"
            +" dt.exec_end_time ASC";
    }
    //保养首页
    selectFirstCheckKeep(deptId,newDateString,equipmentId){
        return (equipmentId !== null && equipmentId !=="")? "SELECT"
            +" DISTINCT(dt.id),"
            +" dt.JOB_CODE,"
            +" dt.job_exec_code,"
            +" dt.CODE,"
            +" dt.exec_start_time,"
            +" dt.exec_end_time,"
            +" dt.exec_code_type,"
            +" dt.JOB_EXEC_TEAM_ID,"
            +" ij.JOB_NAME,"
            +" mri.TABLE_TYPE,"
            +" ij.VER_NBR"
            +" FROM"
            +" daily_task AS dt"
            +" LEFT OUTER JOIN job_exec_time AS jet ON dt.job_exec_code = jet.JOB_EXEC_CODE"
            +" LEFT OUTER JOIN inspect_job AS ij ON jet.VER_NBR = ij.VER_NBR"
            +" LEFT OUTER JOIN inspect_job_manager AS ijm ON ij.JOB_CODE = ijm.JOB_CODE"
            +" LEFT OUTER JOIN man_ref_item AS mri ON ijm.MAN_CODE = mri.MAN_CODE"
            +" WHERE"
            +" dt.exec_end_time >= '"+newDateString+"'"
            +" AND dt.JOB_EXEC_TEAM_ID LIKE '%"+deptId+"%'"
            +" AND mri.TABLE_TYPE=3"
            +" AND ijm.OBJ_ID LIKE '%"+equipmentId+"%'"
            +" ORDER BY"
            +" dt.exec_end_time ASC"
            :
            "SELECT"
            +" DISTINCT(dt.id),"
            +" dt.JOB_CODE,"
            +" dt.job_exec_code,"
            +" dt.CODE,"
            +" dt.exec_start_time,"
            +" dt.exec_end_time,"
            +" dt.exec_code_type,"
            +" dt.JOB_EXEC_TEAM_ID,"
            +" ij.JOB_NAME,"
            +" mri.TABLE_TYPE,"
            +" ij.VER_NBR"
            +" FROM"
            +" daily_task AS dt"
            +" LEFT OUTER JOIN job_exec_time AS jet ON dt.job_exec_code = jet.JOB_EXEC_CODE"
            +" LEFT OUTER JOIN inspect_job AS ij ON jet.VER_NBR = ij.VER_NBR"
            +" LEFT OUTER JOIN inspect_job_manager AS ijm ON ij.JOB_CODE = ijm.JOB_CODE"
            +" LEFT OUTER JOIN man_ref_item AS mri ON ijm.MAN_CODE = mri.MAN_CODE"
            +" WHERE"
            +" dt.exec_end_time >= '"+newDateString+"'"
            +" AND dt.JOB_EXEC_TEAM_ID LIKE '%"+deptId+"%'"
            +" AND mri.TABLE_TYPE=3"
            +" ORDER BY"
            +" dt.exec_end_time ASC";
    }
    //巡检二级页面 type=0
    selectSecondCheckZero(jobCode,verNbr){
        return "SELECT"
            +" b.install_location,"
            +" b.equipment_id,"
            +" b.equipment_name,"
            +" b.equipment_type_id,"
            +" a.MAN_CODE,"
            +" a.OBJ_ID"
            +" FROM"
            +" t_base_equipment b,"
            +" inspect_job_manager a"
            +" WHERE"
            +" b.equipment_type_id = a.OBJ_ID"
            +" AND a.OBJ_TYPE = 0"
            +" AND a.JOB_CODE = '"+jobCode+"'"
            +" AND a.VER_NBR = '"+verNbr+"'";
    }
    //巡检二级页面-场所
    selectSecondCheckPlace(jobCode,verNbr){
        return "SELECT"
            +" b.ID AS equipment_id,"
            +" b.PLACE_FLAG,"
            +" b.PLACE_NAME AS equipment_name,"
            +" b.PLACE_ID,"
            +" b.PLACE_TYPE_ID AS equipment_type_id,"
            +" b.PLACE_TYPE_NAME AS install_location,"
            +" a.MAN_CODE,"
            +" a.OBJ_ID"
            +" FROM"
            +" t_base_place b,"
            +" inspect_job_manager a"
            +" WHERE"
            +" b.PLACE_TYPE_ID = a.OBJ_ID"
            +" AND a.JOB_CODE = '"+jobCode+"'"
            +" AND a.VER_NBR = '"+verNbr+"'";
    }
    //巡检二级页面 type=1
    selectSecondCheckOne(jobCode,verNbr){
        return "SELECT"
            +" a.OBJ_ID,"
            +" a.MAN_CODE"
            +" FROM"
            +" inspect_job_manager a"
            +" WHERE"
            +" a.OBJ_TYPE = 1"
            +" AND a.JOB_CODE = '"+jobCode+"'"
            +" AND a.VER_NBR = '"+verNbr+"'";
    }
    //巡检二级页面 设备详情
    selectSecondCheckEquipment(equipmentId,jobCode,verNbr){
        return "SELECT"
            +" a.MAN_CODE,"
            +" b.install_location,"
            +" b.equipment_id,"
            +" b.equipment_name,"
            +" b.equipment_type_id"
            +" FROM"
            +" t_base_equipment AS b,"
            +" inspect_job_manager AS a"
            +" WHERE"
            +" a.JOB_CODE = '"+jobCode+"'"
            +" AND b.equipment_id = '"+equipmentId+"'"
            +" AND a.OBJ_ID LIKE '%"+equipmentId+"%'"
            +" AND a.VER_NBR = '"+verNbr+"'"
            +" AND a.OBJ_TYPE = 1";
    }
    //巡检三级页面
    selectThirdCheck(manCode){
        return "select b.ID,b.ITEM_NAME,b.ITEM_FORMAT,b.ITEM_RESULT_SET,b.ITEM_CODE,b.ITEM_LEVEL,mri.not_null " +
            "from inspect_item_conf b, man_ref_item mri where " +
            "mri.ITEM_CODE=b.ITEM_CODE " +
            "and mri.MAN_CODE='"+manCode+"'";
    }
    //设备详情
    selectEquipmentDetail(equipmentId){
        return "select " +
            "equipment_id as equipmentId,status,equipment_name as equipmentName,model, " +
            "brand,rated_capacity as ratedCapacity,voltage_level as voltageLevel,threshold, " +
            "size,weight,install_date as time1,start_use_date as time2, " +
            "start_guarant_date as time3,end_guarant_date as time4 " +
            "from  " +
            "t_base_equipment where equipment_id='"+equipmentId+"'";
    }





}