pragma solidity ^0.5.2;

contract IDFPoolV2 {
    function transferOut(address _tokenID, address _to, uint _amount) public returns (bool);
    function transferOutSrc(address _tokenID, address _to, uint _amount) public returns (bool);
    function transferFromSender(address _tokenID, address _from, uint _amount) public returns (bool);
    function transferFromSenderOneClick(address _tokenID, address _from, uint _amount) public returns (bool);
    function transferToCol(address _tokenID, uint _amount) public returns (bool);
    function transferFromSenderToCol(address _tokenID, address _from, uint _amount) public returns (bool);
    function approveToEngine(address _tokenIdx, address _engineAddress) public;
}
