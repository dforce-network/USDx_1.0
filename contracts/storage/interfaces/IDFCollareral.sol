pragma solidity ^0.5.2;

contract IDFCollareral {
    function transferCollateral(address _tokenID, address _sender, uint256 _amount) public returns (bool);
}