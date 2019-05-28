// import { AsyncStorage } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Storage from 'react-native-storage';

var storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: null,
    enableCache: true,
})

// 全局变量
global.storage = storage