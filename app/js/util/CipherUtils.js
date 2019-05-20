

import CryptoJS from 'crypto-js';
import AES from "crypto-js/aes";
import ENC from "crypto-js/enc-utf8";
import ECB from "crypto-js/mode-ecb";
import Pkcs7 from "crypto-js/pad-pkcs7";

//aes密钥是V05sT01wOGMyVnlkbWxqWg==   前端使用前,先base64 decode下, 解码后是  WNlOMp8c2VydmljZ

export function aesEncryptWithKey(data, key) {
         console.log(key + ', data: ' + data);
        let AES_KEY = CryptoJS.enc.Utf8.parse(key);
        console.log(AES_KEY);
        let sendData = CryptoJS.enc.Utf8.parse(data);
        console.log(sendData);
        let encrypted = CryptoJS.AES.encrypt(sendData, AES_KEY, {mode:CryptoJS.mode.ECB, padding:CryptoJS.pad.Pkcs7});
        console.log(encrypted);

        return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
}


export function aesEncrypt(data) {
        //console.log('aesEncrypt  data: ' + data);
        var key = 'WNlOMp8c2VydmljZ';
        let AES_KEY = CryptoJS.enc.Utf8.parse(key);
        //console.log(AES_KEY);
        let sendData = CryptoJS.enc.Utf8.parse(data);
        //console.log(sendData);
        let encrypted = CryptoJS.AES.encrypt(sendData, AES_KEY, {mode:CryptoJS.mode.ECB, padding:CryptoJS.pad.Pkcs7});
        //console.log('aesEncrypt encrypted = ' + encrypted);

        return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
}