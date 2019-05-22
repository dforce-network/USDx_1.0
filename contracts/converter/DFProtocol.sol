pragma solidity ^0.5.2;

import '../update/DFEngineUpgrader.sol';

contract DFProtocol is DFEngineUpgrader {

    event Deposit (address indexed _tokenID, address indexed _sender, uint256 _amount, uint256 _balance);
    event Withdraw(address indexed _tokenID, address indexed _sender, uint256 _amount, uint256 _balance);
    event Destroy (address indexed _sender, uint256 _amount);

    function deposit(address _tokenID, uint256 _amount) public {

        uint256 _balance = iDFEngine.deposit(msg.sender, _tokenID, _amount);
        emit Deposit(_tokenID, msg.sender, _amount, _balance);
    }

    function withdraw(address _tokenID, uint256 _amount) public {

        uint256 _balance = iDFEngine.withdraw(msg.sender, _tokenID, _amount);
        emit Withdraw(_tokenID, msg.sender, _amount, _balance);
    }

    function destroy(uint256 _amount) public {

        iDFEngine.destroy(msg.sender, _amount);
        emit Destroy(msg.sender, _amount);
    }
}