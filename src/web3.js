import Web3 from 'web3';

const web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/yrOCzNlVyms8ClC1UfGG"))
// const web3 = new Web3(window.web3.currentProvider);
export default web3;
