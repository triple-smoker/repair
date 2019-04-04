import React from 'react';
import { View, Text, Button} from "react-native";
import Icon from 'react-native-vector-icons';

export default class HomeScreen extends React.Component {


    constructor(props){
        super(props);
    }

    static navigationOptions = {
        borderBottomWidth: 0,
        title: '首页',
        tabBarIcon: ({ tintColor }) => (
            <Icon name="md-home" size={25} color={tintColor} />
        )
    };


    render() {
        return (
            <View >

                <Button
                    title="新增报修"
                    onPress={() => this.props.navigation.navigate('Repair')}
                />
            </View>
        );
    }
}
