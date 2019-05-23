pragma solidity ^0.5.2;

contract IDFFunds {
    function transferOut(address _sender, uint _amount) public returns (bool);
}