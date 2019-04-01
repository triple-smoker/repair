import React from 'react';
import {PermissionsAndroid, Platform, StyleSheet, Text, View} from 'react-native';
import { ImagePicker } from '@ant-design/react-native';

/**
 * 上传图片
 */
export default class MyImagePicker extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            files: [
                {
                    url: 'http://ckimg.baidu.com/course/2016-10/21/808aa8fc57ab3684ab75bec1489473e2.jpg',
                    id: '2121',
                },
                {
                    url: 'http://ckimg.baidu.com/course/2016-10/21/808aa8fc57ab3684ab75bec1489473e2.jpg',
                    id: '2122',
                }
            ],
            files2: [],
            granted: true,

        };
    }

    handleFileChange = (files: any) => {
        this.setState({
            files,
        });
    }

    async requestCameraPermission() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                {
                    'title': '需要访问相册',
                    'message': '需要访问相册',
                },
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                this.show("你已获取了读写权限")
                this.setState({
                    granted: true,
                })
            } else {
                this.show("获取读写权限失败")
                this.setState({
                    granted: false,
                })
            }
        } catch (err) {
            console.warn(err)
        }
    }
    async componentDidMount() {
        if (Platform.OS === 'android') {
            await this.requestCameraPermission();
        }
    }

    render() {

        if (Platform.OS === 'android' && !this.state.granted) {
            return <Text>需要访问相册的权限</Text>;
        }
        return (
            <View style={styles.ImagePicker}>
                <ImagePicker
                    onChange={this.handleFileChange}
                    files={this.state.files}
                />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    ImagePicker: {
        margin: 10,
        width: '100%',
        backgroundColor: "#fff",
    },

});

