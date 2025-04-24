const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Approving with:", deployer.address);

  const xbu = await hre.ethers.getContractAt("XBU", "0xBA39F572aFEADD9A3cc1a87D5F8c2CAAF9e213F4");
  const treasuryVault = "0x68bEfF0803a4a13739D3d7AC2f4B30378eA4C56B";
  const amount = hre.ethers.parseUnits("1000", 18);
  console.log(`Approving ${amount} XBU for deployer from TreasuryVault...`);
  const tx = await xbu.connect(deployer).approve(deployer.address, amount, { gasLimit: 100000 });
  await tx.wait();
  console.log("Approval successful");
}

main().catch((error) => {
  console.error("Approval failed:", error);
  process.exitCode = 1;
});