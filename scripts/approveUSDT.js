const hre = require("hardhat");

async function main() {
  const mockUSDT = await hre.ethers.getContractAt("IERC20", "0x805aa6E15ef225B03FcC32709D756e76cCC069C1");
  await mockUSDT.approve("0x7a9fa7e4Dc318C5f629004b92d1a8961DEEE65E7", hre.ethers.parseUnits("1000000", 6));
  console.log("Approved Presale for 1M Mock USDT");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});