import CryptoJS from "crypto-js";

export const CRYPTO_MODE = CryptoJS.mode.CBC;

//需要保证两个相同，确保每次加密生成的字符串相同
export const CRYPTO_KEY = CryptoJS.enc.Utf8.parse("1234567890123456");
export const CRYPTO_IV = CryptoJS.enc.Utf8.parse("1234567890123456");
