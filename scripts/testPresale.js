const hre = require("hardhat");

async function main() {
  const presale = await hre.ethers.getContractAt("Presale", "0x7a9fa7e4Dc318C5f629004b92d1a8961DEEE65E7");
  const tx = await presale.buyTokens(hre.ethers.parseUnits("1000", 6));
  await tx.wait();
  console.log("Purchased tokens with 1000 Mock USDT");
  console.log("Total tokens sold:", (await presale.totalTokensSold()).toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});