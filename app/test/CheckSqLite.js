//SQLite.js
import React, { Component } from 'react';

export const SelectFirstCheck = "SELECT DISTINCT"
    +" (dt.id),"
    +" dt.exec_start_time,"
    +" dt.exec_end_time,"
    +" dt.JOB_EXEC_TEAM_ID"
    +" FROM"
    +" daily_task as dt"
    +" WHERE   dt.exec_start_time >= '2019-05-21' AND dt.exec_end_time <= '2019-06-21'"
    +" AND dt.JOB_EXEC_TEAM_ID LIKE '%1078553090117558273%' and"
    +" dt.job_code IN ("
    +" SELECT"
    +" ijm.JOB_CODE"
    +" FROM"
    +" inspect_job_manager as ijm"
    +" WHERE"
    +" ijm.MAN_CODE IN ("
    +" SELECT"
    +" mri.MAN_CODE"
    +" FROM"
    +" man_ref_item as mri"
    +" WHERE"
    +" mri.TABLE_TYPE IN (0, 1, 2)"
    +" )"
    +" ) order by dt.exec_start_time asc";
// export const SelectFirstCheck = "SELECT "+
//     "distinct(daily_task.id),daily_task.JOB_CODE "+
//     "FROM "+
//     "daily_task ";
// export const SelectFirstCheck = "select "
//     +" * from "
//     +" daily_task";
    // +" WHERE   dt.exec_start_time >= '2019-05-21' AND dt.exec_end_time <= '2019-06-21'"
    // +" AND dt.JOB_EXEC_TEAM_ID LIKE '%1078553090117558273%' and"
    // +" dt.job_code IN ("
    // +" SELECT"
    // +" ijm.JOB_CODE"
    // +" FROM"
    // +" inspect_job_manager as ijm"
    // +" WHERE"
    // +" ijm.MAN_CODE IN ("
    // +" SELECT"
    // +" mri.MAN_CODE"
    // +" FROM"
    // +" man_ref_item as mri"
    // +" WHERE"
    // +" mri.TABLE_TYPE IN (0, 1, 2)"
    // +" )"
    // +" )";



export default class CheckSqLite extends Component {





    render(){
        return null;
    }
}