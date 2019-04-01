/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './app/App';
// import App from './app/test/App1';
import {name as appName} from './app.json';


AppRegistry.registerComponent(appName, () => App);
