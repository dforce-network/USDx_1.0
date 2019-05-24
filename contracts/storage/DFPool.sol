pragma solidity ^0.5.2;

import '../token/interfaces/IERC20Token.sol';
import '../utility/DSAuth.sol';
import '../utility/Utils.sol';

contract DFPool is DSAuth, Utils {

    address dfcol;

    constructor (address _dfcol) public {
        dfcol = _dfcol;
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

    function transferToCol(address _colID, uint _amount)
        public
        auth
        returns (bool)
    {
        require(dfcol != address(0), "TransferToCol: collateral empty.");
        assert(IERC20Token(_colID).transfer(dfcol, _amount));
        return true;
    }
}