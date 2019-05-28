pragma solidity ^0.5.2;

import '../update/DFUpgrader.sol';

contract DFProtocol is DFUpgrader {

    event Deposit (address indexed _tokenID, address indexed _sender, uint _amount, uint _balance);
    event Withdraw(address indexed _tokenID, address indexed _sender, uint _amount, uint _balance);
    event Destroy (address indexed _sender, uint _amount);
    event Claim   (address indexed _sender, uint _balance);

    function deposit(address _tokenID, uint _feeTokenIdx, uint _amount) public returns (uint){
        uint _balance = iDFEngine.deposit(msg.sender, _tokenID, _feeTokenIdx, _amount);
        emit Deposit(_tokenID, msg.sender, _amount, _balance);
        return _balance;
    }

    function withdraw(address _tokenID, uint _feeTokenIdx, uint _amount) public returns (uint) {
        uint _balance = iDFEngine.withdraw(msg.sender, _tokenID, _feeTokenIdx, _amount);
        emit Withdraw(_tokenID, msg.sender, _amount, _balance);
        return _balance;
    }

    function destroy(uint _feeTokenIdx, uint _amount) public {
        iDFEngine.destroy(msg.sender, _feeTokenIdx, _amount);
        emit Destroy(msg.sender, _amount);
    }

    function claim(uint _feeTokenIdx) public returns (uint) {
        uint _balance = iDFEngine.claim(msg.sender, _feeTokenIdx);
        emit Claim(msg.sender, _balance);
        return _balance;
    }

    function getUSDXForDeposit(address tokenID, uint amount) public returns (uint) {
        return iDFEngine.calcDepositorMintTotal(msg.sender, tokenID, amount);
    }

    function getUserMaxToClaim() public returns (uint) {
        return iDFEngine.calcMaxClaimAmount(msg.sender);
    }

    function getColMaxClaim() public returns (address[] memory, uint[] memory) {
        return iDFEngine.calClaimMenu(msg.sender);
    }

    function getMintingSection() public returns (address[] memory, uint[] memory) {
        return iDFEngine.getMintingMenu();
    }

    function getBurningSection() public returns (address[] memory, uint[] memory) {
        return iDFEngine.getBurningMenu();
    }

    function getUserWithdrawBalance() public returns (address[] memory, uint[] memory) {
        return iDFEngine.getWithdrawDetails(msg.sender);
    }

    function getPrice(uint typeID) public returns (uint) {
        return iDFEngine.getPrices(typeID);
    }

    function getFeeRate(uint typeID) public returns (uint) {
        return iDFEngine.getFeeRateByID(typeID);
    }
}
