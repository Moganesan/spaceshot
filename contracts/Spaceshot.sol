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

    function deposit() public payable {
        balances[msg.sender] += msg.value;
        transactions++;
    }

    function withdraw(uint256 _amount) public payable {
        address payable senderAddress = payable(msg.sender);
        require(
            balances[msg.sender] >= _amount * (1 ether) &&
                address(this).balance >= _amount,
            "Insufficient Funds"
        );
        balances[msg.sender] -= _amount * (1 ether);
        senderAddress.transfer(_amount * (1 ether));
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
        uint256 amount,
        uint256 multiplier,
        uint256 gameMultiplier
    ) public {
        require(
            balances[msg.sender] >= amount * (1 ether),
            "Insuffecient Funds"
        );
        if (multiplier <= gameMultiplier) {
            uint256 profit = amount * multiplier;
            balances[msg.sender] += profit * (1 ether);
            emit returnResult(
                amount,
                gameMultiplier,
                multiplier,
                amount * multiplier
            );
        } else {
            balances[msg.sender] -= amount * (1 ether);
            emit returnResult(amount, gameMultiplier, multiplier, 0);
        }
    }

    function getTimeStamp() public view returns (uint256) {
        return block.timestamp;
    }
}
