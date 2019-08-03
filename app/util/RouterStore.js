
//搜索订单
import SearchOrder from '../js/pages/work/SearchOrder'
//报修单评价
import HistoryDetail from '../js/pages/repair/HistoryDetail';
//维修单详情
import OrderDetail from '../js/pages/repair/detail/OrderDetail'
//维修前后拍摄照片
import TakePhotos from '../js/pages/repair/detail/TakePhotos'
//派工
import ArrangeWork from '../js/pages/repair/ArrangeWork';
//转单拒绝转单
import TransferOrder from '../js/pages/repair/TransferOrder';
//院区切换
import SearchHospital from '../js/pages/entry/SearchHospital';
//系统设置
import Setting from '../js/pages/login/Setting'
//医院选择
import HospitalPicker from '../js/pages/entry/HospitalPicker'
//添加维修事项
import AddOption from '../js/pages/repair/detail/AddOption';
//添加物料
import MaterielList from  '../js/pages/repair/detail/MaterielList'
//拍照
import TakePicture from '../js/pages/repair/detail/TakePicture';
//完工
import FinishWork from '../js/pages/repair/detail/FinishWork'
//主屏导航
import MainPage from '../js/pages/entry/MainPage';
//设备详情
import ScanResult from '../js/pages/repair/ScanResult';
//我的里面 设置 信息 证照 通知 系统通知
import MySet from '../js/pages/mine/mySet';
import MyData from '../js/pages/mine/myData';
import PapersPage from '../js/pages/mine/PapersPage';
import Inform from '../js/pages/mine/Inform';
import MyPerformance from '../js/pages/mine/MyPerformance';
import SystemInform from '../js/pages/mine/SystemInform';
import workOrderInform from '../js/pages/mine/workOrderInform';
import MyInterest from '../js/pages/mine/MyInterest/index'
//添加关注
import addFocus from '../js/pages/mine/MyInterest/addFocus'
//我的工单
import WorkManager from '../js/pages/workcheck/WorkManager';

//找回密码
import findPsw from '../js/pages/login/findPassWord'
export default {
    SearchOrder : SearchOrder,
    HistoryDetail : HistoryDetail,
    OrderDetail : OrderDetail,
    TakePhotos : TakePhotos,
    ArrangeWork:ArrangeWork,
    TransferOrder : TransferOrder,
    SearchHospital : SearchHospital,
    Setting : Setting,
    HospitalPicker : HospitalPicker,
    AddOption : AddOption,
    MaterielList : MaterielList,
    TakePicture : TakePicture,
    FinishWork : FinishWork,
    MainPage : MainPage,
    ScanResult : ScanResult,
    MySet : MySet,
    MyData : MyData,
    PapersPage : PapersPage,
    Inform : Inform,
    MyPerformance : MyPerformance,
    SystemInform : SystemInform,
    workOrderInform: workOrderInform,
    MyInterest : MyInterest,
    addFocus : addFocus,
    WorkManager : WorkManager,
}
