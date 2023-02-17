import { ethers } from "hardhat";

async function main() {
  const W3NFT = await ethers.getContractFactory("W3NFT");
  const w3nft = await W3NFT.deploy("W3NFT", "W3NFT");
  await w3nft.deployed()

  console.log(`The NFT contract has been deployed to Goerli Testnet at this address: ${w3nft.address}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
