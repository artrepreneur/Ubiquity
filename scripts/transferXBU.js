const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Transferring with:", deployer.address);

  const treasuryVault = await hre.ethers.getContractAt("TreasuryVault", "0x68bEfF0803a4a13739D3d7AC2f4B30378eA4C56B");
  const presale = "0x7a9fa7e4Dc318C5f629004b92d1a8961DEEE65E7";
  const farmRewardsVault = "0x3cf0760A4393b0C38c4D69811aF1E74a9c60b641";
  const xbuAmount = hre.ethers.parseUnits("66670000", 18);
  console.log(`Transferring ${xbuAmount} XBU to Presale...`);
  const tx1 = await treasuryVault.connect(deployer).withdrawXBU(xbuAmount, presale, { gasLimit: 500000 });
  await tx1.wait();
  console.log("XBU transferred to Presale");

  const farmAmount = hre.ethers.parseUnits("8000000000", 18);
  console.log(`Transferring ${farmAmount} XBU to FarmRewardsVault...`);
  const tx2 = await treasuryVault.connect(deployer).withdrawXBU(farmAmount, farmRewardsVault, { gasLimit: 500000 });
  await tx2.wait();
  console.log("XBU transferred to FarmRewardsVault");
}

main().catch((error) => {
  console.error("Transfer failed:", error);
  process.exitCode = 1;
});