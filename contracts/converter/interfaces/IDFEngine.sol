pragma solidity ^0.5.2;

contract IDFEngine {
    function deposit(address _sender, address _tokenID, uint _amount) public returns (uint);
    function withdraw(address _sender, address _tokenID, uint _amount) public returns (uint);
    function destroy(address _sender, uint _amount) public returns (bool);
    function claim(address _depositor) public returns (uint);
}