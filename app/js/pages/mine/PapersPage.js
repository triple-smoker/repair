

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
import TitleBar from '../../component/TitleBar';
import BaseComponent from '../../base/BaseComponent'
import * as Dimens from '../../value/dimens';
import AsyncStorage from '@react-native-community/async-storage';
import Request, {baseOptCert} from '../../http/Request';
import {Content, Accordion, Col, Textarea, Button,} from "native-base";
import {toDate} from '../../util/DensityUtils'
let ScreenWidth = Dimensions
  .get('window')
  .width;
let ScreenHeight = Dimensions
  .get('window')
  .height;
export default class PapersPage extends BaseComponent {
    static navigationOptions = {
        header: null,
    };
    constructor(props){
        super(props);
        this.state={
            theme:this.props.theme,
            userData:null,
            optCertData:null
        }
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
                // console.log(userInfo)
                that.loadOptCert(userInfo.userId)
            }
        })    
    }
    loadOptCert(id){
        Request.requestGet(baseOptCert+id,null,(result) => {
            if(result && result.code == 200){
                console.log(result.data)
                this.setState({
                    optCertData:result.data
                })
            }
        })
    }
    OptCertList(item,i){
        console.log(item)
        var list = <View key={item.archivesNo}  style={styles.content_bg}> 
                    <View style={{ 
                        flexDirection:'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginLeft:0,
                        marginRight:0,
                        paddingLeft: 12,
                        paddingRight: 12,
                        paddingTop: 5,}}> 
                        <Image style={styles.paperImg} source={{uri:item.filePath}}/>
                        <Text>({item.archivesNo})</Text>
                    </View>
                </View>
        return( 
            <Accordion
                dataArray={[{item:item, content:list}]}
                animation={true}
                expanded={true}
                renderHeader={this._renderHeader.bind(this)}
                renderContent={this._renderContent.bind(this)}
                expanded={0}
            /> 
        )
    }
    _renderContent(item) {
        return (
            <Content>
                {item.content}
            </Content>
        );
    }
    _renderHeader(data,expanded){
        var item = data.item;
        var expireTime = item.expireTime;
        console.log(item)
        console.log(expanded)
        var headerStyle = expanded ? styles.header_bg :styles.header_bg1;
        return(
            <View key={data.content.key} style={{...headerStyle,...styles.headerRepeat}}>
                <View style={styles.case}>
                    <Text style={{fontSize:16,color:'#404040'}}>
                        证照名称
                    </Text>
                    <View style={{flexDirection:'row',justifyContent:'flex-end',alignItems: 'center',}}>
                     {
                         expanded ?
                         <Image style={{height:5,width:7,marginLeft:5}} source={require('../../../res/login/dropdown_02.png')}/>
                         : <Image style={{height:5,width:7,marginLeft:5}} source={require('../../../res/login/dropdown_01.png')}/>
                     }   
                    
                    </View>
                    
                </View>
                <View style={styles.case}>
                    <Text style={{fontSize:15,color:'#404040'}}>
                       【维修类】
                    </Text>
                    <Text style={{fontSize:15,color:'#404040'}}>
                        有效期： {toDate(expireTime,'yyyy-MM-dd')}
                    </Text>
                    <Text style={{fontSize:15,color:'#404040'}}>
                    {item.expireDays > 0 ? '-使用中-' : '已过期'} 
                    </Text>

                </View>
              
            </View>
        )
    }

    render() {
        var  userData = this.state.userData;
        if (userData) {
            var headerImg = userData.headImgId;
            var workNumber = userData.workNumber;
            var  deptName = userData.deptAddresses[0].deptName
            var userName = userData.userName;
            var gender = userData.gender;
            var telNo = userData.telNo;
        }
        var optCertData = this.state.optCertData
        var ViewLIst = <Text style={{textAlignVertical:'center',backgroundColor:'white', color:'#999',fontSize:14, height:50, textAlign:'center',}}>暂无证照</Text>;
        if(optCertData && optCertData.length > 0){
            ViewLIst = optCertData.map((item,i)=>{
                return this.OptCertList(item) 
            })    
        }
        return (
          <View style={styles.container}>
          <TitleBar
          centerText={'证照'}
          isShowLeftBackIcon={true}
          navigation={this.props.navigation}
          leftPress={() => this.naviGoBack(this.props.navigation)}
          
          />
          <ScrollView horizontal={false} indicatorStyle={'white'} showsVerticalScrollIndicator={true} style={{height:Dimens.screen_height-40-64, 
                    width:Dimens.screen_width,flex:1}}>
            {
                ViewLIst
            }
            
            {/* <View style={styles.input_center_bg}>
                <View>
                    <View style={styles.case}>
                        <Text style={{fontSize:16,color:'#404040'}}>
                            证照名称
                        </Text>
                        <View style={{flexDirection:'row',justifyContent:'flex-end',alignItems: 'center',}}>
                        <Image style={{height:5,width:7,marginLeft:5}} source={require('../../../res/login/dropdown_02.png')}/>
                        </View>
                        
                    </View>
                    <View style={styles.case}>
                        <Text style={{fontSize:15,color:'#404040'}}>
                        【维修类】
                        </Text>
                        <Text style={{fontSize:15,color:'#404040'}}>
                            有效期： 2019-12-31
                        </Text>
                        <Text style={{fontSize:15,color:'#404040'}}>
                            -使用中-
                        </Text>

                    </View>
                </View>
                <View style={{ 
                    flexDirection:'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft:0,
                    marginRight:0,
                    paddingLeft: 12,
                    paddingRight: 12,
                    paddingTop: 5,}}> 
                     <Image style={styles.paperImg} source={require('../../../res/login/menu_ljbx.jpg')}/>
                    <Text>(1)</Text>
                </View>
                <View style={{ 
                    flexDirection:'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft:0,
                    marginRight:0,
                    paddingLeft: 12,
                    paddingRight: 12,
                    paddingTop: 5,}}> 
                     <Image style={styles.paperImg} source={require('../../../res/login/menu_ljbx.jpg')}/>
                    <Text>(2)</Text>
                </View>
            </View> */}
           
            </ScrollView>
       
        
    </View>

    )
}

}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
    paperImg:{
        height:195,width: ScreenWidth - 48, 
        marginLeft:0,marginRight:0, borderRadius:5,
        borderColor: '#d0d0d0',
        borderWidth: 1,
    },
    case:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginLeft:0,
        marginRight:0,
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 5,
    },
    input_center_bg:{
        overflow:'hidden',
        backgroundColor: '#fff',
        marginTop:12,
        marginLeft:12,
        marginRight:12,
        marginBottom: 15,
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius:5,
        borderColor: '#d0d0d0',
        borderWidth: 1,
    },
    headerRepeat:{
        overflow:'hidden',
        backgroundColor: '#fff',
        marginTop:12,
        marginLeft:12,
        marginRight:12,
        borderColor: '#d0d0d0',
        borderWidth: 1,
        paddingTop: 10,
        paddingBottom: 10,
    },
    header_bg1:{   
        marginBottom: 10,
        borderRadius: 5,
    },
    header_bg:{   
        marginBottom: 0,   
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        borderBottomWidth:0
    },
    content_bg:{
        overflow:'hidden',
        backgroundColor: '#fff',
        marginTop:0,
        marginLeft:12,
        marginRight:12,
        marginBottom: 15,
        paddingTop: 0,
        paddingBottom: 10,
        borderBottomLeftRadius:5,
        borderBottomRightRadius:5,
        borderColor: '#d0d0d0',
        borderWidth: 1,
        borderTopWidth: 0,
    },
    input_item:{
        flexDirection:'row',height:40,alignItems:'center',marginTop:0,
    },
    input_style:{
        fontSize: 15,height:40,textAlign: 'left',textAlignVertical:'center',flex:1,marginLeft:0
    },
    line:{
        backgroundColor:'#eeeeee',height:1,width:(Dimens.screen_width-20),marginTop:0,
    },
});