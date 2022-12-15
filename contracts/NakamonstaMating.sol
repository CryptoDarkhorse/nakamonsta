pragma solidity ^0.4.24;

import "./NakamonstaUtils.sol";
import "./NakamonstaBase.sol";


contract NakamonstaMating is NakamonstaBase {
  uint128 public matingPrice = 0.01 ether;
  address public admin = address(0xbA5Ad1a36add5bBA80043d33F9A1D18b2a5fC636);

  mapping(address => uint256) public points;
  uint256 public pointFactor = 0.001 ether;

  function setPointFactor(uint256 newFactor) public onlyOwner {
    pointFactor = newFactor;
  }

  function addPoint(address user, uint256 earnedPoint) public onlyOwner {
    require(user != address(0));
    points[user] += earnedPoint;
  }

  function getPointFactor() public view returns(uint256) {
    return pointFactor;
  }

  function getPoint() public view returns(uint256) {
    return points[msg.sender];
  }

  // --------------------------------
  // Admin functions (onlyOwner)
  // --------------------------------
  function setMinimumPrice(uint128 _matingPrice) public onlyOwner {
    matingPrice = _matingPrice;
  }

  // --------------------------------
  // Public methods
  // --------------------------------
  function mate(uint _tokenIdMother, uint _tokenIdFather, uint256 _point) 
    public isOwnerOf(_tokenIdMother) isOwnerOf(_tokenIdFather) payable returns(uint) 
  {
    require(points[msg.sender] >= _point, "point is not sufficient");
    require(msg.value + _point * pointFactor >= matingPrice, "matingPrice isn't met");
    
    points[msg.sender] -= _point;
    
    return _mate(_tokenIdMother, _tokenIdFather);
  }

  // --------------------------------
  // Utils
  // --------------------------------
  function _mate(uint _tokenIdMother, uint _tokenIdFather) internal
  isReady(_tokenIdMother) isReady(_tokenIdFather)
  returns(uint) {
    require(_tokenIdMother != _tokenIdFather, "Mother and father must be different");

    Nakamonsta storage mother = nakamonstas[_tokenIdMother];
    Nakamonsta storage father = nakamonstas[_tokenIdFather];

    // Calculate new genes
    uint babyGenes = NakamonstaUtils._mixGenes(father.genes, mother.genes);

    // Create new nakamonsta,
    uint babyNakamonstaId = _createNakamonsta(ownerOf(_tokenIdMother), "Baby", babyGenes,
      uint64(_tokenIdMother), uint64(_tokenIdFather));

    // After mating/giving birth, both parents must rest for 2 days
    mother.readyDate = uint64(now + 2 days);
    father.readyDate = uint64(now + 2 days);

    // Baby becomes adult after 7 days
    nakamonstas[babyNakamonstaId].readyDate = uint64(now + 7 days);
    return babyNakamonstaId;
  }
}
