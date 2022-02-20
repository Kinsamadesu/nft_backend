// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/finance/PaymentSplitter.sol';

contract SimpleNFT is ERC721, Ownable, PaymentSplitter {
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

  function totalSupply() public view returns (uint256) {
    return _tokenIdCounter.current();
  }

  function maxSupply() public pure returns (uint256) {
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

  function listTokenOf(address owner)
    external
    view
    returns (uint256[] memory tokenList)
  {
    uint256[] memory list = new uint256[](balanceOf(owner));
    for (uint256 i = 0; i < totalSupply(); i++) {
      if (ownerOf(i + 1) == owner) {
        list[i] = i + 1;
      }
    }
    return list;
  }

  //--------- tests methods ------------------------------------------
  function test_maxSupply() public onlyOwner {
    _tokenIdCounter._value = 3;
  }

  function test_resetSupply() public onlyOwner {
    _tokenIdCounter.reset();
  }
}
