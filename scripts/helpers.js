const { ethers } = require('ethers');
const { getContractAt } = require('@nomiclabs/hardhat-ethers/internal/helpers');

// Helper method for fetching environment variables from .env
function getEnvVariable(key, defaultValue) {
  if (process.env[key]) {
    return process.env[key];
  }
  if (!defaultValue) {
    throw `${key} is not defined and no default value was provided`;
  }
  return defaultValue;
}

// Helper method for fetching a connection provider to the Ethereum network
function getProvider() {
  return ethers.getDefaultProvider(getEnvVariable('NETWORK', 'goerli'), {
    alchemy: getEnvVariable('ALCHEMY_KEY'),
  });
}

// Helper method for fetching a wallet account using an environment variable for the PK
function getAccount() {
  return new ethers.Wallet(
    getEnvVariable('ACCOUNT_PRIVATE_KEY'),
    getProvider()
  );
}

// Helper method for fetching a contract instance at a given address
function getContract(hre) {
  return getContractAt(
    hre,
    getEnvVariable('NFT_CONTRACT_NAME'),
    getEnvVariable('NFT_CONTRACT_ADDRESS')
  );
}

module.exports = {
  getContract,
  getEnvVariable,
  getProvider,
  getAccount,
};
