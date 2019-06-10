

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    DeviceEventEmitter,
    Dimensions,
    InteractionManager,
    TouchableOpacity,
    ScrollView,
    Modal,
    TextInput,
    Linking,
    ActivityIndicator
} from 'react-native';

import TitleBar from '../../component/TitleBar';
import * as Dimens from '../../value/dimens';
import Request, {ScanMsg,ScanDetails} from '../../http/Request';
import { toastShort } from '../../util/ToastUtil';
import { toDate } from '../../util/DensityUtils';
import BaseComponent from '../../base/BaseComponent'
import Sound from "react-native-sound";
import {Content,Accordion,} from "native-base";
import AsyncStorage from '@react-native-community/async-storage';

let ScreenWidth = Dimensions.get('window').width;
let ScreenHeight = Dimensions.get('window').height;
let orderStatus = "";
export default class ScanResult extends BaseComponent {
    static navigationOptions = {
        header: null,
    };
    constructor(props){
        super(props);
        orderStatus = props.navigation.state.params.status;
        this.state={
            detaiData:null,
            repairId:props.navigation.state.params.repairId,
        }
    }
    componentWillUnmount(){
        // this.loadDetail();
    }
    componentDidMount() {
        this.loadDetail();
    }

    loadDetail() {
        var that = this;
        // 040A8A3A325E81
        // 1083394199443472386
        var scanCode = "040A8A3A325E81"
        // var scanId = "1083394199443472386"
        
        Request.requestGet(ScanMsg+scanCode,null,(result) => {
            if(result && result.code === 200){
                console.log('------')
                console.log(result)
                if(result.data.equipmentId){
                    Request.requestGet(ScanDetails + result.data.equipmentId, null, (result)=> {
                        if (result && result.code === 200) {
                            console.log('+++++++')
                            console.log(result.data)
                            that.setState({
                                detaiData:result.data,
                            });
                        } else {
                
                        }
                    });
                }
            }
        })
        
    
       
    }
    getDetail(scanId){
        // console.log('1')
        // if(scanId){
        //     Request.requestGet(ScanDetails+scanId, null, (result)=> {
        //         if (result && result.code === 200) {
        //             console.log('+++++++')
        //             console.log(result.data)
        //             that.setState({
        //                 detaiData:result.data,
        //             });
        //         } else {
        
        //         }
        //     });
        // }
       
    }

    materielList() {
        // const {navigation} = this.props;
        // InteractionManager.runAfterInteractions(() => {
        //     navigation.navigate('MaterielList',{
        //         theme:this.theme,
        //         repairId: this.state.repairId})
        // });
    }

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
        var brandId = null;
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
        if (detaiData) {
              vardetailAddress = detaiData.detailAddress;
              brand = detaiData.brand;
              brandId = detaiData.brandId;
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
        }
        return (
            <View style={styles.container}>
                <TitleBar
                    centerText={'扫描结果'}
                    isShowLeftBackIcon={true}
                    navigation={this.props.navigation}
                />
                <ScrollView horizontal={false} indicatorStyle={'white'} showsVerticalScrollIndicator={true} style={{height:Dimens.screen_height-40-64, 
                    width:Dimens.screen_width,flex:1}}>
                   <View style={styles.header}>
                        <Image style={styles.images} source={require('../../../res/repair/user_wx.png')}/>
                        <View>
                            <Text>{equipmentName+'（' + model +'）'}</Text>
                            <Text>{brand+' | ' +brandId + ' | ' + this.statusTxt(status) }</Text>
                        </View>
                   </View>
                    <View style={styles.main}>
                        <View><Text styles={{color:'#737373',fontSize:12}}>- 基本属性 -</Text></View>
                        <View style={styles.title}>
                            <Text>额定容量：</Text>
                            <Text>额定容量</Text>
                        </View>
                        <View style={styles.title}>
                            <Text>电压等级：</Text>
                            <Text>{voltageLevel}</Text>
                        </View>
                        <View style={styles.title}>
                            <Text>定值/阙值：</Text>
                            <Text>{threshold}</Text>
                        </View>

                        <View style={styles.title}>
                            <Text>尺寸</Text>
                            <Text>{size}</Text>
                        </View>
                        <View style={styles.title}>
                            <Text>重量</Text>
                            <Text>{weight}</Text>
                        </View>
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
        elevation: 5,
        shadowOffset: {width: 0, height: 0},
        shadowColor: '#c4c6d2',
        shadowOpacity: 0.5,
        shadowRadius: 1
    },
    title:{
        paddingLeft:30,
        marginTop:5,
        flexDirection: 'row',
        justifyContent:'space-between',
    }
});
