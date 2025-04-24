const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying MockUSDT with:", deployer.address);

  const MockUSDT = await hre.ethers.getContractFactory("MockUSDT");
  const mockUSDT = await MockUSDT.deploy();
  await mockUSDT.waitForDeployment();
  console.log("MockUSDT deployed to:", mockUSDT.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});