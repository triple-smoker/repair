
import React,{Component} from 'react'

import Navigator from 'react-native-deprecated-custom-components';

import MainPage from './app/js/pages/entry/MainPage'

//aes密钥是V05sT01wOGMyVnlkbWxqWg==   前端使用前,先base64 decode下, 解码后是  WNlOMp8c2VydmljZ
//./gradlew assembleRelease
export default class WelcomePage extends Component {

        constructor(props) {
            super(props);
            this.state = {
            };
        }

        _renderScene(route, navigator) {
            let Component = route.component;
            return (
                <Component {...route.params} navigator={navigator}/>
            );
        }

        render() {

            return (
                <Navigator.Navigator
                    initialRoute={{
                        name: 'MainPage',
                        component:MainPage,

                    }}
                    renderScene={(e, i)=>this._renderScene(e, i)}
                />
            );
        }
}
