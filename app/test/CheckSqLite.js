//SQLite.js
import React, { Component } from 'react';

export const SelectFirstChecka = "SELECT "+
    "distinct(daily_task.id),daily_task.JOB_CODE,daily_task.exec_start_time,daily_task.exec_end_time,"+
    "daily_task.JOB_EXEC_TEAM_ID,inspect_job.JOB_NAME,man_ref_item.TABLE_TYPE"+
    "FROM "+
    "daily_task  left JOIN inspect_job  ON daily_task.job_code=inspect_job.job_code "+
    "LEFT JOIN inspect_job_manager  ON inspect_job.job_code=inspect_job_manager.job_code "+
    "LEFT JOIN man_ref_item ON inspect_job_manager.MAN_CODE= man_ref_item.MAN_CODE "+
    "WHERE "+
    "daily_task.exec_start_time >= '2019-06-05' AND daily_task.exec_end_time <= '2019-06-13' "+
    "AND daily_task.JOB_EXEC_TEAM_ID LIKE '%1078553090117558273%' AND man_ref_item.TABLE_TYPE in(0,1,2)";
export const SelectFirstCheck = "SELECT "+
    "distinct(daily_task.id),daily_task.JOB_CODE "+
    "FROM "+
    "daily_task ";



export default class CheckSqLite extends Component {





    render(){
        return null;
    }
}