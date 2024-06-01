// import { ethers } from "hardhat";

// async function main() {
//   const currentTimestampInSeconds = Math.round(Date.now() / 1000);
//   const unlockTime = currentTimestampInSeconds + 60;

//   const lockedAmount = ethers.parseEther("0.001");

//   const lock = await ethers.deployContract("Lock", [unlockTime], {
//     value: lockedAmount,
//   });

//   await lock.waitForDeployment();

//   console.log(
//     `Lock with ${ethers.formatEther(
//       lockedAmount
//     )}ETH and unlock timestamp ${unlockTime} deployed to ${lock.target}`
//   );
// }

// // We recommend this pattern to be able to use async/await everywhere
// // and properly handle errors.
// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });


const { ethers } = require("ethers");
const fs = require("fs");
const xlsx = require("xlsx");

const airdropContractAddress = "YOUR_AIRDROP_CONTRACT_ADDRESS";
const airdropWallet = "0xd74Cc068580285CA3328e7fF929366167421CD4f";
const tokenAddress = "0xa3bb956C5F8Ce6Fb8386e0EBBE82Cba12bBe6EBD";
const provider = new ethers.providers.InfuraProvider("sepolia", "YOUR_INFURA_PROJECT_ID");

const wallet = new ethers.Wallet("YOUR_PRIVATE_KEY", provider);
const airdropContract = new ethers.Contract(airdropContractAddress, airdropAbi, wallet);
const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, wallet);

// Load the Excel file
const workbook = xlsx.readFile("path_to_your_excel_file.xlsx");
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

// Parse the Excel data
const data = xlsx.utils.sheet_to_json(sheet);

const recipients = [];
const amounts = [];

data.forEach((row) => {
recipients.push(row.wallet);amounts.push(ethers.utils.parseUnits(row.total_distribution.toString(), 18));
});

// Approve the contract to spend tokens
async function approve() {
  const totalAmount = amounts.reduce((acc, amount) => acc.add(amount), ethers.BigNumber.from(0));
const tx = await tokenContract.approve(airdropContractAddress, totalAmount);
 await tx.wait();
 console.log("Tokens approved");
}

// Execute the airdrop
async function distribute() {
 const tx = await airdropContract.distribute(recipients, amounts);
 await tx.wait();
 console.log("Airdrop executed");
}

// Run the approval and distribution
approve().then(distribute).catch(console.error);
