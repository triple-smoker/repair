

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
    Platform,
    ToastAndroid,
    Switch,
    ListView
} from 'react-native';
import RNFetchBlob from '../../../util/RNFetchBlob';
import TitleBar from '../../component/TitleBar';
import BaseComponent from '../../base/BaseComponent'
import * as Dimens from '../../value/dimens';
import AsyncStorage from '@react-native-community/async-storage';

export default class workOrderInform extends BaseComponent {
    static navigationOptions = {
        header: null,
    };
    constructor(props){
        super(props);
        console.info(this.props)
        const { navigation } = this.props;
        const workOrderNotify = navigation.getParam('workOrderNotify', []);
        console.info(workOrderNotify)
        this.state={
            theme : this.props.theme,
            workOrderNotify : workOrderNotify,
            dataSource : new ListView.DataSource({
                rowHasChanged: (r1, r2)=> {
                    if (r1 !== r2) {
                    } else {
                        console.log("相等=");
                    }
                    return true//r1.isSelected !== r2.isSelected;
                }
            }),
        }
    }

    componentDidMount(){
        this.loadDataSourceByWorkOrderNotify();
    }

    loadDataSourceByWorkOrderNotify(){
        var dataSource = this.state.workOrderNotify.reverse();
        this.setState({
            dataSource:this.state.dataSource.cloneWithRows(dataSource),
        });
    }

    
    renderWorkOrderMessage(data){
        console.info("renderWorkOrderMessage")
        console.info(data)
        return (
            <View style={styles.input_center_bg}>
                <View style={styles.title}>
                    <View style={{position:'relative'}}>
                        <Text style={{fontSize:16,color:'#404040'}}>
                            {data.title}
                        </Text>
                        <View style={{position:'absolute',top:0,right:-7,height:5,width:5,borderRadius:5,backgroundColor:'red'}}></View>
                    </View>
                
                    <Text style={{fontSize:14,color:'#7f7f7f'}}>
                        {data.notifyDate}
                    </Text>
                </View>
                <View style={styles.line} />
                <View style={styles.content}>
                    <Text style={{fontSize:15,color:'#404040'}}>
                        {data.content}
                    </Text>
                </View>
            </View>
        )
    }

    _renderSeparatorView(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
        return (
            <View key={`${sectionID}-${rowID}`} style={styles.separator} />
        );
    }
    
    render() {
        return (
          <View style={styles.container}>
            <TitleBar
                centerText={'工单通知'}
                isShowLeftBackIcon={true}
                navigation={this.props.navigation}
                leftPress={() => this.naviGoBack(this.props.navigation)}
            />

            <ListView
                initialListSize={1}
                dataSource={this.state.dataSource}
                renderRow={(item) => this.renderWorkOrderMessage(item)}
                style={{backgroundColor:'white',flex:1,height:300}}
                onEndReachedThreshold={10}
                enableEmptySections={true}
                renderSeparator={(sectionID, rowID, adjacentRowHighlighted) =>this._renderSeparatorView(sectionID, rowID, adjacentRowHighlighted)}
            />

           </View>
    )
}
onChange(val) {
    this.setState({
        pushStatus : val
    })
    console.log(this.state.pushStatus)
  }
}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#f6f6f6',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
    title:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        lineHeight:45,
        height:45,
        marginLeft:0,
        marginRight:0,
        paddingLeft: 10,
        paddingRight: 10,
    },
    content:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        lineHeight:45,
        height:45,
        marginLeft:0,
        marginRight:0,
        paddingTop:15,
        paddingLeft: 10,
        paddingRight: 10,
    },
    input_center_bg:{
        overflow:'hidden',
        backgroundColor: 'white',
        marginTop:10,
        marginLeft:10,
        marginRight:10,
        borderRadius:5,
        borderColor: '#d0d0d0',
        borderWidth: 1,

    },
    input_center_bg2:{
        overflow:'hidden',
        backgroundColor: '#f5f5f5',
        marginTop:10,
        marginLeft:10,
        marginRight:10,
        borderRadius:5,
        borderColor: '#d0d0d0',
        borderWidth: 1,

    },
    input_item:{
        flexDirection:'row',height:40,alignItems:'center',marginTop:0,
    },
    input_style:{
        fontSize: 15,height:40,textAlign: 'left',textAlignVertical:'center',flex:1,marginLeft:0
    },
    line:{
        backgroundColor:'#d0d0d0',height:1,width:(Dimens.screen_width-40),marginTop:0,marginLeft:10
    },
});