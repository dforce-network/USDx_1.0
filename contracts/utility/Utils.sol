pragma solidity ^0.5.2;

import "./DSMath.sol";
/*
    Utilities & Common Modifiers
*/
contract Utils is DSMath {
    modifier validAddress(address _address) {
        require(_address != address(0), "ValidAddress: address invalid.");
        _;
    }
}
