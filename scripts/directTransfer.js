// scripts/withdraw.js
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Withdrawing with:", deployer.address);

  // ← your real vault address
  const treasuryVaultAddr = "0x83FB4fCA7386F05Ba5380013D42B7312B15ab665";

  const amount = hre.ethers.parseUnits("1000", 18);
  console.log(`Withdrawing ${amount.toString()} XBU from vault → deployer`);

  const treasuryVault = await hre.ethers.getContractAt("TreasuryVault", treasuryVaultAddr, deployer);
  const tx = await treasuryVault.withdrawXBU(amount, deployer.address, { gasLimit: 500_000 });
  await tx.wait();

  console.log("✅ Withdraw successful!");
}

main().catch(error => {
  console.error("❌ Withdrawal failed:", error);
  process.exitCode = 1;
});
