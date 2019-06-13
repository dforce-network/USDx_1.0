pragma solidity ^0.5.2;

import './DSToken.sol';
import './interfaces/IERC20Token';

contract IDSWrappedToken is IERC20Token {
    function decimals() public view returns (uint);
}

contract DSWrappedToken is DSToken {
    ERC20 instance;
    address public DFPool;
    uint8 public srcDecimals;
    constructor(address srcERC20, uint8 srcDecimals_, bytes32 symbol_, address dfPool_) public {
        instance = ERC20(srcERC20);
        symbol = symbol_;
        srcDecimals = srcDecimals_;
        DFPool = dfPool_;
    }

    function wrapper(address _sender, uint _amount) public returns (uint) {
        
    }

}

