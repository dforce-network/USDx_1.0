pragma solidity ^0.5.2;

contract IDFFunds {
    function transferFee(address _sender, uint256 _amount) public returns (bool);
}