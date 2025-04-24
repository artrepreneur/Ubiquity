// Script for rewards emission
// Run like 0 0 * * * node rewardEmitter.js >> rewardEmitter.log 2>&1

const { ethers } = require('ethers');
require('dotenv').config();

// Config
const FARM_REWARDS_VAULT = "0xYourFarmRewardsVaultAddress";
const STAKING_CONTRACT   = "0xYourStakingRewardsContract";
const EMISSION_AMOUNT    = ethers.utils.parseUnits("100000", 18); // daily reward amount

async function emitRewards() {
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    const vaultAbi = ["function automatedReleaseRewards(uint256 amount, address stakingContract) external"];
    const farmRewardsVault = new ethers.Contract(FARM_REWARDS_VAULT, vaultAbi, wallet);

    const tx = await farmRewardsVault.automatedReleaseRewards(EMISSION_AMOUNT, STAKING_CONTRACT);
    console.log("Emission tx sent:", tx.hash);
    await tx.wait();
    console.log("Emission tx confirmed:", tx.hash);
}

emitRewards().catch(console.error);
