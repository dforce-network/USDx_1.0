pragma solidity ^0.5.2;

import '../token/interfaces/IERC20Token.sol';
import '../utility/DSAuth.sol';

contract DFCollateral is DSAuth {

    function transferTo(address _colID, address _to, uint _amount)
        public
        auth
        returns (bool)
    {
        require(_to != address(0), "TransferTo: 0 address not allow.");
        assert(IERC20Token(_colID).transfer(_to, _amount));
        return true;
    }
}