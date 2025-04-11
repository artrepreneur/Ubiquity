// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract USBX is ERC20, Ownable {
    uint256 public constant FEE_NUMERATOR = 14; // 1.4% fee
    uint256 public constant FEE_DENOMINATOR = 1000;
    address public usdtVault;

    constructor(address _usdtVault) ERC20("USBX Stablecoin", "USBX") Ownable(msg.sender) {
        usdtVault = _usdtVault;
    }

    function mint(address to, uint256 usdtAmount) external onlyOwner {
        uint256 usbXAmount = (usdtAmount * (FEE_DENOMINATOR - FEE_NUMERATOR)) / FEE_DENOMINATOR;
        _mint(to, usbXAmount);
        IERC20(usdtVault).transferFrom(msg.sender, usdtVault, usdtAmount);
    }

    function burn(address from, uint256 usbXAmount) external onlyOwner {
        _burn(from, usbXAmount);
        uint256 usdtAmount = (usbXAmount * FEE_DENOMINATOR) / (FEE_DENOMINATOR - FEE_NUMERATOR);
        IERC20(usdtVault).transfer(from, usdtAmount);
    }
}