pragma solidity ^0.5.2;

contract IDFCollateral {
    function transferOut(address _tokenID, address _to, uint _amount) public returns (bool);
    function colUnwrap(address tokenIdx, uint amount) public;
}