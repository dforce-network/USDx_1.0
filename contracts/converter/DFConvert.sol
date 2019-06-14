pragma solidity ^0.5.2;

import '../storage/interfaces/IDFStore.sol';
import '../token/interfaces/IDSToken.sol';
import '../storage/interfaces/IDFPool.sol';
import '../storage/interfaces/IDFCollateral.sol';
import '../utility/DSAuth.sol';
import "../utility/DSMath.sol";

contract DFConvert is DSAuth, DSMath {
    IDFStore public dfStore;
    IDFPool public dfPool;
    IDFCollateral public dfCol;
    IDSToken public usdxToken;

    constructor (
        address _usdxToken,
        address _dfStore,
        address _dfPool,
        address _dfCol
      )
        public
    {
        usdxToken = IDSToken(_usdxToken);
        dfStore = IDFStore(_dfStore);
        dfPool = IDFPool(_dfPool);
        dfCol = IDFCollateral(_dfCol);
    }

    function _convert(
        address _depositor,
        address[] memory _tokens,
        uint[] memory _mintCW,
        uint[] memory _tokenBalance,
        uint[] memory _resUSDXBalance,
        uint[] memory _depositorBalance,
        uint _step)
        public
        auth
        returns(uint)
    {
        uint _mintAmount;
        uint _mintTotal;
        uint _depositorMintAmount;
        uint _depositorMintTotal;

        for (uint i = 0; i < _tokens.length; i++) {
            _mintAmount = mul(_step, _mintCW[i]);
            _depositorMintAmount = min(_depositorBalance[i], add(_resUSDXBalance[i], _mintAmount));
            dfStore.setTokenBalance(_tokens[i], sub(_tokenBalance[i], _mintAmount));
            dfPool.transferToCol(_tokens[i], _mintAmount);
            _mintTotal = add(_mintTotal, _mintAmount);

            if (_depositorMintAmount == 0){
                dfStore.setResUSDXBalance(_tokens[i], add(_resUSDXBalance[i], _mintAmount));
                continue;
            }

            dfStore.setDepositorBalance(_depositor, _tokens[i], sub(_depositorBalance[i], _depositorMintAmount));
            dfStore.setResUSDXBalance(_tokens[i], sub(add(_resUSDXBalance[i], _mintAmount), _depositorMintAmount));
            _depositorMintTotal = add(_depositorMintTotal, _depositorMintAmount);
        }

        dfStore.addTotalMinted(_mintTotal);
        dfStore.addSectionMinted(_mintTotal);
        usdxToken.mint(address(dfPool), _mintTotal);
        dfStore.setTotalCol(add(dfStore.getTotalCol(), _mintTotal));
        checkUSDXTotalAndColTotal();
        dfPool.transferOut(address(usdxToken), _depositor, _depositorMintTotal);
        return _depositorMintTotal;
    }

    function checkUSDXTotalAndColTotal() public view auth {
        address[] memory _tokens = dfStore.getMintedTokenList();
        address _dfCol = address(dfCol);
        uint _colTotal;
        for (uint i = 0; i < _tokens.length; i++) {
            _colTotal = add(_colTotal, IDSToken(_tokens[i]).balanceOf(_dfCol));
        }
        uint _usdxTotalSupply = usdxToken.totalSupply();
        require(_usdxTotalSupply <= _colTotal,
                "checkUSDXTotalAndColTotal : Amount of the usdx will be greater than collateral.");
        require(_usdxTotalSupply == dfStore.getTotalCol(),
                "checkUSDXTotalAndColTotal : Usdx and total collateral are not equal.");
    }
}
