

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    ScrollView,
} from 'react-native';

import * as Dimens from '../../value/dimens';
import Request, {ScanMsg,ScanDetails,Attr} from '../../http/Request';
import { toDate } from '../../util/DensityUtils';
import BaseComponent from '../../base/BaseComponent'
import NetInfo from "@react-native-community/netinfo";
import CheckSqLite from "../../polling/CheckSqLite";
import SQLite from "../../polling/SQLite";

let ScreenWidth = Dimensions.get('window').width;
let ScreenHeight = Dimensions.get('window').height;
let db;
let checkSqLite = new CheckSqLite();
export default class ScanResult extends BaseComponent {
    static navigationOptions = {
        header: null,
    };
    constructor(props){
        super(props);
        const { navigation } = this.props;
        const equipmentId = navigation.getParam('equipmentId', '');
        this.state={
            detaiData:null,
            repairId:props.navigation.state.params.repairId,
            equipmentId : equipmentId
        }
    }
    componentDidMount() {
        this.loadDetail();
    }
    componentWillReceiveProps(){
        setTimeout(
            () => { 
                this.loadDetail()
            }, 500)
    }
    loadDetail() {
        var that = this;
        // 040A8A3A325E81
        // 1083394199443472386
        // var scanCode = "040A8A3A325E81"
        // var scanId = "1083394199443472386"
        NetInfo.fetch().then(state => {
            console.log("当前网络连接：" + state.isConnected);
            if (state.isConnected) {
                Request.requestGet(ScanDetails + this.props.equipmentId, null, (result)=> {
                    if (result && result.code === 200) {
                        console.log(result.data)
                        that.setState({
                            detaiData:result.data,
                        });
                    } else {

                    }
                });

            } else{
                if(!db){
                    db = SQLite.open();
                }
                let sql = checkSqLite.selectEquipmentDetail(this.props.equipmentId);
                db.transaction((tx)=>{
                    tx.executeSql(sql, [],(tx,results)=>{
                        var len = results.rows.length;
                        console.log(len);
                        var detaiData = "";
                        for(let i=0; i<len; i++){
                            detaiData = results.rows.item(i);
                            console.log(detaiData);
                        }
                        console.log("=======")
                        let temp = [{filePath:""}];
                        detaiData.fileList=temp;
                        that.setState({
                            detaiData:detaiData,
                        });

                    });
                },(error)=>{
                    console.log(error);
                });
            }
        })
    }
        
    

    materielList() {
        // const {navigation} = this.props;
        // InteractionManager.runAfterInteractions(() => {
        //     navigation.navigate('MaterielList',{
        //         theme:this.theme,
        //         repairId: this.state.repairId})
        // });
    }
    /* 使用状态*/ 
    statusTxt(num){
        var txt;
        switch (num) {
            case '1':
                txt = '在用'
                break;
            case '2':
                txt = '调试'
                break;
            case '3':
                txt = '停用'
                break; 
            case '4':
                txt = '报废'
                break;   
            default:
                txt = '--'
                break;
        }
        return txt;
    }
    render() {
        var detaiData = this.state.detaiData;
        var brand = null;
        var equipmentId = null;
        var equipmentName = null;
        var status = null;
        var voltageLevel = null;
        var threshold = null;
        var size = null;
        var weight = null;
        var time1 = null;
        var time2 = null;
        var time3 = null;
        var time4 = null;
        var model = null;
        var brandImg = null;
        var ratedCapacity = null;
        var vardetailAddress = null;
        if (detaiData && !Array.isArray(detaiData)) {
              vardetailAddress = detaiData.detailAddress;
              brand = detaiData.brand;
              equipmentId = detaiData.equipmentId;
              model = detaiData.model;
              equipmentName = detaiData.equipmentName;
              status = detaiData.status;
              voltageLevel = detaiData.voltageLevel;
              threshold = detaiData.threshold;
              size = detaiData.size;
              weight = detaiData.weight;
              time1 = detaiData.installDate;
              time2 = detaiData.startUseDate;
              time3 = detaiData.startGuarantDate;
              time4 = detaiData.endGuarantDate;
              if(detaiData.fileList[0].filePath){
                brandImg = detaiData.fileList[0].filePath
              }
              ratedCapacity = detaiData.ratedCapacity
        }
        return (
            <View style={styles.container}>
                {/* <TitleBar
                    centerText={'扫描结果'}
                    isShowLeftBackIcon={true}
                    navigation={this.props.navigation}
                /> */}
                <ScrollView horizontal={false} indicatorStyle={'white'} showsVerticalScrollIndicator={true} style={{height:Dimens.screen_height-40-64, 
                    width:Dimens.screen_width,flex:1}}>
                   <View style={styles.header}>
                       {
                            brandImg ?  
                            <Image style={styles.images} source={{uri:brandImg}} /> : 
                            <Image style={styles.images} source={require('../../../res/repair/noImg.png')}/>
                       }
                                               
                        <View style={{flexDirection: 'column',justifyContent:'space-between',position:'relative'}}>
                            <Text style={{color:'white'}}>{equipmentName}</Text>
                            <Text style={{color:'white'}}>{ model }</Text>
                            <Text numberOfLines={1} ellipsizeMode={'tail'} style={{color:'white'}}>{brand + '  |  ' + equipmentId}</Text>
                             <Text numberOfLines={1} ellipsizeMode={'tail'} style={{color:'white',position: "absolute",top:-16,right:-16}}>{this.statusTxt(status)}</Text>
                           
                            
                        </View>
                   </View>
                    <View style={styles.main}>
                        <View><Text styles={{color:'#737373',fontSize:12}}>- 基本属性 -</Text></View>
                        <View style={styles.title}>
                            <Text>额定容量：</Text>
                            <Text>{ratedCapacity} T</Text>
                        </View>
                        <View style={styles.title}>
                            <Text>电压等级：</Text>
                            <Text>{voltageLevel} V</Text>
                        </View>
                        <View style={styles.title}>
                            <Text>定值/阙值：</Text>
                            <Text>{threshold}</Text>
                        </View>

                        <View style={styles.title}>
                            <Text>尺寸</Text>
                            <Text>{size} M</Text>
                        </View>
                        <View style={styles.title}>
                            <Text>重量</Text>
                            <Text>{weight} KG</Text>
                        </View>
                        <View style={styles.line} />
                        <View style={styles.title}>
                            <Text>安装日期：</Text>
                            <Text>{toDate(time1,'yyyy-MM-dd')}</Text>
                        </View>
                        <View style={styles.title}>
                            <Text>开始使用日期：</Text>
                            <Text>{toDate(time2,'yyyy-MM-dd')}</Text>
                        </View>
                        <View style={styles.title}>
                            <Text>质保开始日期：</Text>
                            <Text>{toDate(time3,'yyyy-MM-dd')}</Text>
                        </View>
                        <View style={styles.title}>
                            <Text>质保结束日期：</Text>
                            <Text>{toDate(time4,'yyyy-MM-dd')}</Text>
                        </View>
                    </View>
                </ScrollView>    
            </View>
        )
    }

}


const styles = StyleSheet.create({
   
    container: {
        flex: 1,
        backgroundColor: '#f6f6f6',
    },
    images:{
        height:80,
        width:80,
    },
    header:{
        backgroundColor:'#61c0c5',
        marginLeft: 6,
        marginRight: 6,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingTop: 16,
        paddingBottom: 16,
    },
    main:{
        backgroundColor:'#fff',
        marginLeft: 10,
        marginRight: 10,
        marginTop: 6,
        paddingTop:10,
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom:10,
    },
    title:{
        paddingLeft:30,
        marginTop:5,
        flexDirection: 'row',
        justifyContent:'space-between',
    },
    line:{
        backgroundColor:'#eeeeee',height:1,marginTop:5,width:(Dimens.screen_width),marginLeft:20,
    },
});
