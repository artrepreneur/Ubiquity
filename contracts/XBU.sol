// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract XBU is ERC20 {
    constructor(address treasuryVault) ERC20("XBU Token", "XBU") {
        require(treasuryVault != address(0), "Invalid treasury vault address");
        _mint(treasuryVault, 10_000_000_000 * 10**decimals());
        emit Minted(treasuryVault, 10_000_000_000 * 10**decimals());
    }

    event Minted(address indexed recipient, uint256 amount);
    event TransferCalled(address indexed sender, address indexed to, uint256 amount);

    function transfer(address to, uint256 amount) public virtual override returns (bool) {
        emit TransferCalled(msg.sender, to, amount);
        require(to != address(0), "ERC20: transfer to zero address");
        require(balanceOf(msg.sender) >= amount, "ERC20: insufficient balance");
        return super.transfer(to, amount);
    }
}