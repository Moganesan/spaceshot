// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Spaceshot {
    mapping(uint256 => address) public players;
    mapping(address => uint256) public balances;
    mapping(address => bool) public accounts;
    uint256 public startingTime;
    uint256 public endingTime;
    uint256 public playersCount;
    uint256 public transactions;

    struct playerDetails {
        uint256 amount;
        uint256 multiplier;
        uint256 beddingTime;
    }

    mapping(uint256 => playerDetails) public currentPlayers;

    function deposit() public payable {
        bool account = accounts[msg.sender];
        if (!account) {
            playersCount++;
            players[playersCount] = msg.sender;
            accounts[msg.sender] = true;
        }
        require(accounts[msg.sender], "User Not have An Account");
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

    function betAmount(uint256 amount, uint256 multiplier) public {
        uint256 balance = balances[msg.sender];
        uint256 timestamp = block.timestamp;
        require(timestamp < endingTime, "Game Starts within 10 seconds");
        require(balance >= amount, "Insuffecient Funds");
        currentPlayers[block.timestamp] = playerDetails(
            amount,
            multiplier,
            block.timestamp
        );
    }

    function startNewGame() public {
        startingTime = block.timestamp;
        endingTime = block.timestamp + 10;
    }

    function endGame() public {
        uint256 timestamp = block.timestamp;
        require(timestamp >= endingTime, "Game Not Ended");
    }
}
