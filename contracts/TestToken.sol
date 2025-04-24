// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestToken is ERC20 {
    constructor(address recipient) ERC20("Test Token", "TEST") {
        _mint(recipient, 1000 * 10**decimals());
    }
}