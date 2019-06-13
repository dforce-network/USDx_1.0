pragma solidity ^0.5.2;

import './DSToken.sol';

contract DSWrappedToken is DSToken {
    ERC20 instance;
    address public DFPool;
    uint public srcDecimals;
    uint public multiple;
    bool public flag;
    constructor(address _srcERC20, uint srcDecimals_, bytes32 symbol_, address dfPool_) public {
        instance = ERC20(_srcERC20);
        symbol = symbol_;
        srcDecimals = srcDecimals_;
        DFPool = dfPool_;
        _calMultiple();
    }

    function _calMultiple() internal {
        multiple = rpow(10, sub(max(srcDecimals, decimals), min(srcDecimals, decimals)));
        flag = (srcDecimals > decimals);
    }

    function wrap(uint _amount) public auth returns (uint) {

        uint _xAmount = _amount;

        uint _multiple = multiple;
        if (flag && _multiple > 0)
            _xAmount = div(_amount, _multiple);
        else
            _xAmount = mul(_amount, _multiple);

        mint(DFPool, _xAmount);

        return _xAmount;
    }

    function unWrap(uint _amount) public auth returns (uint) {

        uint _xAmount = _amount;

        uint _multiple = multiple;
        if (flag && _multiple > 0)
            _xAmount = mul(_amount, _multiple);
        else
            _xAmount = div(_amount, _multiple);

        burn(DFPool, _xAmount);

        return _xAmount;
    }

}

