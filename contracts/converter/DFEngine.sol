pragma solidity ^0.5.2;

import '../token/interfaces/IDSToken.sol';
import '../storage/interfaces/IDFStore.sol';
import '../storage/interfaces/IDFPool.sol';
import '../storage/interfaces/IDFCollateral.sol';
import '../storage/interfaces/IDFFunds.sol';
import '../oracle/interfaces/IMedianizer.sol';
import '../utility/DSAuth.sol';
import "../utility/DSMath.sol";

contract DFEngine is DSMath, DSAuth {

    IDFStore public dfStore;
    IDFPool public dfPool;
    IDFCollateral public dfCol;
    IDFFunds public dfFunds;
    IDSToken public usdxToken;
    IDSToken public dfToken;
    IMedianizer public medianizer;

    enum CommissionType {
        CT_DEPOSIT,
        CT_DESTROY
    }

    constructor (
        address _usdxToken,
        address _dfToken,
        address _dfStore,
        address _dfPool,
        address _dfCol,
        address _dfFunds,
        address _oracle)
        public
    {
        usdxToken = IDSToken(_usdxToken);
        dfToken = IDSToken(_dfToken);
        dfStore = IDFStore(_dfStore);
        dfPool = IDFPool(_dfPool);
        dfCol = IDFCollateral(_dfCol);
        dfFunds = IDFFunds(_dfFunds);
        medianizer = IMedianizer(_oracle);
    }

    function setCommissionRate(CommissionType ct, uint rate) public auth {
        dfStore.setFeeRate(uint(ct), rate);
    }

    function getThePrice(address oracle) public view returns (uint) {
        bytes32 price = IMedianizer(oracle).read();
        return uint(price);
    }

    function updateMintSection(address[] memory _tokens, uint[] memory _weight) public auth {
        // address[] memory _mintTokens = dfStore.getSectionToken(dfStore.getMintPosition());
        // for (uint i = 0; i < _mintTokens.length; i++) {
        //     dfStore.setTokenBalance(_mintTokens[i], add(dfStore.getTokenBalance(_mintTokens[i]), dfStore.getResUSDXBalance(_mintTokens[i])));
        //     dfStore.setResUSDXBalance(_mintTokens[i], 0);
        // }
        dfStore.setSection(_tokens, _weight);
    }

    function _unifiedCommission(CommissionType ct, address depositor, uint _amount) internal {
        uint rate = dfStore.getFeeRate(uint(ct));
        if(rate > 0) {
            uint dfPrice = getThePrice(address(medianizer));
            // uint dfFee = dfPrice * rate / 10000;
            uint dfFee = div(mul(mul(_amount, rate), mul(WAD, WAD)), mul(10000, dfPrice));
            dfToken.transferFrom(depositor, address(dfFunds), dfFee);
        }
    }

    function deposit(address _depositor, address _tokenID, uint _amount) public auth returns (uint) {
        require(_amount > 0, "Deposit: amount not allow.");
        require(dfStore.getMintingToken(_tokenID), "Deposit: asset not allow.");
        address[] memory _tokens;
        uint[] memory _mintCW;
        (, , , _tokens, _mintCW) = dfStore.getSectionData(dfStore.getMintPosition());

        uint[] memory _tokenBalance = new uint[](_tokens.length);
        uint[] memory _resUSDXBalance = new uint[](_tokens.length);
        uint[] memory _depositorBalance = new uint[](_tokens.length);
        uint _depositorMintAmount;
        uint _depositorMintTotal;
        uint _index;
        uint _step = uint(-1);

        _unifiedCommission(CommissionType.CT_DEPOSIT, _depositor, _amount);

        dfPool.transferFromSender(_tokenID, _depositor, _amount);
        for (uint i = 0; i < _tokens.length; i++) {
            _tokenBalance[i] = dfStore.getTokenBalance(_tokens[i]);
            _resUSDXBalance[i] = dfStore.getResUSDXBalance(_tokens[i]);
            _depositorBalance[i] = dfStore.getDepositorBalance(_depositor, _tokens[i]);
            if (_tokenID == _tokens[i]){
                _tokenBalance[i] = add(_tokenBalance[i], _amount);
                _depositorBalance[i] = add(_depositorBalance[i], _amount);
                _index = i;
            }
            _step = min(div(_tokenBalance[i], _mintCW[i]), _step);
        }
        if (_step > 0) {
            _convert(_depositor, _tokens, _mintCW, _tokenBalance, _resUSDXBalance, _depositorBalance, _step);
        } else {
            for (uint i = 0; i < _tokens.length; i++) {
                _depositorMintAmount = min(_depositorBalance[i], _resUSDXBalance[i]);

                if (_depositorMintAmount == 0) {
                    if (_tokenID == _tokens[i]) {
                        dfStore.setDepositorBalance(_depositor, _tokens[i], _depositorBalance[i]);
                    }
                    continue;
                }

                dfStore.setDepositorBalance(_depositor, _tokens[i], _depositorBalance[i] - _depositorMintAmount);
                // dfPool.transferToCol(_tokens[i], _depositorMintAmount);
                dfStore.setResUSDXBalance(_tokens[i], _resUSDXBalance[i] - _depositorMintAmount);
                _depositorMintTotal = add(_depositorMintTotal, _depositorMintAmount);
            }

            if (_depositorMintTotal > 0) {
                // usdxToken.mint(address(dfPool), _depositorMintTotal);
                dfPool.transferOut(address(usdxToken), _depositor, _depositorMintTotal);
                // usdxToken.transfer(_depositor, _depositorMintTotal);
                // dfStore.addTotalMinted(_depositorMintTotal);
                // dfStore.addSectionMinted(_depositorMintTotal);
            }
            dfStore.setTokenBalance(_tokenID, _tokenBalance[_index]);
        }
        return (_depositorMintTotal);
    }

    function withdraw(address _depositor, address _tokenID, uint _amount) public auth returns (uint) {
        if (_tokenID == address(usdxToken)) {
            return claim(_depositor); //claim as many as possible.
        }

        require(_amount > 0, "Withdraw: not enough balance.");

        uint _depositorBalance = dfStore.getDepositorBalance(_depositor, _tokenID);
        uint _tokenBalance = dfStore.getTokenBalance(_tokenID);
        uint _withdrawAmount = min(_amount, min(_tokenBalance, _depositorBalance));

        if (_withdrawAmount <= 0)
            return (0);

        _depositorBalance = sub(_depositorBalance, _withdrawAmount);
        dfStore.setDepositorBalance(_depositor, _tokenID, _depositorBalance);
        dfStore.setTokenBalance(_tokenID, sub(_tokenBalance, _withdrawAmount));
        dfPool.transferOut(_tokenID, _depositor, _withdrawAmount);

        return (_withdrawAmount);
    }

    function claim(address _depositor, uint _amount) public auth returns (uint) {
        require(_amount > 0, "Claim: amount not correct.");
        address[] memory _tokens = dfStore.getSectionToken(dfStore.getMintPosition());
        uint _resUSDXBalance;
        uint _depositorBalance;
        uint _depositorMintAmount;
        uint _remain = _amount;

        for (uint i = 0; i < _tokens.length && _remain > 0; i++) {
            _resUSDXBalance = dfStore.getResUSDXBalance(_tokens[i]);
            _depositorBalance = dfStore.getDepositorBalance(_depositor, _tokens[i]);
            _depositorMintAmount = min(min(_resUSDXBalance, _depositorBalance), _remain);
            _remain = sub(_remain, _depositorMintAmount);

            if (_depositorMintAmount > 0){
                dfStore.setResUSDXBalance(_tokens[i], _resUSDXBalance - _depositorMintAmount);
                dfStore.setDepositorBalance(_depositor, _tokens[i], _depositorBalance - _depositorMintAmount);
                // dfPool.transferToCol(_tokens[i], _depositorMintAmount);
            }
        }

        require(_remain > 0, "Claim: balance not enough.");
        dfPool.transferOut(address(usdxToken), _depositor, _amount);
        // usdxToken.mint(address(this), _amount);
        // usdxToken.transfer(_depositor, _amount);
        // dfStore.addTotalMinted(_amount);
        // dfStore.addSectionMinted(_amount);
        return _amount;
    }

    function claim(address _depositor) public auth returns (uint) {
        address[] memory _tokens = dfStore.getSectionToken(dfStore.getMintPosition());
        uint _resUSDXBalance;
        uint _depositorBalance;
        uint _depositorMintAmount;
        uint _mintAmount;

        for (uint i = 0; i < _tokens.length; i++) {
            _resUSDXBalance = dfStore.getResUSDXBalance(_tokens[i]);
            _depositorBalance = dfStore.getDepositorBalance(_depositor, _tokens[i]);

            _depositorMintAmount = min(_resUSDXBalance, _depositorBalance);
            _mintAmount = add(_mintAmount, _depositorMintAmount);

            if (_depositorMintAmount > 0){
                dfStore.setResUSDXBalance(_tokens[i], _resUSDXBalance - _depositorMintAmount);
                dfStore.setDepositorBalance(_depositor, _tokens[i], _depositorBalance - _depositorMintAmount);
                // dfPool.transferToCol(_tokens[i], _depositorMintAmount);
            }
        }

        if (_mintAmount <= 0)
            return 0;

        dfPool.transferOut(address(usdxToken), _depositor, _mintAmount);
        // usdxToken.mint(address(this), _mintAmount);
        // usdxToken.transfer(_depositor, _mintAmount);
        // dfStore.addTotalMinted(_mintAmount);
        // dfStore.addSectionMinted(_mintAmount);
        return _mintAmount;
    }

    function destroy(address _depositor, uint _amount) public auth returns (bool){
        require(_amount > 0, "Destroy: amount not correct.");
        require(_amount <= usdxToken.balanceOf(_depositor), "Destroy: exceed max USDX balance.");
        require(_amount <= sub(dfStore.getTotalMinted(), dfStore.getTotalBurned()), "Destroy: not enough to burn.");
        address[] memory _tokens;
        uint[] memory _burnCW;
        uint _burnPosition;
        uint _sumBurnCW;
        uint _burned;
        uint _minted;
        uint _burnedAmount;
        uint _amountTemp = _amount;

        _unifiedCommission(CommissionType.CT_DESTROY, _depositor, _amount);

        while(_amountTemp > 0) {

            _burnPosition = dfStore.getBurnPosition();
            (_minted, _burned, , _tokens, _burnCW) = dfStore.getSectionData(_burnPosition);

            _sumBurnCW = 0;
            for (uint i = 0; i < _burnCW.length; i++) {
                _sumBurnCW = add(_sumBurnCW, _burnCW[i]);
            }

            if (_burned + _amountTemp <= _minted){
                dfStore.setSectionBurned(add(_burned, _amountTemp));
                _burnedAmount = _amountTemp;
                _amountTemp = 0;
            } else {
                _burnedAmount = sub(_minted, _burned);
                _amountTemp = sub(_amountTemp, _burnedAmount);
                dfStore.setSectionBurned(_minted);
                dfStore.burnSectionMoveon();
            }

            for (uint i = 0; i < _tokens.length; i++) {
                dfCol.transferOut(_tokens[i], _depositor, div(mul(_burnedAmount, _burnCW[i]), _sumBurnCW));
            }
        }

        usdxToken.transferFrom(_depositor, address(this),_amount);
        usdxToken.burn(address(this), _amount);
        dfStore.addTotalBurned(_amount);
    }

    function _convert(
        address _depositor,
        address[] memory _tokens,
        uint[] memory _mintCW,
        uint[] memory _tokenBalance,
        uint[] memory _resUSDXBalance,
        uint[] memory _depositorBalance,
        uint _step)
        internal
    {
        uint _mintAmount;
        uint _mintTotal;
        uint _lockAmount;
        uint _depositorMintAmount;
        uint _depositorMintTotal;

        for (uint i = 0; i < _tokens.length; i++) {
            _mintAmount = mul(_step, _mintCW[i]);
            _lockAmount = add(_resUSDXBalance[i], _mintAmount);
            _depositorMintAmount = min(_depositorBalance[i], add(_resUSDXBalance[i], _mintAmount));
            dfStore.setTokenBalance(_tokens[i], _tokenBalance[i] - _mintAmount);
            dfPool.transferToCol(_tokens[i], _mintAmount);
            _mintTotal = add(_mintTotal, _mintAmount);

            if (_depositorMintAmount == 0){
                dfStore.setResUSDXBalance(_tokens[i], add(_resUSDXBalance[i], _mintAmount));
                continue;
            }

            dfStore.setDepositorBalance(_depositor, _tokens[i], _depositorBalance[i] - _depositorMintAmount);
            // dfPool.transferToCol(_tokens[i], _depositorMintAmount);
            // dfPool.transferToCol(_tokens[i], _mintAmount);
            dfStore.setResUSDXBalance(_tokens[i], add(_resUSDXBalance[i], _mintAmount) - _depositorMintAmount);
            _depositorMintTotal = add(_depositorMintTotal, _depositorMintAmount);
        }

        dfStore.addTotalMinted(_mintTotal);
        dfStore.addSectionMinted(_mintTotal);
        usdxToken.mint(address(dfPool), _mintTotal);
        dfPool.transferOut(address(usdxToken), _depositor, _depositorMintTotal);
        // usdxToken.transfer(_depositor, _depositorMintTotal);
    }
}