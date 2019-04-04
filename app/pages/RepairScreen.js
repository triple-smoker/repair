
import React from "react";
import {Container, Content, Button} from 'native-base';
import { TextareaItem } from "@ant-design/react-native";
import MultipleImagePicker from "../components/MultipleImagePicker";
import Reporter from '../components/Reporter';
import Notice from '../components/Notice';
import MyFooter from '../components/MyFooter';


export default class RepairScreen extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            images: [],
        }
    }



    static navigationOptions = {
        // header: null,
        headerTitle: '新增报修',
        borderBottomWidth: 0,
        headerRight: (
            <Button
                onPress={() => alert('This is a button!')}
                title="Info"
                color="#fff"
            />
        ),

    };

    submit(){
        // Alert.alert('12345');

        console.log(this.state.reporter);
        console.log(this.state.images);

    }

    changeReporter(){

        const { navigate } = this.props.navigation;
        navigate('Address', {
            callback: (
                (info) => {
                    // Alert.alert('I am back!',info.name);
                    this.setState(
                        {
                            reporter: info.name,
                            phone: info.phone,
                            address: info.address,
                        }
                    )
                }
            )
        })
    };

    render() {


        return (
            <Container style={{backgroundColor: "#EEEEEE"}}>
                <Content >
                    <Notice />
                    <TextareaItem rows={6} placeholder="我的报修内容..." />
                    <MultipleImagePicker images={this.state.images}/>
                    <Reporter name={this.state.reporter} phone={this.state.phone} adds={this.state.address} changAdds={()=>this.changeReporter()}/>
                </Content>
                <MyFooter submit={() => this.submit()} value='提交'/>

            </Container>

        );
    }


}



