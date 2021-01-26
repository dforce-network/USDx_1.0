pragma solidity ^0.5.2;

import "../token/ERC20SafeTransfer.sol";
import "../utility/DSMath.sol";
import "../utility/DSAuth.sol";
import "../utility/Utils.sol";
import "./interfaces/IDToken.sol";
import "./interfaces/IDFStore.sol";
import "./interfaces/IDTokenController.sol";
import "../token/interfaces/IDSWrappedToken.sol";

contract DFPoolV1 is DSMath, DSAuth, Utils, ERC20SafeTransfer {
    address dfcol;

    constructor(address _dfcol) public {
        dfcol = _dfcol;
    }

    function transferFromSender(
        address _tokenID,
        address _from,
        uint256 _amount
    ) public auth returns (bool) {
        uint256 _balance = IERC20(_tokenID).balanceOf(address(this));
        require(
            doTransferFrom(_tokenID, _from, address(this), _amount),
            "transferFromSender: failed"
        );
        assert(
            sub(IERC20(_tokenID).balanceOf(address(this)), _balance) == _amount
        );
        return true;
    }

    function transferOut(
        address _tokenID,
        address _to,
        uint256 _amount
    ) public validAddress(_to) auth returns (bool) {
        uint256 _balance = IERC20(_tokenID).balanceOf(_to);
        require(doTransferOut(_tokenID, _to, _amount), "transferOut: failed");
        assert(sub(IERC20(_tokenID).balanceOf(_to), _balance) == _amount);
        return true;
    }

    function transferToCol(address _tokenID, uint256 _amount)
        public
        auth
        returns (bool)
    {
        require(
            dfcol != address(0),
            "TransferToCol: collateral address empty."
        );
        uint256 _balance = IERC20(_tokenID).balanceOf(dfcol);
        require(
            doTransferOut(_tokenID, dfcol, _amount),
            "transferToCol: failed"
        );
        assert(sub(IERC20(_tokenID).balanceOf(dfcol), _balance) == _amount);
        return true;
    }

    function transferFromSenderToCol(
        address _tokenID,
        address _from,
        uint256 _amount
    ) public auth returns (bool) {
        require(
            dfcol != address(0),
            "TransferFromSenderToCol: collateral address empty."
        );
        uint256 _balance = IERC20(_tokenID).balanceOf(dfcol);
        require(
            doTransferFrom(_tokenID, _from, dfcol, _amount),
            "transferFromSenderToCol: failed"
        );
        assert(sub(IERC20(_tokenID).balanceOf(dfcol), _balance) == _amount);
        return true;
    }

    function approveToEngine(address _tokenIdx, address _engineAddress)
        public
        auth
    {
        require(
            doApprove(_tokenIdx, _engineAddress, uint256(-1)),
            "approveToEngine: Approve failed!"
        );
    }
}

contract DFPoolV2 is ERC20SafeTransfer, DFPoolV1(address(0)) {
    bool private initialized;
    address dFPoolOld;
    address dTokenController;
    address constant dfStore = 0xD30d06b276867CfA2266542791242fF37C91BA8d;

    mapping(address => bool) public supportDToken;

    constructor(
        address _dfcol,
        address _dFPoolOld,
        address _dTokenController
    ) public {
        initialize(_dfcol, _dFPoolOld, _dTokenController);
    }

    // --- Init ---
    function initialize(
        address _dfcol,
        address _dFPoolOld,
        address _dTokenController
    ) public {
        require(!initialized, "initialize: Already initialized!");
        owner = msg.sender;
        dfcol = _dfcol;
        dFPoolOld = _dFPoolOld;
        dTokenController = _dTokenController;
        initialized = true;
    }

    function transferFromSenderOneClick(
        address _tokenID,
        address _from,
        uint256 _amount
    ) public returns (bool) {
        super.transferFromSender(_tokenID, _from, _amount);
        if (supportDToken[_tokenID])
            IDToken(IDTokenController(dTokenController).getDToken(_tokenID))
                .mint(address(this), _amount);
        return true;
    }

    function transferOutSrc(
        address _tokenID,
        address _to,
        uint256 _amount
    ) public returns (bool) {
        if (supportDToken[_tokenID])
            IDToken(IDTokenController(dTokenController).getDToken(_tokenID))
                .redeemUnderlying(address(this), _amount);
        transferOut(_tokenID, _to, _amount);
        return true;
    }

    function transferToCol(address _xToken, uint256 _amount)
        public
        returns (bool)
    {
        super.transferToCol(_xToken, _amount);
        address _srcToken = IDSWrappedToken(_xToken).getSrcERC20();
        if (supportDToken[_srcToken])
            IDToken(IDTokenController(dTokenController).getDToken(_srcToken))
                .mint(
                address(this),
                IDSWrappedToken(_xToken).reverseByMultiple(_amount)
            );
        return true;
    }

    function approve(address _tokenID) external auth {
        address _dToken = IDTokenController(dTokenController).getDToken(
            _tokenID
        );
        require(_dToken != address(0), "approve: dToken address empty.");
        require(
            doApprove(_tokenID, _dToken, uint256(-1)),
            "approve: Approve failed!"
        );
    }

    function initUpdate() external auth {
        address[] memory _xTokens = IDFStore(dfStore).getSectionToken(
            IDFStore(dfStore).getMintPosition()
        );
        for (uint256 i = 0; i < _xTokens.length; i++) {
            if (
                IDSWrappedToken(_xTokens[i]).getSrcERC20() ==
                0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48
            ) enableDToken(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48);
            else disableDToken(IDSWrappedToken(_xTokens[i]).getSrcERC20());
        }
    }

    function enableDToken(address _tokenID) public auth {
        address _dToken = IDTokenController(dTokenController).getDToken(
            _tokenID
        );
        require(_dToken != address(0), "enableDToken: dToken address empty.");

        if (IERC20(_tokenID).allowance(address(this), _dToken) == 0)
            require(
                doApprove(_tokenID, _dToken, uint256(-1)),
                "approve: Approve failed!"
            );

        address _xToken = IDFStore(dfStore).getWrappedToken(_tokenID);
        require(_xToken != address(0), "enableDToken: xToken address empty.");

        uint256 _amount = sub(
            IERC20(_tokenID).balanceOf(address(this)),
            IDSWrappedToken(_xToken).reverseByMultiple(
                IERC20(_xToken).balanceOf(address(this))
            )
        );
        if (_amount > 0) IDToken(_dToken).mint(address(this), _amount);

        require(
            IDSWrappedToken(_xToken).reverseByMultiple(
                IERC20(_xToken).balanceOf(address(this))
            ) == IERC20(_tokenID).balanceOf(address(this)),
            "enableDToken: Pending src token in new pool verification failed"
        );

        supportDToken[_tokenID] = true;
    }

    function disableDToken(address _tokenID) public auth {
        address _dToken = IDTokenController(dTokenController).getDToken(
            _tokenID
        );
        require(_dToken != address(0), "disableDToken: dToken address empty.");

        uint256 _amount = IERC20(_dToken).balanceOf(address(this));
        if (_amount > 0) IDToken(_dToken).redeem(address(this), _amount);

        address _xToken = IDFStore(dfStore).getWrappedToken(_tokenID);
        require(_xToken != address(0), "disableDToken: xToken address empty.");

        require(
            IDSWrappedToken(_xToken).reverseByMultiple(
                IERC20(_xToken).totalSupply()
            ) <= IERC20(_tokenID).balanceOf(address(this)),
            "disableDToken: Pending src token in new pool verification failed"
        );

        supportDToken[_tokenID] = false;
    }

    function rmul(uint256 x, uint256 y) internal pure returns (uint256 z) {
        z = mul(x, y) / 1e18;
    }

    function getInterestByXToken(address _xToken)
        public
        returns (address, uint256)
    {
        address _token = IDSWrappedToken(_xToken).getSrcERC20();
        uint256 _xBalance = IDSWrappedToken(_xToken).changeByMultiple(
            getUnderlying(_token)
        );
        uint256 _xPrincipal = IERC20(_xToken).balanceOf(dfcol);
        return (
            _token,
            _xBalance > _xPrincipal ? sub(_xBalance, _xPrincipal) : 0
        );
    }

    function getUnderlying(address _underlying) public returns (uint256) {
        if (supportDToken[_underlying]) {
            address _dToken = IDTokenController(dTokenController).getDToken(
                _underlying
            );
            if (_dToken == address(0)) return 0;

            return IDToken(_dToken).balanceOfUnderlying(address(this));
        }

        address _xToken = IDFStore(dfStore).getWrappedToken(_underlying);
        return
            sub(
                IERC20(_underlying).balanceOf(address(this)),
                IDSWrappedToken(_xToken).reverseByMultiple(
                    IERC20(_xToken).balanceOf(address(this))
                )
            );
    }
}
