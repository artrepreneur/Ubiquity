const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with:", deployer.address);

  const usdtAddress = "0x805aa6E15ef225B03FcC32709D756e76cCC069C1";
  const placeholderXbuAddress = "0x0000000000000000000000000000000000000001"; // Temporary placeholder

  console.log("Deploying TreasuryVault...");
  const TreasuryVault = await hre.ethers.getContractFactory("TreasuryVault");
  const treasuryVault = await TreasuryVault.deploy(placeholderXbuAddress, usdtAddress, deployer.address, { gasLimit: 5000000 });
  await treasuryVault.waitForDeployment();
  console.log("TreasuryVault:", treasuryVault.address);

  console.log("Deploying XBU...");
  const XBU = await hre.ethers.getContractFactory("XBU");
  const xbu = await XBU.deploy(treasuryVault.address, { gasLimit: 5000000 });
  await xbu.waitForDeployment();
  console.log("XBU:", xbu.address);

  console.log("Verifying balances...");
  console.log("Total supply:", (await xbu.totalSupply()).toString());
  console.log("TreasuryVault balance:", (await xbu.balanceOf(treasuryVault.address)).toString());
  console.log("Deployer balance:", (await xbu.balanceOf(deployer.address)).toString());

  console.log("Testing withdrawXBU...");
  const amount = hre.ethers.parseUnits("1000", 18);
  const tx = await treasuryVault.connect(deployer).withdrawXBU(amount, deployer.address, { gasLimit: 2000000 });
  console.log("Transaction hash:", tx.hash);
  await tx.wait();
  console.log("Transfer successful");
}

main().catch((error) => {
  console.error("Deployment or transfer failed:", error);
  process.exitCode = 1;
});