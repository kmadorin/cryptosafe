import CryptoJS from 'crypto-js';
import ethutil from 'ethereumjs-util';

export default class Wallet {

  static generate(password) {
    // Initiate empty wallet object
    let wallet = {}

    // Generate private key from password
    const bprivateKey = ethutil.sha256(password);
    const privateKey = bprivateKey.toString('hex')

    // Encrypt private key and collect ciphertext

    wallet.encryptedKey = CryptoJS.AES.encrypt(privateKey, password).toString()

    // Generate address and add '0x' prefix
    wallet.address = '0x' + ethutil.privateToAddress(bprivateKey).toString('hex');

    return wallet

  }

  static generateAddress(password) {
    return Wallet.generate(password).address;
  }

  static decryptPrivateKey(encryptedKey, password) {

    // Decrypt private key and convert it to hex string
    return CryptoJS.AES.decrypt(encryptedKey, password).toString(CryptoJS.enc.Utf8)

  }

  static delete() {

    // Clear address and encrypted private key from localStorage and reset app completely
    localStorage.clear()
  }
}