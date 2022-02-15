import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

import { contractAbi, contractAddress } from "../utils/constants";

export const TransactionContext = React.createContext();

const { ethereum } = window;

const getEthereumContract = () => {
  // A Provider is an abstraction of a connection to the Ethereum network.
  const provider = new ethers.providers.Web3Provider(ethereum);
  //   A Signer in ethers is an abstraction of an Ethereum Account.
  const signer = provider.getSigner();

  const transactionContract = new ethers.Contract(
    contractAddress,
    contractAbi,
    signer
  );

  return transactionContract;
};

export const TransactionProvider = ({ children }) => {
  // It will get reset, everytime the component is re-rendered, or the browser is reloaded.
  const [transactionCount, setTransactionCount] = useState(
    localStorage.getItem("transactionCount") || 0
  );
  const [currentAccount, setCurrentAccount] = useState("");
  const [formData, setFormData] = useState({
    addressTo: "",
    amount: "",
    keyword: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const handleChange = (e, name) => {
    //   If you pass in a callback, react gives you access to a previous state. e is the keyboard event, target is the text field on which the event is being called, and value is the value in that textfield.

    // ... is used to create a copy of the object, or array and pass it, not as reference.
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const getTransactions = async () => {
    if (!ethereum) return alert("Please connect to MetaMask");
    try {
      const transactionContract = getEthereumContract();
      const availableTransactions =
        await transactionContract.getAllTransactions();

      const structuredTransactions = availableTransactions.map(
        (transaction) => ({
          addressTo: transaction.receiver,
          addressFrom: transaction.sender,
          //   Convert the hex value to decimal, and then divide it by 18, to get the amount in ETH.
          amount: parseInt(transaction.amount._hex) / 10 ** 18,
          message: transaction.message,
          //   timestamp in the transaction, is a bigNumber, to get the nice ddmmyyyy format, we do the following.
          timestamp: new Date(
            transaction.timestamp.toNumber() * 1000
          ).toLocaleString(),
          keyword: transaction.keyword,
        })
      );

      setTransactions(structuredTransactions);
    } catch (err) {
      console.log(err);
    }
  };

  // Utility function to get the current account.
  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) return alert("Please install Metamask");
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length != 0) {
        setCurrentAccount(accounts[0]);

        //   Get all transactions
        await getTransactions();
      } else {
        alert("No accounts found");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install Metamask");

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      //   console.log("Inside the connectWallet function");
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err);

      throw new err("No ethereum object found");
    }
  };

  //   Just once, when the application loads up.
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const sendTransaction = async () => {
    try {
      if (!ethereum) return alert("Please install Metamask");
      // Get form data
      const { addressTo, amount, keyword, message } = formData;
      const transactionContract = getEthereumContract();
      const parsedAmount = ethers.utils.parseEther(amount);

      await ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            to: addressTo,
            from: currentAccount,
            gas: "0x5208", // 21000 gwei, 0.000021 ethereum.
            // Add the ._hex to convert to string.
            value: parsedAmount._hex, // Parsed in GWEI, add the ._hex later
          },
        ],
      });

      //   Store transactions
      const transactionHash = await transactionContract.addToBlockChain(
        addressTo,
        parsedAmount,
        message,
        keyword
      );

      setIsLoading(true);
      console.log(`Loading - ${transactionHash.hash}`);

      //   Wait for the transaction to be resolved.
      const receipt = await transactionHash.wait();

      //   Mining is the process of creating a block of transactions to be added to the Ethereum blockchain. I am mining a block of transactions, to create it.
      setIsLoading(false);
      console.log(`Success - ${transactionHash.hash}`);

      //   This receipt object has a few props - addressTo, addressFrom, indexOfTransaction, cumulativeGasUsed, gasUsed, contractAddress and a few more, refer docs.
      const transactionCount = await transactionContract.getTransactionCount();

      //   Store the transaction count in local storage.
      localStorage.setItem("transactionCount", transactionCount.toNumber());
      setTransactionCount(transactionCount.toNumber());
    } catch (err) {
      console.log(err);
      alert("Error in Transaction. Please try again.");
    }
  };

  return (
    //   value is the state of the context, whats available to all components.
    <TransactionContext.Provider
      value={{
        connectWallet: connectWallet,
        currentAccount,
        formData,
        setFormData,
        handleChange,
        sendTransaction,
        transactions,
        isLoading,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
