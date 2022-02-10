// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/security/PullPayment.sol';

contract KinTestTokenV2 is ERC721, Ownable, PullPayment {
  using Counters for Counters.Counter;

  Counters.Counter private _tokenIdCounter;

  // Constants
  uint256 public constant TOTAL_SUPPLY = 3;
  uint256 public constant MINT_PRICE = 0.01 ether;

  constructor() ERC721('KinTestTokenV2', 'KTT2') {}

  function _baseURI() internal pure override returns (string memory) {
    return
      'https://ipfs.io/ipfs/bafybeieiffkhetbq6rxhg4gvvmqaadx4nqixdw5vkvslzb42w6z44kojsu/metadata/';
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
