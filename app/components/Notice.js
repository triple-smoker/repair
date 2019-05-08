import React, {Component} from 'react';
import { StyleSheet, Text, View,Image} from 'react-native';
export default class Notice extends Component{
    render() {
        return (
            <View style={styles.notice}>
                <Image style={{width: 16, height: 16, marginRight: 5}} source={require('../image/ico_tips.png')}/>
                <Text style={{color:'#dbb582' ,fontSize: 16,textAlign: 'center'}}>{this.props.text}</Text>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    IconColor: {
        fontSize: 16,
    },
    notice: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        height: 32,
        backgroundColor: '#FCF4E9',
        flexDirection: 'row',
    },
});
