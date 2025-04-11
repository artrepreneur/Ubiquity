# Ubiquity
Agentic Payments Network

Ubiquity is a decentralized ecosystem designed to facilitate agentic payments, leveraging a dual-token system: XBU (a yield-bearing token) and USBX (a stablecoin pegged to USDT/USDC).

## Overview
The ICO phase deploys 7 smart contracts to:
- Pre-mint XBU tokens.
- Raise in USDT via presale with vesting (6-month cliff, 5% initial, 8% quarterly).
- Prepare USBX for pool funding.
- Allocate XBU for community rewards.


## Contracts
The ICO phase includes the following contracts:

| **Contract**            | **Purpose**                                                                 |
|--------------------------|-----------------------------------------------------------------------------|
| **XBU.sol**             | Pre-mints 10B XBU tokens, distributes to vaults for presale and rewards.   |
| **USBX.sol**            | Manages USBX stablecoin with 1.4% mint/burn fee, links to USDT Vault.      |
| **InvestorVault.sol**   | Locks 66.67M XBU for presale investors with vesting schedule.              |
| **TreasuryVault.sol**   | Holds 653.33M XBU and $1M USDT, funds pool and ops.                        |
| **FarmRewardsVault.sol**| Stores 8B XBU for community rewards, prepares for staking.                 |
| **USDTVault.sol**       | Secures $250K USDT for USBX minting, supports pool setup.                  |
| **Presale.sol**         | Executes $1M ICO, transfers XBU to Investor Vault and USDT to Treasury.    |

Post-ICO, 5 additional contracts (e.g., liquidity pool, staking) complete the launch phase.

## Prerequisites
- **Node.js**: v16–v18 (e.g., v18.20.6).
- **npm**: v8+ (e.g., v9.6.7).
- **Hardhat**: Ethereum development environment.
- **Base Network Access**: Alchemy or Infura API key for Base Mainnet/Testnet.
- **Wallet**: MetaMask or similar with Base ETH (~0.1 ETH for gas) and private key.
- **USDT**: Base Mainnet USDT address (verify on [Basescan](https://basescan.org)).

## Setup Instructions
Clone this repository and set up the project:

```bash
git clone https://github.com/yourusername/ubiquity.git
cd ubiquity
npm install