import React, { Component } from 'react';
import {
    StyleSheet,
    Dimensions,
    View,
    Modal,
    TouchableOpacity,
    Image,
    ListView
} from 'react-native';
import { Content,Row,Col,Text,List,ListItem,Button } from 'native-base';
import Axios from '../../util/Axios';
import * as Dimens from '../../js/value/dimens';
import AsyncStorage from '@react-native-community/async-storage';

let ScreenWidth = Dimensions.get('window').width;
let ScreenHeight = Dimensions.get('window').height;
class DeptType extends Component {

  render() {
    return (
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={this.props.modalVisible}
                onRequestClose={() =>this.props.isShowModal()}
            >
                <TypeMd Close={this.props.isShowModal} goToRepair={this.props.goToRepair} />
            </Modal>
    )
  }
}
class TypeMd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            repairList : [],
            deptData:null,
            returnList:null,
            childrenList:[],
            customerId: null,
            dadId:null,
            dadname:null,
            deptName:null,
            dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2)=> {
                    if (r1 !== r2) {

                    } else {

                    }
            return true
            }}),
            dataSource1: new ListView.DataSource({
                rowHasChanged: (r1, r2)=> {
                    if (r1 !== r2) {

                    } else {

                    }
            return true
            }}),
            };
        
      }
      
      componentDidMount(){
          this.loadData()
      }
      loadData(){
        var that = this;
        AsyncStorage.getItem('uinfo',function (error, result) {
            if (error) {
                console.log(error)
            }else {
                console.log(result)
                let userInfo = JSON.parse(result);
                var customerId = userInfo.customerId
                // that.setState({
                //     customerId : customerId
                // })
                that.getDeptListData(customerId)
            }

        })
      }
      getDeptListData(id){
        var   url="/api/basic/hospital/getDeptStructure";
        //接口获取报修类型
        Axios.GetAxios(url).then(
            (response) => {
                    var types = response.data;
                    var childList = types[0].childrenList
                    var list = null
                    childList.map((item,i)=>{
                        if(item.id == id){
                            list = item.childrenList 
                        }
                    })
                    console.log(list)
                    this.setState({
                        repairList:list,
                        dataSource:this.state.dataSource.cloneWithRows(list),
                    });
                    }
        )
      }
      
      //左侧
      renderItemLeft(data) {
            var that = this; 
            var color = this.state.dadId&&this.state.dadId==data.id ? '#444' : '#999';
            var img = null;
            if (this.state.dadId&&this.state.dadId==data.id) {
                img = <Image source={require('../../res/login/ic_arrow.png')} 
                style={{width:6,height:11,marginLeft:15,marginRight:15,}}/>
            }
            
            return (
            <View key={data.repairTypeId}>
                <TouchableOpacity onPress={()=>{this.onPressItemLeft(data)}} style={{height:45,flex:1,backgroundColor: '#f6f6f6',}}>
                    <View style={{flexDirection:'row',marginLeft:10,height:45,textAlignVertical:'center',alignItems: 'center',}} >
                        <Text style={{fontSize:14,color:color,marginLeft:15,flex:1}}>
                            {data.name}
                        </Text>
                        {img}
                    </View>
                </TouchableOpacity>
            </View>
            );
        }
        //左侧按钮方法
        onPressItemLeft(data){
            var that = this;
            var items = this.state.repairList;
            this.setState({
                dataSource1:that.state.dataSource1.cloneWithRows(data.childrenList), 
                dataSource:that.state.dataSource.cloneWithRows(items),  
                dadId : data.id,
                dadname : data.name,
                childrenList:data.childrenList
            })
           
        
        }
        //右侧
        renderItem(data) {
            var that = this;
            return (
                <View key={data.repairTypeId}>
                    <TouchableOpacity onPress={()=>{that.onPressItem(data)}} style={{height:45,flex:1}}>
                        <View style={{
                                    flexDirection:'row',
                                    marginLeft:10,height:45,
                                    textAlignVertical:'center',
                                    alignItems: 'center',}} >
                            <Image source={this.state.deptData&&this.state.deptData.id===data.id ? 
                                    require('../../res/login/checkbox_pre.png') :
                                    require('../../res/login/checkbox_nor.png')} 
                                    style={{width:18,height:18}}/>
                            <Text style={{fontSize:14,color:'#777',marginLeft:15,}}>{data.name}</Text>
                        </View>
                    </TouchableOpacity>
            
                </View>
            );
        }  
        //右侧按钮方法
        onPressItem(data){
            var items = this.state.childrenList;
            this.setState({
                dataSource1:this.state.dataSource1.cloneWithRows(items),
                deptData:data,
                deptName:data.name
            })
        }
        _renderSeparatorView(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
         return (
            <View key={`${sectionID}-${rowID}`} style={styles.separator} />
            );
        }
        //确认按钮
        submit(){
            console.log('确认');
            console.log(this.state.deptName)
            var deptName = null;
             var dadname = null;  
            if(this.state.deptName || this.state.dadname){
                if(this.state.deptName){
                    deptName = this.state.deptName
                    this.props.goToRepair(
                        deptName
                    )  
                } else {
                    dadname = this.state.dadname
                    this.props.goToRepair(
                        dadname
                    ) 
                } 
                
            }
                        
        }
        render(){
          
        
            return (
                <View style={modalStyles.container}>
                 
            <View style={{top:0,height:Dimens.screen_height,width:Dimens.screen_width,backgroundColor: 'rgba(0,0,0,0.5)',alignItems:'center',justifyContent:'center',}}>
                <View style={styles.bottomStyle}>
                    <View style={styles.topStyle}>
                        <Text onPress={this.props.Close} style={{color:'#9b9b9b', marginLeft:10, flex:1}}>取消</Text>
                        <Text onPress={()=>this.submit()} style={{color:'#9b9b9b', marginRight:10, }}>确定</Text>
                    </View>
                    <View style={{flexDirection:'row', height:300,}}>
                    <ListView
                        initialListSize={1}
                        dataSource={this.state.dataSource}
                        renderRow={(item) => this.renderItemLeft(item)}
                        style={{backgroundColor:'white',flex:1,height:300,width:Dimens.screen_width/3,}}
                        onEndReachedThreshold={10}
                        enableEmptySections={true}
                        renderSeparator={(sectionID, rowID, adjacentRowHighlighted) =>this._renderSeparatorView(sectionID, rowID, adjacentRowHighlighted)}/>

                    <ListView
                        initialListSize={1}
                        dataSource={this.state.dataSource1}
                        renderRow={(item) => this.renderItem(item)}
                        style={{backgroundColor:'white',flex:1,height:300,width:Dimens.screen_width*2/3,}}
                        onEndReachedThreshold={10}
                        enableEmptySections={true}
                        renderSeparator={(sectionID, rowID, adjacentRowHighlighted) =>this._renderSeparatorView(sectionID, rowID, adjacentRowHighlighted)}/>

                    </View>
                </View>
            </View>
                </View>
            );
        }
}


const modalStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    innerContainer: {
        borderRadius: 10,
        height:'80%',
        alignItems:'center',
        backgroundColor: '#fff',
    },

});

const styles = StyleSheet.create({
    modelStyle:{
        flex: 1,
        width:Dimens.screen_width,
        height:Dimens.screen_height,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    bottomStyle:{
        width:Dimens.screen_width,
        height:335,
        textAlign:'center',
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        alignSelf: 'center'
      },
      topStyle: {
            flexDirection:'row',
            fontSize:14,
            backgroundColor: '#EFF0F1',
            width:Dimens.screen_width,
            height:35,
            alignItems:'center',
        justifyContent:'center',
        textAlignVertical:'center',
        },
})





module.exports=DeptType;