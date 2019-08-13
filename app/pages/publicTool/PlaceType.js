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
// import Request from '../../util/Request';
import Request, {ScanMsg,ScanDetails,Attr} from '../../js/http/Request';

let ScreenWidth = Dimensions.get('window').width;
let ScreenHeight = Dimensions.get('window').height;
class PlaceType extends Component {

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
            repairParent:'',
            repairParentCn:'',
            repairChildCn:'',
            repairChildList:[],
            repairChild:'',
            repairCareList:[],
            deptList:[],
            userList:[],
            selUserList:[],
            selectTypeData:null,
            selectChildrenData:null,
            returnList:null,
            childrenList:[],
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
            buildList:[],
            buildingId:null,
            buildingName:null,
            floorName:null,
            roomName:null,
            step:1,
            floorList:[],
            isNoneShow:false,
            placeType:1,
            };
      }
      
      componentDidMount(){
        this.loadDetail(1)
      }
      //加载数据 （type 1 内部 2外部）
      loadDetail(type){
        var url1 = 'api/basic/baseBuilding/list' 
        var url2 = 'api/basic/baseInpatientWard/list'
        var params = new Map();
        params.set('hospitalId', global.hospitalId);
        if(type == 1){
            Request.requestGet(url1,params,(res)=>{
                console.log('resssssssssssssssssssss')
                console.log(res)
                var data = res.data.records;
                this.setState({
                    buildList:data,
                    step:1,
                    placeType:1,
                    dataSource:this.state.dataSource.cloneWithRows(data),
                })   
            })
        }else if(type ==2){
            Request.requestGet(url2,null,(res)=>{
                var data = res.data.records;
                this.setState({
                    buildList:data,
                    step:1,
                    placeType:2,
                    dataSource:this.state.dataSource.cloneWithRows(data),
                })   
            })
        }
        
      }

 
      // 数据级别 （数据）
      renderItemLeft(data) {
            var that = this;
            var name = null;
            var id = null;
            var step = this.state.step
            var placeType = this.state.placeType
            var publictxt = "";
              if(data.publicType === '1'){
                  publictxt = ' （室外）'
              }
            if(step === 1){
                if(placeType === 1){
                    name = data.buildingName
                    id = data.buildingId
                }else if(placeType === 2){
                    name = data.inpatientWardName
                    id = data.inpatientWardId
                }
                
            }else if(step === 2){
                name = data.floorName
                id = data.floorId
            }else if(step === 3){
                name = data.roomName
                id = data.roomId
            }
            
            
            return (
            <View key={id}>
                <TouchableOpacity onPress={()=>{this.onPressItemLeft(data,step)}} style={{height:40,flex:1,backgroundColor: '#f2f2f2',}}>
                    <View style={{flexDirection:'row',marginLeft:10,height:40,textAlignVertical:'center',alignItems: 'center',}} >
                        <Text style={{fontSize:13,color:'#404040',marginLeft:15,flex:1}}>
                            {name+publictxt}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
            );
        }
        //按钮方法 （数据，选择层级 1楼宇 2楼层 3房间，是否重新选择）
        onPressItemLeft(data,step,update){
            if(step == 1 && this.state.placeType == 2){
                var txt =  data.inpatientWardName
                var txt2 = data.hospitalName
                var name = txt2 + ' '+txt
                this.setState({
                    buildingName:name,
                })
                setTimeout(
                    () => {
                        this.submit()    
                    }, 500
                ) 
                return  
            }
            if(step == 1){
                var url = 'api/basic/baseFloor/list' 
                var params = new Map();
                if(update){
                    params.set('buildingId', this.state.buildingId);
                    Request.requestGet(url,params,(res)=>{
                        var data = res.data.records;
                        this.setState({
                            step:2,
                            isNoneShow:false,
                            buildList:data,
                            dataSource:this.state.dataSource.cloneWithRows(data),
                        })
                        
                    })
                }else{
                    var buildingId = data.buildingId;
                    var name = data.buildingName
                    params.set('buildingId', data.buildingId);
                    Request.requestGet(url,params,(res)=>{
                        var data = res.data.records;
                        this.setState({
                            buildingId:buildingId,
                            buildingName:name,
                            isNoneShow:false,
                            step:2,
                            buildList:data,
                            dataSource:this.state.dataSource.cloneWithRows(data),
                        })
                        
                    })
                }
                
                
            }else if(step==2){
                
                var url = 'api/basic/baseRoom/list' 
                var params = new Map();
                // if(update){
                //     params.set('floorId', this.state.floorId);
                //     Request.requestGet(url,params,(res)=>{
                //         var data = res.data.records;
                //         if(data.length == 0){
                //             this.setState({
                //                 isNoneShow:true,
                //             })
                //         }
                //         this.setState({
                //             floorId:null,
                //             floorName:null,
                //             step:2,
                //             buildList:data,
                //             dataSource:this.state.dataSource.cloneWithRows(data),
                //         })
                        
                //     })
                // }else{}
                    var id = data.floorId;
                    var name = data.floorName;
                    params.set('floorId', id);
                    Request.requestGet(url,params,(res)=>{
                        var data = res.data.records;
                        if(data.length == 0){
                            this.setState({
                                isNoneShow:true,
                            })
                        }
                        this.setState({
                            floorId:id,
                            floorName:name+'层',
                            step:3,
                            buildList:data,
                            dataSource:this.state.dataSource.cloneWithRows(data),
                        })
                        
                    })
                
               
            }else if(step == 3){
                var id = data.roomId;
                var name = data.roomName
                    this.setState({
                        roomId:id,
                        roomName:name,
                    })
                    setTimeout(
                        () => {
                            this.submit()    
                        }, 500
                    )  
                
            }
            
           
           
        
        }
        _renderSeparatorView(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
         return (
            <View key={`${sectionID}-${rowID}`} style={styles.separator} />
            );
        }
        //确认按钮
        submit(){
            console.log('确认');
            
            var data = this.state.buildList;
            var buildingName = ''
            var  floorName = ''
            var  roomName = ''
            if(data){
                buildingName = this.state.buildingName
                floorName = this.state.floorName
                roomName = this.state.roomName 
            }
            console.log(buildingName)
                this.props.goToRepair(
                    buildingName,
                    floorName,
                    roomName
                )          
        }
        render(){
            var buildingName = null;
            var floorName = null;
            var roomName = null;
            var stepTxt = '楼宇'
            var step = this.state.step;
            var color1 = null;
            var color2 =null;
            var isNoneShow = this.state.isNoneShow
            if(step == 1){
                stepTxt = '楼宇'
                buildingName = this.state.buildingName
                color1 = '#fff';
            }else if(step == 2){
                stepTxt = '楼层'
                buildingName = this.state.buildingName 
                floorName = '请选择楼层'
                
                color1 = '#fff';
                
            }else if(step == 3){
                stepTxt = '房间'
                buildingName = this.state.buildingName
                floorName = this.state.floorName
                color1 = '#61C0C5';
                roomName = '请选择房间'   
            }
            var placeType = this.state.placeType
            var leftColor =null;
            var rightColor = null;
            var leftbot = 0;
            var rightbot = 0;
            if(placeType == 1){
                leftColor = '#61C0C5'
                rightColor = '#404040'
                leftbot = 1
                rightbot = 0
            }else if(placeType == 2){
                leftColor = '#404040'
                rightColor = '#61C0C5'
                leftbot = 0
                rightbot = 1
            }
            return (
                <View style={modalStyles.container}>
                 
                    <View style={{top:0,height:Dimens.screen_height,width:Dimens.screen_width,backgroundColor: 'rgba(0,0,0,0.5)',alignItems:'center',justifyContent:'center',}}>
                        <View style={styles.bottomStyle}>
                            <View style={styles.topStyle}>
                                
                                
                                <View style={{flexDirection:'row',
                                                fontSize:14,
                                                backgroundColor: '#EFF0F1',
                                                width:Dimens.screen_width,
                                                height:35,
                                                alignItems:'center',
                                                justifyContent:'center',
                                                textAlignVertical:'center',}}>
                                    {/* <Text  style={{color:'#000', marginLeft:10, flex:1,lineHeight:35}}>请选择</Text> */}
                                    <Text onPress={this.props.Close} style={{color:'#9b9b9b', marginLeft:10,flex:1}}>取消</Text>
                                    <Text onPress={()=>this.submit()} style={{color:'#333', marginRight:10,}}>确定</Text>
                                </View>
                                <View style={{flexDirection:'row',justifyContent:'space-around',height:40}}>
                                    <TouchableOpacity onPress={()=>this.loadDetail(1)} style={{marginLeft:10, flex:1}}>
                                        <Text  style={{color:leftColor, fontSize:13,borderBottomColor:leftColor,borderBottomWidth:leftbot,marginLeft:10, flex:1,textAlign:'center',lineHeight:40}}>地址</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={()=>this.loadDetail(2)} style={{marginLeft:10, flex:1}}>
                                        <Text  style={{color:rightColor, fontSize:13,borderBottomColor:rightColor,borderBottomWidth:rightbot, marginLeft:10, flex:1,textAlign:'center',lineHeight:40}}>病区</Text>
                                    </TouchableOpacity>
                                </View>
                                
                               {
                                   step != 1 ? <View  style={{width: Dimens.screen_width,paddingLeft:20, flexDirection:'column',justifyContent:'flex-start',alignItems:'flex-start',backgroundColor:'#fff'}}>
                                   
                                              {step >= 2 ? <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center', height:30}}>
                                                    <View style={{width:8,height:8,borderRadius:8,backgroundColor:'#61C0C5',position:'relative',
                                                                borderColor:'#61C0C5',borderWidth:1}}></View>
                                                    <View style={{width:1,height:28,borderRadius:1,backgroundColor:'#61C0C5',position: 'absolute',top:18,left:3,
                                                                borderColor:'#61C0C5',borderWidth:1}}></View>
                                                    <TouchableOpacity onPress={()=>this.loadDetail(1)}>
                                                    <Text  style={{color:'#333',flex:1, fontSize:14,lineHeight:30,marginLeft:10}}>{buildingName}</Text>
                                                    </TouchableOpacity>
                                                </View> : null }
                                                
                                               {step >= 2 ? <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center', height:30}}>
                                                    
                                                    <View style={{width:8,height:8,borderRadius:8,backgroundColor:color1,position:'relative',
                                                                borderColor:'#61C0C5',borderWidth:1}}></View>
                                                   
                                                   {step >= 3 ? <View style={{width:1,height:29,borderRadius:1,backgroundColor:'#61C0C5',position: 'absolute',top:18,left:3,
                                                                borderColor:'#61C0C5',borderWidth:1}}></View> : null} 
                                                    <TouchableOpacity onPress={()=>this.onPressItemLeft(null,1,true)}>
                                                    <Text  style={{color:'#333', fontSize:14,lineHeight:30,marginLeft:10}}>{floorName}</Text>
                                                    </TouchableOpacity>
                                                </View> : null}     
                                                
                                                {step >=3 ? <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center', height:30}}>
                                                    <View style={{width:8,height:8,borderRadius:8,backgroundColor:'#fff',
                                                                borderColor:'#61C0C5',borderWidth:1}}></View>
                                                    {/* <TouchableOpacity onPress={()=>this.onPressItemLeft(null,2,true)}></TouchableOpacity> */}
                                                    <Text  style={{color:'#333', fontSize:14,lineHeight:30,marginLeft:10}}>{roomName}</Text>
                                                    
                                                </View> : null}
                                                
                                            </View> : null
                               }
                               {
                                   step == 1 ? <View  style={{flexDirection:'row',justifyContent:'flex-start',height:30}}>
                                        <Text  style={{color:'#919191', fontSize:11,marginLeft:10, flex:1,textAlign:'left',lineHeight:30}}>选择{stepTxt}</Text>
                                    </View> : null
                               }
                                

                                {isNoneShow ?  <View  style={{flexDirection:'row',justifyContent:'flex-start',height:30}}>
                                                <Text  style={{color:'#333', fontSize:13,marginLeft:10, flex:1,textAlign:'center',lineHeight:30}}>暂无数据</Text>
                                            </View> :null}
                                
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
            flexDirection:'column',
            fontSize:14,
            backgroundColor: '#EFF0F1',
            width:Dimens.screen_width,
           
            alignItems:'center',
            justifyContent:'center',
            textAlignVertical:'center',
            position:'relative'
        },
})





module.exports=PlaceType;