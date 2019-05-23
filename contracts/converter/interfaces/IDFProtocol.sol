pragma solidity ^0.5.2;

contract IDFProtocol {
    function deposit(address _tokenID, uint _amount) public;
    function withdraw(address _tokenID, uint _amount) public;
    function destroy(uint _amount) public;
}