import React, { useContext, useState } from "react";
import { AiFillPlayCircle } from "react-icons/ai";
import { SiEthereum } from "react-icons/si";
import { BsInfoCircle } from "react-icons/bs";
import { Loader } from "./";

import { TransactionContext } from "../context/TransactionContext";

// Address shortener
import { shortenAddress } from "../utils/shortenAddress";

const commonStyles =
  "min-h-[70px] sm:px-0 px-2 sm:min-w-[80px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white";

const Input = ({ placeholder, name, type, value, handleChange }) => (
  <input
    placeholder={placeholder}
    type={type}
    step="0.0001"
    value={value}
    onChange={(e) => handleChange(e, name)}
    className="my-2 w-full p-2 outline-none bg-transparent text-white border-none text-small white-glassmorphism"
  ></input>
);

function Welcome() {
  const {
    connectWallet,
    currentAccount,
    formData,
    handleChange,
    sendTransaction,
    isLoading,
  } = useContext(TransactionContext);

  const handleSubmit = (e) => {
    console.log(formData);
    const { addressTo, amount, keyword, message } = formData;
    e.preventDefault();

    if (!addressTo || !amount || !keyword || !message) {
      return;
    }

    sendTransaction();
  };

  return (
    <div className="flex w-full justify-center h-screen">
      <div className="flex mf:flex-row flex-col items-start justify-between md:p-20 py-12 px-4 py-10"></div>
      <div className="flex flex-1 justify-start flex-col mf:mr-10">
        <h1 className="text-3xl sm:text-5xl text-white text-gradient py-1 mt-40">
          Send Crypto <br /> Across the World
        </h1>
        <p className="text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base">
          Explore the crypto world, Buy and Sell CryptoCurriences easily
        </p>
        {!currentAccount ? (
          <button
            type="button"
            onClick={connectWallet}
            className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-md cursor-pointer hover:bg-[#2546bd]"
          >
            <p className="text-white text=base font-semibold">Connect Wallet</p>
          </button>
        ) : null}
      </div>
      <div className="flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10">
        <div className="p-3 justify-end items-start flex-col rounded-xl h-40 sm:w-72 w-full my-5 eth-card white-glassmorphism">
          <div className="flex justify-between flex-col w-full h-full">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-full border-2 border-white flex justify-center items-center">
                <SiEthereum fontSize={21} color="#fff" />
              </div>
              <BsInfoCircle fontSize={17} color="#fff" />
            </div>
            <div>
              <p className="text-white font-light text-sm">
                {/* Render the address of the blockchain wallet */}
                {currentAccount ? shortenAddress(currentAccount) : "Address"}
              </p>
              <p className="text-white font-semibold text-lg mt-1">Ethereum</p>
            </div>
          </div>

          <div className="p-2 justify-end items-start flex-col rounded-xl sm:w-72 w-72 my-5 blue-glassmorphism">
            <Input
              placeholder="Address To"
              name="addressTo"
              type="text"
              handleChange={handleChange}
            />
            <Input
              placeholder="Amount(ETH)"
              name="amount"
              type="number"
              handleChange={handleChange}
            />
            <Input
              placeholder="Keyword(GIF)"
              name="keyword"
              type="text"
              handleChange={handleChange}
            />
            <Input
              placeholder="Enter Message"
              name="message"
              type="text"
              handleChange={handleChange}
            />

            {isLoading ? (
              <Loader />
            ) : (
              <button
                className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] rounded-md cursor-pointer"
                type="button"
                onClick={handleSubmit}
              >
                Send Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
