contract Spaceshot {
    mapping(address => uint256) public balances;
    uint256 public playersCount;
    uint256 public transactions;

    uint256 startingTime;
    uint256 endingTime;

    struct GameStatus {
        uint256 startingTime;
        uint256 endingTime;
    }

    GameStatus gameStatus;

    struct playerDetails {
        uint256 amount;
        uint256 multiplier;
        uint256 beddingTime;
        address walletAddress;
    }

    struct GameResult {
        uint256 amount;
        uint256 multiplier;
        uint256 payout;
        address walletAddress;
    }

    event gameStarted(uint256 _startingTime, uint256 _endingTime);

    event returnResult(uint256 _amount, uint256 _multiplier, uint256 profit);

    mapping(uint256 => playerDetails) public currentPlayers;
    mapping(uint256 => GameResult) public gameResult;

    modifier checkPlayerDetails() {
        for (uint8 i = 0; i <= playersCount; i++) {
            require(
                address(currentPlayers[i].walletAddress) != msg.sender,
                "You are already in the game"
            );
        }
        _;
    }

    function deposit() public payable {
        balances[msg.sender] += msg.value;
        transactions++;
    }

    function withdraw(uint256 _amount) public payable {
        address payable senderAddress = payable(msg.sender);
        require(balances[msg.sender] >= _amount, "Insufficient Funds");
        balances[msg.sender] -= _amount * (1 ether);
        senderAddress.transfer(_amount * (1 ether));
    }

    function getPlayerCount() public view returns (uint256) {
        return playersCount;
    }

    function getBalance(address player) public view returns (uint256) {
        return balances[player];
    }

    function getGameBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function addPlayer(
        uint256 amount,
        uint256 multiplier,
        uint256 timestamp,
        address walletAddress
    ) internal {
        currentPlayers[playersCount] = playerDetails(
            amount,
            multiplier,
            timestamp,
            walletAddress
        );
        playersCount++;
    }

    function betAmount(
        uint256 amount,
        uint256 multiplier,
        uint256 gameMultiplier
    ) public checkPlayerDetails {
        uint256 balance = balances[msg.sender];
        require(balance >= amount, "Insuffecient Funds");
        if (multiplier <= gameMultiplier) {
            balances[msg.sender] += amount * multiplier;
            emit returnResult(amount, multiplier, amount * multiplier);
        } else {
            balances[msg.sender] -= amount;
            emit returnResult(amount, multiplier, 0);
        }
    }

    function getGameStatus() public view returns (GameStatus memory) {
        return gameStatus;
    }

    function checkGameStatus() public view returns (bool) {
        if (gameStatus.startingTime == 0 && gameStatus.endingTime == 0) {
            return false;
        } else {
            return true;
        }
    }

    function getTimeStamp() public view returns (uint256) {
        return block.timestamp;
    }

    function getBlockhash() public view returns (bytes32) {
        uint256 blockNumber = block.number;
        bytes32 blockHash = blockhash(blockNumber - 1);
        return blockHash;
    }

    function startNewGame() public {
        startingTime = block.timestamp;
        endingTime = block.timestamp + 10;
        gameStatus = GameStatus(block.timestamp, block.timestamp + 1000);
    }

    function endGame(uint256 _multiplier) public {
        for (uint256 i = 0; i <= playersCount; i++) {
            uint256 _betAmount = currentPlayers[i].amount;
            uint256 multiplier = currentPlayers[i].multiplier;
            address walletAddress = currentPlayers[i].walletAddress;
            if (multiplier <= _multiplier) {
                uint256 payout = _betAmount * multiplier;
                gameResult[i] = GameResult(
                    _betAmount,
                    multiplier,
                    payout,
                    walletAddress
                );
            } else {
                gameResult[i] = GameResult(
                    _betAmount,
                    multiplier,
                    0,
                    walletAddress
                );
            }
        }
    }

    function getGameResult() public view returns (GameResult[] memory) {
        GameResult[] memory _gameResult = new GameResult[](playersCount);
        for (uint256 i = 0; i < playersCount; i++) {
            GameResult storage gameResult_ = gameResult[i];
            _gameResult[i] = gameResult_;
        }
        return _gameResult;
    }
}
