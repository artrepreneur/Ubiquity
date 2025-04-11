// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TreasuryVault is Ownable {
    IERC20 public xbuToken;
    IERC20 public usdtToken;

    constructor(IERC20 _xbuToken, IERC20 _usdtToken) Ownable(msg.sender) {
        xbuToken = IERC20(_xbuToken);
        usdtToken = IERC20(_usdtToken);
    }

    function withdrawXBU(uint256 amount, address to) external onlyOwner {
        xbuToken.transfer(to, amount);
    }

    function withdrawUSDT(uint256 amount, address to) external onlyOwner {
        usdtToken.transfer(to, amount);
    }
}