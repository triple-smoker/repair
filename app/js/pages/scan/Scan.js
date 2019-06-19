import React, { Component } from 'react';
import {StyleSheet, Text,Image, Animated,Easing,InteractionManager, View, Alert } from 'react-native';
import {RNCamera} from 'react-native-camera';
import Axios from '../../../util/Axios';

class Scan extends Component {

    static navigationOptions = {
        headerTitle: "二维码扫描",
        headerBackImage: (<Image resizeMode={'contain'} style={{width: 38, height: 60}} source={require('../../../image/navbar_ico_back.png')} />),
    };

    constructor(props) {
        super(props);
        const { navigation } = this.props;
        const targetRouteName = navigation.getParam('targetRouteName', '');
        this.state = {
            show: true,
            animate: new Animated.Value(0), // 二维坐标{x:0,y:0}
            targetRouteName : targetRouteName,
        }
    }
    componentDidMount(){
        InteractionManager.runAfterInteractions(() => {
            this.startAnimation()
        })
    }

    // 动画开始
    startAnimation(){
        if(this.state.show){
            this.state.animate.setValue(0);
            Animated.timing(this.state.animate,{
                toValue: 1,   // 运动终止位置，比值
                duration: 2500,  // 动画时长
                easing: Easing.linear,  // 线性的渐变函数
            }).start(()=>this.startAnimation());
        }
    }

    componentWillUnmount(){
        this.state.show = false;
        console.info("-----componentWillUnmount-----")
    }

    barcodeReceived(result){
        if(this.state.show){
            this.state.show = false;
            if(result){
                this.newRepair(result);
            }else{
                Alert.alert('提示', '扫描失败！',[{text:'确定'}])
                setTimeout(() => {
                    this.state.show = true;
                    this.startAnimation();                 
                }, 2000);
            }
        }
    }

    //报修导航
    newRepair(result){
        //获取维修单数量
        var uri = "/api/opcs/matrix/scan/" + result.data
        Axios.GetAxios(uri).then(
            (response) => {
                console.info(response)
                if (response && response.code === 200) {

                    if(response.data.error){
                        Alert.alert('提示', response.data.message,[{text:'确定'}])
                        setTimeout(() => {
                            this.state.show = true;
                            this.startAnimation();
                        }, 2000);
                    }else{
                        const { navigate } = this.props.navigation;

                        if(this.props.navigation.state.params.callback){
                            this.props.navigation.state.params.callback({
                                isScan : true,
                                equipmentId : response.data.detail.equipmentId,
                                equipmentName: response.data.detail.equipmentName
                            });
                            navigate(this.state.targetRouteName);
                        }else{
                            this.props.navigation.replace(this.state.targetRouteName,{
                                isScan : true,
                                equipmentId : response.data.detail.equipmentId,
                                equipmentName: response.data.detail.equipmentName
                            });
                        }
                    }
                }
            }
        );
        
    }

    render() {
        return (
            <View style={styles.container}>
                <RNCamera
                    style={styles.camera}
                    ref={ref => {
                        this.camera = ref;
                    }}
                    type={RNCamera.Constants.Type.back}
                    flashMode={RNCamera.Constants.FlashMode.on}
                    onCameraReady={() => {
                        console.log('ready')
                    }}
                    onBarCodeRead={this.barcodeReceived.bind(this)}
                >
                    <View style={styles.rectangleContainer}>
                        <View style={styles.rectangle}>
                            <Animated.View style={{
                                alignItems: 'center',
                                transform: [{
                                    translateY: this.state.animate.interpolate({
                                        inputRange: [0,1],
                                        outputRange: [2,258]
                                    })
                                }]
                            }}>
                                <Text style={{width:250,height:1,backgroundColor:'#00ff00'}}></Text>
                            </Animated.View>
                        </View>
                        <Text style={styles.rectangleText}>将二维码放入框内，即可自动扫描</Text>
                    </View>
                    
                </RNCamera>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    camera: {
        flex: 1,
    },
    rectangleContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'rgba(0,0,0,0.5)',
    },
    rectangle: {
        width: 260,
        height: 260,
        borderWidth: 1,
        borderColor: 'skyblue',
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    info: {
        width: 80,
        height: 80,
        backgroundColor: '#fff',
        paddingLeft: 10,
        paddingBottom:5,
        justifyContent: 'space-around',
    },
    rectangleText: {
        flex: 0,
        color: '#fff',
        marginTop: 10
    },
});

module.exports = Scan;