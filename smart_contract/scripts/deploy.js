const hre = require("hardhat");

const main = async () => {
  // This is a factory, which generates instances of the smart contract.
  const Transactions = await hre.ethers.getContractFactory("Transactions");
  // One instance is created by using deploy().
  const transactions = await Transactions.deploy();

  await transactions.deployed();

  console.log("Transactions deployed to:", transactions.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

runMain();
