import React, {Component} from 'react';
// import axios from 'axios';
import './App.css';
import yashchex from './yashchex';
import web3 from './web3';
import Wallet from './wallet';
let wallet,accountAddress, account;

class App extends Component {
  state = {
    bargainStatus: false,
    bargainId: 1,
    seller: '',
    buyer: '',
    boxAddress: '0x337DA5Fa7381b1345C273f5702C2Fc1f369e19F0',
    isAdmin: false,
    authorized: false,
    password: '',
  };

  handleChange = (field) => event => {
    this.setState({[field]: event.target.value});
  }

  handlePasswordSubmit = async event => {
    event.preventDefault();
    this.setState({authorized: true});
    const {password} = this.state;
    wallet = Wallet.generate(password);
    accountAddress = wallet.address;
    console.log(accountAddress);
    const pk = '0x'+Wallet.decryptPrivateKey(wallet.encryptedKey, password);
    account = web3.eth.accounts.privateKeyToAccount(pk);
    account.address =web3.utils.toChecksumAddress(account.address);
    web3.eth.accounts.wallet.add(account);
    const isAdmin = await yashchex.methods.isAdmin(accountAddress).call();
    if (isAdmin) {
      this.setState({isAdmin: true});
    }
  };

  handleBargainFormSubmit = async event => {
    event.preventDefault();
    const {bargainId, seller, buyer, boxAddress} = this.state;
    const newBargainId = bargainId+1;
    this.setState({bargainId: newBargainId});
    // const text = {
    //   "theme": "NEW_BARGAIN",
    //   "bargainId": ""+newBargainId,
    // }

    // const message = JSON.stringify({
    //   sender_address: '111',
    //   receiver_address: '112',
    //   text: text,
    //   type: "FROM_USER_MESSAGE",
    // });

//     const message = `{
// "sender_address": "${buyer}",
// "reciever_address": "${seller}",
// "text": "{\"theme\":\"NEW_BARGAIN\",\"bargain_id\":\"${newBargainId}\"}",
// "type": "FROM_USER_MESSAGE"
// }`

    // console.log(message);

    // axios.put('http://10.30.93.17:8000/api/messages/675/create_eth_bargain/', message)
    // .then(function (response) {
    //   console.log(response);

    // })
    // .catch(function (error) {
    //   console.log(error);
    // });
    const gasPrice = await web3.eth.gasPrice;
    await yashchex.methods.addBargain(bargainId, seller, buyer, boxAddress).send({from: account.address, gas: '200000', gasPrice});
    alert('Сделка успешно добавлена');
  };

  handleResolveBargainFormSubmit = async event => {
    event.preventDefault();
    const gasPrice = await web3.eth.gasPrice;
    await yashchex.methods.tryToResolveBargain(this.state.bargainId).send({from: account.address, gas: '200000', gasPrice});
    alert('Вы одобрили сделку с вашей стороны');
  }

  render() {
    return (
      <div className="container">
        <form className={this.state.authorized ? 'form' : 'form form--visible'} onSubmit={this.handlePasswordSubmit}>
          <div className="group form__input">
            <input type="text" id="password" onChange={this.handleChange('password')} required/>
            <span className="highlight"></span>
            <span className="bar"></span>
            <label>Password for your wallet</label>
          </div>
          <button type="submit" className="form__submit btn btn--blue">Login</button>
        </form>
        <form className={this.state.authorized && this.state.isAdmin ? 'form form--visible' : 'form'} onSubmit={this.handleBargainFormSubmit}>
          <div className="group form__input">
            <input type="text" onChange={this.handleChange('buyer')} required/>
            <span className="highlight"></span>
            <span className="bar"></span>
            <label>Buyer ID</label>
          </div>
          <div className="group form__input">
            <input type="text" onChange={this.handleChange('seller')} required/>
            <span className="highlight"></span>
            <span className="bar"></span>
            <label>Seller ID</label>
          </div>
          <button type="submit" className="form__submit btn btn--blue">Init</button>
        </form>
        <form className={this.state.authorized ? 'form form--visible' : 'form'} onSubmit={this.handleResolveBargainFormSubmit}>
          <div className="group form__input">
            <input type="text" onChange={this.handleChange('bargainId')} required/>
            <span className="highlight"></span>
            <span className="bar"></span>
            <label>Bargain ID</label>
          </div>
          <button type="submit" className="form__submit btn btn--blue">Sign</button>
        </form>
      </div>
    );
  }
}

export default App;
