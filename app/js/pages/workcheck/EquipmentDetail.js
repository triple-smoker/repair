
import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    TouchableHighlight, StyleSheet,
    ScrollView,
} from 'react-native';

import BaseComponent from '../../base/BaseComponent'
import ScanResult from '../repair/ScanResult'
import * as Dimens from "../../value/dimens";


export default class EquipmentDetail extends BaseComponent {
    static navigationOptions = {
        header: null,
    };
    constructor(props){
        super(props);
        const { navigation } = this.props;
        const equipmentId = navigation.getParam('equipmentId', '');
        const equipmentName = navigation.getParam('equipmentName', '');
        this.state = {
            equipmentId : equipmentId,
            equipmentName : equipmentName,
        }
    }
    goBack(){
        this.props.navigation.goBack();
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{height:44,backgroundColor:'white',justifyContent:'center', textAlignVertical:'center', flexDirection:'row',alignItems:'center', marginBottom:5}}>
                    <TouchableHighlight style={{width:50,height:44,alignItems:"center",justifyContent:"center"}} onPress={()=>this.goBack()}>
                        <Image style={{width:21,height:37}} source={require("../../../image/navbar_ico_back.png")}/>
                    </TouchableHighlight>
                    <View style={{flex:1,justifyContent:'center',alignItems:'center',height:30,fontWeight:"600"}}>
                        <Text style={{color: '#555', fontSize: 18, marginLeft: 5, flex: 1}}>{this.state.equipmentName}</Text>
                    </View>
                    <View style={{width:50}}/>
                </View>
                <ScrollView horizontal={false} indicatorStyle={'white'} showsVerticalScrollIndicator={true} style={{width:Dimens.screen_width,flex:1}}>
                    <ScanResult equipmentId={this.state.equipmentId} navigation = {this.props.navigation}/>
                </ScrollView>
            </View>
        )
    }


}
const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
});

