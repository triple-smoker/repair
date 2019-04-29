import React, { Component } from 'react';
import {
    StyleSheet,
    Dimensions,
    View,
    Image,
    Text
} from 'react-native';
import {Button,Container} from 'native-base';

class CauseBtn extends Component{
    constructor(props) {
       super(props);
       this.state = {
            causeStyleShow:false,
       };
    }

    changeStyle(){
        this.setState({causeStyleShow:!this.state.causeStyleShow})
    }
    render(){
        return(
                <Button bordered block Button  style={ (this.props.cause.showType===false)? causeStyle.causeBtn:causeStyle.causeBtnPro} onPress={()=>{this.props.changeCause(this.props.cause),this.props.chCause(this.props.cause)}}>
                    <Text style={{fontSize:12,color:(this.props.cause.showType===false)?'#343434':'#369ced'}}>
                        {this.props.cause.causeCtn}
                    </Text>
                </Button>
        );
    }
}


const causeStyle =StyleSheet.create({
  causeBtn: {
    width:'30%',
    height:35,
    borderRadius:10,
    backgroundColor:'#fff',
    borderColor: '#c2c2c2',
    marginRight:"3.33%",
    marginTop:13
  },
  causeBtnPro: {
    width:'30%',
    height:35,
    borderRadius:10,
    backgroundColor:'#e1f0fd',
    borderColor:'#50a9ef',
    marginRight:"3.33%",
    marginTop:13
  },
})


module.exports=CauseBtn;