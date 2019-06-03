import React, { Component } from 'react';
import {
    StyleSheet,
    Dimensions,
    View,
    Modal,
    TouchableOpacity,
    Image,
} from 'react-native';
import { Content,Row,Col,Text,List,ListItem,Button } from 'native-base';
import Axios from '../../util/Axios';


let ScreenWidth = Dimensions.get('window').width;
let ScreenHeight = Dimensions.get('window').height;
class OrderType extends Component {

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
        this.state = {repairList : [],
        repairParent:'',
        repairParentCn:'',
        repairChildCn:'',
        repairChildList:[],
        repairChild:'',
        repairCareList:[]};
        var   url="/api/repair/repRepairType/list";
//接口获取报修类型
        Axios.GetAxios(url).then(
            (response) => {
                    var types = response.data;
                    this.setState({repairList:types});
                    }
        )
      }
      setParent(visible,ctn){
        this.setState({repairParent:visible,repairParentCn:ctn})
      }
//渲染一级类型
      getRepair(){
        let repairList = this.state.repairList;
        let listItems = (  repairList === null ? null : repairList.map((repair, index) =>
                <Button style={{width:"40%",marginTop:20,justifyContent:"center",marginRight:'10%',borderWidth:1,borderColor:'#c9c9c9',backgroundColor:'#fff'}}
                 key={index} onPress={()=>this.setParent(repair.repairTypeId,repair.repairTypeCtn)}>
                    <Text style={{color:'#696969'}}>{repair.repairTypeCtn}</Text>
                </Button>
        ))
        return listItems;
      }
//接口获取快修选项
      setChild(visible,ctn){
        this.setState({repairChild:visible,repairChildCn:ctn})
        var   url="/api/repair/repRepairType/getRepairMatterList";
        var data = {
            "repairTypeId":visible,
            "typeParentId":"",
            "matterName":""
        };
        Axios.PostAxios(url,data).then(
            (response) => {
                    var cares = response.data;
                    this.setState({repairCareList:cares});
                    }
        )

      }
//渲染二级类型
      getRepairChild(goToRepair){
        let repairList = this.state.repairList;
        var repairParentList = repairList.find(item=>item.repairTypeId==this.state.repairParent);
        console.log(JSON.stringify(repairParentList));
        // let listItems =(  repairParentList.childrenList === null ? null : repairParentList.childrenList.map((repair, index) =>
        //         <Button style={{width:"40%",marginTop:20,justifyContent:"center",marginRight:'10%',borderWidth:1,borderColor:'#c9c9c9',backgroundColor:'#fff'}}
        //          key={index} onPress={()=>this.setChild(repair.repairTypeId,repair.repairTypeCtn)}>
        //             <Text style={{color:'#696969'}}>{repair.repairTypeCtn}</Text>
        //         </Button>
        // ))
        let listItems =(  repairParentList.childrenList === null ? null : repairParentList.childrenList.map((repair, index) =>
                <Button style={{width:"40%",marginTop:20,justifyContent:"center",marginRight:'10%',borderWidth:1,borderColor:'#c9c9c9',backgroundColor:'#fff'}}
                 key={index} onPress={()=>goToRepair(
                    repair.repairTypeId,
                    repair.repairMatterId,
                    this.state.repairParentCn,
                    repair.repairTypeCtn
                )}>
                    <Text style={{color:'#696969'}}>{repair.repairTypeCtn}</Text>
                </Button>
        ))
        return listItems;
      }
        render(){
            var repairParentCn = this.state.repairParentCn;
            var repairChildCn = this.state.repairChildCn;
            return (
                <View style={modalStyles.container}>
                    <TouchableOpacity  style={{height:ScreenHeight/2}} onPress={this.props.Close}>
                    </TouchableOpacity>
                    <View style={modalStyles.innerContainer}>
                        <Content style={{paddingLeft:"8%",width:"100%"}}>
                            <Col style={{width:'100%',alignItems:'center',paddingRight:'8%',marginTop:10}}>
                                <Text style={{fontSize:18}}>报修类别</Text>
                                {this.state.repairParentCn !='' &&
                                <Button transparent block
                                onPress={()=>this.setState({repairParent:'',repairParentCn:'',repairChild:'',repairChildCn:''})}>
                                    <Text style={{color:'#1890ff'}}>{repairParentCn+"/"+repairChildCn}</Text>
                                </Button>}
                            </Col>
                            {this.state.repairParent == '' && this.state.repairChild == '' &&
                                <View style={{flexDirection:'row',flexWrap:'wrap',width:"100%",paddingBottom:40}}>
                                {this.getRepair()}
                                </View>
                            }
                            {this.state.repairParent != '' && this.state.repairChild == '' &&
                                <View style={{flexDirection:'row',flexWrap:'wrap',width:"100%",paddingBottom:40}}>
                                {this.getRepairChild((repairTypeId,repairMatterIdm,repairParentCn,repairChildCn)=>{
                                    this.props.goToRepair(repairTypeId,repairMatterIdm,repairParentCn,repairChildCn)})}
                                </View>
                            }
                            {this.state.repairParent != '' && this.state.repairChild != '' &&
                                <View style={{flexDirection:'row',flexWrap:'wrap',width:"100%",paddingBottom:40}}>
                                    <QuicklyBtnList repairCareList={this.state.repairCareList} repairParentCn={repairParentCn} repairChildCn={repairChildCn} goToRepair={
                                        (repairTypeId,repairMatterIdm,repairParentCn,repairChildCn)=>{
                                            this.props.goToRepair(repairTypeId,repairMatterIdm,repairParentCn,repairChildCn)}
                                    }/>
                                </View>
                            }
                        </Content>
                    </View>
                    <TouchableOpacity  style={{height:ScreenHeight/2}} onPress={this.props.Close}>
                    </TouchableOpacity>
                </View>
            );
        }
}


class QuicklyBtnList extends Component{
    render() {
            let repairList = this.props.repairCareList;
            let listItems =(  repairList === null ? null : repairList.map((repair, index) =>
              <QuicklyBtn repair={repair} repairParentCn={this.props.repairParentCn} repairChildCn={this.props.repairChildCn} goToRepair = {(repairTypeId,repairMatterId,repairParentCn,repairChildCn)=>this.props.goToRepair(repairTypeId,repairMatterId,repairParentCn,repairChildCn)} key={index}/>
            ))
        return listItems;
    }
}

class QuicklyBtn extends Component {
    render(){
        return (
            <Button style={{width:"40%",marginTop:20,justifyContent:"center",marginRight:'10%',borderWidth:1,borderColor:'#c9c9c9',backgroundColor:'#fff'}}
              onPress={()=>this.props.goToRepair(
                                        this.props.repair.repairTypeId,
                                        this.props.repair.repairMatterId,
                                        this.props.repairParentCn,
                                        this.props.repairChildCn
                                        // this.state.repairParentCn,
                                        // this.state.repairChildCn,
                                        // this.state.matterName
                                        )}>
                <Text style={{color:'#696969'}}>{this.props.repair.matterName}</Text>
            </Button>
        )
    }
}

const modalStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingLeft:"7%",
        paddingRight:"7%",
        paddingTop:"5%",
        paddingBottom:"5%",
    },
    innerContainer: {
        borderRadius: 10,
        height:'80%',
        alignItems:'center',
        backgroundColor: '#fff',
    },

});





module.exports=OrderType;