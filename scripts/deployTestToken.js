const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const TestToken = await hre.ethers.getContractFactory("TestToken");
  const testToken = await TestToken.deploy(deployer.address, { gasLimit: 5000000 });
  await testToken.waitForDeployment();
  console.log("TestToken deployed at:", testToken.address);

  const amount = hre.ethers.parseUnits("100", 18);
  console.log(`Transferring ${amount} TEST to deployer...`);
  const tx = await testToken.transfer(deployer.address, amount, { gasLimit: 100000 });
  await tx.wait();
  console.log("Transfer successful");
}

main().catch((error) => {
  console.error("Deployment or transfer failed:", error);
  process.exitCode = 1;
});