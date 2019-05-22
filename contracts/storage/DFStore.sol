pragma solidity ^0.5.2;

import '../utility/DSAuth.sol';
import '../utility/Utils.sol';

contract DFStore is DSAuth, Utils {

    // MEMBERS
    /// @dev  cw - The Weight of collateral
    struct Section {
        uint minted;
        uint burned;
        uint updateIndex;
        address[] tokenAddress;
        uint[] cw;
        // mapping (address => uint) cw;
    }

    Section[] public sectionList;

    uint spareIndex = 1;
    mapping(uint => Section) public sectionSpare;

    mapping(address => bool) public mintedToken;
    mapping(address => bool) public token;
    mapping(address => address) public spareToken;

    /// @dev The position of current sectionList
    uint private mintPosition;

    /// @dev The position of old sectionList
    uint private burnPosition;

    /// @dev  The total amount of minted.
    uint private totalMinted;

    /// @dev  The total amount of burned.
    uint private totalBurned;

    mapping(address => uint) public tokenBalance;
    mapping(address => uint) public tokenLockBalance;
    mapping(address => mapping (address => uint)) public depositorBalance;

    // event UpdateSection(address[] _tokens, uint[] _pos);
    event UpdateTokens(address[] _tokens, uint[] _number);

    constructor(address[] memory _tokens, uint[] memory _weight) public {
        _setSection(_tokens, _weight);
    }

    // PUBLIC FUNCTIONS
    // (Data Store)

    function getSectionMinted(uint _position) public view returns (uint) {
        return sectionList[_position].minted;
    }

    function addSectionMinted(uint _amount) public auth {
        require(_amount > 0, "addSectionMinted: minted amount is zero.");
        sectionList[mintPosition].minted = add(sectionList[mintPosition].minted, _amount);
    }

    function addSectionMinted(uint _position, uint _amount) public auth {
        require(_amount > 0, "addSectionMinted: minted amount is zero.");
        sectionList[_position].minted = add(sectionList[_position].minted, _amount);
    }

    function setSectionMinted(uint _amount) public auth {
        sectionList[mintPosition].minted = _amount;
    }

    function setSectionMinted(uint _position, uint _amount) public auth {
        sectionList[_position].minted = _amount;
    }

    function getSectionBurned(uint _position) public view returns (uint) {
        return sectionList[_position].burned;
    }

    function addSectionBurned(uint _amount) public auth {
        require(_amount > 0, "addSectionBurned: burned amount is zero.");
        sectionList[burnPosition].burned = add(sectionList[burnPosition].burned, _amount);
    }

    function addSectionBurned(uint _position, uint _amount) public auth {
        require(_amount > 0, "addSectionBurned: burned amount is zero.");
        sectionList[_position].burned = add(sectionList[_position].burned, _amount);
    }

    function setSectionBurned(uint _amount) public auth {
        sectionList[burnPosition].burned = _amount;
    }

    function setSectionBurned(uint _position, uint _amount) public auth {
        sectionList[_position].burned = _amount;
    }

    function getSectionToken(uint _position) public view returns (address[] memory) {
        return sectionList[_position].tokenAddress;
    }

    function getSectionWeight(uint _position) public view returns (uint[] memory) {
        return sectionList[_position].cw;
    }

    function getSectionData(uint _position) public view returns (uint, address[] memory, uint[] memory) {
        return (sectionList[_position].updateIndex, sectionList[_position].tokenAddress, sectionList[_position].cw);
    }

    function getSectionSpareData(uint _position) public view returns (uint, address[] memory, uint[] memory) {
        uint _spareIndex = getSectionSpareIndex(_position);
        return (sectionSpare[_spareIndex].updateIndex, sectionSpare[_spareIndex].tokenAddress, sectionSpare[_spareIndex].cw);
    }

    function getSectionSpareIndex(uint _position) public view returns (uint) {
        return sectionList[_position].updateIndex;
    }

    function setSectionSpareIndex(uint _position, uint _spareIndex) public auth {
        sectionList[_position].updateIndex = _spareIndex;
    }

    function _setSection(address[] memory _tokens, uint[] memory _weight) internal {
        require(_tokens.length == _weight.length, "_setSection: Input parameter error");

        // address[] memory addrs = new address[](_tokens.length);

        sectionList.push(Section(0, 0, 0, new address[](_tokens.length), new uint[](_weight.length)));

        uint _mintPosition = sectionList.length - 1;
        for (uint i = 0; i < _tokens.length; i++) {
            require(_tokens[i] != address(0), "token contract address invalid");
            require(_weight[i] > 0, "weight must greater than 0");

            sectionList[_mintPosition].cw[i] = mul(_weight[i], 10 ** 18);
            sectionList[_mintPosition].tokenAddress[i] = _tokens[i];
            mintedToken[_tokens[i]] = true;
            token[_tokens[i]] = true;
        }

        if (_mintPosition > 0){
            address[] memory _originTokens = getSectionToken(mintPosition);
            // _originTokens = getSectionToken(mintPosition);
            for (uint i = 0; i < _originTokens.length; i++)
                delete mintedToken[_originTokens[i]];

            mintPosition = _mintPosition;
        }
        emit UpdateTokens(sectionList[_mintPosition].tokenAddress, sectionList[_mintPosition].cw);
    }

    function setSection(address[] memory _tokens, uint[] memory _weight) public auth {
        _setSection(_tokens, _weight);
    }

    function setSectionSpare(uint _position, address[] memory _tokens, uint[] memory _weight) public auth {

        require(_tokens.length == _weight.length, "setSectionSpare: Input parameter error");
        require(_position < mintPosition, "setSectionSpare: section does not exist");

        uint _spareIndex = sectionList[_position].updateIndex;
        if (_spareIndex == 0){

            _spareIndex = spareIndex;
            sectionList[_position].updateIndex = _spareIndex;
            spareIndex = add(_spareIndex, 1);
        }

        sectionSpare[_spareIndex] = Section(0, 0, _position, new address[](_tokens.length), new uint[](_weight.length));

        for (uint i = 0; i < _tokens.length; i++) {
            require(_tokens[i] != address(0), "token contract address invalid");
            require(_weight[i] > 0, "weight must greater than 0");

            sectionSpare[_spareIndex].cw[i] = mul(_weight[i], (10 ** 18));
            sectionSpare[_spareIndex].tokenAddress[i] = _tokens[i];
            token[_tokens[i]] = true;
        }
    }

    function burnSectionMoveon() public auth {
        require(
            sectionList[burnPosition].minted == sectionList[burnPosition].burned,
            "Still have collateral not to change end"
            );

        burnPosition += 1;
    }

    function getMintedToken(address _token) public view returns (bool) {
        return mintedToken[_token];
    }

    function setMintedToken(address _token, bool _flag) public auth {
        mintedToken[_token] = _flag;
    }

    function getToken(address _token) public view returns (bool) {
        return token[_token];
    }

    function setToken(address _token, bool _flag) public auth {
        // if(_flag)
        //     delete spareToken[_token];
        token[_token] = _flag;
    }

    function getSpareToken(address _token) public view returns (address) {
        return spareToken[_token];
    }

    function setSpareToken(address _token, address _spareToken) public auth {
        spareToken[_token] = _spareToken;
        // token[_token] = false;
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
        require(_amount > 0, "addTotalMinted: minted amount is zero.");
        totalMinted = add(totalMinted, _amount);
    }

    function setTotalMinted(uint _amount) public auth {
        totalMinted = _amount;
    }

    function getTotalBurned() public view returns (uint) {
        return totalBurned;
    }

    function addTotalBurned(uint _amount) public auth {
        require(_amount > 0, "addTotalBurned: minted amount is zero.");
        totalBurned = add(totalBurned, _amount);
    }

    function setTotalBurned(uint _amount) public auth {
        totalBurned = _amount;
    }

    function getTokenBalance(address _tokenID) public view returns (uint) {
        return tokenBalance[_tokenID];
    }

    function setTokenBalance(address _tokenID, uint _amount) public auth {
        tokenBalance[_tokenID] = _amount;
    }

    function getTokenLockBalance(address _tokenID) public view returns (uint) {
        return tokenLockBalance[_tokenID];
    }

    function setTokenLockBalance(address _tokenID, uint _amount) public auth {
        tokenLockBalance[_tokenID] = _amount;
    }

    function getDepositorBalance(address _depositor, address _tokenID) public view returns (uint) {
        return depositorBalance[_depositor][_tokenID];
    }

    function setDepositorBalance(address _depositor, address _tokenID, uint _amount) public auth {
        depositorBalance[_depositor][_tokenID] = _amount;
    }
}