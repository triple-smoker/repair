import React from "react";
import {Footer} from "native-base";
import {StyleSheet, Text, TouchableNativeFeedback} from "react-native";

/**
 * 页脚按钮
 */
class MyFooter extends React.Component  {

    render() {

        return (
            <TouchableNativeFeedback onPress={this.props.submit}>
            <Footer style={stylesFooter.Footer}>
                <Text  style={stylesFooter.Text}>{this.props.value}</Text>
            </Footer>
            </TouchableNativeFeedback>
        );
    }
}
const stylesFooter=StyleSheet.create({
    Footer:{
        backgroundColor:'#6dc5c9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    Text:{
        color:'#ffffff',
        fontSize:20,
    },

});
export default MyFooter;
