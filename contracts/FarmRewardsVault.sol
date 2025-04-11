// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FarmRewardsVault is Ownable {
    IERC20 public token;

    event RewardsReleased(uint256 amount, address to);

    constructor(IERC20 _token) Ownable(msg.sender) {
        token = IERC20(_token);
    }

    function releaseRewards(uint256 amount, address to) external onlyOwner {
        require(token.balanceOf(address(this)) >= amount, "Insufficient reward tokens");
        token.transfer(to, amount);
        emit RewardsReleased(amount, to);
    }
}