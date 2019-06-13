pragma solidity ^0.5.2;

import './IERC20Token.sol';

contract IDSWrappedToken is IERC20Token {
    function mint(address _account, uint _value) public;
    function burn(address _account, uint _value) public;
    function wrap(uint _amount) public returns (uint);
    function unWrap(uint _amount) public returns (uint);
}