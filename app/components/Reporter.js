import {StyleSheet, Text, View} from "react-native";
import React from "react";
import {Button} from "native-base";

export default class Reporter extends React.Component {
    render() {
        return (
            <View style={stylesBody.Item}>
                <View style={stylesBody.Info}>
                        <View style={stylesBody.Row}>
                            <Text>报修人: {this.props.name}</Text>
                            <Text>{this.props.phone}</Text>
                        </View>
                        <View>
                            <Text >报修位置:{this.props.adds}</Text>
                        </View>
                </View>
                <View style={stylesBody.Butt}>
                    <Button onPress={this.props.changAdds} rounded bordered style={stylesBody.button} >
                        <Text style={stylesBody.buttonFont}>修改</Text>
                    </Button>
                </View>
            </View>
        );
    }
}

const stylesBody=StyleSheet.create({
    Item: {
        flex: 1,
        height: 80,
        flexDirection: 'row',
        backgroundColor: '#fff',
        justifyContent: 'space-between',
    },
    Info:{
        width: '75%',
        marginLeft: '5%',
        justifyContent: 'center',
    },
    Row : {
        flexDirection: 'row',
        fontSize:18,
        color:'#83ced1',
        width:'70%',
        justifyContent: 'space-between'
    },
    Butt:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button:{
        alignItems: 'center',
        justifyContent: 'center',
        borderColor:'#83ced1',
        width:60,
        height:25,
    },
    buttonFont:{
        color:'#83ced1',
        fontSize:16
    }
});
