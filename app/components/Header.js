import React, { Component } from 'react';
import {Header, Left, Body, Button, Icon, Title ,Right} from 'native-base';
import {StyleSheet} from "react-native";


export default class MyHeader extends Component {

    render() {
        return (
            <Header transparent style={styles.baseColor}>
                <Left>
                    <Button transparent>
                        <Icon style={styles.IconColor} type="AntDesign" name='left' />
                    </Button>
                </Left>
                <Body>
                    <Title transparent style={styles.title}>{this.props.HeaderName}</Title>
                </Body>
                <Right />
            </Header>
        );
    }
}
const styles = StyleSheet.create({
    baseColor: {
        backgroundColor: "#fff",
    },
    IconColor:{
        color: "#C4C4C4",
    },

    title: {
        color: "#000000",
    }
});
