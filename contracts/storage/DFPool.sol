pragma solidity ^0.5.2;

import '../token/interfaces/IERC20Token.sol';
import '../utility/DSAuth.sol';
import '../utility/Utils.sol';

contract DFPool is DSAuth, Utils {

    address bank;

    constructor (address _bank) public {
        bank = _bank;
    }

    function transferFromCollateral(address _collateral, address _from, uint256 _amount)
        public
        auth
        returns (bool)
    {
        assert(IERC20Token(_collateral).transferFrom(_from, address(this), _amount));
        return true;
    }

    function transferCollateral(address _collateral, address _to, uint256 _amount)
        public
        validAddress(_to)
        auth
        returns (bool)
    {
        assert(IERC20Token(_collateral).transfer(_to, _amount));
        return true;
    }

    function transferToBank(address _collateral, uint256 _amount)
        public
        auth
        returns (bool)
    {
        require(bank != address(0), "DFPool bank The address is empty");
        assert(IERC20Token(_collateral).transfer(bank, _amount));
        return true;
    }
}