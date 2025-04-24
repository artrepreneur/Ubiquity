// SPDX-License-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract USDTVault is Ownable {
    IERC20 public usdt;
    address public usbXContract;

    event USDTWithdrawn(uint256 amount, address to);

    constructor(IERC20 _usdt, address _usbXContract, address initialOwner) Ownable(initialOwner) {
        usdt = IERC20(_usdt);
        usbXContract = _usbXContract;
    }

    function withdrawUSDT(uint256 amount, address to) external onlyOwner {
        usdt.transfer(to, amount);
        emit USDTWithdrawn(amount, to);
    }

    function transferForMint(uint256 amount) external {
        require(msg.sender == usbXContract, "Only USBX contract");
        usdt.transfer(usbXContract, amount);
    }
}