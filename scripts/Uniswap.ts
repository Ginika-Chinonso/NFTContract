import { ethers } from "hardhat";

async function main() {

  // Setting state variables
  console.log(`********* Setting up state variables ******************`)
  const ROUTER = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
  const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
  const UNI = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984";
  const IMPACC = "0x748dE14197922c4Ae258c7939C7739f3ff1db573";
  const UNIFACTORYADDRESS= "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"


  // Getting contract implementation
  console.log(`************ Setting up contract implementations *************`)
  const Uniswap = await ethers.getContractAt("IUniswap", ROUTER);
  const DaiContract = await ethers.getContractAt("IToken", DAI);
  const WETHContract = await ethers.getContractAt("IToken", WETH);
  const UniContract = await ethers.getContractAt("IToken", UNI);
  const UniFactoryContract = await ethers.getContractAt("IUnifactory", UNIFACTORYADDRESS);

  // Get DAI and UNI pair address
  const DAIUNIADDR = await UniFactoryContract.getPair(DAI, UNI);

  // Get pair instance
  const DAIUNIContract = await ethers.getContractAt("IPair", DAIUNIADDR);

  

  // Setting up impersonator
  console.log(`********* Setting up Impersonator account ************`)
  const helpers = require("@nomicfoundation/hardhat-network-helpers");
  await helpers.impersonateAccount(IMPACC);
  const impersonatedSigner = await ethers.getSigner(IMPACC);

  // Setting up transaction variables
  console.log(`********** Setting up transaction variables ************`)

  // First transaction
  const tx1 = {
      tokenA: DAI,
      tokenB: UNI,
      amountADesired: ethers.utils.parseEther("100"),
      amountBDesired: ethers.utils.parseEther("40"),
      amountAMin: 0,
      amountBMin: 0,
      to: impersonatedSigner.address,
      deadline: 1686588399
  }

  // Second transaction
  const tx2 = {
    token: DAI,
    amountTokenDesired: ethers.utils.parseEther("100"),
    amountTokenMin: 0,
    amountETHMin: 0,
    to: impersonatedSigner.address,
    deadline: 1686588399,
    value: ethers.utils.parseEther("1")
  }

  // Third transaction
  const tx3 = {
      tokenA: DAI,
      tokenB: UNI,
      liquidity: ethers.utils.parseEther("15"),
      amountAMin: 0,
      amountBMin: 0,
      to: impersonatedSigner.address,
      deadline: 1686588399
  }
    


  // Transactions

  console.log(`First transaction`)
  // First Transaction
  // Approving DAI and UNI
  console.log(`Approving tokens`)
  await DaiContract.connect(impersonatedSigner).approve(ROUTER, tx1.amountADesired)
  await UniContract.connect(impersonatedSigner).approve(ROUTER, tx1.amountBDesired)

  console.log(`DAI balance before adding liquidity: ${await DaiContract.balanceOf(impersonatedSigner.address)}`);
  console.log(`UNI balance before adding liquidity: ${await UniContract.balanceOf(impersonatedSigner.address)}`);

  console.log(`Adding DAI and UNI liquidity`)
  // Adding Liquidity for DAI and UNI
  await Uniswap.connect(impersonatedSigner).addLiquidity(tx1.tokenA, tx1.tokenB, tx1.amountADesired, tx1.amountBDesired, tx1.amountAMin, tx1.amountBMin, tx1.to, tx1.deadline);

  console.log( `DAI balance after adding liquidity: ${await DaiContract.balanceOf(impersonatedSigner.address)}`);
  console.log(`UNI balance after adding liquidity: ${await UniContract.balanceOf(impersonatedSigner.address)}`);



  // Second Transaction
  console.log(`Second Transaction`)


  console.log(`DAI balance before adding liquidity: ${await DaiContract.balanceOf(impersonatedSigner.address)}`);
  console.log(`ETH balance before adding liquidity: ${await ethers.provider.getBalance(impersonatedSigner.address)}`);


  // Approving DAI
  console.log(`Approving token`)
  await DaiContract.connect(impersonatedSigner).approve(ROUTER, tx2.amountTokenDesired)

  console.log(`Adding DAI and ETH liquidity`)
  // Adding Liquidity for DAI and ETH
  Uniswap.connect(impersonatedSigner).addLiquidityETH(tx2.token, tx2.amountTokenDesired, tx2.amountTokenMin, tx2.amountETHMin, tx2.to, tx2.deadline, {value: tx2.value})


  console.log( `DAI balance after adding liquidity: ${await DaiContract.balanceOf(impersonatedSigner.address)}`);
  console.log(`ETH balance after adding liquidity: ${await ethers.provider.getBalance(impersonatedSigner.address)}`);





  // Third Transaction
  console.log(`Third transaction`)


  console.log( `DAI balance before removing liquidity: ${await DaiContract.balanceOf(impersonatedSigner.address)}`);
  console.log(`UNI balance before removing liquidity: ${await UniContract.balanceOf(impersonatedSigner.address)}`);


  // Getting DAI-UNI Liquidity
  const Liq = await DAIUNIContract.balanceOf(impersonatedSigner.address)
  console.log(`Signers Liquidity balance is: ${Liq}`) //32 239 184 546 873 652 058


  // Removing Liquidity for DAI and UNI
  console.log(`Removing DAI and UNI liquidity`)
  await DAIUNIContract.connect(impersonatedSigner).approve(ROUTER, Liq)
  Uniswap.connect(impersonatedSigner).removeLiquidity(tx3.tokenA, tx3.tokenB, tx3.liquidity, tx3.amountAMin, tx3.amountBMin, tx3.to, tx3.deadline)

  console.log( `DAI balance after removing liquidity: ${await DaiContract.balanceOf(impersonatedSigner.address)}`);
  console.log(`UNI balance after removing liquidity: ${await UniContract.balanceOf(impersonatedSigner.address)}`);

  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
