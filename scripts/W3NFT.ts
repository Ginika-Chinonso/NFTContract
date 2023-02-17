import { ethers } from "hardhat";

// Token address on mainnet: 0x8B696741eff7bcBEA3eE21f8583C9f8c9dbCea69

async function main() {
  const [addr1] = await ethers.getSigners()
  const W3NFT = await ethers.getContractFactory("W3NFT");
  const w3nft = await W3NFT.deploy("W3NFT", "W3NFT");
  await w3nft.deployed()

  console.log(`The NFT contract has been deployed to Goerli Testnet at this address: ${w3nft.address}`)

  await w3nft.safeMint(addr1.address, "Qmf7VNLwLwRfCZgs7fZP9mm7cNu31Xt1BZiUxHJckXYjjg");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
