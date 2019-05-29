

import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    InteractionManager,
    TextInput,
    ListView,
    Modal,
    // AsyncStorage,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import BaseComponent from '../../base/BaseComponent'
import * as Dimens from '../../value/dimens';
// import Setting from './Setting';
import Pop from 'rn-global-modal'
// import HospitalPicker from '../entry/HospitalPicker';

import Request, {AuthToken, GetUserInfo} from '../../http/Request';
import {Toast} from '../../component/Toast'
import { aesEncrypt } from '../../util/CipherUtils';

let tempTypeIds = [1,2,3,4];

const STORE_DATA={
    "api":"GetStoreList",
    "v":"1.0",
    "code":"0",
    "msg":"success",
    "data":[{
        "id":1,
        "name":"四川Brunch",
        "star":4,
        "comment":45,
        "tag":"中国餐馆,四川菜,重辣",
        "location":"6.6km",
        "remark":"每日有优惠",
        "isSelected":0,
    },{
        "id":2,
        "name":"聚星楼",
        "star":4,
        "comment":45,
        "tag":"中国餐馆,四川菜,重辣",
        "location":"6.6km",
        "remark":"每日有优惠",
        "isSelected":0,
    },{
        "id":3,
        "name":"四川川二娃",
        "star":4,
        "comment":45,
        "tag":"中国餐馆,四川菜,重辣",
        "location":"6.6km",
        "remark":"每日有优惠",
        "isSelected":0,
    },{
        "id":4,
        "name":"韩国大烤肉",
        "star":4,
        "comment":45,
        "tag":"中国餐馆,四川菜,重辣",
        "location":"6.6km",
        "remark":"每日有优惠",
        "isSelected":0,
    },{
        "id":5,
        "name":"釜山料理",
        "star":4,
        "comment":45,
        "tag":"中国餐馆,四川菜,重辣",
        "location":"6.6km",
        "remark":"每日有优惠",
        "isSelected":0,
    }
    ]
};

var username = '';
var password = '';

export default class Login extends BaseComponent {

    static navigationOptions = {
        header: null,
    };

    constructor(props){
        super(props);
        console.log('Login');
        this.state={
            focusIndex:-1,
            nameBgColor: '#eeeeee',
            pswBgColor: '#eeeeee',
            theme:this.props.theme,
            keepPsw: false,
            dialogShow: false,
            dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2)=> {
                    if (r1 !== r2) {
                        console.log("不相等=");
                        console.log(r1);
                    } else {
                        console.log("相等=");
                        console.log(r1);
                        console.log(r2);
                    }
            return true//r1.isSelected !== r2.isSelected;
        }
    }),
            storeLists :STORE_DATA.data,
            selectIndex: '-1',
            modalVisible: false,
        }

    }


    _onFocus(index) {

        if (index === 0) {
            this.setState({
               focusIndex:index,
               nameBgColor: '#5ec4c8',
               pswBgColor: '#eeeeee',
           });
        } else if (index === 1) {

            this.setState({
               focusIndex:index,
               pswBgColor: '#5ec4c8',
               nameBgColor: '#eeeeee',
           });
        }

        console.log('_onFocus2 : ' + this.state.focusIndex + ", this.state.nameBgColor = " + this.state.nameBgColor);
    }

    _onRemember() {
        console.log('onRemember');
        this.setState({keepPsw:!this.state.keepPsw});
    }

    _setting() {
        const {navigation} = this.props;
        InteractionManager.runAfterInteractions(() => {
            // navigator.push({
            //     component: Setting,
            //     name: 'Setting',
            //     params:{
            //         theme:this.theme
            //     }
            // });
            navigation.navigate( 'Setting',{theme:this.theme})
        });
    }

    _onForgotPsw() {
        const {navigation} = this.props;
        InteractionManager.runAfterInteractions(() => {
            // navigator.push({
            //     component: HospitalPicker,
            //     name: 'HospitalPicker',
            //     params:{
            //         theme:this.theme
            //     }
            // });
            navigation.navigate('HospitalPicker',{theme:this.theme})
        });
    }

    _onLogin() {

    // if(username === ''){
    //      Toast.show('用户名不能为空');
    //      return;
    //  }
    //  if (password === '') {
    //      Toast.show('密码不能为空');
    //      return;
    //  }

     var psw = aesEncrypt(password);
     console.log('password: ' + password + ', psw: ' + psw);
     var that = this;
     var params = new Map();
     params.set('username', username);
     params.set('password', encodeURIComponent(psw));
     global.access_token = null;
     Request.requestGet(AuthToken, params, (result)=> {
        if (result && result.access_token) {
            Toast.show('登录成功');
            // global.storage.save({
            //         key:'token',
            //         data: result.access_token,
            //         expires: result.expires_in
            //     });
            global.access_token = result.access_token;
            AsyncStorage.setItem('token', result.access_token, function (error) {
                if (error) {
                   console.log('error: save error');
                } else {
                   console.log('save: access_token = ' + result.access_token);
                }
            });

            that.fetchUserInfo();
        } else {
            Toast.show('登录失败，请重试');
        }

    });

}

fetchUserInfo() {
    var that = this;
    Request.requestGet(GetUserInfo, null, (result)=> {
        //console.log('result.code: ' + result.code + ', is 200: ' + (result.code === 200));
        if (result && result.code === 200) {
            // global.storage.save({
            //         key:'uinfo',
            //         data: result.data,
            //         expires: null
            //     });
            global.uinfo = result.data;
            global.userId=global.uinfo.userId;
            global.deptId=global.uinfo.deptAddresses[0].deptId;

            //console.log('uinfo: data = ' + JSON.stringify(result.data));
            AsyncStorage.setItem('uinfo', JSON.stringify(result.data), function (error) {
                //console.log('uinfo: error' + error);
                if (error) {
                   console.log('error: save error' + JSON.stringify(error));
                } else {
                   //console.log('save: uinfo = ' + JSON.stringify(result.data));
                }

                //DeviceEventEmitter.emit('ACTION_BASE_', "_onLogin_", result.data);
                // that.naviGoBack(that.props.navigator)

                const {navigation} = that.props;
                navigation.goBack()
            });
        }

    });
}

_hide() {
    Pop.hide();

    this.setState({modalVisible:false});
}

_pressSelect() {
    this.setState({modalVisible:true, dataSource:this.state.dataSource.cloneWithRows(this.state.storeLists)});

    //Pop.show(popView, {animationType: 'slide-up', maskClosable: true, onMaskClose: ()=>{}});
}


_renderSeparatorView(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
    return (
      <View key={`${sectionID}-${rowID}`} style={styles.separator} />
      );
  }
  //点击列表每一项响应按钮
  onPressItem(data){
      var items = this.state.storeLists;
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.id === data.id) {
            item.isSelected = 1;
        } else {
            item.isSelected = 0;
        }

    }

    this.setState({modalVisible:true, dataSource:this.state.dataSource.cloneWithRows(items), storeLists:items});
}
//进行渲染数据
renderContent(dataSource) {
    return (
    <ListView
    initialListSize={1}
    dataSource={dataSource}
    renderRow={(item) => this.renderItem(item)}
    style={{backgroundColor:'white',flex:1, height:219,}}
    onEndReachedThreshold={10}
    enableEmptySections={true}
    renderSeparator={(sectionID, rowID, adjacentRowHighlighted) =>
        this._renderSeparatorView(sectionID, rowID, adjacentRowHighlighted)
    }
    />
    );
}


renderItem(data) {
    var that = this;
    return (
    <View key={data.id}>
    <TouchableOpacity onPress={()=>{that.onPressItem(data)}} style={{height:45,flex:1}}>
    <View style={{flexDirection:'row',marginLeft:20,height:45,textAlignVertical:'center',alignItems: 'center',}} >
    <Image source={data.isSelected===0 ? require('../../../res/login/checkbox_nor.png') : require('../../../res/login/checkbox_pre.png')} style={{width:18,height:18}}/>
    <Text style={{fontSize:14,color:'#777',marginLeft:15,}}>{data.name}</Text>
    </View>
    </TouchableOpacity>

    </View>
    );
}

//渲染每一项的数据
renderItemEx(data) {
    return (
    <View key={data.id}>
    <TouchableOpacity onPress={()=>{this.onPressItem(data)}}>
    <View style={{flexDirection:'row',marginLeft:8,marginTop:8,marginBottom:8}} >
    <Image source={require('../../../res/images/ic_store_lv_item.png')} style={{width:130,height:115}}/>
    <View style={{marginLeft:8,width:(Dimens.screen_width-149)}}>
    <Text style={{fontSize:15,color:'black'}}>{data.name}</Text>
    <View style={{flexDirection:'row',marginTop:3}}>
    {
       tempTypeIds.map((typeId) => {
          const typeView = (<Image key={typeId}
          source={require('../../../res/images/ic_store_star.png')}
          style={{width:10,height:10,marginLeft:3,marginTop:3}}/>);
          return typeView;
      })
  }
  <Text style={{fontSize:12,color:'#777',marginLeft:3}}>{data.comment}条评论</Text>
  </View>
  <Text style={{fontSize:12,color:'#777',marginTop:3}}>{data.tag}</Text>
  <View style={{flexDirection:'row'}}>
  <Text style={{fontSize:12,color:'#777',marginTop:3}}>{data.location}</Text>
  </View>
  <View style={{flexDirection:'row'}}>
  <Text style={{fontSize:12,color:'#777',marginTop:3}}>{data.remark}</Text>
  </View>
  </View>
  </View>
  </TouchableOpacity>
  <Image source={require('../../../res/images/ic_short_bar.png')}/>
  </View>
  );
}


render() {

    var image = <TouchableOpacity style={styles.TouchableOpacityRightImgview} onPress={ ()=> {
        this._setting()
    } }>
    <View style={{alignItems: 'center'}}>
    <Image
    style={styles.rightImage}
    source={require('../../../res/login/navbar_ico_set.png')}/>

    </View>
    </TouchableOpacity>

    let touchableOpacity =
    <TouchableOpacity
    style={styles.TouchableOpacityLeftText}
    onPress={()=> this._pressSelect() }>
    <Text style={{fontSize:14,color:'#999999',height:25,textAlignVertical:'center',textAlign:'center',}}>全院</Text>
    <Text
    style={{borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
        borderBottomRightRadius: 6,
        borderBottomLeftRadius: 6,
        fontSize:14,
        marginLeft:6,
        color:'#5ec4c8',
        backgroundColor: '#ffffff',
        alignItems:'center',
        justifyContent:'center',
        textAlignVertical:'center',
        borderWidth:1,
        borderColor:'#5ec4c8',
        width:38,
        height:25,
        textAlign:'center',
    }}>切换</Text>

    </TouchableOpacity>

    let iOSTop = null;
    if (Dimens.isIOS) {
        iOSTop = <View style={{backgroundColor: 'white', height: (Dimens.isIphoneX()?30:20)}}/>
    }

    return (
    <View style={styles.container}>

    {iOSTop}
    <View style={{
        height:44,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: Dimens.color_line_cc,
    }}>
    <View style={styles.containerText}>
    {touchableOpacity}
    <Text style={{
        fontSize: 18,
        color: Dimens.color_text_33
    }}>登录</Text>

    {image}
    </View>
    </View>

    <View style={styles.logo_center_bg}>
    <Image
    style={{width:207,height:48}}
    source={require('../../../res/login/ic_logo.png')}
    />
    </View>

    <View style={styles.input_center_bg}>
    <View style={styles.input_item}>
    <Image source={this.state.focusIndex===0?require('../../../res/login/login_user_pre.png'):require('../../../res/login/login_user_nor.png')}
    style={{width:20,height:20,marginLeft:40}}/>

    <TextInput
    style={styles.input_style}
    placeholder="请输入手机号或用户名"
    placeholderTextColor="#aaaaaa"
    underlineColorAndroid="transparent"
    numberOfLines={1}
    ref={'username'}
    autoFocus={true}
    onChangeText={(text) => {
     username = text;}}
    onFocus={(event) => this._onFocus(0)}
    onBlur={(event) => this._onFocus(-1)}
 />
 </View>
 <View style={{backgroundColor:this.state.nameBgColor,height:1,width:(Dimens.screen_width-40),marginTop:5}} />
 <View style={{flexDirection:'row',height:40,alignItems:'center',marginTop:20,}}>
 <Image source={this.state.focusIndex===1?require('../../../res/login/login_password_pre.png'):require('../../../res/login/login_password_nor.png')}
 style={{width:20,height:20,marginLeft:40}}/>
 <TextInput
 style={styles.input_style}
 placeholder="请输入密码"
 placeholderTextColor="#aaaaaa"
 underlineColorAndroid="transparent"
 numberOfLines={1}
 ref={'password'}
 secureTextEntry={true}
 onChangeText={(text) => {
     password = text;
 }}
 onFocus={(event) => this._onFocus(1)}
 onBlur={(event) => this._onFocus(-1)}
 />

 </View>
 <View style={{backgroundColor:this.state.pswBgColor,height:1,width:(Dimens.screen_width-40),marginTop:5}} />

 </View>

 <Text
 onPress={()=>this._onLogin()}
 style={{
    height:46,
    color:'#ffffff',
    fontSize:18,
    textAlign:'center',
    backgroundColor: '#5ec4c8',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    borderBottomLeftRadius: 6,
    marginTop:30,
    marginLeft:30,
    marginRight:30,
    alignItems:'center',
    justifyContent:'center',
    textAlignVertical:'center',
}}>登录</Text>

<View style={{flexDirection :'row', justifyContent: 'space-between', marginTop:10, marginLeft:30, marginRight:30,}}>
<TouchableOpacity style={{flexDirection :'row', }} onPress={()=>this._onRemember()}>
<Image
style={{width:18,height:18}}
source={this.state.keepPsw?require('../../../res/login/radio_pre.png'):require('../../../res/login/radio_nor.png')}
/>
<Text style={{fontSize:14, color:'#777', marginLeft:10,}}>记住密码</Text>
</TouchableOpacity>
<Text style={{fontSize:14,color:'#777'}}></Text>
<Text style={{fontSize:14,color:'#777'}} onPress={()=>this._onForgotPsw()}>忘记密码</Text>
</View>

<Image source={require('../../../res/login/login_bottom.png')}
style={styles.logo_bottom}>

</Image>

<Text style={{

    color:'#bbbbbb',
    fontSize:12,
    textAlign:'center',
    margin:30,
    alignItems:'center',
    justifyContent:'center',
    textAlignVertical:'center',
    position: 'absolute',
    top: Dimens.screen_height-110,
    left: 0,
    right: 0,
}}>上海见行信息科技有限公司</Text>

<Text style={{

    color:'#bbbbbb',
    fontSize:12,
    textAlign:'center',
    margin:30,
    alignItems:'center',
    justifyContent:'center',
    textAlignVertical:'center',
    position: 'absolute',
    top: Dimens.screen_height-95,
    left: 0,
    right: 0,
}}>版权所有@2018-2025</Text>

<Modal
animationType={"none"}
transparent={true}
visible={this.state.modalVisible}
onRequestClose={() => {}}
>
<View style={{top:0,height:Dimens.screen_height,width:Dimens.screen_width,backgroundColor: 'rgba(0,0,0,0.5)',alignItems:'center',justifyContent:'center',}}><View style={{height: 300, width: '60%', backgroundColor:'transparent'}}>
<Text style={{borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    fontSize:15,
    color:'#777777',
    backgroundColor: '#ffffff',
    alignItems:'center',
    justifyContent:'center',
    textAlignVertical:'center',
    height:40,
    textAlign:'center',
}}>选择院区</Text>
<View style={{backgroundColor: '#eeeeee', height:1}}/>
<View style={{height:219,}}>

<ListView
initialListSize={1}
dataSource={this.state.dataSource}
renderRow={(item) => this.renderItem(item)}
style={{backgroundColor:'white',flex:1, height:219,}}
onEndReachedThreshold={10}
enableEmptySections={true}
renderSeparator={(sectionID, rowID, adjacentRowHighlighted) =>
    this._renderSeparatorView(sectionID, rowID, adjacentRowHighlighted)
}
/>
</View>
<View style={{height:40,flexDirection:'row',borderBottomRightRadius: 10,borderBottomLeftRadius: 10,backgroundColor: '#f5f5f5',}}>
<Text onPress={()=> {this._hide()}}
style={{fontSize:15,
    color:'#777777',
    flex: 1,
    alignItems:'center',
    justifyContent:'center',
    textAlignVertical:'center',
    height:40,
    textAlign:'center',
}}>取消</Text>
<Text onPress={()=> {this._hide()}}
style={{fontSize:15,
    color:'#777777',
    flex: 1,
    borderBottomRightRadius: 10,
    alignItems:'center',
    justifyContent:'center',
    textAlignVertical:'center',
    height:40,
    backgroundColor: '#eaeaea',
    textAlign:'center',
}}>确定</Text>
</View>

</View>
</View>
</Modal>
</View>

)
}
}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'white',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },

    welcome:{
        color:'#123456',

    },
    logo_center_bg:{
        alignItems:'center',
        height:48,
        width:Dimens.screen_width,
        marginTop:40
    },

    input_center_bg:{
        alignItems:'center',
        height:120,
        width:Dimens.screen_width,
        marginTop:40,

    },
    logo_bottom:{
        alignItems:'center',
        height:120,
        width:Dimens.screen_width,
        position: 'absolute',
        top: Dimens.screen_height-120,
        left: 0,
        right: 0,
        alignSelf: 'center'
    },
    input_item:{
        flexDirection:'row',height:40,alignItems:'center',marginTop:10,
    },
    input_style:{
        fontSize: 15,height:40,textAlign: 'left',textAlignVertical:'center',flex:1,marginLeft:10
    },
    line:{
        backgroundColor:'#eeeeee',height:1,width:(Dimens.screen_width-40),marginTop:5,
    },
    TouchableOpacityRightImgview: {
        position: 'absolute',
        right: 0,
        top: 8,
        bottom: 8,
        justifyContent: 'center',
    },
    rightTxt: {
        fontSize: 15,
        color: Dimens.color_text_33,
    },
    rightImage: {
        width: 22,
        height: 22,
        marginRight:15,
    },
    containerText: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        height: 44,
    },
    TouchableOpacityLeftText: {
        position: 'absolute',
        left: 15,
        top: 8,
        bottom: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        textAlignVertical:'center',
    },
    dialogContentView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    separator: {
     height: 0.5,
     backgroundColor: '#eee'
 }
});


// {"code":200,"data":{"customerId":"1055390940066893827",
// "deptAddresses":[{"buildingId":"1078386477644865537","buildingName":"后勤大楼","deptId":"1078641550383865857",
// "deptName":"后勤总仓","detailAddress":"后勤大楼 / 1F / 001","floorId":"1078647953580318722","floorName":"1F",
// "parentId":null,"roomId":"1078648182631260162","roomName":"001"}],"gender":"1","generalFlag":"1",
// "headImgId":"https://dev.jxing.com.cn/000569/oss_images/c8b7278053444b2191b506db94574266.jpg",
// "hospitalIdList":["1055390940066893827","1098891173140557825","1116210351425863681"],
// "hospitalName":"上海市仁济人民医院","isAdmin":1,



