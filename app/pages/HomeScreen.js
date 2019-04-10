import React from 'react';
import {View, Text, Button, TouchableNativeFeedback} from "react-native";
import Icon from 'react-native-vector-icons';
import { Container, Header, Content, Tab, Tabs } from 'native-base';

export default class HomeScreen extends React.Component {




    getTabs (TAB) {
        return (
            <View >
                <Text>{TAB}</Text>
            </View>
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



    render() {
        return (

                <Container>

                    <Tabs>
                        <Tab heading="Tab1">
                            {this.getTabs('dfi')}
                        </Tab>
                        <Tab heading="Tab2">
                            {this.getTabs('dfahueit')}
                        </Tab>
                        <Tab heading="Tab3">
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
                            </View>
                        </Tab>
                    </Tabs>
                </Container>




        );
    }
}
