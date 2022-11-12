pragma solidity ^0.8.0;

contract Spaceshot {
    mapping(address => uint256) public balances;
    uint256 public playersCount;
    uint256 public transactions;
    address owner;

    constructor() {
        owner = msg.sender;
    }

    struct GameResult {
        uint256 amount;
        uint256 multiplier;
        uint256 payout;
        address walletAddress;
    }

    event returnResult(
        uint256 _amount,
        uint256 _gameMultiplier,
        uint256 _multiplier,
        uint256 profit
    );

    function deposit() public payable returns (uint256) {
        balances[msg.sender] += msg.value;
        return balances[msg.sender];
    }

    function withdraw(uint256 _amount) public payable {
        address payable senderAddress = payable(msg.sender);
        require(balances[msg.sender] >= _amount, "Insufficient Funds");
        balances[msg.sender] -= _amount;
        senderAddress.transfer(_amount);
    }

    function getPlayerCount() public view returns (uint256) {
        return playersCount;
    }

    function withdrawContract() public payable {
        require(msg.sender == owner, "Only owner can withdraw funds");
        payable(owner).transfer(address(this).balance);
    }

    function getBalance(address player) public view returns (uint256) {
        return balances[player];
    }

    function getGameBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function betAmount(
        address player,
        uint256 amount,
        uint256 multiplier,
        uint256 gameMultiplier
    ) public {
        require(balances[player] >= amount, "Insuffecient Funds");
        if (multiplier <= gameMultiplier) {
            uint256 profit = amount * multiplier;
            balances[player] += profit;
            emit returnResult(
                amount,
                gameMultiplier,
                multiplier,
                amount * multiplier
            );
        } else {
            balances[player] -= amount * (1 ether);
            emit returnResult(amount, gameMultiplier, multiplier, 0);
        }
    }

    function getTimeStamp() public view returns (uint256) {
        return block.timestamp;
    }
}
