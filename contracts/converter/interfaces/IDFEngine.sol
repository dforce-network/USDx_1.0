pragma solidity ^0.5.2;

contract IDFEngine {
    function deposit(address _sender, address _tokenID, uint256 _amount) public returns (uint256);
    function withdraw(address _sender, address _tokenID, uint256 _amount) public returns (uint256);
    function destroy(address _sender, uint256 _amount) public returns (bool);
}