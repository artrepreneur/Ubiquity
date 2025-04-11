const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with:", deployer.address);

  // USDT address on Base (replace with actual Base USDT address)
  const usdtAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"; // Placeholder, verify!

  // Deploy Treasury Vault first (receives 10B XBU)
  const TreasuryVault = await hre.ethers.getContractFactory("TreasuryVault");
  const treasuryVault = await TreasuryVault.deploy(deployer.address, usdtAddress);
  await treasuryVault.waitForDeployment();
  console.log("TreasuryVault deployed to:", treasuryVault.target);

  // Deploy XBU Token (mints to Treasury Vault)
  const XBU = await hre.ethers.getContractFactory("XBU");
  const xbu = await XBU.deploy(treasuryVault.target);
  await xbu.waitForDeployment();
  console.log("XBU deployed to:", xbu.target);

  // Deploy Farm Rewards Vault
  const FarmRewardsVault = await hre.ethers.getContractFactory("FarmRewardsVault");
  const farmRewardsVault = await FarmRewardsVault.deploy(xbu.target);
  await farmRewardsVault.waitForDeployment();
  console.log("FarmRewardsVault deployed to:", farmRewardsVault.target);

  // Deploy USDT Vault
  const USDTVault = await hre.ethers.getContractFactory("USDTVault");
  const usdtVault = await USDTVault.deploy(usdtAddress, deployer.address); // Placeholder USBX
  await usdtVault.waitForDeployment();
  console.log("USDTVault deployed to:", usdtVault.target);

  // Deploy USBX Stablecoin
  const USBX = await hre.ethers.getContractFactory("USBX");
  const usbx = await USBX.deploy(usdtVault.target);
  await usbx.waitForDeployment();
  console.log("USBX deployed to:", usbx.target);

  // Update USDT Vault with USBX address
  await usdtVault.transferOwnership(usbx.target); // Transfer control to USBX

  // Deploy Investor Vault
  const InvestorVault = await hre.ethers.getContractFactory("InvestorVault");
  const investorVault = await InvestorVault.deploy(xbu.target);
  await investorVault.waitForDeployment();
  console.log("InvestorVault deployed to:", investorVault.target);

  // Deploy Presale Contract (example sale period: 4 weeks from now)
  const now = Math.floor(Date.now() / 1000);
  const saleStart = now + 60; // 1 minute from now for testing
  const saleEnd = saleStart + 4 * 7 * 24 * 60 * 60; // 4 weeks
  const Presale = await hre.ethers.getContractFactory("Presale");
  const presale = await Presale.deploy(usdtAddress, investorVault.target, treasuryVault.target, saleStart, saleEnd);
  await presale.waitForDeployment();
  console.log("Presale deployed to:", presale.target);

  // Transfer 66.67M XBU to Presale (for Investor Vault allocation)
  const xbuAmount = hre.ethers.parseUnits("66670000", 18);
  await xbu.connect(deployer).approve(treasuryVault.target, xbuAmount);
  await treasuryVault.withdrawXBU(xbuAmount, presale.target);

  // Transfer 8B XBU to Farm Rewards Vault
  const farmAmount = hre.ethers.parseUnits("8000000000", 18);
  await xbu.connect(deployer).approve(treasuryVault.target, farmAmount);
  await treasuryVault.withdrawXBU(farmAmount, farmRewardsVault.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});