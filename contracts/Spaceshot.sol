// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Spaceshot {
    mapping(uint256 => address) public players;
    mapping(address => uint256) public balances;
    uint256 public playersCount;
    uint256 public transactions;

    function createAccount() public returns (bool) {
        playersCount += 1;
        players[playersCount] = msg.sender;
        return true;
    }

    function deposit() public payable {
        balances[msg.sender] += msg.value;
        transactions++;
    }

    function withdraw(uint256 _amount) public payable {
        address payable senderAddress = payable(msg.sender);
        require(balances[senderAddress] >= _amount, "Insufficent Funds");
        balances[senderAddress] -= _amount;
        senderAddress.transfer(msg.value);
    }

    function getBalance(address player) public view returns (uint256) {
        return balances[player];
    }

    function getGameBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
