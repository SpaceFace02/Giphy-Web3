import React, { useContext } from "react";
import { TransactionContext } from "../context/TransactionContext";

import dummyData from "../utils/dummyData";

// shortenAddress
import { shortenAddress } from "../utils/shortenAddress";

// useFetch
import useFetch from "../hooks/useFetch";

const TransactionCard = ({
  addressTo,
  addressFrom,
  timestamp,
  amount,
  message,
  url,
  keyword,
}) => {
  const gifURL = useFetch({ keyword });

  //   Return JSX
  return (
    <div className="bg-[#18191d] m-4 flex flex-1 2xl:min-w-[450px] 2xl:max-w-[500px] sm:min-w-[270px] sm:max-w-[300px] p-3 rounded-md hover:shadow-2xl">
      <div className="flex flex-col items-center w-full mt-3">
        <div className="w-full mb-6 p-2">
          <a
            href={`https://ropsten.etherscan.io/address/${addressFrom}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="text-base text-white">
              From: {shortenAddress(addressFrom)}
            </p>
          </a>
          <a
            href={`https://ropsten.etherscan.io/address/${addressTo}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="text-base text-white">
              To: {shortenAddress(addressTo)}
            </p>
          </a>
          <p className="text-white text-base">Amount: {amount} ETH</p>
          {message && (
            <>
              <br />
              <p className="text-white text-base">Message: {message}</p>
            </>
          )}
          <div className="bg-[#070731] p-3 px-5 w-max rounded-3xl mt-5 shadow-2xl">
            <p className="text-[#c2d4ff] font-bold">{timestamp}</p>
          </div>
          {/* url for demo images, gifURL for newly created transactions */}
          {/* Before it was gifURL || url, but now there's no predefined url. */}
          <img
            src={gifURL}
            alt="gif"
            className="w-full h-60 2x:h-96 rounded-md shadow-xl  object-cover"
          />
        </div>
      </div>
    </div>
  );
};

function Transactions() {
  const { currentAccount, transactions } = useContext(TransactionContext);

  return (
    <div className="flex w-full justify-center items-center 2xl:px-20 custom-chirag-gradient">
      <div className="flex flex-col md:p-12 py-12 px-4">
        {currentAccount ? (
          <h3 className="text-white text-3xl text-center my-2">
            Latest Transactions
          </h3>
        ) : (
          <h3 className="text-white text-3xl text-center my-2">
            Connect your account to see the latest changes
          </h3>
        )}

        <div className="flex flex-row flex-wrap justify-center items-center mt-10">
          {transactions.reverse().map((transaction, i) => (
            //   All of the props in dummy Data are passed down here.
            <TransactionCard key={i} {...transaction} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Transactions;
