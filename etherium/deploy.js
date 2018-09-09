const ganache = require('ganache-cli');

// Web3 constructor
const Web3 = require('web3');

// Compiled output of contract
const { interface, bytecode } = require('./compile');

const provider = ganache.provider();

// Create web3 instance, ready to talk to network
const web3 = new Web3(provider);

// This function exists simply so we can  use async/await syntax
const deploy = async() => {
  const accounts = await web3.eth.getAccounts();

  const selectedAccount = accounts[0];

  console.log('Attempting to deploy from account', selectedAccount);

  const result = await
    new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    // Send creates a transaction. Contrast with call
    .send({ gas: '1000000', from: selectedAccount });
};

deploy();

// Note: This is very very similar to the tst javascript
