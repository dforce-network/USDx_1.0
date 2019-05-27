pragma solidity ^0.5.2;

import '../utility/DSAuth.sol';
import '../utility/DSMath.sol';

contract DFStore is DSMath, DSAuth {
    // MEMBERS
    /// @dev  cw - The Weight of collateral
    struct Section {
        uint        minted;
        uint        burned;
        uint        backupIdx;
        address[]   colIDs;
        uint[]      cw;
    }

    Section[] public secList;

    uint backupSeed = 1;
    mapping(uint => Section) public secListBackup;

    mapping(address => bool) public mintingTokens;
    mapping(address => bool) public mintedTokens;
    mapping(address => address) public tokenBackup;

    /// @dev The position of current secList
    uint private mintPosition;

    /// @dev The position of old secList
    uint private burnPosition;

    /// @dev  The total amount of minted.
    uint private totalMinted;

    /// @dev  The total amount of burned.
    uint private totalBurned;

    mapping(uint => uint) public FeeRate;
    mapping(address => uint) public colsBalance;
    mapping(address => uint) public resUSDXBalance;
    mapping(address => mapping (address => uint)) public depositorsBalance;

    event UpdateSection(address[] _colIDs, uint[] _number);

    constructor(address[] memory _colIDs, uint[] memory _weights) public {
        _setSection(_colIDs, _weights);
    }

    function getSectionMinted(uint _position) public view returns (uint) {
        return secList[_position].minted;
    }

    function addSectionMinted(uint _amount) public auth {
        require(_amount > 0, "AddSectionMinted: amount not correct.");
        secList[mintPosition].minted = add(secList[mintPosition].minted, _amount);
    }

    function addSectionMinted(uint _position, uint _amount) public auth {
        require(_amount > 0, "AddSectionMinted: amount not correct.");
        secList[_position].minted = add(secList[_position].minted, _amount);
    }

    function setSectionMinted(uint _amount) public auth {
        secList[mintPosition].minted = _amount;
    }

    function setSectionMinted(uint _position, uint _amount) public auth {
        secList[_position].minted = _amount;
    }

    function getSectionBurned(uint _position) public view returns (uint) {
        return secList[_position].burned;
    }

    function addSectionBurned(uint _amount) public auth {
        require(_amount > 0, "AddSectionBurned: amount not correct.");
        secList[burnPosition].burned = add(secList[burnPosition].burned, _amount);
    }

    function addSectionBurned(uint _position, uint _amount) public auth {
        require(_amount > 0, "AddSectionBurned: amount not correct.");
        secList[_position].burned = add(secList[_position].burned, _amount);
    }

    function setSectionBurned(uint _amount) public auth {
        secList[burnPosition].burned = _amount;
    }

    function setSectionBurned(uint _position, uint _amount) public auth {
        secList[_position].burned = _amount;
    }

    function getSectionToken(uint _position) public view returns (address[] memory) {
        return secList[_position].colIDs;
    }

    function getSectionWeight(uint _position) public view returns (uint[] memory) {
        return secList[_position].cw;
    }

    function getSectionData(uint _position) public view returns (uint, uint, uint, address[] memory, uint[] memory) {

        return (
            secList[_position].minted,
            secList[_position].burned,
            secList[_position].backupIdx,
            secList[_position].colIDs,
            secList[_position].cw
            );
    }

    function getBackupSectionData(uint _position) public view returns (uint, address[] memory, uint[] memory) {
        uint _backupIdx = getBackupSectionIndex(_position);
        return (secListBackup[_backupIdx].backupIdx, secListBackup[_backupIdx].colIDs, secListBackup[_backupIdx].cw);
    }

    function getBackupSectionIndex(uint _position) public view returns (uint) {
        return secList[_position].backupIdx;
    }

    function setBackupSectionIndex(uint _position, uint _backupIdx) public auth {
        secList[_position].backupIdx = _backupIdx;
    }

    function _setSection(address[] memory _colIDs, uint[] memory _weight) internal {
        require(_colIDs.length == _weight.length, "_SetSection: data not allow.");

        secList.push(Section(0, 0, 0, new address[](_colIDs.length), new uint[](_weight.length)));
        uint _mintPosition = secList.length - 1;

        if (_mintPosition > 0) {
            address[] memory _cruColIDs = getSectionToken(mintPosition);
            for (uint i = 0; i < _cruColIDs.length; i++)
                delete mintingTokens[_cruColIDs[i]];
        }

        for (uint i = 0; i < _colIDs.length; i++) {
            require(_colIDs[i] != address(0), "_SetSection: 0 address not allow.");
            require(_weight[i] > 0, "_SetSection: cw not allow.");

            secList[_mintPosition].cw[i] = mul(_weight[i], 10 ** 18);
            secList[_mintPosition].colIDs[i] = _colIDs[i];
            mintingTokens[_colIDs[i]] = true;
            mintedTokens[_colIDs[i]] = true;
        }

        mintPosition = _mintPosition;
        emit UpdateSection(secList[mintPosition].colIDs, secList[mintPosition].cw);
    }

    function setSection(address[] memory _colIDs, uint[] memory _weight) public auth {
        _setSection(_colIDs, _weight);
    }

    function setBackupSection(uint _position, address[] memory _colIDs, uint[] memory _weight) public auth {
        require(_colIDs.length == _weight.length, "SetBackupSection: data not allow.");
        require(_position < mintPosition, "SetBackupSection: update mint section first.");

        uint _backupIdx = secList[_position].backupIdx;

        if (_backupIdx == 0){

            _backupIdx = backupSeed;
            secList[_position].backupIdx = _backupIdx;
            backupSeed = add(_backupIdx, 1);
        }

        secListBackup[_backupIdx] = Section(0, 0, _position, new address[](_colIDs.length), new uint[](_weight.length));

        for (uint i = 0; i < _colIDs.length; i++) {
            require(_colIDs[i] != address(0), "SetBackupSection: token contract address invalid");
            require(_weight[i] > 0, "SetBackupSection: weight must greater than 0");

            secListBackup[_backupIdx].cw[i] = mul(_weight[i], (10 ** 18));
            secListBackup[_backupIdx].colIDs[i] = _colIDs[i];
            mintedTokens[_colIDs[i]] = true;
        }
    }

    function burnSectionMoveon() public auth {
        require(
            secList[burnPosition].minted == secList[burnPosition].burned,
            "BurnSectionMoveon: burned not meet minted."
            );

        burnPosition += 1;
    }

    function getMintingToken(address _token) public view returns (bool) {
        return mintingTokens[_token];
    }

    function setMintingToken(address _token, bool _flag) public auth {
        mintingTokens[_token] = _flag;
    }

    function getMintedToken(address _token) public view returns (bool) {
        return mintedTokens[_token];
    }

    function setMintedToken(address _token, bool _flag) public auth {
        mintedTokens[_token] = _flag;
    }

    function getBackupToken(address _token) public view returns (address) {
        return tokenBackup[_token];
    }

    function setBackupToken(address _token, address _backupToken) public auth {
        tokenBackup[_token] = _backupToken;
    }

    function getMintPosition() public view returns (uint) {
        return mintPosition;
    }

    function getBurnPosition() public view returns (uint) {
        return burnPosition;
    }

    function getTotalMinted() public view returns (uint) {
        return totalMinted;
    }

    function addTotalMinted(uint _amount) public auth {
        require(_amount > 0, "AddTotalMinted: minted amount is zero.");
        totalMinted = add(totalMinted, _amount);
    }

    function setTotalMinted(uint _amount) public auth {
        totalMinted = _amount;
    }

    function getTotalBurned() public view returns (uint) {
        return totalBurned;
    }

    function addTotalBurned(uint _amount) public auth {
        require(_amount > 0, "AddTotalBurned: minted amount is zero.");
        totalBurned = add(totalBurned, _amount);
    }

    function setTotalBurned(uint _amount) public auth {
        totalBurned = _amount;
    }

    function getTokenBalance(address _tokenID) public view returns (uint) {
        return colsBalance[_tokenID];
    }

    function setTokenBalance(address _tokenID, uint _amount) public auth {
        colsBalance[_tokenID] = _amount;
    }

    function getResUSDXBalance(address _tokenID) public view returns (uint) {
        return resUSDXBalance[_tokenID];
    }

    function setResUSDXBalance(address _tokenID, uint _amount) public auth {
        resUSDXBalance[_tokenID] = _amount;
    }

    function getDepositorBalance(address _depositor, address _tokenID) public view returns (uint) {
        return depositorsBalance[_depositor][_tokenID];
    }

    function setDepositorBalance(address _depositor, address _tokenID, uint _amount) public auth {
        depositorsBalance[_depositor][_tokenID] = _amount;
    }

    function setFeeRate(uint ct, uint rate) public auth {
        FeeRate[ct] = rate;
    }

    function getFeeRate(uint ct) public view returns (uint) {
        return FeeRate[ct];
    }
}