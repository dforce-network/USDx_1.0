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

    function getUSDXForDeposit(address tokenID, uint amount) public pure returns (uint) {
        uint depositMintTotal = iDFEngine.calcDepositorMintTotal(msg.sender, tokenID, amount);

        return depositMintTotal;
    }

    function getUserMaxToClaim() public pure returns (uint) {
        uint maxClaiming = iDFEngine.calcMaxClaimAmount(msg.sender);

        return maxClaiming;
    }

    function getColMaxClaim() public pure returns (address[] memory, uint[] memory) {
        address[] memory tokens;
        uint[] memory weight;

        (tokens, weight) = iDFEngine.calClaimMenu(msg.sender);

        return (tokens, weight);
    }

    function getMintingSection() public pure returns (address[] memory, uint[] memory) {
        address[] memory tokens;
        uint[] memory weight;

        (tokens, weight) = iDFEngine.getMintingMenu();

        return (tokens, weight);
    }

    function getBurningSection() public pure returns (address[] memory, uint[] memory) {
        address[] memory tokens;
        uint[] memory weight;

        (tokens, weight) = iDFEngine.getBurningMenu();

        return (tokens, weight);
    }

    function getUserWithdrawBalance() public pure returns (address[] memory, uint[] memory) {
        address[] memory tokens;
        uint[] memory weight;

        (tokens, weight) = iDFEngine.getWithdrawDetails();
        
        return (tokens, weight);
    }

    function getPrice(uint typeID) public pure returns (uint) {
        uint tokenID = iDFEngine.getPriceType();
        uint price = iDFEngine.getThePrice(tokenID);

        return price;
    }

    function getFeeRate(uint typeID) public pure returns (uint) {
        uint feeRate = iDFEngine.getFeeRateByID(typeID);

        return feeRate;
    }
}
