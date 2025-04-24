// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  const { ethers, network } = hre;
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with:", deployer.address);
  console.log(" network:", network.name);

  const usdtAddress = network.name === "baseTestnet"
    ? "0x805aa6E15ef225B03FcC32709D756e76cCC069C1"
    : "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

  // 1️⃣ Deploy XBU
  console.log("\n1️⃣  Deploying XBU…");
  const XBU = await ethers.getContractFactory("XBU");
  const xbu = await XBU.deploy(deployer.address);
  await xbu.waitForDeployment();
  console.log("   → XBU:", xbu.target);

  // 2️⃣ Deploy TreasuryVault
  console.log("\n2️⃣  Deploying TreasuryVault…");
  const TreasuryVault = await ethers.getContractFactory("TreasuryVault");
  const treasuryVault = await TreasuryVault.deploy(
    xbu.target,
    usdtAddress,
    deployer.address
  );
  await treasuryVault.waitForDeployment();
  console.log("   → TreasuryVault:", treasuryVault.target);

  // 3️⃣ Fund TreasuryVault
  console.log("\n3️⃣  Funding TreasuryVault…");
  const totalXBU = await xbu.totalSupply();
  await (await xbu.transfer(treasuryVault.target, totalXBU)).wait();
  console.log("   → Transferred", totalXBU.toString(), "XBU to vault");

  // 4️⃣ Deploy FarmRewardsVault
  console.log("\n4️⃣  Deploying FarmRewardsVault…");
  const FarmRewardsVault = await ethers.getContractFactory("FarmRewardsVault");
  const farmRewardsVault = await FarmRewardsVault.deploy(
    xbu.target,
    deployer.address
  );
  await farmRewardsVault.waitForDeployment();
  console.log("   → FarmRewardsVault:", farmRewardsVault.target);

  // 5️⃣ Deploy USDTVault (use ethers.ZeroAddress here!)
  console.log("\n5️⃣  Deploying USDTVault…");
  const USDTVault = await ethers.getContractFactory("USDTVault");
  const usdtVault = await USDTVault.deploy(
    usdtAddress,
    ethers.ZeroAddress,      // ← FIXED: zero‐address constant in ethers v6
    deployer.address
  );
  await usdtVault.waitForDeployment();
  console.log("   → USDTVault:", usdtVault.target);

  // 6️⃣ Deploy USBX
  console.log("\n6️⃣  Deploying USBX…");
  const USBX = await ethers.getContractFactory("USBX");
  const usbx = await USBX.deploy(
    usdtVault.target,
    deployer.address
  );
  await usbx.waitForDeployment();
  console.log("   → USBX:", usbx.target);

  // 7️⃣ Transfer USDTVault ownership to USBX
  console.log("\n7️⃣  Transferring USDTVault → USBX…");
  await (await usdtVault.transferOwnership(usbx.target)).wait();
  console.log("   → USDTVault.owner =", await usdtVault.owner());

  // 8️⃣ Deploy InvestorVault
  console.log("\n8️⃣  Deploying InvestorVault…");
  const InvestorVault = await ethers.getContractFactory("InvestorVault");
  const investorVault = await InvestorVault.deploy(
    xbu.target,
    deployer.address
  );
  await investorVault.waitForDeployment();
  console.log("   → InvestorVault:", investorVault.target);

  // 9️⃣ Deploy Presale
  console.log("\n9️⃣  Deploying Presale…");
  const now       = Math.floor(Date.now() / 1000);
  const saleStart = now + 60;                             // +1 min
  const saleEnd   = saleStart + 4 * 7 * 24 * 60 * 60;      // +4 weeks
  const Presale   = await ethers.getContractFactory("Presale");
  const presale   = await Presale.deploy(
    usdtAddress,
    investorVault.target,
    treasuryVault.target,
    saleStart,
    saleEnd,
    deployer.address
  );
  await presale.waitForDeployment();
  console.log("   → Presale:", presale.target);

  console.log("\n✅ All done!\n");
  console.log({
    XBU: xbu.target,
    TreasuryVault: treasuryVault.target,
    FarmRewardsVault: farmRewardsVault.target,
    USDTVault: usdtVault.target,
    USBX: usbx.target,
    InvestorVault: investorVault.target,
    Presale: presale.target,
  });
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
