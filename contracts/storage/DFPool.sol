pragma solidity ^0.5.2;

import '../token/interfaces/IERC20Token.sol';
import '../utility/DSAuth.sol';
import '../utility/Utils.sol';

contract DFPool is DSAuth, Utils {

    address dfund;

    constructor (address _fund) public {
        dfund = _fund;
    }

    function transferFromSender(address _colID, address _from, uint _amount)
        public
        auth
        returns (bool)
    {
        assert(IERC20Token(_colID).transferFrom(_from, address(this), _amount));
        return true;
    }

    function transferOut(address _colID, address _to, uint _amount)
        public
        validAddress(_to)
        auth
        returns (bool)
    {
        assert(IERC20Token(_colID).transfer(_to, _amount));
        return true;
    }

    function transferToFunds(address _colID, uint _amount)
        public
        auth
        returns (bool)
    {
        require(dfund != address(0), "TransferToFund: dfund empty.");
        assert(IERC20Token(_colID).transfer(dfund, _amount));
        return true;
    }
}