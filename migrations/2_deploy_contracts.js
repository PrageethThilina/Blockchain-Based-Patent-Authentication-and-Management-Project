//Migrations
//deploy the smart contract to our Ganache personal blockhain
//use command truffle migrate to run the migrations
//use command truffle console to check the smart contract from the console

const Patent = artifacts.require("Patent");

module.exports = function(deployer) {
  deployer.deploy(Patent);
};