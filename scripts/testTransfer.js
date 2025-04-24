const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Testing with:", deployer.address);

  const treasuryVault = await hre.ethers.getContractAt("TreasuryVault", "0x68bEfF0803a4a13739D3d7AC2f4B30378eA4C56B");
  const xbuAmount = hre.ethers.parseUnits("1000", 18); // Small amount for testing
  console.log(`Transferring ${xbuAmount} XBU to deployer...`);
  await treasuryVault.withdrawXBU(xbuAmount, deployer.address);
  console.log("Transfer successful");
}

main().catch((error) => {
  console.error("Transfer failed:", error);
  process.exitCode = 1;
});