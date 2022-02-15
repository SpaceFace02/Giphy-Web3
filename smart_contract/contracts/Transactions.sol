//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Transactions{
    uint256 transactionCount;

    // Function, emit or call later on
    event Transfer(address from, address receiver, uint amount, string message, uint256 timestamp, string keyword);

    struct transferStruct {
        address sender;
        address receiver;
        uint amount;
        string message;
        uint256 timestamp;
        string keyword;
    }

    // Array of transactions on the block chain
    transferStruct[] transactions;

// String memory
    function addToBlockChain(address payable receiver, uint amount, string memory message, string memory keyword) public {
        transactionCount += 1;

        transactions.push(transferStruct({
            sender: msg.sender,
            receiver: receiver,
            amount: amount,
            message: message,
            // Timestamp of the transaction in a block.
            timestamp: block.timestamp,
            keyword: keyword
        }));

        emit Transfer(msg.sender, receiver, amount, message, block.timestamp, keyword);

    }

    function getAllTransactions() public view returns (transferStruct[] memory)
    {
        // Return transactions
        return transactions;
    }

    function getTransactionCount() public view returns (uint256) {
        // Return transaction count
        return transactionCount;
    }



}