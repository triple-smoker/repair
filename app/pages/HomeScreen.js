import React from 'react';
import {View, Button, Linking, StyleSheet, NativeModules, Image, Text, TouchableOpacity,Alert} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons';
import { Container, } from 'native-base';

import ImagePicker from 'react-native-image-picker';
import DeviceStorage from '../util/DeviceStorage';

export default class HomeScreen extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            image: null,
            video: null
        };

    }



    static navigationOptions = {
        // borderBottomWidth: 0,
        headerStyle: {
            elevation: 0,
            borderBottomWidth: 0,
        },
        elevation: 0,
        title: '首页',
        tabBarIcon: ({ tintColor }) => (
            <Icon name="md-home" size={25} color={tintColor} />
        )
    };

    pickSingleWithCamera(cropping, mediaType='photo') {
        // ImagePicker.openCamera({
        //     cropping: cropping,
        //     width: 500,
        //     height: 500,
        //     includeExif: true,
        //     mediaType,
        // }).then(image => {
        //     console.log('received image', image);
        //     this.setState({
        //         video: {uri: image.path, width: image.width, height: image.height, mime: image.mime},
        //         images: null
        //     });
        // }).catch(e => alert(e));


        const options = {
            mediaType: 'video',
            videoQuality: 'medium',
            durationLimit: 30
        };
        ImagePicker.launchCamera(options, (response) => {
            console.log('Response = ', response);

            this.setState({
                        video: {uri: response.path},
                        images: null
                    });

            // let images = [];
            // images.push(response);
            // this.appendImage(images);
            if (response.didCancel) {
                console.log('User cancelled video picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                this.setState({
                    videoSource: response.uri,
                });
            }
        });

    }

    //删除
    _deleteData(){
        console.log('删除')

        //删除一条数据
        AsyncStorage.removeItem('reporterInfoHistory', function (error) {
            if (error) {
                alert('删除失败')
            }else {
                alert('删除完成')
            }
        })
        //删除一条数据
        AsyncStorage.removeItem('searchItemHistory', function (error) {
            if (error) {
                alert('删除失败')
            }else {
                alert('删除完成')
            }
        })
        //删除一条数据
        AsyncStorage.removeItem('cdTimeHistory', function (error) {
            if (error) {
                alert('删除失败')
            }else {
                alert('删除完成')
            }
        })

    }

    ceshi(){
        setTimeout(function(){
            Alert.alert("123")
        },5000)
    }

    change(){


        console.log(global.userToken)

    }

    call_button(){
        NativeModules.ToastModule.show('调用原生方法的Demo',1);
    }

    render() {
        return (
                <Container>
                    <View >
                        <Button
                            title="延迟测试"
                            onPress={()=>this.ceshi()}
                        />
                        <Button
                            title="新增报修"
                            onPress={() => this.props.navigation.navigate('Repair')}
                        />
                        <Button
                            title="全部订单"
                            onPress={() => this.props.navigation.navigate('AllOrder')}
                        />
                        <Button
                            title="报修单评价"
                            onPress={() => this.props.navigation.navigate('Evaluate')}
                        />
                        <Button
                            title="拨打电话"
                            onPress={() => thumbnail.get.get('../image/broadchurch.mp4').then((result) => {
                                console.log(result.path); // thumbnail path
                            })}
                        />
                        <Button
                            title="清空缓存"
                            onPress={() => this._deleteData()}
                        />
                        <Button
                            title="搜索"
                            onPress={() => this.props.navigation.navigate('OrderSearch')}
                        />
                        <Button
                            title="搜索"
                            onPress={() => this.call_button()}
                        />
                        <Button
                            title="sqlite"
                            onPress={() => this.props.navigation.navigate('SQLiteDemo')}
                        />
                    </View>

                    <TouchableOpacity onPress={() => this.pickSingleWithCamera(false, mediaType='video')} style={styles.button}>
                        <Text style={styles.text}>Select Single Video With Camera</Text>
                    </TouchableOpacity>

                    <Text>
                        {global.userToken}
                    </Text>
                </Container>




        );
    }
}
const styles = StyleSheet.create({
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
});
