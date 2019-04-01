
import React from "react";
import {Container, Content, Button} from 'native-base';
import { TextareaItem } from "@ant-design/react-native";
import MultipleImagePicker from "../components/MultipleImagePicker";
import Reporter from '../components/Reporter';
import Notice from '../components/Notice';
import MyFooter from '../components/MyFooter';

export default class RepairScreen extends React.Component {

    static navigationOptions = {
        // header: null,
        headerTitle: '新增报修',
        headerRight: (
            <Button
                onPress={() => alert('This is a button!')}
                title="Info"
                color="#fff"
            />
        ),

    };


    render() {
        return (
            <Container style={{backgroundColor: "#EEEEEE"}}>
                <Content >
                    <Notice />
                    <TextareaItem rows={6} placeholder="我的报修内容..." />
                    <MultipleImagePicker />
                    {/*<Reporter name='周良' phone='12388888888' adds='A机房C机架B群组-F203' changAdds={()=>this._changeAdds('周良','12388888888','A机房C机架B群组-F203')}/>*/}
                </Content>
                <MyFooter value='提交'/>

            </Container>

        );
    }


}



