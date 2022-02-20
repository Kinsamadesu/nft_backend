const { expect, use } = require('chai');
const { solidity } = require('ethereum-waffle');
const { getEnvVariable } = require('../scripts/helpers');

use(solidity);

describe('SimpleNFT contract', function () {
  let contract;
  let owner;

  beforeEach(async () => {
    contract = await deployContract();
    [owner] = await ethers.getSigners();
  });

  const deployContract = async () => {
    const snft = await ethers.getContractFactory(
      getEnvVariable('NFT_CONTRACT_NAME')
    );
    const payee_map = getEnvVariable('PAYEE_WALLET_MAP');
    const share_map = getEnvVariable('PAYEE_SHARE_MAP');
    const payee_array = payee_map.split(';');
    const share_array = share_map.split(';').map((s) => parseInt(s));
    const deployed = await snft.deploy(payee_array, share_array);
    return deployed;
  };

  describe('Given contract is deployed', () => {
    it('should return the total supply', async () => {
      let supply = await contract.totalSupply();
      expect(supply.toNumber()).equals(0);
      await contract.freeMint(owner.address);
      await contract.freeMint(owner.address);
      supply = await contract.totalSupply();
      expect(supply.toNumber()).equals(2);
    });

    it('should return the max supply', async () => {
      let supply = await contract.maxSupply();
      expect(supply.toNumber()).equals(3);
    });

    it('should list token for a specific address', async () => {
      await contract.freeMint(owner.address);
      await contract.freeMint(owner.address);
      const tokensBig = await contract.listTokenOf(owner.address);
      const tokens = tokensBig.map((b) => b.toNumber());
      expect(tokens).to.eql([1, 2]);
    });

    describe('Given admin wants to mint', () => {
      describe('Given total supply not reached', () => {
        it('should mint a new token', async () => {
          await expect(contract.freeMint(owner.address))
            .to.emit(contract, 'Transfer')
            .withArgs(ethers.constants.AddressZero, owner.address, '1');
        });
      });
      describe('Given total supply reached', () => {
        it('should not mint', async () => {
          await contract.test_maxSupply();
          await expect(contract.freeMint(owner.address)).to.be.revertedWith(
            'Max supply reached'
          );
        });
      });
    });

    describe('Given user wants to mint', () => {
      describe('Given total supply not reached', () => {
        describe('Given correct payment is sent', () => {
          it('should mint a new token', async () => {
            await expect(
              contract.publicMint(owner.address, {
                value: ethers.utils.parseEther('0.01'),
              })
            )
              .to.emit(contract, 'Transfer')
              .withArgs(ethers.constants.AddressZero, owner.address, '1');
          });
        });
        describe('Given wrong payment is sent', () => {
          it('should not mint', async () => {
            await expect(
              contract.publicMint(owner.address, {
                value: ethers.utils.parseEther('0.02'),
              })
            ).to.be.revertedWith(
              'Transaction value did not equal the mint price'
            );
          });
        });
      });
      describe('Given total supply reached', () => {
        it('should not mint', async () => {
          await contract.test_maxSupply();
          await expect(
            contract.publicMint(owner.address, {
              value: ethers.utils.parseEther('0.01'),
            })
          ).to.be.revertedWith('Max supply reached');
        });
      });
    });
  });
});
