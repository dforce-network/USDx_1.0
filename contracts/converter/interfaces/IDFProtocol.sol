pragma solidity ^0.5.2;

contract IDFProtocol {
    function deposit(address _tokenID, uint _amount) public returns (uint _balance);
    function withdraw(address _tokenID, uint _amount) public returns (uint _balance);
    function destroy(uint _amount) public;
    function claim() public returns (uint _balance);
}