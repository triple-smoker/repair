import React from 'react';
import {View, Button, Linking, StyleSheet, Image, Text, TouchableOpacity} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons';
import { Container, } from 'native-base';

import ImagePicker from 'react-native-image-picker';

import Axios from '../util/Axios';

export default class HomeScreen extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            image: null,
            video: null
        };
        // console.log("123456");
        //http://10.145.196.107:8082/api/repair/repRepairInfo/dept/list?page=1&limit=5
        // axios({
        //     method: 'GET',
        //     url: 'http://10.144.4.45:8080/api/basic/baseDept/getDeptListByType',
        //     headers : {
        //         'rcId':'1055390940066893827',
        //         'x-tenant-key':'Uf2k7ooB77T16lMO4eEkRg==',
        //         'Authorization' :'Bearer b3d21a2e-81ff-422c-b881-25fb241fb6ad',
        //     }
        // }).then(
        //     (response) => {
        //         console.log('----------------');
        //         console.log(response);
        //     }
        // ).catch((error)=> {
        //     console.log('=======================');
        //     console.log(error)
        // });


        Axios.GetAxios('http://47.102.197.221:8188/api/basic/baseDept/getDeptListByType').then(
            (response) => {
                        console.log('----------------');
                        console.log(response);
                    }
        )

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

    }

    render() {
        return (
                <Container>
                    <View >
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
                            onPress={() => alert(this.state.woDe)}
                        />
                    </View>

                    <TouchableOpacity onPress={() => this.pickSingleWithCamera(false, mediaType='video')} style={styles.button}>
                        <Text style={styles.text}>Select Single Video With Camera</Text>
                    </TouchableOpacity>



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
