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
import axios from 'axios';


let ScreenWidth = Dimensions.get('window').width;
let ScreenHeight = Dimensions.get('window').height;
class OrderType extends Component {

  render() {
    return (
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={this.props.modalVisible}
                onRequestClose={() => {
                           alert("Modal has been closed.");
                         }}
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
        var   url="http://47.102.197.221:8188/api/repair/repRepairType/list";
        axios({
            method: 'GET',
            url: url,
            data: null,
            headers:{
                'x-tenant-key':'Uf2k7ooB77T16lMO4eEkRg==',
                'rcId':'1055390940066893827',
                'Authorization':'6c7cf948-bdf9-4bde-8fea-f1256183f388',
            }
        }).then(
            (response) => {
                    var types = response.data.data;
                    this.setState({repairList:types});
            }
        ).catch((error)=> {
            console.log(error)
        });

      }
      setParent(visible,ctn){
        this.setState({repairParent:visible,repairParentCn:ctn})
      }
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
      setChild(visible,ctn){
        this.setState({repairChild:visible,repairChildCn:ctn})
        var   url="http://47.102.197.221:8188/api/repair/repRepairType/getRepairMatterList";
        var data = {
            "repairTypeId":visible,
            "typeParentId":"",
            "matterName":""
        };
        axios({
            method: 'POST',
            url: url,
            data: data,
            headers:{
                'Content-type':'application/json',
                'x-tenant-key':'Uf2k7ooB77T16lMO4eEkRg==',
                'rcId':'1055390940066893827',
                'Authorization':'6c7cf948-bdf9-4bde-8fea-f1256183f388',
            }
        }).then(
            (response) => {
                    var cares = response.data.data;
                    this.setState({repairCareList:cares});
            }
        ).catch((error)=> {
            console.log(error)
        });
      }
      getRepairChild(){
        let repairList = this.state.repairList;
        var repairParentList = repairList.find(item=>item.repairTypeId==this.state.repairParent);

        let listItems =(  repairParentList.childrenList === null ? null : repairParentList.childrenList.map((repair, index) =>
                <Button style={{width:"40%",marginTop:20,justifyContent:"center",marginRight:'10%',borderWidth:1,borderColor:'#c9c9c9',backgroundColor:'#fff'}}
                 key={index} onPress={()=>this.setChild(repair.repairTypeId,repair.repairTypeCtn)}>
                    <Text style={{color:'#696969'}}>{repair.repairTypeCtn}</Text>
                </Button>
        ))
        return listItems;
      }

        render(){
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
                                    <Text style={{color:'#1890ff'}}>{this.state.repairParentCn+"/"+this.state.repairChildCn}</Text>
                                </Button>}
                            </Col>
                            {this.state.repairParent == '' && this.state.repairChild == '' &&
                                <View style={{flexDirection:'row',flexWrap:'wrap',width:"100%",paddingBottom:40}}>
                                {this.getRepair()}
                                </View>
                            }
                            {this.state.repairParent != '' && this.state.repairChild == '' &&
                                <View style={{flexDirection:'row',flexWrap:'wrap',width:"100%",paddingBottom:40}}>
                                {this.getRepairChild()}
                                </View>
                            }
                            {this.state.repairParent != '' && this.state.repairChild != '' &&
                                <View style={{flexDirection:'row',flexWrap:'wrap',width:"100%",paddingBottom:40}}>
                                    <QuicklyBtnList repairCareList={this.state.repairCareList} goToRepair={(repairTypeId,repairMatterId)=>{this.props.goToRepair(repairTypeId,repairMatterId)}}/>
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
              <QuicklyBtn repair={repair}  goToRepair = {(repairTypeId,repairMatterId)=>this.props.goToRepair(repairTypeId,repairMatterId)} key={index}/>
            ))
        return listItems;
    }
}

class QuicklyBtn extends Component {
    render(){
        return (
            <Button style={{width:"40%",marginTop:20,justifyContent:"center",marginRight:'10%',borderWidth:1,borderColor:'#c9c9c9',backgroundColor:'#fff'}}
              onPress={()=>this.props.goToRepair(this.props.repair.repairTypeId,this.props.repair.repairMatterId)}>
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
        padding:20
    },
    innerContainer: {
        borderRadius: 10,
        height:'80%',
        alignItems:'center',
        backgroundColor: '#fff',
    },
    btnContainer: {
        width:'33.3333%',
        height:40,
        backgroundColor:'#666'
    }
});





module.exports=OrderType;