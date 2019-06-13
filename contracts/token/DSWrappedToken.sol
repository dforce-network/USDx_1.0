pragma solidity ^0.5.2;

import './DSToken.sol';

contract DSWrappedToken is DSToken {
    // ERC20 instance;
    address public srcERC20;
    uint public srcDecimals;
    uint public multiple;
    bool public flag;
    constructor(address _srcERC20, uint _srcDecimals, bytes32 _symbol) public {
        // instance = ERC20(_srcERC20);
        symbol = _symbol;
        srcDecimals = _srcDecimals;
        srcERC20 = _srcERC20;
        _calMultiple();
    }

    function _calMultiple() internal {
        multiple = rpow(10, sub(max(srcDecimals, decimals), min(srcDecimals, decimals)));
        flag = (srcDecimals > decimals);
    }

    function wrap(address _dst, uint _amount) public auth returns (uint) {

        uint _xAmount = changeByMultiple(_amount);
        mint(_dst, _xAmount);
        return _xAmount;
    }

    function unwrap(address _dst, uint _xAmount) public auth returns (uint) {

        // uint _amount = reverseByMultiple(_xAmount);
        burn(_dst, _xAmount);
        // instance.transfer(_receiver, _amount);
        return _xAmount;
    }

    function changeByMultiple(uint _amount) public view returns (uint) {

        uint _xAmount = _amount;
        uint _multiple = multiple;
        if (flag && _multiple > 0)
            _xAmount = div(_amount, _multiple);
        else
            _xAmount = mul(_amount, _multiple);

        return _xAmount;
    }

    function reverseByMultiple(uint _xAmount) public view returns (uint) {

        uint _amount = _xAmount;
        uint _multiple = multiple;
        if (flag && _multiple > 0)
            _amount = mul(_xAmount, _multiple);
        else
            _amount = div(_xAmount, _multiple);

        return _amount;
    }

    function getSrcERC20() public view returns (address) {
        return srcERC20;
    }

}

