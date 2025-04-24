// SPDX-License-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TreasuryVault is Ownable {
    IERC20 public xbuToken;
    IERC20 public usdtToken;

    constructor(IERC20 _xbuToken, IERC20 _usdtToken, address initialOwner) Ownable(initialOwner) {
        require(address(_xbuToken) != address(0), "Invalid XBU token address");
        require(address(_usdtToken) != address(0), "Invalid USDT token address");
        xbuToken = IERC20(_xbuToken);
        usdtToken = IERC20(_usdtToken);
    }

    function withdrawXBU(uint256 amount, address to) external onlyOwner {
        require(amount > 0, "Amount must be greater than zero");
        require(to != address(0), "Cannot transfer to zero address");
        require(xbuToken.balanceOf(address(this)) >= amount, "Insufficient XBU balance");
        bool success = xbuToken.transfer(to, amount);
        require(success, "XBU transfer failed");
    }

    function withdrawUSDT(uint256 amount, address to) external onlyOwner {
        require(amount > 0, "Amount must be greater than zero");
        require(to != address(0), "Cannot transfer to zero address");
        require(usdtToken.balanceOf(address(this)) >= amount, "Insufficient USDT balance");
        bool success = usdtToken.transfer(to, amount);
        require(success, "USDT transfer failed");
    }
}