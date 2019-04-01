import React from 'react';
import { View, Text, Button} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import {Modal} from "@ant-design/react-native";


export default class HomeScreen extends React.Component {

    static navigationOptions = {
        title: '首页',
        tabBarIcon: ({ tintColor }) => (
            <Icon name="md-home" size={25} color={tintColor} />
        )
    };

    onButtonClick2 = () => {
        Modal.alert('Title', 'alert content', [
            {
                text: 'Cancel',
                onPress: () => console.log('cancel'),
                style: 'cancel',
            },
            { text: 'OK', onPress: () => console.log('ok') },
        ]);
    };

    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                {/*<Text>Details Screen</Text>*/}
                <Button
                    title="新增报修"
                    onPress={() => this.props.navigation.navigate('Repair')}
                />
                <Button
                    title="新增地址"
                    onPress={() => this.props.navigation.navigate('Address')}
                />

            </View>
        );
    }
}
