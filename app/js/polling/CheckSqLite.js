//SQLite.js
import React, { Component } from 'react';

//巡检首页
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
            +" AND dt.JOB_EXEC_TEAM_ID LIKE '%"+deptId+"%' AND mri.TABLE_TYPE in(0,1,2)";
    }




}