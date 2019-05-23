pragma solidity ^0.5.2;

import '../token/interfaces/IERC20Token.sol';
import '../token/interfaces/IDSToken.sol';
import '../storage/interfaces/IDFStore.sol';
import '../storage/interfaces/IDFPool.sol';
import '../storage/interfaces/IDFCollareral.sol';
import '../storage/interfaces/IDFFunds.sol';
import '../utility/DSAuth.sol';
import '../utility/Utils.sol';

contract DFEngine is Utils, DSAuth {

    IDFStore public dfStore;
    IDFPool public dfPool;
    IDFCollareral public dfCollareral;
    IDFFunds public dfFunds;
    IDSToken public usdxToken;
    IDSToken public dfToken;

    constructor (
        address _usdxToken,
        address _dfToken,
        address _dfStore,
        address _dfPool,
        address _dfCollareral,
        address _dfFunds)
        public
    {
        usdxToken = IDSToken(_usdxToken);
        dfToken = IDSToken(_dfToken);
        dfStore = IDFStore(_dfStore);
        dfPool = IDFPool(_dfPool);
        dfCollareral = IDFCollareral(_dfCollareral);
        dfFunds = IDFFunds(_dfFunds);
    }

    function updateMintSection(address[] memory _tokens, uint[] memory _weight) public auth {
        dfStore.setSection(_tokens, _weight);
    }

    // function depositTest(address _depositor, address _tokenID, uint _amount) public auth returns (uint) {
    //     require(_amount > 0, "Input amount is zero");
    //     require(dfStore.getMintedToken(_tokenID), "Not allowed token");

    //     address[] memory _tokens;
    //     uint[] memory _mintCW;
    //     (, _tokens, _mintCW) = dfStore.getSectionData(dfStore.getMintPosition());
    //     uint[] memory _tokenBalance = new uint[](_tokens.length);
    //     uint _depositorBalance;
    //     uint _depositorMintAmount;
    //     uint _depositorMintTotal;
    //     uint _index;
    //     uint _times = uint(-1);

    //     dfPool.transferFromCollateral(_tokenID, _depositor, _amount);

    //     for (uint i = 0; i < _tokens.length; i++) {

    //         _tokenBalance[i] = dfStore.getTokenBalance(_tokens[i]);
    //         if (_tokenID == _tokens[i]){

    //             _tokenBalance[i] = add(_tokenBalance[i], _amount);
    //             _index = i;
    //         }

    //         _times = min(div(_tokenBalance[i], _mintCW[i]), _times);
    //     }

    //     if (_times > 0) {

    //         for (uint i = 0; i < _tokens.length; i++) {

    //             _depositorBalance = dfStore.getDepositorBalance(_depositor, _tokens[i]);
    //             if (_tokenID == _tokens[i]){
    //                 _depositorBalance = add(_depositorBalance, _amount);
    //             }
    //             _depositorMintAmount = min(_depositorBalance, mul(_times, _mintCW[i]));
    //             dfStore.setTokenBalance(_tokens[i], _tokenBalance[i] - mul(_times, _mintCW[i]));
    //             if (_depositorMintAmount == 0){

    //                 dfStore.setTokenLockBalance(_tokens[i], add(dfStore.getTokenLockBalance(_tokens[i]), mul(_times, _mintCW[i])));
    //                 continue;
    //             }

    //             dfStore.setDepositorBalance(_depositor, _tokens[i], _depositorBalance - _depositorMintAmount);
    //             dfPool.transferToBank(_tokens[i], _depositorMintAmount);
    //             dfStore.setTokenLockBalance(_tokens[i], add(dfStore.getTokenLockBalance(_tokens[i]), mul(_times, _mintCW[i])) - _depositorMintAmount);
    //             _depositorMintTotal = add(_depositorMintTotal, _depositorMintAmount);
    //         }

    //         usdxToken.mint(address(this), _depositorMintTotal);
    //         usdxToken.transfer(_depositor, _depositorMintTotal);

    //         dfStore.addTotalMinted(_depositorMintTotal);
    //         dfStore.addSectionMinted(_depositorMintTotal);
    //         return (dfStore.getDepositorBalance(_depositor, _tokenID));
    //     }

    //     for (uint i = 0; i < _tokens.length; i++) {

    //         _depositorBalance = dfStore.getDepositorBalance(_depositor, _tokens[i]);
    //             if (_tokenID == _tokens[i]){
    //                 _depositorBalance = add(_depositorBalance, _amount);
    //             }
    //         _depositorMintAmount = min(_depositorBalance, dfStore.getTokenLockBalance(_tokens[i]));
    //         if (_depositorMintAmount == 0){

    //             if (_tokenID == _tokens[i])
    //                 dfStore.setDepositorBalance(_depositor, _tokens[i], _depositorBalance);

    //             continue;
    //         }

    //         dfStore.setDepositorBalance(_depositor, _tokens[i], _depositorBalance - _depositorMintAmount);
    //         dfPool.transferToBank(_tokens[i], _depositorMintAmount);
    //         dfStore.setTokenLockBalance(_tokens[i], dfStore.getTokenLockBalance(_tokens[i]) - _depositorMintAmount);
    //         _depositorMintTotal = add(_depositorMintTotal, _depositorMintAmount);
    //     }

    //     if (_depositorMintTotal > 0){

    //         usdxToken.mint(address(this), _depositorMintTotal);
    //         usdxToken.transfer(_depositor, _depositorMintTotal);
    //         dfStore.addTotalMinted(_depositorMintTotal);
    //         dfStore.addSectionMinted(_depositorMintTotal);

    //     }

    //     dfStore.setTokenBalance(_tokenID, _tokenBalance[_index]);

    //     return (dfStore.getDepositorBalance(_depositor, _tokenID));
    // }

    function deposit(address _depositor, address _tokenID, uint _amount) public returns (uint) {
        require(_amount > 0, "Input amount is zero");
        require(dfStore.getMintedToken(_tokenID), "Not allowed token");

        address[] memory _tokens;
        uint[] memory _mintCW;
        (, _tokens, _mintCW) = dfStore.getSectionData(dfStore.getMintPosition());

        uint[] memory _tokenBalance = new uint[](_tokens.length);
        uint[] memory _tokenLockBalance = new uint[](_tokens.length);
        uint[] memory _depositorBalance = new uint[](_tokens.length);
        uint _depositorMintAmount;
        uint _depositorMintTotal;
        uint _index;
        uint _times = uint(-1);

        dfPool.transferFromCollateral(_tokenID, _depositor, _amount);

        for (uint i = 0; i < _tokens.length; i++) {

            _tokenBalance[i] = dfStore.getTokenBalance(_tokens[i]);
            _tokenLockBalance[i] = dfStore.getTokenLockBalance(_tokens[i]);
            _depositorBalance[i] = dfStore.getDepositorBalance(_depositor, _tokens[i]);
            if (_tokenID == _tokens[i]){

                _tokenBalance[i] = add(_tokenBalance[i], _amount);
                _depositorBalance[i] = add(_depositorBalance[i], _amount);
                _index = i;
            }

            _times = min(div(_tokenBalance[i], _mintCW[i]), _times);
        }

        if (_times > 0) {

            _convert(_depositor, _tokens, _mintCW, _tokenBalance, _tokenLockBalance, _depositorBalance, _times);
            return (dfStore.getDepositorBalance(_depositor, _tokenID));
        }else{

            for (uint i = 0; i < _tokens.length; i++) {

                _depositorMintAmount = min(_depositorBalance[i], _tokenLockBalance[i]);
                if (_depositorMintAmount == 0){

                    if (_tokenID == _tokens[i])
                        dfStore.setDepositorBalance(_depositor, _tokens[i], _depositorBalance[i]);

                    continue;
                }

                dfStore.setDepositorBalance(_depositor, _tokens[i], _depositorBalance[i] - _depositorMintAmount);
                dfPool.transferToBank(_tokens[i], _depositorMintAmount);
                dfStore.setTokenLockBalance(_tokens[i], _tokenLockBalance[i] - _depositorMintAmount);
                _depositorMintTotal = add(_depositorMintTotal, _depositorMintAmount);
            }

            if (_depositorMintTotal > 0){

                usdxToken.mint(address(this), _depositorMintTotal);
                usdxToken.transfer(_depositor, _depositorMintTotal);
                dfStore.addTotalMinted(_depositorMintTotal);
                dfStore.addSectionMinted(_depositorMintTotal);

            }
            dfStore.setTokenBalance(_tokenID, _tokenBalance[_index]);

        }

        return (_depositorBalance[_index]);
    }

    function withdraw(address _depositor, address _tokenID, uint _amount) public returns (uint) {

        if (_tokenID == address(usdxToken))
            return draw(_depositor, _amount);

        uint _depositorBalance = dfStore.getDepositorBalance(_depositor, _tokenID);
        uint _tokenBalance = dfStore.getTokenBalance(_tokenID);

        require(_amount <= min(_tokenBalance, _depositorBalance) && _amount > 0, "The depositor balance is not enough");

        _depositorBalance = sub(_depositorBalance, _amount);
        dfStore.setDepositorBalance(_depositor, _tokenID, _depositorBalance);
        dfStore.setTokenBalance(_tokenID, sub(_tokenBalance, _amount));
        dfPool.transferCollateral(dfStore.getToken(_tokenID) ? _tokenID : dfStore.getSpareToken(_tokenID), _depositor, _amount);
        return (_depositorBalance);
    }

    function draw(address _depositor, uint _amount) public returns (uint) {

        require(_amount > 0, "withdraw usdx input amount is zero");

        address[] memory _tokens = dfStore.getSectionToken(dfStore.getMintPosition());
        uint _tokenLockBalance;
        uint _depositorBalance;
        uint _depositorMintAmount;
        uint _amountTemp = _amount;

        for (uint i = 0; i < _tokens.length && _amountTemp > 0; i++) {

            _tokenLockBalance = dfStore.getTokenLockBalance(_tokens[i]);
            _depositorBalance = dfStore.getDepositorBalance(_depositor, _tokens[i]);

            _depositorMintAmount = min(min(_tokenLockBalance, _depositorBalance), _amountTemp);
            _amountTemp = sub(_amountTemp, _depositorMintAmount);

            if (_depositorMintAmount > 0){
                dfStore.setTokenBalance(_tokens[i], _tokenLockBalance - _depositorMintAmount);
                dfStore.setDepositorBalance(_depositor, _tokens[i], _depositorBalance - _depositorMintAmount);
                dfPool.transferToBank(_tokens[i], _depositorMintAmount);
            }
        }

        require(_amountTemp > 0, "The depositor usdx balance is not enough");

        usdxToken.mint(address(this), _amount);
        usdxToken.transfer(_depositor, _amount);
        dfStore.addTotalMinted(_amount);
        dfStore.addSectionMinted(_amount);
        return (usdxToken.balanceOf(_depositor));
    }

    function draw(address _depositor) public returns (uint) {

        address[] memory _tokens = dfStore.getSectionToken(dfStore.getMintPosition());
        uint _tokenLockBalance;
        uint _depositorBalance;
        uint _depositorMintAmount;
        uint _mintAmount;

        for (uint i = 0; i < _tokens.length; i++) {

            _tokenLockBalance = dfStore.getTokenLockBalance(_tokens[i]);
            _depositorBalance = dfStore.getDepositorBalance(_depositor, _tokens[i]);

            _depositorMintAmount = min(_tokenLockBalance, _depositorBalance);
            _mintAmount = add(_mintAmount, _depositorMintAmount);

            if (_depositorMintAmount > 0){
                dfStore.setTokenLockBalance(_tokens[i], _tokenLockBalance - _depositorMintAmount);
                dfStore.setDepositorBalance(_depositor, _tokens[i], _depositorBalance - _depositorMintAmount);
                dfPool.transferToBank(_tokens[i], _depositorMintAmount);
            }
        }

        require(_mintAmount > 0, "The depositor usdx balance is zero");

        usdxToken.mint(address(this), _mintAmount);
        usdxToken.transfer(_depositor, _mintAmount);
        dfStore.addTotalMinted(_mintAmount);
        dfStore.addSectionMinted(_mintAmount);
        return (usdxToken.balanceOf(_depositor));
    }

    function destroy(address _depositor, uint _amount) public returns (bool){

        require(_amount > 0, "Input destruction is zero");
        require(_amount <= usdxToken.balanceOf(_depositor), "It is not enough for depositors to destroy the usdx balance.");
        require(_amount <= sub(dfStore.getTotalMinted(), dfStore.getTotalBurned()), "Total minted is not enough");

        address[] memory _tokens;
        uint[] memory _burnCW;
        uint _burnPosition = dfStore.getBurnPosition();
        uint _spareIndex = dfStore.getSectionSpareIndex(_burnPosition);
        uint _sumBurnCW;
        uint _burned;
        uint _minted;
        uint _burnedAmount;
        uint _amountTemp = _amount;
        while(_amountTemp > 0){

            if (_spareIndex == 0){
                (, _tokens, _burnCW) = dfStore.getSectionData(_burnPosition);
            }else{
                (, _tokens, _burnCW) = dfStore.getSectionSpareData(_burnPosition);
            }

            _sumBurnCW = 0;
            for (uint i = 0; i < _burnCW.length; i++) {

                _sumBurnCW = add(_sumBurnCW, _burnCW[i]);
            }

            _burned = dfStore.getSectionBurned(_burnPosition);
            _minted = dfStore.getSectionMinted(_burnPosition);

            if (_burned + _amountTemp <= _minted){

                dfStore.setSectionBurned(add(_burned, _amountTemp));
                _burnedAmount = _amountTemp;
                _amountTemp = 0;
            }else{

                _burnedAmount = sub(_minted, _burned);
                _amountTemp = sub(_amountTemp, _burnedAmount);
                dfStore.setSectionBurned(_minted);
                dfStore.burnSectionMoveon();
            }

            for (uint i = 0; i < _tokens.length; i++) {
                dfCollareral.transferCollateral(_tokens[i], _depositor, div(mul(_burnedAmount, _burnCW[i]), _sumBurnCW));
            }

            _burnPosition = dfStore.getBurnPosition();
            _spareIndex = dfStore.getSectionSpareIndex(_burnPosition);
        }

        usdxToken.transferFrom(_depositor, address(this),_amount);
        usdxToken.burn(address(this), _amount);
        dfStore.addTotalBurned(_amount);
        //[TODO] fix it, need oracle!
        dfToken.transferFrom(_depositor, address(dfFunds), 5 * 10 ** 18); ///[snow] _depositor approve to converter.
    }

    function _convert(
        address _depositor,
        address[] memory _tokens,
        uint[] memory _mintCW,
        uint[] memory _tokenBalance,
        uint[] memory _tokenLockBalance,
        uint[] memory _depositorBalance,
        uint _times)
        internal
    {
        uint _mintAmount;
        uint _lockAmount;
        uint _depositorMintAmount;
        uint _depositorMintTotal;

        for (uint i = 0; i < _tokens.length; i++) {

            _mintAmount = mul(_times, _mintCW[i]);
            _lockAmount = add(_tokenLockBalance[i], _mintAmount);
            _depositorMintAmount = min(_depositorBalance[i], add(_tokenLockBalance[i], _mintAmount));
            dfStore.setTokenBalance(_tokens[i], _tokenBalance[i] - _mintAmount);
            if (_depositorMintAmount == 0){
                dfStore.setTokenLockBalance(_tokens[i], add(_tokenLockBalance[i], _mintAmount));
                continue;
            }

            dfStore.setDepositorBalance(_depositor, _tokens[i], _depositorBalance[i] - _depositorMintAmount);
            dfPool.transferToBank(_tokens[i], _depositorMintAmount);
            dfStore.setTokenLockBalance(_tokens[i], add(_tokenLockBalance[i], _mintAmount) - _depositorMintAmount);
            _depositorMintTotal = add(_depositorMintTotal, _depositorMintAmount);
        }

        usdxToken.mint(address(this), _depositorMintTotal);
        usdxToken.transfer(_depositor, _depositorMintTotal);

        dfStore.addTotalMinted(_depositorMintTotal);
        dfStore.addSectionMinted(_depositorMintTotal);
        // return (dfStore.getDepositorBalance(_depositor, _tokenID));
    }
}