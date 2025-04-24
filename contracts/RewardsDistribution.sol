// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract RewardsDistribution is Ownable {
    IERC20 public rewardToken;
    mapping(address => bool) public authorized;

    constructor(IERC20 _rewardToken) Ownable(msg.sender) {
        rewardToken = _rewardToken;
    }

    modifier onlyAuthorized() {
        require(authorized[msg.sender], "Not authorized");
        _;
    }

    function setAuthorized(address account, bool _authorized) external onlyOwner {
        authorized[account] = _authorized;
    }

    function distributeReward(address to, uint256 amount) external onlyAuthorized {
        rewardToken.transfer(to, amount);
    }
}
