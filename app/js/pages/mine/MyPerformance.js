

import React, { Component } from 'react';
import {
    View,
    Text,
    BackAndroid,
    TouchableOpacity,
    Image,
    StyleSheet,
    InteractionManager,
    TextInput,
    ScrollView,
    Dimensions
} from 'react-native';
import RNFetchBlob from '../../../util/RNFetchBlob';
import TitleBar from '../../component/TitleBar';
import BaseComponent from '../../base/BaseComponent'
import * as Dimens from '../../value/dimens';
import AsyncStorage from '@react-native-community/async-storage';

let MainHeight = Dimensions.get('window').height;
let MainWidth = Dimensions.get('window').width;
let tmp = 0;
let to = 0;
let flagMonthQuarterYear = 0;
var imageUrl = './app_logo.png';
export default class MyPerformance extends BaseComponent {
    static navigationOptions = {
        header: null,
    };
    constructor(props){
        super(props);
        this.state={
            theme:this.props.theme,
            userData:null,
            duringMonth_borderWidth:false,
            duringQuater_borderWidth:false,
            duringYear_borderWidth:false,
            scoreMonth:59,
            scoreQuarter:98,
            scoreYear:99,
            dotIndex:(new Date().getMonth()+1).toString(),
            dotIndex_month:(new Date().getMonth()+1).toString(),
            dotIndex_quarter:((new Date().getMonth()+1).toString()<=3)? 1 : (((new Date().getMonth()+1).toString()<=6)?2:((((new Date().getMonth()+1).toString())<=10)?3:4)),
            dotIndex_year:(new Date()).getFullYear().toString(),
            duringMonthText:'当月',
            duringQuarterText:'当季度',
            duringYearText:'今年',
            gouImageMonth:false,
            gouImageQuarter:false,
            gouImageYear:false,
        }
        this.chooseMonth = this.chooseMonth.bind(this);
        this.chooseQuarter = this.chooseQuarter.bind(this);
        this.chooseYear = this.chooseYear.bind(this);
    }
    componentDidMount() {
        var that = this;
        this.loadDetail();
    }
    componentWillReceiveProps(nextProps) {
        this.loadDetail();
    }
    loadDetail() {
        var that = this;
        AsyncStorage.getItem('uinfo',function (error, result) {
            if(error){
                console.log(error)
                return
            }else{
                var userInfo =  JSON.parse(result);
                that.setState({userData:userInfo});
                console.log(userInfo)
            }
        })
    }
chooseDot(index){
        if(this.state.duringMonth_borderWidth){
            this.setState({
                dotIndex_month: index,
            })
            if(index!=((new Date().getMonth()+1).toString())){
                if(index==1){
                    this.setState({
                        scoreMonth:60,
                        duringMonthText:'一月',
                    })
                }else if(index==2){
                    this.setState({
                        scoreMonth:61,
                        duringMonthText:'二月',
                    })
                }else if(index==3){
                    this.setState({
                        scoreMonth:63,
                        duringMonthText:'三月',
                    })
                }else if(index==4){
                    this.setState({
                        scoreMonth:64,
                        duringMonthText:'四月',
                    })
                }else if(index==5){
                    this.setState({
                        scoreMonth:65,
                        duringMonthText:'五月',
                    })
                }else if(index==6){
                    this.setState({
                        scoreMonth:65,
                        duringMonthText:'六月',
                    })
                }else if(index==7){
                    this.setState({
                        scoreMonth:66,
                        duringMonthText:'七月',
                    })
                }else if(index==8){
                    this.setState({
                        scoreMonth:67,
                        duringMonthText:'八月',
                    })
                }else if(index==9){
                    this.setState({
                        scoreMonth:68,
                        duringMonthText:'九月',
                    })
                }else if(index==10){
                    this.setState({
                        scoreMonth:69,
                        duringMonthText:'十月',
                    })
                }else if(index==11){
                    this.setState({
                        scoreMonth:70,
                        duringMonthText:'十一月',
                    })
                }else if(index==12){
                    this.setState({
                        scoreMonth:71,
                        duringMonthText:'十二月',
                    })
                }
            }else{
                this.setState({
                    scoreMonth:59,
                    duringMonthText:'当月',
                })
            }
        }else if(this.state.duringQuater_borderWidth){
            this.setState({
                dotIndex_quarter: index,
            })
            if(index!=(((new Date().getMonth()+1).toString()<=3)? 1 : (((new Date().getMonth()+1).toString()<=6)?2:((((new Date().getMonth()+1).toString())<=10)?3:4)))){
                if(index==1){
                    this.setState({
                        scoreQuarter:98,
                        duringQuarterText:'一季度',
                    })
                }else if(index==2){
                    this.setState({
                        scoreQuarter:97,
                        duringQuarterText:'二季度',
                    })
                }else if(index==3){
                    this.setState({
                        scoreQuarter:96,
                        duringQuarterText:'三季度',
                    })
                }else if(index==4){
                    this.setState({
                        scoreQuarter:95,
                        duringQuarterText:'四季度',
                    })
                }
            }else{
                this.setState({
                    scoreQuarter:98,
                    duringQuarterText:'当季度',
                })
            }
        }else if(this.state.duringYear_borderWidth){
            this.setState({
                dotIndex_year: index,
            })
            if(index!=((new Date()).getFullYear().toString())){
                if(index==2019){
                    this.setState({
                        scoreYear:99,
                        duringYearText:'2019',
                    })
                }else if(index==2018){
                    this.setState({
                        scoreYear:97,
                        duringYearText:'2018',
                    })
                }else if(index==2017){
                    this.setState({
                        scoreYear:96,
                        duringYearText:'2017',
                    })
                }else if(index==2016){
                    this.setState({
                        scoreYear:95,
                        duringYearText:'2016',
                    })
                }
            }else{
                this.setState({
                    scoreYear:99,
                    duringYearText:'今年',
                })
            }
        }else{

        }
    }
     chooseMonth() {
            this.setState({
                duringMonth_borderWidth: true,
                duringQuater_borderWidth:false,
                duringYear_borderWidth:false,
                gouImageMonth:true,
                gouImageQuarter:false,
                gouImageYear:false,
            })

            var date = new Date();
            var month = (date.getMonth()+1).toString();
            tmp = 12;
            to = month;
            this.renderMonthOrQuarterOrYear(tmp);
        }
        chooseQuarter(){
            this.setState({
                duringMonth_borderWidth:false,
                duringQuater_borderWidth:true,
                duringYear_borderWidth:false,
                gouImageMonth:false,
                gouImageQuarter:true,
                gouImageYear:false,
            })
            var date = new Date();
            var month = (date.getMonth()+1).toString();
            var quarter = 0;
            if(month>=1 && month<=3){
                quarter = 1;
            }else if(month>=4 && month<=6){
                quarter = 2;
            }else if(month>=7 && month<=9){
                quarter = 3;
            }else if(month>=10 && month<=12){
                quarter = 4;
            }
            tmp = 4;
            to = quarter;
            this.renderMonthOrQuarterOrYear(tmp);

        }
        chooseYear(){
            this.setState({
                duringMonth_borderWidth: false,
                duringQuater_borderWidth:false,
                duringYear_borderWidth:true,
                gouImageMonth:false,
                gouImageQuarter:false,
                gouImageYear:true,
            })
            var date = new Date();
            var year = date.getFullYear().toString();
            var toYear = year-2017+1;
            tmp = toYear;
            this.renderMonthOrQuarterOrYear(tmp);
        }
        showMQYWord(){
            var itemAry = [];
            if(tmp==12){
                itemAry.push(<View style={styles.mQYWord}><Text style={styles.monthText}>月</Text></View>)
            }else if(tmp==4){
                itemAry.push(<View style={styles.mQYWord}><Text style={styles.monthText}>季</Text></View>)
            }else if(tmp==0){

            }else{
                itemAry.push(<View style={styles.mQYWord}><Text style={styles.monthText}>年</Text></View>)
            }
            return itemAry;
        }
        renderMonthOrQuarterOrYear(len) {
            var itemAry = [];
            if(this.state.duringMonth_borderWidth){
                to = this.state.dotIndex_month;
            }else if(this.state.duringQuater_borderWidth){
                to = this.state.dotIndex_quarter;
            }else if(this.state.duringYear_borderWidth){
                to = this.state.dotIndex_year;
            }
            if(this.state.duringYear_borderWidth){
                // len = 50;
                var year = (new Date()).getFullYear().toString();
                if(len==1){
                    itemAry.push(
                        <View key={i} style={[styles.dotYear]}>
                                <Text style={styles.fontYearBig}>{year-len+1}</Text>
                        </View>
                    );
                }
                if(len>=2){
                    if(this.state.dotIndex_year==(year-len+1)){
                        itemAry.push(
                            <View key={i} style={[styles.dotYear]}>
                                    <Text style={styles.fontYearBig}>{year-len+1}</Text>
                            </View>
                        );
                    }else{
                        itemAry.push(
                            <View key={i} style={[styles.dotYear]}>
                                <TouchableOpacity onPress={()=>this.chooseDot(year-len+1)}>
                                    <Text style={styles.fontYear}>{year-len+1}</Text>
                                </TouchableOpacity>
                            </View>
                        );
                    }
                    for(var i=year-len+2; i<=year; i++){
                        if(this.state.dotIndex_year==i){
                            itemAry.push(
                                <View style={styles.lineForMonthQuarterYear}/>
                            );
                            itemAry.push(
                                <View key={i} style={[styles.dotYear]}>
                                    <Text style={styles.fontYearBig}>{this.state.dotIndex_year}</Text>
                                </View>
                            );
                        }else{
                            itemAry.push(
                                <View style={styles.lineForMonthQuarterYear}/>
                            );
                            const year_tmp = i;
                            // console.log("year_tmp:"+year_tmp);
                            itemAry.push(
                                <View key={i} style={[styles.dotYear]}>
                                    <TouchableOpacity onPress={()=>this.chooseDot(year_tmp)}>
                                        <Text style={styles.fontYear}>{year_tmp}</Text>
                                    </TouchableOpacity>
                                </View>
                            );
                        }
                    }
                }else{
                }
            }else{
                for (var i = 0; i<len; i++) {
                    var index = i+1;
                    if(i==0){
                        if(i==to-1){
                            itemAry.push(
                                <View key={i} style={[styles.dotMonthQuarterYearForOne,{width:MainWidth*0.07,height:MainWidth*0.07,}]}>
                                    <Text style={styles.fontMonthQuarterYearBig}>{index}</Text>
                                </View>
                            );
                        }else{
                            const indexTmp = index;
                            itemAry.push(

                                <View key={i} style={[styles.dotMonthQuarterYearForOne]}>
                                    <TouchableOpacity onPress={()=>this.chooseDot(indexTmp)}>
                                        <Text style={styles.fontMonthQuarterYear}>{index}</Text>
                                    </TouchableOpacity>
                                </View>
                            );
                        }
                    }else{
                        itemAry.push(
                            <View style={styles.lineForMonthQuarterYear}/>
                        );
                        if(index==to){
                            itemAry.push(
                                <View key={i} style={[styles.dotMonthQuarterYearTo]}>
                                    <Text style={styles.fontMonthQuarterYearTo}>{index}</Text>
                                </View>
                            );
                        }else{
                            const indexTmp = index;
                            itemAry.push(
                                <View key={i} style={[styles.dotMonthQuarterYear]}>
                                    <TouchableOpacity onPress={()=>this.chooseDot(indexTmp)}>
                                        <Text style={styles.fontMonthQuarterYear}>{index}</Text>
                                    </TouchableOpacity>
                                </View>
                            );
                        }
                    }
                }
            }
            return itemAry;
        }
    render() {
        let duringMonth ={
            borderWidth: this.state.duringMonth_borderWidth ? 2 : 0,
            borderColor: '#61C0C5',
            borderRadius: 100,
            marginLeft: MainWidth*0.08,
            width:MainWidth*0.2,
            height:MainWidth*0.2,
            justifyContent: "center",
            alignItems:"center",
            alignSelf: "center",
        }
        let duringQuarter ={
            borderWidth: this.state.duringQuater_borderWidth ? 2 : 0,
            borderColor: '#61C0C5',
            borderRadius: 100,
            marginLeft: MainWidth*0.08,
            width:MainWidth*0.2,
            height:MainWidth*0.2,
            justifyContent: "center",
            alignItems:"center",
            alignSelf: "center",
        }
        let duringYear ={
            borderWidth: this.state.duringYear_borderWidth ? 2 : 0,
            borderColor: '#61C0C5',
            borderRadius: 100,
            marginLeft: MainWidth*0.08,
            width:MainWidth*0.2,
            height:MainWidth*0.2,
            justifyContent: "center",
            alignItems:"center",
            alignSelf: "center",
        }
        let duringTextMonth ={
            fontSize: 35,
            color: this.state.duringMonth_borderWidth ? '#ff1505' : '#000',
        }
        let duringTextQuarter ={
            fontSize: 35,
            color: this.state.duringQuater_borderWidth ? '#ff1505' : '#000',
        }
        let duringTextYear ={
            fontSize: 35,
            color: this.state.duringYear_borderWidth ? '#ff1505' : '#000',
        }
        var  userData = this.state. userData;
        if (userData) {
            var headerImg = userData.headImgId;
            var workNumber = userData.workNumber;
            var  deptName = userData.deptAddresses[0].deptName
            var userName = userData.userName;
            var gender = userData.gender;
            var telNo = userData.telNo;
        }
        return (

          <View style={styles.container}>
            <TitleBar
            centerText={'我的绩效'}
            isShowLeftBackIcon={true}
            navigation={this.props.navigation}
            leftPress={() => this.naviGoBack(this.props.navigation)}
            />
              <Text style={styles.pingFengMingXiAndGuanLiYuanGong}>      <Image style={styles.imageStaffManagerment} source={require('../../../res/login/guanliyuangong.png')}/>: 管理员工</Text>
              <View style={styles.staffManagement} >


                  <View style={styles.duringMonthQuarterYear}>
                      <TouchableOpacity onPress={this.chooseMonth}>
                          <View style={duringMonth}>
                              <Image style={styles.imageGou} source={this.state.gouImageMonth==true?require('../../../res/login/gou.png'):require('../../../res/login/nothing.png')}/>
                              <Text style={duringTextMonth}>{this.state.scoreMonth}</Text>
                          </View>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={this.chooseQuarter}>
                          <View style={duringQuarter}>
                              <Image style={styles.imageGou} source={this.state.gouImageQuarter==true?require('../../../res/login/gou.png'):require('../../../res/login/nothing.png')}/>
                              <Text style={duringTextQuarter}>{this.state.scoreQuarter}</Text>
                          </View>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={this.chooseYear}>
                          <View style={duringYear}>
                              <Image style={styles.imageGou} source={this.state.gouImageYear==true?require('../../../res/login/gou.png'):require('../../../res/login/nothing.png')}/>
                              <Text style={duringTextYear}>{this.state.scoreYear}</Text>
                          </View>
                      </TouchableOpacity>
                  </View>

                  <View style={styles.duringMonthQuarterYearMiddle} >
                      <View style={styles.duringMonthText}><Text >{this.state.duringMonthText}</Text></View>
                      <View style={styles.duringQuarterText}><Text >{this.state.duringQuarterText}</Text></View>
                      <View style={styles.duringYearText}><Text >{this.state.duringYearText}</Text></View>
                  </View>
                  <View style={styles.duringMonthQuarterYearUnder}>
                      {this.showMQYWord()}
                      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}
                                  ref={scrollView => {
                                      if(scrollView !== null){
                                          setTimeout(()=>{
                                              //父组件传入的参数的option（用于计算偏移，根据自己实际情况）
                                              scrollView.scrollTo({x:35*to,y:this.props.option*40,animated:true},1)
                                          })
                                      }}}
                      >
                          {this.renderMonthOrQuarterOrYear(tmp)}
                      </ScrollView>
                  </View>
              </View>
              <Text style={styles.pingFengMingXiAndGuanLiYuanGong}>      评分明细</Text>
              <View style={styles.scoreDetail} >
                  <Text style={{marginLeft:MainHeight*0.02,lineHeight: 30,}}>{this.state.duringQuater_borderWidth==true?this.state.duringQuarterText:(this.state.duringYear_borderWidth==true?this.state.duringYearText:this.state.duringMonthText)}</Text>

                  <View style={styles.line}/>
                  <View style={{flexDirection:'row',}}>
                      <View>
                          <Text style={styles.scoreWord}>工作能力(30%)</Text>
                      </View>
                      <View style={styles.score}>
                          <Text style={{color:'#F6182D',lineHeight: 30,}}>24<Text style={{color:'#000000',lineHeight: 30,}}>分</Text></Text>
                      </View>
                  </View>

                  <View style={styles.line}/>
                  <View style={{flexDirection:'row',}}>
                      <View>
                          <Text style={styles.scoreWord}>工作态度(20%)</Text>
                      </View>
                      <View style={styles.score}>
                          <Text style={styles.detailText}>76<Text style={styles.detailText}>分</Text></Text>
                      </View>
                  </View>

                  <View style={styles.line}/>
                  <View style={{flexDirection:'row',}}>
                      <View>
                          <Text style={styles.scoreWord}>出勤率(10%)</Text>
                      </View>
                      <View style={{marginLeft:MainHeight*0.33,}}>
                          <Text style={styles.detailText}>100<Text style={styles.detailText}>分</Text></Text>
                      </View>
                  </View>

                  <View style={styles.line}/>
                  <View style={{flexDirection:'row',}}>
                      <View>
                          <Text style={styles.scoreWord}>工作完成情况(40%)</Text>
                      </View>
                      <View style={{marginLeft:MainHeight*0.28,}}>
                          <Text style={styles.detailText}>96<Text style={styles.detailText}>分</Text></Text>
                      </View>
                  </View>
                  <View style={styles.line}/>
              </View>
              <View style={{flex: 3, backgroundColor: '#fff'}} />
        </View>
        )
    }
}
const styles = StyleSheet.create({
    imageStaffManagerment: {
        width:20,
        height:20,
    },
    imageGou: {
        position:'absolute',
        right:32,
        top:32,
        width:80,
        height:80,

    },
    mQYWord: {
        width: 40,
        marginTop: 4,
    },
    monthText: {
        marginLeft: MainWidth*0.05,
    },
    fontMonthQuarterYearTo: {
        color: '#fffd06',
        fontSize: 23,
    },
    fontMonthQuarterYear: {
        color: '#fff',
    },
    fontMonthQuarterYearBig: {
        color: '#fffd06',
        fontSize: 23,
    },
    fontYear: {
        color: '#000',
        fontSize:15,
    },
    fontYearBig: {
        color: '#000',
        fontSize:20,
    },
    dotMonthQuarterYearForOne: {
        borderRadius: 100,
        backgroundColor: '#61C0C5',
        /*marginLeft: MainWidth*0.1,*/
        width:MainWidth*0.05,
        height:MainWidth*0.05,
        justifyContent: "center",
        alignItems:"center",
        alignSelf: "center",
        marginLeft: MainWidth*0.05,
    },
    dotMonthQuarterYearTo: {
        borderRadius: 100,
        backgroundColor: '#61C0C5',
        /*marginLeft: MainWidth*0.1,*/
        width:MainWidth*0.07,
        height:MainWidth*0.07,
        justifyContent: "center",
        alignItems:"center",
        alignSelf: "center",
        //marginLeft: MainWidth*0.088,
    },
    dotMonthQuarterYear: {
        borderRadius: 100,
        backgroundColor: '#61C0C5',
        /*marginLeft: MainWidth*0.1,*/
        width:MainWidth*0.05,
        height:MainWidth*0.05,
        justifyContent: "center",
        alignItems:"center",
        alignSelf: "center",
        //marginLeft: MainWidth*0.088,
    },
    dotYear: {
        // borderRadius: 100,
        backgroundColor: '#fff',
        /*marginLeft: MainWidth*0.1,*/
        // width:MainWidth*0.05,
        // height:MainWidth*0.05,
        justifyContent: "center",
        alignItems:"center",
        alignSelf: "center",
        //marginLeft: MainWidth*0.088,
    },
    monthQuarterYearValue: {
        flexDirection:'row',
        textDecorationLine: 'underline',
    },
    duringText: {
        fontSize: 35,
    },
    duringMonthText: {
        marginTop: 0,
        marginLeft: MainWidth*0.15,
    },
    duringQuarterText: {
        marginLeft: MainWidth*0.19,
    },
    duringYearText: {
        marginLeft: MainWidth*0.19,
    },
    duringMonthQuarterYear: {
        flexDirection:'row',
        marginTop:MainWidth*0.05,
    },
    duringMonthQuarterYearMiddle: {
        flexDirection:'row',
        /*marginTop:MainWidth*0.00,*/
    },
    duringMonthQuarterYearUnder: {
        flexDirection:'row',
        marginTop:MainWidth*0.05,
    },
    duringMonth: {
        /*backgroundColor:'#bb8ea0',*/
        borderWidth: 2,
        borderColor: '#00ffd7',
        borderRadius: 100,
        marginLeft: MainWidth*0.08,
        width:MainWidth*0.2,
        height:MainWidth*0.2,
        justifyContent: "center",
        alignItems:"center",
        alignSelf: "center",

    },
    duringQuarter: {
        /*backgroundColor:'#5abb5f',*/
        marginLeft: MainWidth*0.08,
        width:MainWidth*0.2,
        height:MainWidth*0.2,
        justifyContent: "center",
        alignItems:"center",
        alignSelf: "center",
    },
    duringYear: {
        /*backgroundColor:'#fffd8c',*/
        marginLeft: MainWidth*0.08,
        width:MainWidth*0.2,
        height:MainWidth*0.2,
        justifyContent: "center",
        alignItems:"center",
        alignSelf: "center",
    },
    score: {
        marginLeft:MainHeight*0.32,
    },
    scoreWord: {
        marginLeft:MainHeight*0.02,
        lineHeight: 30,
    },
    line: {
        width: Dimensions.get('window').width  * 0.90,
        height: 1,
        borderWidth: 1,
        borderColor: '#D0D0D0',
        backgroundColor: "#D0D0D0",
    },
    lineForMonthQuarterYear: {
        width: Dimensions.get('window').width  * 0.1,
        height: 1,
        borderWidth: 1,
        borderColor: '#61C0C5',
        backgroundColor: "#61C0C5",
        justifyContent: "center",
        alignItems:"center",
        alignSelf: "center",
        textAlign: "center",
    },
    center: {
        justifyContent: "center",
        alignItems:"center",
        alignSelf: "center",
        textAlign: "center",
    },
    staffManagement: {
        flex: 3,
        backgroundColor: '#fff',
        width: Dimensions.get('window').width  * 0.90,
        /*justifyContent: "center",*/
        /*alignItems:"center",*/
        /*alignSelf: "center",*/
        alignSelf: "center",
        borderWidth: 1,
        borderColor: '#e2e2e2'

    },
    pingFengMingXiAndGuanLiYuanGong: {
        fontSize: 15,
        lineHeight: 40,
    },
    detailText: {
        lineHeight: 30,
        color:'#000000',
    },
    scoreDetail: {
        flex: 2.6,
        backgroundColor: 'white',
        width: Dimensions.get('window').width  * 0.90,
        alignSelf: "center",
        borderWidth: 1,
        borderColor: '#e2e2e2'
    },


    container: {
        flex: 1,
        backgroundColor: '#f6f6f6',
    },
    images:{
        height:45,
        width:45,
        borderRadius:45,
        marginLeft:10
    },
    header:{
        backgroundColor:'#61c0c5',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height:50,
        borderBottomLeftRadius: 150,
        borderBottomRightRadius: 150,
    },
    main:{
        backgroundColor:'#fff',
        marginLeft: 18,
        marginRight: 18,
        marginTop: -50,
        paddingTop:15,
        paddingBottom:0,
        borderRadius: 5,
        overflow:'hidden'
    },
    title:{
        paddingLeft:30,
        marginTop:5,
        flexDirection: 'row',
        justifyContent:'space-between',
    },
    scrollViewStyle: {
        // 背景色
        backgroundColor:'red'
    },

    itemStyle: {
        // 尺寸
        width:100,
        height:200
    },
});
