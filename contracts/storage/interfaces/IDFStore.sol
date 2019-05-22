pragma solidity ^0.5.2;

contract IDFStore {

    function getSectionMinted(uint _position) public view returns (uint);
    function addSectionMinted(uint _amount) public;
    function addSectionMinted(uint _position, uint _amount) public;
    function setSectionMinted(uint _amount) public;
    function setSectionMinted(uint _position, uint _amount) public;

    function getSectionBurned(uint _position) public view returns (uint);
    function addSectionBurned(uint _amount) public;
    function addSectionBurned(uint _position, uint _amount) public;
    function setSectionBurned(uint _amount) public;
    function setSectionBurned(uint _position, uint _amount) public;

    function getSectionToken(uint _position) public view returns (address[] memory);
    function getSectionWeight(uint _position) public view returns (uint[] memory);
    function getSectionData(uint _position) public view returns (uint, address[] memory, uint[] memory);
    function getSectionSpareData(uint _position) public view returns (uint, address[] memory, uint[] memory);
    function getSectionSpareIndex(uint _position) public view returns (uint);
    function setSectionSpareIndex(uint _position, uint _spareIndex) public;

    function setSection(address[] memory _tokens, uint[] memory _weight) public;
    function setSectionSpare(uint _position, address[] memory _tokens, uint[] memory _weight) public;
    function burnSectionMoveon() public;

    function getMintedToken(address _token) public view returns (bool);
    function setMintedToken(address _token, bool _flag) public;
    function getToken(address _token) public view returns (bool);
    function setToken(address _token, bool _flag) public;
    function getSpareToken(address _token) public view returns (address);
    function setSpareToken(address _token, address _spareToken) public;

    function getMintPosition() public view returns (uint);
    function getBurnPosition() public view returns (uint);

    function getTotalMinted() public view returns (uint);
    function addTotalMinted(uint _amount) public;
    function setTotalMinted(uint _amount) public;
    function getTotalBurned() public view returns (uint);
    function addTotalBurned(uint _amount) public;
    function setTotalBurned(uint _amount) public;

    function getTokenBalance(address _tokenID) public view returns (uint);
    function setTokenBalance(address _tokenID, uint _amount) public;
    function getTokenLockBalance(address _tokenID) public view returns (uint);
    function setTokenLockBalance(address _tokenID, uint _amount) public;
    function getDepositorBalance(address _depositor, address _tokenID) public view returns (uint);
    function setDepositorBalance(address _depositor, address _tokenID, uint _amount) public;
}