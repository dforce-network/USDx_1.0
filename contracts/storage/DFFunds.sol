pragma solidity ^0.5.2;

import '../token/interfaces/IERC20Token.sol';
import '../utility/DSAuth.sol';

contract DFFunds is DSAuth {

    address dfnAddr;

    constructor (address _dfn) public {
        dfnAddr = _dfn;
    }

    function transferFee(address _to, uint256 _amount)
        public
        auth
        returns (bool)
    {
        require(_to != address(0), "DFCollareral _to The address is empty");
        assert(IERC20Token(dfnAddr).transfer(_to, _amount));
        return true;
    }
}