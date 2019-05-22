pragma solidity ^0.5.2;

contract IDFPool {
    function transferCollateral(address _tokenID, address _to, uint256 _amount) public returns (bool);
    function transferFromCollateral(address _tokenID, address _from, uint256 _amount) public returns (bool);
    function transferToBank(address _tokenID, uint256 _amount) public returns (bool);
}