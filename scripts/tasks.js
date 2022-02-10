const { task } = require('hardhat/config');
const { getAccount, getContract, getEnvVariable } = require('./helpers');
const fetch = require('node-fetch');

task('deploy', 'Deploys the contract').setAction(async function (
  taskArguments,
  hre
) {
  const nftContractFactory = await hre.ethers.getContractFactory(
    getEnvVariable('NFT_CONTRACT_NAME'),
    getAccount()
  );
  const nft = await nftContractFactory.deploy();
  console.log(`Contract deployed to address: ${nft.address}`);
});

task('mint', 'Mints from the NFT contract')
  .addParam('address', 'The address to receive a token')
  .setAction(async function (taskArguments, hre) {
    const contract = await getContract(hre);
    const transactionResponse = await contract.safeMint(taskArguments.address);
    console.log(`Transaction Hash: ${transactionResponse.hash}`);
  });

task(
  'publicMint',
  'Mints from the NFT contract using public method with payment'
)
  .addParam('address', 'The address to receive a token')
  .addParam('value', 'The amount to pay for the token')
  .setAction(async function (taskArguments, hre) {
    const contract = await getContract(hre);
    const transactionResponse = await contract.publicMint(
      taskArguments.address,
      { value: ethers.utils.parseEther(taskArguments.value) }
    );
    console.log(`Transaction Hash: ${transactionResponse.hash}`);
  });

task('withdraw', 'Withdraw funds stored in the contract to the address')
  .addParam('address', 'The address to transfer funds')
  .setAction(async function (taskArguments, hre) {
    const contract = await getContract(hre);
    const transactionResponse = await contract.withdrawPayments(
      taskArguments.address
    );
    console.log(`Transaction Hash: ${transactionResponse.hash}`);
  });

task('getPayments', 'Get the payments owed to an address')
  .addParam('address', 'The address')
  .setAction(async function (taskArguments, hre) {
    const contract = await getContract(hre);
    const transactionResponse = await contract.payments(taskArguments.address);
    console.log(`Withdrawable funds: ${transactionResponse}`);
  });

task('getMetadata', 'Fetches the token metadata for the given token ID')
  .addParam('tokenid', 'The tokenID to fetch metadata for')
  .setAction(async function (taskArguments, hre) {
    const contract = await getContract(hre);
    const response = await contract.tokenURI(taskArguments.tokenid);

    const metadata_url = response;
    console.log(`Metadata URL: ${metadata_url}`);

    const metadata = await fetch(metadata_url).then((res) => res.json());
    console.log(
      `Metadata fetch response: ${JSON.stringify(metadata, null, 2)}`
    );
  });

task('getOwner', 'Return the owner wallet of the token')
  .addParam('tokenid', 'The tokenID to show the owner')
  .setAction(async function (taskArguments, hre) {
    const contract = await getContract(hre);
    const response = await contract.ownerOf(taskArguments.tokenid);

    console.log('Owner of this token is', response);
  });
