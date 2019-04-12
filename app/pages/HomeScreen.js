import React from 'react';
import {View, Text, Button, Linking} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons';
import { Container, Header, Content, Tab, Tabs } from 'native-base';
import axios from 'axios';

export default class HomeScreen extends React.Component {



    constructor(props){
        super(props);
        //http://10.145.196.107:8082/api/repair/repRepairInfo/dept/list?page=1&limit=5
        axios({
            method: 'GET',
            url: 'http://10.145.196.107:8082/api/repair/repRepairInfo/dept/list',
            data: {
                page: 1,
                limit: 5
            },
        }).then(
            (response) => {
                console.log('----------------');
                console.log(response);
            }
        ).catch((error)=> {
            console.log('================');
            console.log(error)
        });
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
                            onPress={() => Linking.openURL(`tel:${`10086`}`)}
                        />
                        <Button
                            title="清空缓存"
                            onPress={() => this._deleteData()}
                        />
                    </View>

                </Container>




        );
    }
}
