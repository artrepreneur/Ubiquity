// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract XBU is ERC20 {
    constructor(address treasuryVault) ERC20("XBU Token", "XBU") {
        _mint(treasuryVault, 10_000_000_000 * 10**decimals()); // 10B XBU
    }
}