// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/finance/PaymentSplitter.sol';

contract KinTestTokenV2 is ERC721, Ownable, PaymentSplitter {
  using Counters for Counters.Counter;

  Counters.Counter private _tokenIdCounter;

  // Constants
  uint256 constant TOTAL_SUPPLY = 3;
  uint256 constant MINT_PRICE = 0.01 ether;

  constructor(address[] memory _payees, uint256[] memory _shares)
    payable
    ERC721('SIMPLENFT', 'SNFT')
    PaymentSplitter(_payees, _shares)
  {}

  function totalSupply() public pure returns (uint256) {
    return TOTAL_SUPPLY;
  }

  function _baseURI() internal pure override returns (string memory) {
    return
      'https://ipfs.io/ipfs/bafybeieeyvkwksmfscj4t47bf6cb7ukkj5nb7nygchsqnupc2vv3uowqca/metadata/';
  }

  function freeMint(address to) public onlyOwner {
    uint256 tokenId = _tokenIdCounter.current();
    require(tokenId < TOTAL_SUPPLY, 'Max supply reached');

    _tokenIdCounter.increment();
    uint256 newItemId = _tokenIdCounter.current();
    _safeMint(to, newItemId);
  }

  function publicMint(address to) public payable {
    uint256 tokenId = _tokenIdCounter.current();
    require(tokenId < TOTAL_SUPPLY, 'Max supply reached');
    require(
      msg.value == MINT_PRICE,
      'Transaction value did not equal the mint price'
    );

    _tokenIdCounter.increment();
    uint256 newItemId = _tokenIdCounter.current();
    _safeMint(to, newItemId);
  }
}
