pragma solidity ^0.5.2;

import '../token/interfaces/IERC20Token.sol';
import '../utility/DSAuth.sol';

contract DFFunds is DSAuth {

    address dfID;

    constructor (address _assetID) public {
        dfID = _assetID;
    }

    function transferOut(address _to, uint _amount)
        public
        auth
        returns (bool)
    {
        require(_to != address(0), "TransferOut: not allow to 0 address.");
        assert(IERC20Token(dfID).transfer(_to, _amount));
        return true;
    }
}