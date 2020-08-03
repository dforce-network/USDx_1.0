pragma solidity ^0.5.2;

import '../token/ERC20SafeTransfer.sol';
import '../utility/DSMath.sol';
import '../utility/DSAuth.sol';
import '../utility/Utils.sol';
import '.interfaces/IDToken.sol';
import '.interfaces/IDTokenController.sol';
import '../token/interfaces/IDSWrappedToken.sol';

contract DFPool is DSMath, DSAuth, Utils, ERC20SafeTransfer {

    address dfcol;

    constructor (address _dfcol) public {
        dfcol = _dfcol;
    }

    function transferFromSender(address _tokenID, address _from, uint _amount)
        public
        auth
        returns (bool)
    {
        uint _balance = IERC20(_tokenID).balanceOf(address(this));
        // IERC20(_tokenID).transferFrom(_from, address(this), _amount);
        require(doTransferFrom(_tokenID, _from, address(this), _amount), "transferFromSender: failed");
        assert(sub(IERC20(_tokenID).balanceOf(address(this)), _balance) == _amount);
        return true;
    }

    function transferOut(address _tokenID, address _to, uint _amount)
        public
        validAddress(_to)
        auth
        returns (bool)
    {
        uint _balance = IERC20(_tokenID).balanceOf(_to);
        // IERC20(_tokenID).transfer(_to, _amount);
        require(doTransferOut(_tokenID, _to, _amount), "transferOut: failed");
        assert(sub(IERC20(_tokenID).balanceOf(_to), _balance) == _amount);
        return true;
    }

    function transferToCol(address _tokenID, uint _amount)
        public
        auth
        returns (bool)
    {
        require(dfcol != address(0), "TransferToCol: collateral address empty.");
        uint _balance = IERC20(_tokenID).balanceOf(dfcol);
        // IERC20(_tokenID).transfer(dfcol, _amount);
        require(doTransferOut(_tokenID, dfcol, _amount), "transferToCol: failed");
        assert(sub(IERC20(_tokenID).balanceOf(dfcol), _balance) == _amount);
        return true;
    }

    function transferFromSenderToCol(address _tokenID, address _from, uint _amount)
        public
        auth
        returns (bool)
    {
        require(dfcol != address(0), "TransferFromSenderToCol: collateral address empty.");
        uint _balance = IERC20(_tokenID).balanceOf(dfcol);
        // IERC20(_tokenID).transferFrom(_from, dfcol, _amount);
        require(doTransferFrom(_tokenID, _from, dfcol, _amount), "transferFromSenderToCol: failed");
        assert(sub(IERC20(_tokenID).balanceOf(dfcol), _balance) == _amount);
        return true;
    }

    function approveToEngine(address _tokenIdx, address _engineAddress) public auth {
        // IERC20(_tokenIdx).approve(_engineAddress, uint(-1));
        require(
            doApprove(_tokenIdx, _engineAddress, uint(-1)),
            "approveToEngine: Approve failed!"
        );
    }
}

contract DFPoolNew is ERC20SafeTransfer, DFPool {

    address dFPoolOld;
    address dTokenController;

    constructor (address _dfcol, address _dFPoolOld, address _dTokenController) public {
        dfcol = _dfcol;
        dFPoolOld = _dFPoolOld;
        dTokenController = _dTokenController;
    }

    function transferFromSenderOneClick(address _tokenID, address _from, uint _amount)
        public
        returns (bool)
    {
        super.transferFromSender(_tokenID, _from, _amount);
        IDToken(IDTokenController(dTokenController).getDToken(_tokenID)).mint(address(this), _amount);
        return true;
    }

    function transferOutSrc(address _tokenID, address _to, uint _amount)
        public
        returns (bool)
    {
        IDToken(IDTokenController(dTokenController).getDToken(_tokenID)).redeemUnderlying(address(this), _amount);
        transferOut(_tokenID, _to, _amount);
        return true;
    }

    function transferToCol(address _tokenID, uint _amount)
        public
        returns (bool)
    {
        super.transferToCol(_tokenID, _amount);
        IDToken(IDTokenController(dTokenController).getDToken(_tokenID)).mint(address(this), add(_amount, migrateOldPool(_tokenID)));
        return true;
    }

    function migrateOldPool(address _tokenID) internal returns (uint) {
        address _dFPoolOld = dFPoolOld;
        uint _balanceOfPoolOld = IERC20(_tokenID).balanceOf(_dFPoolOld);
        if (_balanceOfPoolOld > 0) {
            DFPool(_dFPoolOld).transferOut(_tokenID, address(this), _balanceOfPoolOld);
            address _srcToken = IDSWrappedToken(_tokenID).getSrcERC20();
            DFPool(_dFPoolOld).transferOut(_srcToken, address(this), IERC20(_srcToken).balanceOf(_dFPoolOld));
            return IERC20(_tokenID).balanceOf(dfcol);
        }
        return 0;
    }

    function approve(address _tokenID) public {
        address _dToekn = IDTokenController(dTokenController).getDToken(_tokenID);
        require(_dToekn != address(0), "approve: dToekn address empty.");
        // IERC20(_tokenID).approve(_dToekn, uint(-1));
        require(
            doApprove(_tokenID, _dToekn, uint(-1)),
            "approve: Approve failed!"
        );
    }
}
